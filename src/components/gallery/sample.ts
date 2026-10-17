"use client";

import { useMemo } from "react";
import { useLocale, useText } from "@/i18n/client";
import type { UiLocale } from "@/i18n/locales";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import type { Category } from "@/lib/categories/schema";
import type { StoryFunction } from "@/lib/engine/story";
import type { FunctionId } from "@/lib/events/functions";
import { SAMPLE_DAYS, SAMPLE_OCCASION_DAY, type SampleFunction } from "@/lib/sample/days";
import { isWeddingJourney } from "@/lib/suites/catalog";
import { formatCardDate, formatCardTime } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { useSampleWords } from "./sample-words";

/*
 * The made-up celebration the gallery's previews show a design with, so a guest's view of
 * it can be judged with words in place: the names, the families' line and each
 * celebration's day, time and place, in the visitor's language. A wedding by default; a
 * design painted for another occasion (a birthday, a puja) shows that occasion's own
 * wording and its one celebration, so a birthday never previews as a haldi.
 */

export type { SampleFunction };

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
  const words = useSampleWords();
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
      date: formatCardDate(SAMPLE_DAYS.wedding[0], locale),
      venue: sample.venues.wedding,
    };
    if (!other) return wedding;
    const own = words.occasions[other];
    const line = (slot: "blessing" | "families" | "line") => own?.[slot] ?? wedding[slot];
    const category: Category = CATEGORIES[other];
    const one = category.people === "one";
    return {
      ...wedding,
      blessing: line("blessing"),
      families: line("families"),
      line: line("line"),
      ...(one && { first: sample.one, joiner: "", second: "" }),
      date: formatCardDate(SAMPLE_OCCASION_DAY[0], locale),
      venue: sample.venues.other,
    };
  }, [sample, locale, other, words]);
  const functions = useMemo<StoryFunction[]>(() => {
    const named = (kind: FunctionId) => words.functions[kind] ?? kind;
    if (other) {
      // The occasion's own celebration, once, whichever painting stands in for it
      if (!key) return [];
      const kind = CATEGORIES[other].functions.primary;
      return [
        {
          kind,
          name: named(kind),
          localName: null,
          date: formatCardDate(SAMPLE_OCCASION_DAY[0], locale),
          time: formatCardTime(SAMPLE_OCCASION_DAY[1], null, locale),
          muhurat: null,
          venue: sample.venues.other,
        },
      ];
    }
    return (key ? (key.split(",") as SampleFunction[]) : []).map((kind) => ({
      kind,
      name: named(kind),
      localName: null,
      date: formatCardDate(SAMPLE_DAYS[kind][0], locale),
      time: formatCardTime(SAMPLE_DAYS[kind][1], null, locale),
      muhurat: null,
      venue: sample.venues[kind],
    }));
  }, [key, words, locale, sample, other]);
  return { copy, functions, lang: locale };
}
