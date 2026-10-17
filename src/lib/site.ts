import type { UiLocale } from "@/i18n/locales";

/** Explicit URL first, then Vercel's production and deployment URLs, so link previews never point at localhost. */
function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const vercelHost =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;
  return "http://localhost:3000";
}

export const site = {
  /** The full brand, for titles, link previews and legal text. Rules: docs/BRAND_SEO.md. */
  name: "Shubh Invitation",
  /** The app's name and the core brand, for short everyday copy ("Sign in to Shubh"). */
  shortName: "Shubh",
  /** Used on Hindi pages. */
  nameDevanagari: "शुभ इन्विटेशन",
  /** The full brand as each Indian-language page writes it (docs/BRAND_SEO.md). */
  localNames: {
    hi: "शुभ इन्विटेशन",
    mr: "शुभ इन्व्हिटेशन",
    gu: "શુભ ઇન્વિટેશન",
    bn: "শুভ ইনভিটেশন",
    ta: "ஷுப் இன்விடேஷன்",
  },
  tagline: "Invitations that come alive",
  description:
    "Create beautiful digital, animated and 3D invitations for every celebration, share them on WhatsApp, and collect RSVPs in one tap.",
  url: siteUrl(),
  /**
   * The brand's own channels: linked in the site and guest footers and on Contact, and
   * given to search engines as the Organization's sameAs (docs/BRAND_SEO.md).
   */
  social: {
    instagram: "https://www.instagram.com/shubh.celebration/",
    whatsapp: "https://whatsapp.com/channel/0029VbDJL893rZZZPyZ2q80o",
    youtube: "https://www.youtube.com/channel/UCGcpksufbY45cL9ujZkpyBw",
  },
  /** Where people write about their data and the terms (docs/LAUNCH.md); set before launch. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
} as const;

/** The brand as a page in this language writes it: "Shubh Invitation", "शुभ इन्विटेशन". */
export function siteNameIn(locale: UiLocale): string {
  return locale === "en" ? site.name : site.localNames[locale];
}
