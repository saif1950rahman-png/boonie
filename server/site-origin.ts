/**
 * Public origin for robots.txt / sitemap.xml. Prefers the SITE_URL (or
 * VITE_SITE_URL) env var; otherwise falls back to the request host, restricted
 * to a sane hostname so a forged Host header cannot inject anything.
 */
export function siteOrigin(event: { url: URL; req: { headers: Headers } }): string {
  const configured = (process.env.SITE_URL || process.env.VITE_SITE_URL || "").trim().replace(/\/+$/, "");
  if (/^https?:\/\/[a-z0-9.-]+(:\d+)?$/i.test(configured)) return configured;
  const host = event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host;
  const clean = /^[a-z0-9.-]+(:\d+)?$/i.test(host) ? host : event.url.host;
  const proto = /^localhost|^127\./.test(clean) ? "http" : "https";
  return `${proto}://${clean}`;
}
