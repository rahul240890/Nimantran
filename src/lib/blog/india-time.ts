/* Post dates in India time, whatever time zone the admin's browser is in. */

/** "2026-10-03T09:30" in India time, for a datetime-local box. */
export function indiaLocal(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** The moment a datetime-local box's India time stands for. India has no daylight saving. */
export function fromIndiaLocal(local: string): Date {
  return new Date(`${local.slice(0, 16)}:00+05:30`);
}
