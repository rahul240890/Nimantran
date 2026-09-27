import { format, parseISO, type Locale as DateLocale } from "date-fns";
import { bn, enIN, gu, hi, ta } from "date-fns/locale";

/*
 * Languages a card can be written in (TRADITIONS.md, section 7): English and the scripts of
 * the first tradition packs. A card carries one or two; guests switch between them.
 */

export const CARD_LANGUAGES = ["en", "hi", "mr", "gu", "bn", "ta"] as const;
export type CardLanguage = (typeof CARD_LANGUAGES)[number];

export function isCardLanguage(value: unknown): value is CardLanguage {
  return typeof value === "string" && (CARD_LANGUAGES as readonly string[]).includes(value);
}

const DATE_LOCALES: Partial<Record<CardLanguage, DateLocale>> = { hi, gu, bn, ta };

// date-fns has no Marathi, so its day and month names are kept here
const MARATHI_DAYS = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const MARATHI_MONTHS = [
  "जानेवारी",
  "फेब्रुवारी",
  "मार्च",
  "एप्रिल",
  "मे",
  "जून",
  "जुलै",
  "ऑगस्ट",
  "सप्टेंबर",
  "ऑक्टोबर",
  "नोव्हेंबर",
  "डिसेंबर",
];

/**
 * The card's date line in its language: "Saturday, 12 December 2026", "शनिवार, 12 दिसंबर
 * 2026". Digits stay Western, as most printed cards have them.
 */
export function formatCardDate(date: string, language: CardLanguage = "en"): string {
  const day = parseISO(date);
  if (language === "mr") {
    return `${MARATHI_DAYS[day.getDay()]}, ${day.getDate()} ${MARATHI_MONTHS[day.getMonth()]} ${day.getFullYear()}`;
  }
  return format(day, "EEEE, d MMMM yyyy", {
    locale: language === "en" ? enIN : DATE_LOCALES[language],
  });
}
