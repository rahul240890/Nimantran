import { editorText } from "@/i18n/copy/editor";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import type { FunctionId } from "@/lib/events/functions";
import { isWeddingJourney } from "@/lib/suites/catalog";
import { cardSuggestions } from "@/lib/templates/card-suggestions";
import { SAMPLE_DAYS, type SampleFunction } from "./days";

/*
 * The few words the gallery's previews print on a design, worked out on the server: each
 * sample celebration's name, and each occasion's first blessing, families' line and
 * invitation line. The browser gets these alone, not the editor's words or every card
 * language's suggestions, which would weigh down every page with a design on it.
 */

export type SampleLine = { blessing: string; families: string; line: string };

export type SampleWords = {
  functions: Partial<Record<FunctionId, string>>;
  /** An occasion beyond the wedding's journey: its own words, where it has them. */
  occasions: Partial<Record<CategoryId, Partial<SampleLine>>>;
};

export function sampleWords(locale: UiLocale): SampleWords {
  const { functionCopy } = editorText[locale];
  const others = CATEGORY_IDS.filter((id) => !isWeddingJourney(id));
  const kinds = new Set<FunctionId>([
    ...(Object.keys(SAMPLE_DAYS) as SampleFunction[]),
    ...others.map((id) => CATEGORIES[id].functions.primary),
  ]);
  const first = (id: CategoryId, slot: keyof SampleLine) => cardSuggestions(id, locale, slot)[0];
  return {
    functions: Object.fromEntries([...kinds].map((kind) => [kind, functionCopy[kind].name])),
    occasions: Object.fromEntries(
      others.map((id) => [
        id,
        {
          blessing: first(id, "blessing"),
          families: first(id, "families"),
          line: first(id, "line"),
        },
      ]),
    ),
  };
}
