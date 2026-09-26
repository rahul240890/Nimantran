"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type UiLocale } from "./locales";

const LocaleContext = createContext<UiLocale>(DEFAULT_LOCALE);

/** The page's language, for every client component under it. Set by the root layouts. */
export function LocaleProvider({ locale, children }: { locale: UiLocale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): UiLocale {
  return useContext(LocaleContext);
}

/** One area's copy in the page's language. */
export function useText<T>(text: Record<UiLocale, T>): T {
  return text[useContext(LocaleContext)];
}
