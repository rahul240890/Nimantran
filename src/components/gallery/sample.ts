"use client";

import { useMemo } from "react";
import { useLocale, useText } from "@/i18n/client";
import type { UiLocale } from "@/i18n/locales";
import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import type { Category } from "@/lib/categories/schema";
import type { StoryFunction } from "@/lib/engine/story";
import type { FunctionId } from "@/lib/events/functions";
import { isWeddingJourney } from "@/lib/suites/catalog";
import { formatCardDate, formatCardTime } from "@/lib/templates/card-languages";
import { cardSuggestions } from "@/lib/templates/card-suggestions";
import type { CardCopy } from "@/lib/templates/content";

/*
 * The made-up celebration the gallery's previews show a design with, so a guest's view of
 * it can be judged with words in place: the names, the families' line and each
 * celebration's day, time and place, in the visitor's language. A wedding by default; a
 * design painted for another occasion (a birthday, a puja) shows that occasion's own
 * wording and its one celebration, so a birthday never previews as a haldi.
 */

/** Each celebration's sample day and time. */
const DAYS = {
  haldi: ["2027-02-12", "10:00"],
  mehendi: ["2027-02-12", "16:00"],
  sangeet: ["2027-02-12", "20:00"],
  baraat: ["2027-02-13", "17:00"],
  wedding: ["2027-02-13", "19:30"],
  reception: ["2027-02-14", "20:00"],
} as const satisfies Partial<Record<FunctionId, readonly [string, string]>>;

export type SampleFunction = keyof typeof DAYS;

/** An occasion's one celebration, on the sample wedding day. */
const OCCASION_DAY = ["2027-02-13", "18:00"] as const;

export function useSampleInvite(
  kinds: readonly SampleFunction[],
  /** The occasion the design is painted for; a wedding when missing. */
  occasion?: CategoryId,
): {
  copy: CardCopy;
  functions: StoryFunction[];
  lang: UiLocale;
} {
  const locale = useLocale();
  const { galleryCopy } = useText(galleryText);
  const { functionCopy } = useText(editorText);
  const sample = galleryCopy.sample;
  const key = kinds.join(",");
  const other = occasion && !isWeddingJourney(occasion) ? occasion : null;
  const copy = useMemo<CardCopy>(() => {
    const wedding: CardCopy = {
      doors: ["", ""],
      blessing: sample.blessing,
      families: sample.families,
      first: sample.first,
      joiner: locale === "hi" ? "संग" : "&",
      second: sample.second,
      line: sample.line,
      date: formatCardDate(DAYS.wedding[0], locale),
      venue: sample.venues.wedding,
    };
    if (!other) return wedding;
    const words = (slot: "blessing" | "families" | "line") =>
      cardSuggestions(other, locale, slot)[0] ?? wedding[slot];
    const category: Category = CATEGORIES[other];
    const one = category.people === "one";
    return {
      ...wedding,
      blessing: words("blessing"),
      families: words("families"),
      line: words("line"),
      ...(one && { first: sample.one, joiner: "", second: "" }),
      date: formatCardDate(OCCASION_DAY[0], locale),
      venue: sample.venues.other,
    };
  }, [sample, locale, other]);
  const functions = useMemo<StoryFunction[]>(() => {
    if (other) {
      // The occasion's own celebration, once, whichever painting stands in for it
      if (!key) return [];
      const kind = CATEGORIES[other].functions.primary;
      return [
        {
          kind,
          name: functionCopy[kind].name,
          localName: null,
          date: formatCardDate(OCCASION_DAY[0], locale),
          time: formatCardTime(OCCASION_DAY[1], null, locale),
          muhurat: null,
          venue: sample.venues.other,
        },
      ];
    }
    return (key ? (key.split(",") as SampleFunction[]) : []).map((kind) => ({
      kind,
      name: functionCopy[kind].name,
      localName: null,
      date: formatCardDate(DAYS[kind][0], locale),
      time: formatCardTime(DAYS[kind][1], null, locale),
      muhurat: null,
      venue: sample.venues[kind],
    }));
  }, [key, functionCopy, locale, sample, other]);
  return { copy, functions, lang: locale };
}
