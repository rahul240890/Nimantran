import { CATEGORIES } from "@/lib/categories/catalog";
import { functionCopy } from "@/content/editor";
import {
  draftCopy,
  formatCardDate,
  includedFunctions,
  mainFunction,
  needsTime,
  type InviteDraft,
} from "@/lib/editor/draft";
import { formatTime } from "@/lib/time";
import type { CalendarEntry } from "./calendar";

/* Plain-text descriptions of a published invite, for link previews, messages and calendars. */

/** "Aarav & Meera", or one name, from the card's own wording. */
export function inviteNames(draft: InviteDraft): string {
  const copy = draftCopy(draft);
  const first = draft.content.first?.trim() || copy.first;
  const second = draft.content.second?.trim() || copy.second;
  const joiner = draft.content.joiner?.trim() || "&";
  return second ? `${first} ${joiner} ${second}` : first;
}

export function occasionName(draft: InviteDraft): string {
  return CATEGORIES[draft.categoryId].names.en;
}

/** "Saturday, 12 December 2026 · 7:30 pm" for the main function. */
export function inviteWhen(draft: InviteDraft): string {
  const main = mainFunction(draft);
  if (!main) return "";
  const fn = draft.functions[main];
  if (!fn.date) return "";
  const time = fn.time && needsTime(draft) ? ` · ${formatTime(fn.time)}` : "";
  return `${formatCardDate(fn.date)}${time}`;
}

export function inviteWhere(draft: InviteDraft): string {
  const main = mainFunction(draft);
  return main ? draft.functions[main].venue.trim() : "";
}

/** One calendar entry per function, titled "Haldi · Aarav & Meera". */
export function calendarEntries(
  draft: InviteDraft,
  { id, url }: { id: string; url: string },
): CalendarEntry[] {
  const names = inviteNames(draft);
  const timed = needsTime(draft);
  return includedFunctions(draft).flatMap((kind) => {
    const fn = draft.functions[kind];
    if (!fn.date) return [];
    return [
      {
        uid: `${id}-${kind}@shubhdwar`,
        title: `${functionCopy[kind].name} · ${names}`,
        date: fn.date,
        time: timed ? fn.time : "",
        location: [fn.venue.trim(), fn.address.trim()].filter(Boolean).join(", "),
        description: fn.dressCode.trim() ? `Dress code: ${fn.dressCode.trim()}` : "",
        url,
      },
    ];
  });
}
