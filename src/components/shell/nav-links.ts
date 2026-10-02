import { homePath, type UiLocale } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";

/*
 * Where each header link goes. "designs" and "weddings" are pages of their own; every other
 * id is a section of the home page, reached from anywhere as home#id.
 */

const PAGES = {
  designs: { kind: "gallery" },
  weddings: { kind: "occasion", id: "wedding" },
} as const;

export function isPageLink(id: string): id is keyof typeof PAGES {
  return id in PAGES;
}

export function navHref(id: string, locale: UiLocale): string {
  return isPageLink(id) ? pagePath(PAGES[id], locale) : `${homePath(locale)}#${id}`;
}
