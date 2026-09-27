import type { Metadata } from "next";
import { CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/templates/schema";
import { TRADITION_IDS, type TraditionId } from "@/lib/traditions/schema";
import { UI_LOCALES, homePath, type UiLocale } from "@/i18n/locales";

/*
 * The public, indexable pages (docs/BRAND_SEO.md, section 6), generated from data: one
 * page per occasion, tradition and design, plus the design gallery, in every site
 * language. English lives at /…, Hindi at /hi/…, and each links to the other.
 */

export type PublicPage =
  | { kind: "home" }
  | { kind: "designs" }
  | { kind: "design"; id: TemplateId }
  | { kind: "occasion"; id: CategoryId }
  | { kind: "tradition"; id: TraditionId };

/** The page's address without the language prefix: "/invitations/haldi". */
function basePath(page: PublicPage): string {
  switch (page.kind) {
    case "home":
      return "/";
    case "designs":
      return "/designs";
    case "design":
      return `/designs/${page.id}`;
    case "occasion":
      return `/invitations/${page.id}`;
    case "tradition":
      return `/traditions/${page.id}`;
  }
}

/** The page's address in one language. */
export function pagePath(page: PublicPage, locale: UiLocale): string {
  const path = basePath(page);
  if (path === "/") return homePath(locale);
  return locale === "en" ? path : `${homePath(locale)}${path}`;
}

/** Every public page, for the sitemap and tests. */
export function publicPages(): PublicPage[] {
  return [
    { kind: "home" },
    { kind: "designs" },
    ...TEMPLATE_IDS.map((id) => ({ kind: "design" as const, id })),
    ...CATEGORY_IDS.map((id) => ({ kind: "occasion" as const, id })),
    ...TRADITION_IDS.map((id) => ({ kind: "tradition" as const, id })),
  ];
}

/** Canonical address and its language versions, with English as the default. */
export function pageAlternates(page: PublicPage, locale: UiLocale): Metadata["alternates"] {
  return {
    canonical: pagePath(page, locale),
    languages: {
      ...Object.fromEntries(UI_LOCALES.map((code) => [`${code}-IN`, pagePath(page, code)])),
      "x-default": pagePath(page, "en"),
    },
  };
}

const LOCALIZED = /^\/(designs|invitations|traditions)(\/|$)/;

/**
 * The same page in another language, for the language menu: public pages carry their
 * language in the address; null means the page re-renders in place.
 */
export function switchLocalePath(pathname: string, locale: UiLocale): string | null {
  const prefix = UI_LOCALES.map(homePath).find(
    (home) => home !== "/" && (pathname === home || pathname.startsWith(`${home}/`)),
  );
  const rest = prefix ? pathname.slice(prefix.length) || "/" : pathname;
  if (rest !== "/" && !LOCALIZED.test(rest)) return null;
  if (rest === "/") return homePath(locale);
  return locale === "en" ? rest : `${homePath(locale)}${rest}`;
}
