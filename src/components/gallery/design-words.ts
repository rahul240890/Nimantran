import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import type { UiLocale } from "@/i18n/locales";
import {
  OCCASIONS,
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  type GalleryDesign,
  type WeddingKind,
} from "@/lib/gallery/catalog";
import type { SearchWords } from "@/lib/gallery/search";

/** A design's name and description in the page's language. */
export function designWords(
  design: GalleryDesign,
  locale: UiLocale,
): { name: string; description: string } {
  const { designCopy, suiteCopy } = editorText[locale];
  if (design.suite === "classic") return designCopy[design.template];
  return { name: suiteCopy.names[design.suite], description: suiteCopy.descriptions[design.suite] };
}

/** Everything the gallery search reads, in both site languages, so either one finds it. */
export function searchWords(): SearchWords {
  const locales: UiLocale[] = ["en", "hi"];
  return {
    occasion: (id) => {
      const occasion = OCCASIONS.find((o) => o.id === id);
      return [
        ...(occasion ? [occasion.names.en, occasion.names.hi] : []),
        ...locales.map((l) => galleryText[l].occasionTaglines[id] ?? ""),
      ];
    },
    kind: (id: WeddingKind) =>
      locales.flatMap((l) => [
        galleryText[l].weddingKindCopy[id].name,
        galleryText[l].weddingKindCopy[id].description,
      ]),
    // A design is found by the kinds of wedding it is made for too ("gujarati" finds Bandhani)
    design: (design) => {
      const kinds = WEDDING_KINDS.filter((kind) => {
        const entry = WEDDING_KIND_ENTRIES[kind];
        return design.suite === "classic"
          ? entry.cards.includes(design.template)
          : entry.suites.includes(design.suite);
      });
      return locales.flatMap((l) => {
        const words = designWords(design, l);
        return [
          words.name,
          words.description,
          ...kinds.map((kind) => galleryText[l].weddingKindCopy[kind].name),
        ];
      });
    },
  };
}
