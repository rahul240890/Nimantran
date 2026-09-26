"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isUiLocale } from "@/i18n/locales";

/** Remembers the visitor's language for a year. */
export async function setLocale(locale: unknown): Promise<boolean> {
  if (!isUiLocale(locale)) return false;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });
  return true;
}
