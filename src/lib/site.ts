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
  tagline: "Invitations that come alive",
  description:
    "Create beautiful digital, animated and 3D invitations for every celebration, share them on WhatsApp, and collect RSVPs in one tap.",
  url: siteUrl(),
  /** Where people write about their data and the terms (docs/LAUNCH.md); set before launch. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
} as const;
