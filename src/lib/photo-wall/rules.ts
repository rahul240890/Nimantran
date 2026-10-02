import type { UiLocale } from "@/i18n/locales";
import { daysBetween } from "@/lib/publish/countdown";

/*
 * The shared photo wall's rules (Step 24, docs/PRICING.md section 2). The wall opens on
 * the morning of the first function, so guests can share from the haldi onwards, and
 * stays open for the edition's album days after the last one. Hosts can see and download
 * what is on it at any time.
 */

export const WALL_RULES = {
  /** Photos are shrunk on the guest's phone to this long side before they upload. */
  maxSide: 2048,
  /** The largest file the server takes, after shrinking (the bucket's own limit). */
  maxBytes: 5 * 1024 * 1024,
  /** Photos one phone can add to one wall. */
  perDevice: 40,
  /** Photos on one wall in all. */
  perEvent: 1500,
  /** Photos a guest can pick at once. */
  perPick: 20,
  types: ["image/webp", "image/jpeg", "image/png"] as readonly string[],
};

/** Days the wall stays open before payments are switched on: a year, as on Royal. */
export const OPEN_ALBUM_DAYS = 365;

export type WallWindow =
  | { state: "open"; closesOn: string | null }
  | { state: "soon"; opensOn: string }
  | { state: "closed" }
  | { state: "off" };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d! + days)).toISOString().slice(0, 10);
}

/**
 * Whether guests can add photos `today` (a YYYY-MM-DD date in India), given the
 * functions' dates and the edition's album days (0: no wall, Infinity: forever). An invite
 * without dates is open from the start.
 */
export function wallWindow(dates: readonly string[], albumDays: number, today: string): WallWindow {
  if (albumDays <= 0) return { state: "off" };
  const known = dates.filter((date) => DATE.test(date)).sort();
  const first = known[0];
  const last = known.at(-1);
  if (!first || !last) {
    return { state: "open", closesOn: null };
  }
  if (daysBetween(today, first) > 0) return { state: "soon", opensOn: first };
  if (!Number.isFinite(albumDays)) return { state: "open", closesOn: null };
  const closesOn = addDays(last, albumDays);
  return daysBetween(today, closesOn) >= 0 ? { state: "open", closesOn } : { state: "closed" };
}

/** "12 December 2026", in the site's language. */
export function formatWallDate(date: string, locale: UiLocale): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString(
    locale === "hi" ? "hi-IN" : "en-IN",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
}
