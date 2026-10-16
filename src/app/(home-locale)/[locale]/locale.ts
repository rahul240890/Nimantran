import { notFound } from "next/navigation";
import { PREFIXED_LOCALES, isPrefixedLocale, type PrefixedLocale } from "@/i18n/locales";

/*
 * The site in every language but English, under its own prefix: /hi, /mr, /gu, /bn, /ta.
 * Each page here is the English page's twin, with the language from the address.
 */

/** One set of pages for each prefixed language, built ahead. */
export function localeParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

/** The page's language, or a 404 for an address that isn't one of them. */
export async function routeLocale(params: Promise<{ locale: string }>): Promise<PrefixedLocale> {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return locale;
}
