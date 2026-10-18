import { homePath, type UiLocale } from "@/i18n/locales";

/*
 * Blog addresses, light enough for the language menu on every page: the posts themselves
 * (posts.ts) stay on the server. A unit test checks POST_PAIRS against the posts.
 */

/** /blog/<slug> in English, /hi/blog/<slug> in Hindi; the blog's front page without a slug. */
export function blogPostPath(slug: string | null, locale: UiLocale): string {
  const blog = locale === "en" ? "/blog" : `${homePath(locale)}/blog`;
  return slug ? `${blog}/${slug}` : blog;
}

/** The posts written in two languages (a post's `pair`), each language's slug. */
export const POST_PAIRS: readonly Partial<Record<UiLocale, string>>[] = [
  { en: "birthday-invitation-messages", hi: "janmdin-nimantran-sandesh" },
  { en: "diwali-party-invitation-message", hi: "diwali-nimantran-sandesh" },
  { en: "engagement-invitation-message", hi: "sagai-nimantran-sandesh" },
  { en: "griha-pravesh-invitation-message", hi: "griha-pravesh-nimantran-sandesh" },
  { en: "haldi-mehendi-sangeet-invitation-messages", hi: "haldi-mehendi-sangeet-nimantran" },
  { en: "gujarati-wedding-invitation-wording", gu: "kankotri-lakhan" },
  { en: "satyanarayan-puja-invitation-message", hi: "satyanarayan-katha-nimantran" },
  { en: "when-to-send-wedding-invitations", hi: "shadi-card-kab-bhejein" },
];

/** A post read in one language, in another: itself, its pair, or null for that blog's front page. */
export function pairedPost(slug: string, from: UiLocale, to: UiLocale): string | null {
  if (from === to) return slug;
  return POST_PAIRS.find((pair) => pair[from] === slug)?.[to] ?? null;
}
