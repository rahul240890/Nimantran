import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/*
 * Public pages are open to crawlers; accounts, the editor and guests' invitations are not.
 * Rules match by prefix, so the review pages (/design, /engine, /templates) rely on their
 * noindex tag instead: a "/design" rule would also block /designs. Guests' invitations
 * (/i/…) stay crawlable so WhatsApp can draw link previews; their noindex keeps them out
 * of search.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api/", "/auth/", "/create", "/invites", "/join/", "/sign-in"],
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
