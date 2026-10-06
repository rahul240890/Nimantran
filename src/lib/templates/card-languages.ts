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

/** Hindi and Marathi share Devanagari, so a Hindi family's invocation suits a Marathi card. */
const SCRIPT_OF: Record<string, string> = { hi: "deva", mr: "deva" };

/** Whether two languages are written in the same script. */
export function sameScript(a: string, b: string): boolean {
  return a === b || (SCRIPT_OF[a] !== undefined && SCRIPT_OF[a] === SCRIPT_OF[b]);
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

/*
 * Times the way printed Indian cards write them: the part of the day, then the hour, as in
 * "शाम 6:30 बजे" or "સાંજે 6:30 વાગ્યે", never "PM" in English letters on a Gujarati card.
 * Morning runs from 4 to noon, afternoon to 4, evening to 8, then night.
 */
const CARD_TIME_WORDS: Record<
  Exclude<CardLanguage, "en">,
  { parts: [string, string, string, string]; at: string; range: (a: string, b: string) => string }
> = {
  hi: { parts: ["सुबह", "दोपहर", "शाम", "रात"], at: "बजे", range: (a, b) => `${a} से ${b} तक` },
  mr: {
    parts: ["सकाळी", "दुपारी", "सायंकाळी", "रात्री"],
    at: "वाजता",
    range: (a, b) => `${a} ते ${b}`,
  },
  gu: {
    parts: ["સવારે", "બપોરે", "સાંજે", "રાત્રે"],
    at: "વાગ્યે",
    range: (a, b) => `${a} થી ${b}`,
  },
  bn: { parts: ["সকাল", "দুপুর", "সন্ধ্যা", "রাত"], at: "", range: (a, b) => `${a} থেকে ${b}` },
  ta: {
    parts: ["காலை", "மதியம்", "மாலை", "இரவு"],
    at: "மணிக்கு",
    range: (a, b) => `${a} முதல் ${b} வரை`,
  },
};

function cardClock(time: string): { part: number; clock: string } {
  const h = Number(time.slice(0, 2));
  const m = Number(time.slice(3, 5));
  const part = h >= 4 && h < 12 ? 0 : h >= 12 && h < 16 ? 1 : h >= 16 && h < 20 ? 2 : 3;
  return { part, clock: `${h % 12 || 12}:${String(m).padStart(2, "0")}` };
}

/**
 * A function's time, or its start and end, in the card's language: "शाम 6:30 बजे",
 * "सुबह 9:47 से 10:31 तक". Times are stored as 24-hour "HH:mm".
 */
export function formatCardTime(time: string, end: string | null, language: CardLanguage): string {
  if (language === "en") {
    const clock = (t: string) => format(parseISO(`2000-01-01T${t}`), "p", { locale: enIN });
    return end ? `${clock(time)} to ${clock(end)}` : clock(time);
  }
  const words = CARD_TIME_WORDS[language];
  const from = cardClock(time);
  const start = `${words.parts[from.part]} ${from.clock}`;
  if (!end) return words.at ? `${start} ${words.at}` : start;
  const to = cardClock(end);
  return words.range(
    start,
    to.part === from.part ? to.clock : `${words.parts[to.part]} ${to.clock}`,
  );
}
