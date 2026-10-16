import type { FormatDistanceToken, Locale, Localize } from "date-fns";
import { hi } from "date-fns/locale";

/*
 * date-fns has no Marathi, so the site's Marathi dates borrow the Hindi locale's grammar
 * (Devanagari digits off, Monday weeks) with Marathi month and day names and Marathi words
 * for "3 days ago". The card's own Marathi dates live in src/lib/templates/card-languages.ts.
 */

const MONTHS = {
  wide: [
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
  ],
  abbreviated: [
    "जाने.",
    "फेब्रु.",
    "मार्च",
    "एप्रि.",
    "मे",
    "जून",
    "जुलै",
    "ऑग.",
    "सप्टें.",
    "ऑक्टो.",
    "नोव्हें.",
    "डिसें.",
  ],
} as const;

const DAYS = {
  wide: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  abbreviated: ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"],
  narrow: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
} as const;

/** "3 दिवस", "सुमारे 1 तास": the span alone, before "पूर्वी" (ago) or "नंतर" (in). */
const SPANS: Record<FormatDistanceToken, (count: number) => string> = {
  lessThanXSeconds: (n) => (n === 1 ? "1 सेकंदापेक्षा कमी" : `${n} सेकंदांपेक्षा कमी`),
  xSeconds: (n) => `${n} सेकंद`,
  halfAMinute: () => "अर्धा मिनिट",
  lessThanXMinutes: (n) => (n === 1 ? "1 मिनिटापेक्षा कमी" : `${n} मिनिटांपेक्षा कमी`),
  xMinutes: (n) => (n === 1 ? "1 मिनिट" : `${n} मिनिटे`),
  aboutXHours: (n) => `सुमारे ${n} तास`,
  xHours: (n) => `${n} तास`,
  xDays: (n) => `${n} दिवस`,
  aboutXWeeks: (n) => `सुमारे ${n} ${n === 1 ? "आठवडा" : "आठवडे"}`,
  xWeeks: (n) => `${n} ${n === 1 ? "आठवडा" : "आठवडे"}`,
  aboutXMonths: (n) => `सुमारे ${n} ${n === 1 ? "महिना" : "महिने"}`,
  xMonths: (n) => `${n} ${n === 1 ? "महिना" : "महिने"}`,
  aboutXYears: (n) => `सुमारे ${n} वर्ष`,
  xYears: (n) => `${n} वर्ष`,
  overXYears: (n) => `${n} वर्षांपेक्षा जास्त`,
  almostXYears: (n) => `जवळपास ${n} वर्ष`,
};

type Width = "narrow" | "short" | "abbreviated" | "wide";

export const mr: Locale = {
  ...hi,
  code: "mr",
  formatDistance: (token, count, options) => {
    const span = SPANS[token](count);
    if (!options?.addSuffix) return span;
    return options.comparison !== undefined && options.comparison > 0
      ? `${span} नंतर`
      : `${span} पूर्वी`;
  },
  localize: {
    ...hi.localize,
    month: ((index: number, options?: { width?: Width }): string =>
      (options?.width === "wide" || !options?.width ? MONTHS.wide : MONTHS.abbreviated)[
        index
      ]!) as Localize["month"],
    day: ((index: number, options?: { width?: Width }): string =>
      (options?.width === "narrow"
        ? DAYS.narrow
        : options?.width === "wide" || !options?.width
          ? DAYS.wide
          : DAYS.abbreviated)[index]!) as Localize["day"],
  },
};
