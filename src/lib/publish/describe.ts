import { publishText } from "@/i18n/copy/publish";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES } from "@/lib/categories/catalog";
import {
  cardLanguages,
  draftCopy,
  draftPeople,
  formatCardDate,
  includedFunctions,
  mainFunction,
  needsTime,
  type InviteDraft,
} from "@/lib/editor/draft";
import { formatCardTime } from "@/lib/templates/card-languages";
import type { CalendarEntry } from "./calendar";
import { cardFunctions, storyFunctions } from "./story";

/* Plain-text descriptions of a published invite, for link previews, messages and calendars. */

/**
 * The language guests read the invitation in: the card's first language. Everything a
 * guest gets around the card (the link's preview, the message it is sent with, calendar
 * entries) speaks it, whatever language the host's own screens are in.
 */
export function inviteLanguage(draft: InviteDraft): UiLocale {
  return cardLanguages(draft)[0];
}

/** "Aarav & Meera", or one name, from the card's own wording. */
export function inviteNames(draft: InviteDraft): string {
  const copy = draftCopy(draft);
  const first = draft.content.first?.trim() || copy.first;
  const second = draftPeople(draft) === "one" ? "" : draft.content.second?.trim() || copy.second;
  const joiner = draft.content.joiner?.trim() || "&";
  return second ? `${first} ${joiner} ${second}` : first;
}

export function occasionName(draft: InviteDraft, locale: UiLocale = "en"): string {
  return CATEGORIES[draft.categoryId].names[locale];
}

/**
 * "Saturday, 12 December 2026 · 7:30 pm" for the main function, in the given language:
 * written as that language's printed cards write it ("શનિવાર, 12 ડિસેમ્બર 2026 · સાંજે 7:30
 * વાગ્યે"), never with an English "pm" on a Gujarati line.
 */
export function inviteWhen(draft: InviteDraft, locale: UiLocale = "en"): string {
  const main = mainFunction(draft);
  if (!main) return "";
  const fn = draft.functions[main];
  if (!fn.date) return "";
  const time = fn.time && needsTime(draft) ? ` · ${formatCardTime(fn.time, null, locale)}` : "";
  return `${formatCardDate(fn.date, locale)}${time}`;
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
  const { guestCopy } = publishText[locale];
  // Each function named as the card names it in this language (a Gujarati card's પીઠી)
  const named = cardFunctions(storyFunctions(draft, locale), draft, locale);
  const names = inviteNames(draft);
  const timed = needsTime(draft);
  return includedFunctions(draft).flatMap((kind) => {
    const fn = draft.functions[kind];
    if (!fn.date) return [];
    return [
      {
        // Kept from the earlier name so calendars that saved an event update it rather than add a copy.
        uid: `${id}-${kind}@shubhdwar`,
        title: `${named.find((item) => item.kind === kind)?.name ?? kind} · ${names}`,
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
