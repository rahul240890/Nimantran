import type { Locale } from "date-fns";
import { enIN, hi } from "date-fns/locale";
import type { UiLocale } from "./locales";

/** date-fns words for each site language: month names, "3 days ago" and the like. */
export const dateLocale: Record<UiLocale, Locale> = { en: enIN, hi };
