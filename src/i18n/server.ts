import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { LOCALE_COOKIE, pickLocale, type UiLocale } from "./locales";

/**
 * The language for this request on app pages: the visitor's choice (a cookie), else their
 * phone's languages. The home pages carry their language in the address instead (/ and /hi).
 */
export const getLocale = cache(async (): Promise<UiLocale> => {
  const [store, head] = await Promise.all([cookies(), headers()]);
  return pickLocale(store.get(LOCALE_COOKIE)?.value, head.get("accept-language"));
});

/** One area's copy in this request's language, or in the one given. */
export async function getText<T>(text: Record<UiLocale, T>, locale?: UiLocale): Promise<T> {
  return text[locale ?? (await getLocale())];
}
