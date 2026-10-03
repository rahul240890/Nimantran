import { formatDistanceToNow, type Locale } from "date-fns";
import { enIN, hi } from "date-fns/locale";
import type { UiLocale } from "./locales";

/** date-fns words for each site language: month names, "3 days ago" and the like. */
export const dateLocale: Record<UiLocale, Locale> = { en: enIN, hi };

/**
 * "5 minutes ago" in the site language. A time stamped by the server can be a little
 * ahead of a phone whose clock runs slow; that reads as just now, never "in 2 minutes".
 */
export function timeAgo(when: string | Date, locale: UiLocale): string {
  const time = Math.min(new Date(when).getTime(), Date.now());
  return formatDistanceToNow(time, { addSuffix: true, locale: dateLocale[locale] });
}
