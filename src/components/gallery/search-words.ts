import { galleryText } from "@/i18n/copy/gallery";
import { UI_LOCALES, type UiLocale } from "@/i18n/locales";
import {
  OCCASIONS,
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  type WeddingKind,
} from "@/lib/gallery/catalog";
import { collectionOf } from "@/lib/gallery/collections";
import type { SearchWords } from "@/lib/gallery/search";
import { nameOf, type DesignNames } from "./design-name";

/**
 * Everything the gallery search reads: occasions, kinds and collections in every site
 * language, so any of them finds them, and designs by the names lists given (every
 * language's from design-words.ts, or the page's own until those load).
 */
export function searchWords(named: readonly DesignNames[]): SearchWords {
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
      return [
        ...named.flatMap((names) => {
          const words = nameOf(names, design);
          return [words.name, words.description];
        }),
        ...locales.flatMap((l) => [
          ...kinds.map((kind) => galleryText[l].weddingKindCopy[kind].name),
          galleryText[l].collectionCopy.names[collectionOf(design.suite)].name,
        ]),
      ];
    },
  };
}
