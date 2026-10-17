import { designNamesText } from "@/i18n/copy/design-names";
import { UI_LOCALES, type UiLocale } from "@/i18n/locales";
import type { GalleryDesign } from "@/lib/gallery/catalog";
import type { SearchWords } from "@/lib/gallery/search";
import { nameOf } from "./design-name";
import { searchWords } from "./search-words";

/*
 * Design names on the server, in any language. Client components get their page's list
 * from it through DesignNamesProvider (design-names.tsx) instead of importing this, which
 * would ship every language's list to the phone.
 */

/** A design's name and description in the page's language. */
export function designWords(
  design: GalleryDesign,
  locale: UiLocale,
): { name: string; description: string } {
  return nameOf(designNamesText[locale], design);
}

/** Everything the gallery search reads, every design by its names in every site language. */
export function allSearchWords(): SearchWords {
  return searchWords(UI_LOCALES.map((locale) => designNamesText[locale]));
}
