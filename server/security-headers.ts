/**
 * HTTP security headers, applied to every response via Nitro `routeRules`
 * (see vite.config.ts).
 *
 * CSP notes:
 * - `script-src 'unsafe-inline'` is required because TanStack Start streams
 *   small inline hydration scripts and the page ships JSON-LD. Everything else
 *   is locked to this origin; there is no `eval`, no third-party script host.
 * - Google Fonts is the only third-party origin (styles + font files).
 * - `frame-ancestors 'none'` stops clickjacking. If you ever need to embed
 *   the site in an iframe, change it to 'self' or an explicit origin.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const securityHeaders: Record<string, string> = {
  "content-security-policy": csp,
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "x-permitted-cross-domain-policies": "none",
};
