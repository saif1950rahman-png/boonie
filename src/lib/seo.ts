import { bakery } from "@/lib/bakery";

/**
 * Your public address, no trailing slash. Set VITE_SITE_URL in the environment
 * at BUILD time (see .env.example). It feeds the canonical link, Open Graph
 * URLs, and the structured data. robots.txt and sitemap.xml read SITE_URL (or
 * the request host) at runtime.
 */
const rawSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() ?? "";
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export const SEO_TITLE = "Boonies Bakery Co · Custom Cakes & Cookies in Kilgore, TX";
export const SEO_DESCRIPTION =
  "Home bakery in Kilgore, Texas. Scratch-made custom cakes, cookies, brownies and sweet treats for birthdays and gatherings. Message on Facebook or call (903) 812-9005 to order.";

const abs = (path: string) => (SITE_URL ? `${SITE_URL}${path}` : path);

const googleVerification = (
  import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined
)?.trim();

export function seoHead() {
  const meta: Array<Record<string, string>> = [
    { title: SEO_TITLE },
    { name: "description", content: SEO_DESCRIPTION },
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
    { name: "author", content: bakery.name },
    { name: "format-detection", content: "telephone=yes" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: bakery.name },
    { property: "og:locale", content: "en_US" },
    { property: "og:title", content: SEO_TITLE },
    { property: "og:description", content: SEO_DESCRIPTION },
    { property: "og:image", content: abs("/og.jpg") },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Cakes, cookies and sweet treats from Boonies Bakery Co in Kilgore, Texas.",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: SEO_TITLE },
    { name: "twitter:description", content: SEO_DESCRIPTION },
    { name: "twitter:image", content: abs("/og.jpg") },
    { name: "geo.region", content: "US-TX" },
    { name: "geo.placename", content: "Kilgore" },
  ];
  if (SITE_URL) meta.push({ property: "og:url", content: `${SITE_URL}/` });
  if (googleVerification) meta.push({ name: "google-site-verification", content: googleVerification });

  const links: Array<Record<string, string>> = [];
  if (SITE_URL) links.push({ rel: "canonical", href: `${SITE_URL}/` });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Bakery",
        "@id": `${SITE_URL}/#bakery`,
        name: bakery.name,
        description: SEO_DESCRIPTION,
        url: SITE_URL ? `${SITE_URL}/` : undefined,
        image: SITE_URL ? [`${SITE_URL}/og.jpg`] : undefined,
        telephone: bakery.phoneTel,
        email: bakery.email,
        servesCuisine: "Bakery",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kilgore",
          addressRegion: "TX",
          addressCountry: "US",
        },
        areaServed: { "@type": "City", name: "Kilgore, TX" },
        sameAs: [bakery.facebook],
        potentialAction: {
          "@type": "OrderAction",
          target: { "@type": "EntryPoint", urlTemplate: bakery.messenger, actionPlatform: "https://schema.org/DesktopWebPlatform" },
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: bakery.name,
        url: SITE_URL ? `${SITE_URL}/` : undefined,
        inLanguage: "en-US",
      },
    ],
  };

  return {
    meta,
    links,
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }],
  };
}
