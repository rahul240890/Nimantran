import { format, type Locale } from "date-fns";
import { enIN } from "date-fns/locale";

/** Times are stored as 24-hour "HH:mm" strings; display follows the chosen locale. */

export function timeSlots(stepMinutes = 15, start = "00:00", end = "23:59"): string[] {
  if (!Number.isInteger(stepMinutes) || stepMinutes <= 0 || 1440 % stepMinutes !== 0) {
    throw new Error(`stepMinutes must divide a day evenly, got ${stepMinutes}`);
  }
  const from = toMinutes(start);
  const to = toMinutes(end);
  const slots: string[] = [];
  for (let m = 0; m < 1440; m += stepMinutes) {
    if (m >= from && m <= to) slots.push(fromMinutes(m));
  }
  return slots;
}

export function toMinutes(time: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) throw new Error(`Expected HH:mm, got "${time}"`);
  return Number(match[1]) * 60 + Number(match[2]);
}

function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * "19:30" → "7:30 PM" in English (India), "7:30 अपराह्न" in Hindi.
 * date-fns rather than Intl, so server and browser always agree and hydration never mismatches.
 */
export function formatTime(time: string, locale: Locale = enIN): string {
  const minutes = toMinutes(time);
  return format(new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60), "p", { locale });
}
