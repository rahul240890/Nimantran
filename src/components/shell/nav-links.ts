import { homePath, type UiLocale } from "@/i18n/locales";
import { DEMO_PATH } from "@/lib/sample/paths";
import { pagePath } from "@/lib/seo/paths";

/*
 * Where each header link goes. "weddings" and "designs" are pages of their own, "sample"
 * opens a live invitation from the tour, and "help" a chat with us on WhatsApp. Every
 * other id is a section of the home page, reached from anywhere as home#id.
 */

const PAGES = {
  designs: { kind: "designs" },
  weddings: { kind: "occasion", id: "wedding" },
} as const;

/** A link to a page of the site (not a home page section, and not WhatsApp). */
export function isPageLink(id: string): boolean {
  return id in PAGES || id === "sample";
}

/** The link that leaves for WhatsApp, in a new tab. */
export const isHelpLink = (id: string) => id === "help";

/**
 * Help on WhatsApp goes through /help/whatsapp, which reads the number from Admin, Business
 * details and writes the visitor's first message in their language.
 */
export function helpPath(locale: UiLocale): string {
  return locale === "en" ? "/help/whatsapp" : `/help/whatsapp?lang=${locale}`;
}

export function navHref(id: string, locale: UiLocale): string {
  if (id === "sample") return DEMO_PATH;
  if (isHelpLink(id)) return helpPath(locale);
  if (id in PAGES) return pagePath(PAGES[id as keyof typeof PAGES], locale);
  return `${homePath(locale)}#${id}`;
}
