import type { CategoryId } from "@/lib/categories/catalog";
import type { WeddingKind } from "./catalog";
import {
  NO_FILTERS,
  PHOTO_GROUPS,
  filterCatalog,
  filtersToParams,
  type CatalogEntry,
  type DesignFilters,
  type DesignFormat,
  type PhotoGroup,
} from "./filters";

/*
 * The Designs page's rows, the way large shops lay out a catalogue: a few designs of one
 * kind in a row that scrolls sideways, and View all for the rest, instead of every design
 * in one long grid. Each row is a filter, so View all is the same page with that filter
 * chosen, and its address can be shared or linked from the menu.
 */

export type Shelf =
  | { id: `photos-${PhotoGroup}`; kind: "photos"; value: PhotoGroup }
  | { id: `format-${DesignFormat}`; kind: "format"; value: DesignFormat }
  | { id: `tradition-${WeddingKind}`; kind: "tradition"; value: WeddingKind }
  | { id: `occasion-${CategoryId}`; kind: "occasion"; value: CategoryId };

/** Occasions beyond the wedding that get a row of their own. */
export const SHELF_OCCASIONS = [
  "birthday",
  "anniversary",
  "baby-shower",
  "housewarming",
] as const satisfies readonly CategoryId[];

/**
 * Every row, in order: by photos, then by kind of invitation, then other occasions. Wedding
 * traditions head the page as tiles instead (each opens its View all), so the page stays short.
 */
export const SHELVES: readonly Shelf[] = [
  ...PHOTO_GROUPS.map((value) => ({
    id: `photos-${value}` as const,
    kind: "photos" as const,
    value,
  })),
  ...(["story", "scene", "card"] as const satisfies readonly DesignFormat[]).map((value) => ({
    id: `format-${value}` as const,
    kind: "format" as const,
    value,
  })),
  ...SHELF_OCCASIONS.map((value) => ({
    id: `occasion-${value}` as const,
    kind: "occasion" as const,
    value,
  })),
];

/** The filters a row stands for, which View all chooses. */
export function shelfFilters(shelf: Shelf): DesignFilters {
  switch (shelf.kind) {
    case "photos":
      return { ...NO_FILTERS, photos: shelf.value };
    case "format":
      return { ...NO_FILTERS, format: shelf.value };
    case "tradition":
      return { ...NO_FILTERS, kind: shelf.value };
    case "occasion":
      return { ...NO_FILTERS, occasion: shelf.value };
  }
}

/** View all: the Designs page with the row's filter chosen ("/designs?photos=none"). */
export function shelfHref(shelf: Shelf, designsPath: string): string {
  return `${designsPath}${filtersToParams(shelfFilters(shelf))}`;
}

/** A wedding tradition's tile at the head of the page, which is a row too. */
export const traditionShelf = (value: WeddingKind): Shelf => ({
  id: `tradition-${value}`,
  kind: "tradition",
  value,
});

/** How many designs a row shows before View all. */
export const SHELF_SIZE = 10;

/** A row's designs: the first few, and how many there are in all. */
export function shelfEntries(
  entries: readonly CatalogEntry[],
  shelf: Shelf,
): { shown: CatalogEntry[]; total: number } {
  const all = filterCatalog(entries, shelfFilters(shelf), () => "");
  return { shown: all.slice(0, SHELF_SIZE), total: all.length };
}
