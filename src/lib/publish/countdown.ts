/*
 * The guest page's diya countdown (docs/MOTION.md, section 7): a row of lamps, one more
 * lit each day of the last week before the first function, all of them on the day.
 */

export const COUNTDOWN_LAMPS = 7;

export type Countdown = {
  /** Whole days from today to the first function; 0 on the day itself. */
  daysLeft: number;
  lit: number;
  lamps: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Days between two calendar dates (YYYY-MM-DD), ignoring time zones and clock changes. */
export function daysBetween(from: string, to: string): number {
  const utc = (date: string) => {
    const [y, m, d] = date.split("-").map(Number);
    return Date.UTC(y!, m! - 1, d!);
  };
  return Math.round((utc(to) - utc(from)) / DAY_MS);
}

/**
 * The countdown on `today` for the earliest of `dates`, or null when none is to come.
 * Dates are calendar dates (YYYY-MM-DD) where the event happens.
 */
export function diyaCountdown(
  dates: readonly string[],
  today: string,
  lamps = COUNTDOWN_LAMPS,
): Countdown | null {
  const ahead = dates
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .map((date) => daysBetween(today, date))
    .filter((days) => days >= 0);
  if (ahead.length === 0) return null;
  const daysLeft = Math.min(...ahead);
  return { daysLeft, lit: Math.max(0, Math.min(lamps, lamps - daysLeft)), lamps };
}

/** Today's date in India, where the events are, as YYYY-MM-DD. */
export function todayInIndia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * The moment an event starts, in India: its date at its start time, or at midnight when
 * it has no time. Null for a missing or malformed date.
 */
export function startsAt(date: string, time = ""): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const clock = /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
  const at = Date.parse(`${date}T${clock}:00+05:30`);
  return Number.isNaN(at) ? null : at;
}

export type Remaining = { days: number; hours: number; minutes: number; seconds: number };

/** What is left until `target`, in whole units, or null once it has come. */
export function remaining(target: number, now: number): Remaining | null {
  const left = Math.floor((target - now) / 1000);
  if (left <= 0) return null;
  return {
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
  };
}
