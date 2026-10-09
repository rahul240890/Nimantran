"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocale } from "@/i18n/client";
import { guestText, type GuestText } from "@/i18n/copy/guest";
import type { CardLanguage } from "@/lib/templates/card-languages";

const GuestLanguageContext = createContext<CardLanguage | null>(null);

/**
 * The card language a guest is reading, for everything around the card: the opening, the
 * details, the reply form and the photo wall all follow it, and switch with it.
 */
export function GuestLanguage({
  language,
  children,
}: {
  language: CardLanguage;
  children: ReactNode;
}) {
  return <GuestLanguageContext.Provider value={language}>{children}</GuestLanguageContext.Provider>;
}

/** The guest's language; outside a guest page (the editor, review pages), the site's. */
export function useGuestLanguage(): CardLanguage {
  const locale = useLocale();
  return useContext(GuestLanguageContext) ?? locale;
}

/** The words around the card in the guest's language. */
export function useGuestText(): GuestText {
  return guestText[useGuestLanguage()];
}
