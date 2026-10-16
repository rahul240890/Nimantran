import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import { UI_LOCALES, type UiLocale } from "@/i18n/locales";
import {
  OCCASIONS,
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  type GalleryDesign,
  type WeddingKind,
} from "@/lib/gallery/catalog";
import { collectionOf } from "@/lib/gallery/collections";
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

/** Everything the gallery search reads, in every site language, so any of them finds it. */
export function searchWords(): SearchWords {
  const locales: readonly UiLocale[] = UI_LOCALES;
  return {
    occasion: (id) => {
      const occasion = OCCASIONS.find((o) => o.id === id);
      return [
        ...(occasion ? Object.values(occasion.names) : []),
        ...locales.map((l) => galleryText[l].occasionTaglines[id] ?? ""),
      ];
    },
    kind: (id: WeddingKind) =>
      locales.flatMap((l) => [
        galleryText[l].weddingKindCopy[id].name,
        galleryText[l].weddingKindCopy[id].description,
      ]),
    // A design is found by the kinds of wedding it is made for ("gujarati" finds Bandhani)
    // and by its collection ("royal" finds Jal Mahal)
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
          galleryText[l].collectionCopy.names[collectionOf(design.suite)].name,
        ];
      });
    },
  };
}
