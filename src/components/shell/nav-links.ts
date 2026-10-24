import type { UiLocale } from "@/i18n/locales";
import { DEMO_PATH } from "@/lib/sample/paths";
import { pagePath } from "@/lib/seo/paths";

/*
 * Where each of the footer's Explore links goes: "designs" and "pricing" are pages of their
 * own, "sample" opens a live invitation from the tour, and "help" a chat with us on WhatsApp.
 */

const PAGES = {
  designs: { kind: "designs" },
  pricing: { kind: "pricing" },
} as const;

/** The link that leaves for WhatsApp, in a new tab. */
export const isHelpLink = (id: string) => id === "help";

/**
 * Help on WhatsApp goes through /help/whatsapp, which reads the number from Admin, Business
 * details and writes the visitor's first message in their language: asking for help, or
 * (make) asking us to make the invitation for them.
 */
export function helpPath(
  locale: UiLocale,
  purpose: "help" | "make" = "help",
  /** The design the family wants us to make it in, from its own page. */
  design?: string,
): string {
  const params = new URLSearchParams();
  if (locale !== "en") params.set("lang", locale);
  if (purpose === "make") params.set("for", "make");
  if (purpose === "make" && design) params.set("design", design);
  const query = params.toString();
  return query ? `/help/whatsapp?${query}` : "/help/whatsapp";
}

export function navHref(id: keyof typeof PAGES | "sample" | "help", locale: UiLocale): string {
  if (id === "sample") return DEMO_PATH;
  if (id === "help") return helpPath(locale);
  return pagePath(PAGES[id], locale);
}
