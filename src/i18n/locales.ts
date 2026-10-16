/*
 * The languages Shubh Invitation speaks (Step 12). The site itself is in English, Hindi,
 * Marathi, Gujarati, Bengali and Tamil; the other four arrive one at a time. Invitations
 * themselves can be written in any of the ten (src/lib/categories).
 */

export const languages = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "ml", native: "മലയാളം", english: "Malayalam" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

/**
 * Languages the site's own screens are translated into. Marathi, Gujarati, Bengali and
 * Tamil are drafts awaiting a native proofreader (Step 12); their legal pages stay in
 * English, the binding version, until a reviewed translation replaces them.
 */
export const UI_LOCALES = [
  "en",
  "hi",
  "mr",
  "gu",
  "bn",
  "ta",
] as const satisfies readonly LanguageCode[];
export type UiLocale = (typeof UI_LOCALES)[number];

/** The languages whose pages live under their own prefix: /hi, /mr, /gu, /bn, /ta. */
export type PrefixedLocale = Exclude<UiLocale, "en">;
export const PREFIXED_LOCALES = UI_LOCALES.filter(
  (locale): locale is PrefixedLocale => locale !== "en",
);

export function isPrefixedLocale(value: unknown): value is PrefixedLocale {
  return typeof value === "string" && (PREFIXED_LOCALES as readonly string[]).includes(value);
}

export const DEFAULT_LOCALE: UiLocale = "en";

/** The visitor's choice, remembered for a year. */
export const LOCALE_COOKIE = "shubhdwar-locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isUiLocale(value: unknown): value is UiLocale {
  return typeof value === "string" && (UI_LOCALES as readonly string[]).includes(value);
}

/**
 * The language to show: the visitor's own choice first, then the first of their phone's
 * languages the site speaks. A Hindi phone opening a WhatsApp link sees Hindi.
 */
export function pickLocale(cookie: string | null | undefined, acceptLanguage?: string | null) {
  if (isUiLocale(cookie)) return cookie;
  const wanted = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((param) => param.trim().startsWith("q="));
      return { base: tag!.toLowerCase().split("-")[0]!, q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((item) => item.base && item.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { base } of wanted) {
    if (isUiLocale(base)) return base;
    if (base === "en") return "en";
  }
  return DEFAULT_LOCALE;
}

/** The address of the home page in each language. */
export function homePath(locale: UiLocale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

/** BCP 47 tags for Intl formatting, with the Indian region. */
/** Open Graph's own spelling of a page's language: en_IN, hi_IN. */
export const ogLocale = (locale: UiLocale) => `${locale}_IN`;

export const intlLocale: Record<UiLocale, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  bn: "bn-IN",
  ta: "ta-IN",
};
