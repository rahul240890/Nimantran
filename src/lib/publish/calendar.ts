/*
 * Add-to-calendar for an invite's functions: an .ics file (Apple Calendar, Outlook and
 * most phones) and a Google Calendar link. Times are entered in India Standard Time, so
 * they're converted to UTC here and every calendar shows them in the guest's own zone.
 */

export type CalendarEntry = {
  /** Stable across edits, so re-adding updates the entry instead of duplicating it. */
  uid: string;
  title: string;
  /** yyyy-MM-dd */
  date: string;
  /** HH:mm, or empty for a date-only entry (save-the-date). */
  time: string;
  /** HH:mm when the function ends; past midnight counts as the next day. */
  endTime?: string;
  location: string;
  description: string;
  url?: string;
};

/** How long a timed function is assumed to last when no end time is given. */
export const DEFAULT_HOURS = 3;
const IST_OFFSET_MINUTES = 330;

const pad = (n: number) => String(n).padStart(2, "0");

function utcStamp(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`
  );
}

function dayStamp(date: string, addDays = 0): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const day = new Date(Date.UTC(y, m - 1, d + addDays));
  return `${day.getUTCFullYear()}${pad(day.getUTCMonth() + 1)}${pad(day.getUTCDate())}`;
}

/** Start and end in UTC for a timed entry. */
export function entryTimes(entry: Pick<CalendarEntry, "date" | "time" | "endTime">): {
  start: Date;
  end: Date;
} {
  const [y, m, d] = entry.date.split("-").map(Number) as [number, number, number];
  const [hh, mm] = entry.time.split(":").map(Number) as [number, number];
  const start = new Date(Date.UTC(y, m - 1, d, hh, mm) - IST_OFFSET_MINUTES * 60_000);
  if (!entry.endTime) return { start, end: new Date(start.getTime() + DEFAULT_HOURS * 3_600_000) };
  const [eh, em] = entry.endTime.split(":").map(Number) as [number, number];
  let end = new Date(Date.UTC(y, m - 1, d, eh, em) - IST_OFFSET_MINUTES * 60_000);
  // A sangeet from 8 PM to 1 AM ends the next morning
  if (end <= start) end = new Date(end.getTime() + 24 * 3_600_000);
  return { start, end };
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/([,;])/g, "\\$1");
}

/** Lines longer than 75 bytes are folded, as the format requires. */
function fold(line: string): string {
  const bytes = new TextEncoder();
  if (bytes.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  for (const char of line) {
    if (bytes.encode(current + char).length > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = "";
    }
    current += char;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function icsCalendar(entries: CalendarEntry[], now: Date = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shubh Invitation//Invitations//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const entry of entries) {
    lines.push("BEGIN:VEVENT", `UID:${entry.uid}`, `DTSTAMP:${utcStamp(now)}`);
    if (entry.time) {
      const { start, end } = entryTimes(entry);
      lines.push(`DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(end)}`);
    } else {
      lines.push(
        `DTSTART;VALUE=DATE:${dayStamp(entry.date)}`,
        `DTEND;VALUE=DATE:${dayStamp(entry.date, 1)}`,
      );
    }
    lines.push(`SUMMARY:${escapeText(entry.title)}`);
    if (entry.location) lines.push(`LOCATION:${escapeText(entry.location)}`);
    if (entry.description) lines.push(`DESCRIPTION:${escapeText(entry.description)}`);
    if (entry.url) lines.push(`URL:${entry.url}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(entry: CalendarEntry): string {
  const dates = entry.time
    ? (() => {
        const { start, end } = entryTimes(entry);
        return `${utcStamp(start)}/${utcStamp(end)}`;
      })()
    : `${dayStamp(entry.date)}/${dayStamp(entry.date, 1)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: entry.title,
    dates,
    details: entry.url ? `${entry.description}\n\n${entry.url}`.trim() : entry.description,
    location: entry.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
