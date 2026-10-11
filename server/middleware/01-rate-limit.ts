/**
 * Per-IP rate limiting + request hardening. Runs before every route.
 *
 * - Sliding-window counters kept in memory (no database, no extra service).
 * - Two buckets: general traffic and a much stricter one for /api/ and
 *   server-function endpoints (the only places that accept POSTs).
 * - Static assets (/assets, /images, fonts) are exempt: the CDN serves them
 *   and counting them would punish normal page loads.
 * - Verified search-engine crawling is far below the limits, so Googlebot
 *   is never blocked.
 *
 * Tuning (all optional env vars):
 *   RATE_LIMIT_PAGE_MAX   default 120  requests per window per IP
 *   RATE_LIMIT_API_MAX    default 20   requests per window per IP
 *   RATE_LIMIT_WINDOW_MS  default 60000
 *   TRUSTED_PROXY_HOPS    default 1    how many proxies sit in front of the app
 *                                      (used to pick the real client IP out of
 *                                      X-Forwarded-For; the left side of that
 *                                      header is client-controlled and spoofable)
 *
 * Limitation: counters live in each server instance's memory. On serverless
 * hosts (Vercel, Cloud Run, ...) every instance counts separately, so this is
 * a solid first line of defence against floods and scrapers, not a global
 * quota. For a hard global limit also enable your host's/WAF's rate limiting
 * (Cloudflare, Vercel Firewall, Google Cloud Armor).
 */

interface RateEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

const num = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

const WINDOW_MS = num(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
const PAGE_MAX = num(process.env.RATE_LIMIT_PAGE_MAX, 120);
const API_MAX = num(process.env.RATE_LIMIT_API_MAX, 20);
const PROXY_HOPS = num(process.env.TRUSTED_PROXY_HOPS, 1);
const MAX_TRACKED_KEYS = 50_000;

const hits = new Map<string, number[]>();
let lastSweep = Date.now();

const EXEMPT_PREFIXES = ["/assets/", "/images/", "/_build/"];
const EXEMPT_EXACT = new Set([
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/og.jpg",
  "/robots.txt",
]);
const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "OPTIONS"]);

function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    // Count from the right: entries added by our own proxies are trustworthy.
    const ip = parts[Math.max(0, parts.length - PROXY_HOPS)];
    if (ip) return ip;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS && hits.size < MAX_TRACKED_KEYS) return;
  lastSweep = now;
  for (const [key, stamps] of hits) {
    if (!stamps.length || now - stamps[stamps.length - 1]! > WINDOW_MS) hits.delete(key);
  }
  // Still too big (distributed flood): drop everything rather than grow forever.
  if (hits.size >= MAX_TRACKED_KEYS) hits.clear();
}

/** Returns seconds to wait if over the limit, otherwise 0. */
function consume(key: string, max: number, now: number): number {
  const stamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (stamps.length >= max) {
    hits.set(key, stamps);
    return Math.max(1, Math.ceil((stamps[0]! + WINDOW_MS - now) / 1000));
  }
  stamps.push(now);
  hits.set(key, stamps);
  return 0;
}

function text(status: number, body: string, extra: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...extra },
  });
}

export default async function rateLimit(
  event: RateEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const method = (event.req.method ?? "GET").toUpperCase();
  const path = event.url.pathname;

  if (!ALLOWED_METHODS.has(method)) {
    return text(405, "Method Not Allowed", { allow: "GET, HEAD, POST, OPTIONS" });
  }
  // Reject absurd URLs outright (scanners, buffer-overflow probes).
  if (event.url.href.length > 2048) return text(414, "URI Too Long");
  // The public pages have no use for non-GET requests outside API endpoints.
  const isApi = path.startsWith("/api/") || path.startsWith("/_serverFn");
  if (method === "POST" && !isApi) return text(405, "Method Not Allowed", { allow: "GET, HEAD" });

  if (EXEMPT_EXACT.has(path) || EXEMPT_PREFIXES.some((p) => path.startsWith(p))) return next();

  const now = Date.now();
  sweep(now);
  const ip = clientIp(event.req.headers);
  const bucket = isApi ? "api" : "page";
  const max = isApi ? API_MAX : PAGE_MAX;
  const retryAfter = consume(`${bucket}:${ip}`, max, now);
  if (retryAfter > 0) {
    return text(429, "Too many requests. Please slow down and try again shortly.", {
      "retry-after": String(retryAfter),
      "ratelimit-limit": String(max),
      "ratelimit-remaining": "0",
      "ratelimit-reset": String(retryAfter),
    });
  }
  return next();
}
