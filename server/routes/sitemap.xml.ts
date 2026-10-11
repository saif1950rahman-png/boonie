import { siteOrigin } from "../site-origin";

// This is a one-page site. When you add routes, list them here.
const PATHS = ["/"];

export default function sitemap(event: { url: URL; req: { headers: Headers } }) {
  const origin = siteOrigin(event);
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = PATHS.map(
    (p) =>
      `  <url><loc>${origin}${p}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  ).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
