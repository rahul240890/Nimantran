import { galleryText } from "@/i18n/copy/gallery";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import type { Category } from "@/lib/categories/schema";
import { newDraft, withGalleryChoice, type InviteDraft } from "@/lib/editor/draft";
import { suiteOccasion, type GalleryDesign } from "@/lib/gallery/catalog";
import { designPhotos } from "@/lib/gallery/photos";
import type { PublicPhoto } from "@/lib/invites/public";
import { formatCardDate, type CardLanguage } from "@/lib/templates/card-languages";
import { cardSuggestions } from "@/lib/templates/card-suggestions";
import { SAMPLE_DAYS, SAMPLE_OCCASION_DAY, type SampleFunction } from "./days";
import { SCENE_PHOTOS, at } from "./drafts";

/*
 * A design's public sample (/sample/<design>): the invitation exactly as a guest would get
 * it, made with the gallery's "Use this design" choice and filled with made-up names, days
 * and places in the visitor's language. Nothing about it is saved or sent.
 */

export type SampleInvite = { draft: InviteDraft; photos: PublicPhoto[]; category: CategoryId };

/** The occasion a design opens in: a painted theme's own, a card's first occasion. */
export function sampleOccasion(design: GalleryDesign): CategoryId {
  if (design.suite !== "classic") return suiteOccasion(design.suite);
  const holds = (category: CategoryId) =>
    (CATEGORIES[category].templates as readonly string[]).includes(design.template);
  return holds("wedding") ? "wedding" : (CATEGORY_IDS.find(holds) ?? "wedding");
}

/** How many stand-in photos fill the design's frames. */
function photoCount(design: GalleryDesign, category: CategoryId): number {
  const need = designPhotos(design, category);
  return need === "two" || need === "either" ? 2 : need === "one" || need === "couple" ? 1 : 0;
}

export function sampleInvite(design: GalleryDesign, locale: UiLocale): SampleInvite {
  const category = sampleOccasion(design);
  const language: CardLanguage = locale === "hi" ? "hi" : "en";
  const sample = galleryText[locale].galleryCopy.sample;
  const base = withGalleryChoice(newDraft(design.template, category), {
    category,
    tradition: null,
    suite: design.suite,
    template: design.template,
    format: design.format,
  });
  const wedding = category === "wedding";
  const occasion: Category = CATEGORIES[category];
  const one = occasion.people === "one";
  const words = (slot: "blessing" | "families" | "line") =>
    cardSuggestions(category, language, slot)[0] ?? "";

  // A wedding has its run of celebrations; any other occasion (a roka too) its one
  const days: Partial<Record<SampleFunction, readonly [string, string]>> = wedding
    ? SAMPLE_DAYS
    : {};
  const functions = Object.fromEntries(
    Object.entries(base.functions).map(([kind, fn]) => {
      const day = days[kind as SampleFunction];
      // The baraat rides in on the wedding's own card; the sample shows the five evenings
      if (wedding && day && kind !== "baraat") {
        return [kind, at(day[0], day[1], sample.venues[kind as SampleFunction])];
      }
      if (!wedding && kind === occasion.functions.primary) {
        return [kind, at(SAMPLE_OCCASION_DAY[0], SAMPLE_OCCASION_DAY[1], sample.venues.other)];
      }
      return [kind, { ...fn, included: false }];
    }),
  ) as InviteDraft["functions"];

  const count = photoCount(design, category);
  const draft: InviteDraft = {
    ...base,
    step: "preview",
    languages: [language],
    content: {
      first: one ? sample.one : sample.first,
      second: one ? "" : sample.second,
      blessing: wedding ? sample.blessing : words("blessing"),
      families: wedding ? sample.families : words("families"),
      line: wedding ? sample.line : words("line") || sample.line,
      date: formatCardDate(wedding ? SAMPLE_DAYS.wedding[0] : SAMPLE_OCCASION_DAY[0], language),
      venue: wedding ? sample.venues.wedding : sample.venues.other,
    },
    functions,
    couplePhotos: count ? { layout: count === 2 ? "two" : "one", ids: [] } : base.couplePhotos,
  };
  return { draft, photos: SCENE_PHOTOS.slice(0, count), category };
}

/** The sample's title: the design's name and its occasion. */
export function sampleTitle(name: string, category: CategoryId, locale: UiLocale): string {
  return `${name} · ${CATEGORIES[category].names[locale]}`;
}
