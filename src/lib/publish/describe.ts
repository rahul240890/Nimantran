import { format, parseISO } from "date-fns";
import { dateLocale } from "@/i18n/dates";
import { editorText, publishText } from "@/i18n/copy";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES } from "@/lib/categories/catalog";
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

export function occasionName(draft: InviteDraft, locale: UiLocale = "en"): string {
  return CATEGORIES[draft.categoryId].names[locale];
}

/** "Saturday, 12 December 2026 · 7:30 pm" for the main function, in the site language. */
export function inviteWhen(draft: InviteDraft, locale: UiLocale = "en"): string {
  const main = mainFunction(draft);
  if (!main) return "";
  const fn = draft.functions[main];
  if (!fn.date) return "";
  const words = dateLocale[locale];
  const time = fn.time && needsTime(draft) ? ` · ${formatTime(fn.time, words)}` : "";
  const date =
    locale === "en"
      ? formatCardDate(fn.date)
      : format(parseISO(fn.date), "EEEE, d MMMM yyyy", { locale: words });
  return `${date}${time}`;
}

export function inviteWhere(draft: InviteDraft): string {
  const main = mainFunction(draft);
  return main ? draft.functions[main].venue.trim() : "";
}

/** One calendar entry per function, titled "Haldi · Aarav & Meera". */
export function calendarEntries(
  draft: InviteDraft,
  { id, url }: { id: string; url: string },
  locale: UiLocale = "en",
): CalendarEntry[] {
  const { functionCopy } = editorText[locale];
  const { guestCopy } = publishText[locale];
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
        endTime: timed && fn.time ? fn.endTime : "",
        location: [fn.venue.trim(), fn.address.trim()].filter(Boolean).join(", "),
        description: fn.dressCode.trim() ? `${guestCopy.dressCode}: ${fn.dressCode.trim()}` : "",
        url,
      },
    ];
  });
}
