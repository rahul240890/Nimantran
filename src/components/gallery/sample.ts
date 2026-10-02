"use client";

import { useMemo } from "react";
import { useLocale, useText } from "@/i18n/client";
import type { UiLocale } from "@/i18n/locales";
import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import type { StoryFunction } from "@/lib/engine/story";
import type { FunctionId } from "@/lib/events/functions";
import { formatCardDate, formatCardTime } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";

/*
 * The made-up wedding the gallery's previews show a design with, so a guest's view of it
 * can be judged with words in place: the names, the families' line and each celebration's
 * day, time and place, in the visitor's language.
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

export function useSampleInvite(kinds: readonly SampleFunction[]): {
  copy: CardCopy;
  functions: StoryFunction[];
  lang: UiLocale;
} {
  const locale = useLocale();
  const { galleryCopy } = useText(galleryText);
  const { functionCopy } = useText(editorText);
  const sample = galleryCopy.sample;
  const key = kinds.join(",");
  const copy = useMemo<CardCopy>(
    () => ({
      doors: ["", ""],
      blessing: sample.blessing,
      families: sample.families,
      first: sample.first,
      joiner: locale === "hi" ? "संग" : "&",
      second: sample.second,
      line: sample.line,
      date: formatCardDate(DAYS.wedding[0], locale),
      venue: sample.venues.wedding,
    }),
    [sample, locale],
  );
  const functions = useMemo<StoryFunction[]>(
    () =>
      (key ? (key.split(",") as SampleFunction[]) : []).map((kind) => ({
        kind,
        name: functionCopy[kind].name,
        localName: null,
        date: formatCardDate(DAYS[kind][0], locale),
        time: formatCardTime(DAYS[kind][1], null, locale),
        muhurat: null,
        venue: sample.venues[kind],
      })),
    [key, functionCopy, locale, sample],
  );
  return { copy, functions, lang: locale };
}
