import { homePath, type UiLocale } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";

/*
 * Where each header link goes. "designs" and "weddings" are pages of their own, and
 * "collections" the Designs page's collections; every other id is a section of the home
 * page, reached from anywhere as home#id.
 */

const PAGES = {
  designs: { kind: "designs" },
  collections: { kind: "designs" },
  weddings: { kind: "occasion", id: "wedding" },
} as const;

/** A page link that opens at one of the page's sections. */
const SECTIONS: Partial<Record<keyof typeof PAGES, string>> = { collections: "collections" };

export function isPageLink(id: string): id is keyof typeof PAGES {
  return id in PAGES;
}

export function navHref(id: string, locale: UiLocale): string {
  if (!isPageLink(id)) return `${homePath(locale)}#${id}`;
  const section = SECTIONS[id];
  return `${pagePath(PAGES[id], locale)}${section ? `#${section}` : ""}`;
}
