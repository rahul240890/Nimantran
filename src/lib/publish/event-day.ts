import { needsTime, type InviteDraft } from "@/lib/editor/draft";
import { directionsUrl, functionGuide, mapEmbedUrl, mapsPin } from "@/lib/editor/guide";
import type { FunctionId } from "@/lib/events/functions";
import { startsAt } from "./countdown";

/*
 * The guest page's "happening now" banner: on the day, which function is on, or which one
 * is still to come later that day. Times are India Standard Time, as on the card.
 */

/** How long a function with a start but no end is taken to last. */
export const DEFAULT_LENGTH_MS = 4 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type EventWindow = { start: number; end: number };

/**
 * When a function is on: from its start to its end time (past midnight when the end is
 * earlier than the start), or four hours without an end. A function without a time takes
 * its whole day. Null without a date.
 */
export function functionWindow(date: string, time: string, endTime: string): EventWindow | null {
  const timed = /^\d{2}:\d{2}$/.test(time);
  const start = startsAt(date, timed ? time : "");
  if (start === null) return null;
  if (!timed) return { start, end: start + DAY_MS };
  if (/^\d{2}:\d{2}$/.test(endTime)) {
    let end = startsAt(date, endTime)!;
    if (end <= start) end += DAY_MS;
    return { start, end };
  }
  return { start, end: start + DEFAULT_LENGTH_MS };
}

export type DayStatus<K extends string> = { kind: K; state: "now" | "later" };

/** The start of the India calendar day that `at` falls in. */
function dayStart(at: number): number {
  const ist = at + 5.5 * 60 * 60 * 1000;
  return ist - (ist % DAY_MS) - 5.5 * 60 * 60 * 1000;
}

/**
 * What the banner shows at `now`: the function on now (the latest to have started when
 * two overlap), else the next one still to start today, else nothing.
 */
export function eventDayStatus<K extends string>(
  functions: readonly { kind: K; window: EventWindow | null }[],
  now: number,
): DayStatus<K> | null {
  const timed = functions.filter(
    (fn): fn is { kind: K; window: EventWindow } => fn.window !== null,
  );
  const on = timed
    .filter(({ window }) => window.start <= now && now < window.end)
    .sort((a, b) => b.window.start - a.window.start)[0];
  if (on) return { kind: on.kind, state: "now" };
  const tomorrow = dayStart(now) + DAY_MS;
  const next = timed
    .filter(({ window }) => window.start > now && window.start < tomorrow)
    .sort((a, b) => a.window.start - b.window.start)[0];
  return next ? { kind: next.kind, state: "later" } : null;
}

/**
 * What a guest sees under each function to find their way there: the address (unless the
 * host typed a map link in it), dress code, parking, a map and one-tap directions, and
 * when it is on, for the banner.
 */
export function guestGuide(draft: InviteDraft, kind: FunctionId) {
  const fn = draft.functions[kind];
  const guide = functionGuide(draft.guide, kind);
  const address = fn.address.trim();
  // The address field once asked for "address or map link": a link there counts as the pin
  const linkInAddress = mapsPin(address) !== null;
  const pin = mapsPin(guide.pin) ? guide.pin : linkInAddress ? address : "";
  const place = linkInAddress ? "" : address;
  return {
    address: place,
    dressCode: fn.dressCode.trim(),
    parking: guide.parking.trim(),
    mapsUrl: directionsUrl(fn.venue, place, pin),
    mapEmbedUrl: mapEmbedUrl(fn.venue, place, pin),
    window: functionWindow(fn.date, needsTime(draft) ? fn.time : "", fn.endTime),
  };
}
