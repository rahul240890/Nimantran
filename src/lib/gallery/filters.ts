import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { BUILT_PRICING } from "@/lib/plans/design-defaults";
import {
  DESIGN_TIERS,
  tierPricePaise,
  type DesignTier,
  type Pricing,
} from "@/lib/plans/design-tiers";
import { isStoryId, suiteSuits } from "@/lib/suites/catalog";
import { isMoving } from "@/lib/suites/moving";
import {
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  allDesigns,
  designHref,
  suiteOccasion,
  type GalleryDesign,
  type WeddingKind,
} from "./catalog";
import { COLLECTION_IDS, collectionOf, collectionRank, type CollectionId } from "./collections";
import { designPhotos, type PhotoNeed } from "./photos";
import { normalize } from "./search";

/*
 * The Designs page's filters: every design, tagged with its kind (Scene, Story or 3D card),
 * the occasions it suits and the kinds of wedding it is made for, so a host can narrow the
 * whole gallery at once ("Gujarati wedding, Scene") instead of walking occasion by occasion.
 */

/** "moving" is a Scene painted in layers that move like a short film (moving.ts). */
export const DESIGN_FORMATS = ["moving", "storybook", "scene", "story", "card"] as const;
export type DesignFormat = (typeof DESIGN_FORMATS)[number];

/**
 * The photos a host has to hand, as the Designs page groups them: none, one photo (of the
 * couple, or of the one being celebrated) or two (one each). A design that takes either a
 * couple photo or two separate ones is in both of the last two.
 */
export const PHOTO_GROUPS = ["none", "one", "two"] as const;
export type PhotoGroup = (typeof PHOTO_GROUPS)[number];

const PHOTO_GROUP_NEEDS: Record<PhotoGroup, readonly PhotoNeed[]> = {
  none: ["none", "optional"],
  one: ["one", "couple", "either"],
  two: ["two", "either"],
};

export type CatalogEntry = {
  design: GalleryDesign;
  format: DesignFormat;
  photos: PhotoNeed;
  occasions: readonly CategoryId[];
  kinds: readonly WeddingKind[];
  collection: CollectionId;
};

/** How the matching designs are ordered: the gallery's own mix, or by what the design costs. */
export const CATALOG_SORTS = ["recommended", "price-low", "price-high"] as const;
export type CatalogSort = (typeof CATALOG_SORTS)[number];

export type DesignFilters = {
  query: string;
  occasion: CategoryId | null;
  /** A kind of wedding; choosing one means a wedding. */
  kind: WeddingKind | null;
  format: DesignFormat | null;
  photos: PhotoGroup | null;
  /** A collection, such as Royal Wedding (collections.ts). */
  collection: CollectionId | null;
  /** A price tier (Admin, Designs): Free, Premium, Royal or Signature. */
  price: DesignTier | null;
  sort: CatalogSort;
};

export const NO_FILTERS: DesignFilters = {
  query: "",
  occasion: null,
  kind: null,
  format: null,
  photos: null,
  collection: null,
  price: null,
  sort: "recommended",
};

/** Whether any filter is chosen: if not, the Designs page shows its rows instead of a grid. */
export function hasFilters(filters: DesignFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    !!(
      filters.occasion ||
      filters.kind ||
      filters.format ||
      filters.photos ||
      filters.collection ||
      filters.price
    )
  );
}

export function formatOf(design: GalleryDesign): DesignFormat {
  if (isMoving(design.suite)) return "moving";
  if (isStoryId(design.suite)) return "storybook";
  return design.format === "scene" ? "scene" : design.suite === "classic" ? "card" : "story";
}

function occasionsOf(design: GalleryDesign): CategoryId[] {
  return design.suite === "classic"
    ? CATEGORY_IDS.filter((id) =>
        (CATEGORIES[id].templates as readonly string[]).includes(design.template),
      )
    : CATEGORY_IDS.filter((id) => suiteSuits(design.suite, id));
}

export function kindsOf(design: GalleryDesign): WeddingKind[] {
  return WEDDING_KINDS.filter((kind) => {
    const entry = WEDDING_KIND_ENTRIES[kind];
    return design.suite === "classic"
      ? entry.cards.includes(design.template)
      : entry.suites.includes(design.suite);
  });
}

/** One design with what it can be filtered by. */
export function catalogEntry(design: GalleryDesign): CatalogEntry {
  return {
    design,
    format: formatOf(design),
    photos: designPhotos(design),
    occasions: occasionsOf(design),
    kinds: kindsOf(design),
    collection: collectionOf(design.suite),
  };
}

/** Every design in the gallery with what it can be filtered by, each kind mixed through. */
export function designCatalog(): CatalogEntry[] {
  return allDesigns().map(catalogEntry);
}

/** A design's tier at these prices; one missing from the list is never taken as free. */
export const tierOf = (pricing: Pick<Pricing, "tiers">, designId: string): DesignTier =>
  pricing.tiers[designId] ?? "premium";

/**
 * The designs matching every filter, in the order asked for. `words` gives each design's
 * searchable text (its name, description and wedding kinds, in every site language); every
 * word typed must appear. `pricing` is the admin's, for the price filter and sorting.
 */
export function filterCatalog(
  entries: readonly CatalogEntry[],
  filters: DesignFilters,
  words: (design: GalleryDesign) => string,
  pricing: Pick<Pricing, "tiers" | "designs"> = BUILT_PRICING,
): CatalogEntry[] {
  const terms = normalize(filters.query).split(" ").filter(Boolean);
  const occasion = filters.kind ? "wedding" : filters.occasion;
  const shown = entries.filter(
    (entry) =>
      (!filters.format || entry.format === filters.format) &&
      (!occasion || entry.occasions.includes(occasion)) &&
      (!filters.kind || entry.kinds.includes(filters.kind)) &&
      (!filters.collection || entry.collection === filters.collection) &&
      (!filters.photos || PHOTO_GROUP_NEEDS[filters.photos].includes(entry.photos)) &&
      (!filters.price || tierOf(pricing, entry.design.id) === filters.price) &&
      (terms.length === 0 || terms.every((term) => words(entry.design).includes(term))),
  );
  // A collection lists its best themes first
  if (filters.collection) {
    shown.sort((a, b) => collectionRank(a.design.suite) - collectionRank(b.design.suite));
  }
  // By price, designs of one price keep the order above (the sort is stable)
  if (filters.sort !== "recommended") {
    const cost = (entry: CatalogEntry) => tierPricePaise(pricing, tierOf(pricing, entry.design.id));
    const way = filters.sort === "price-low" ? 1 : -1;
    shown.sort((a, b) => way * (cost(a) - cost(b)));
  }
  return shown;
}

/** The occasion a design opens for: the one the host filtered by, else its own. */
export function catalogCategory(entry: CatalogEntry, filters: DesignFilters): CategoryId {
  const wanted = filters.kind ? "wedding" : filters.occasion;
  return wanted && entry.occasions.includes(wanted)
    ? wanted
    : entry.design.suite === "classic"
      ? (entry.occasions[0] ?? "wedding")
      : suiteOccasion(entry.design.suite);
}

/** Use this design, set up for what the host filtered by: their occasion and tradition. */
export function catalogHref(entry: CatalogEntry, filters: DesignFilters): string {
  const category = catalogCategory(entry, filters);
  const kind = category === "wedding" ? filters.kind : null;
  return designHref(entry.design, { category, kind });
}

/**
 * The filters in an address (?occasion=haldi&format=scene&photos=none&price=free&sort=price-low&q=red),
 * ignoring unknown values.
 */
export function filtersFromParams(params: URLSearchParams): DesignFilters {
  const occasion = params.get("occasion");
  const kind = params.get("tradition");
  const format = params.get("format");
  const photos = params.get("photos");
  const collection = params.get("collection");
  const price = params.get("price");
  const sort = params.get("sort");
  return {
    query: params.get("q") ?? "",
    occasion: (CATEGORY_IDS as readonly string[]).includes(occasion ?? "")
      ? (occasion as CategoryId)
      : null,
    kind: (WEDDING_KINDS as readonly string[]).includes(kind ?? "") ? (kind as WeddingKind) : null,
    format: (DESIGN_FORMATS as readonly string[]).includes(format ?? "")
      ? (format as DesignFormat)
      : null,
    photos: (PHOTO_GROUPS as readonly string[]).includes(photos ?? "")
      ? (photos as PhotoGroup)
      : null,
    collection: (COLLECTION_IDS as readonly string[]).includes(collection ?? "")
      ? (collection as CollectionId)
      : null,
    price: (DESIGN_TIERS as readonly string[]).includes(price ?? "") ? (price as DesignTier) : null,
    sort: (CATALOG_SORTS as readonly string[]).includes(sort ?? "")
      ? (sort as CatalogSort)
      : "recommended",
  };
}

export function filtersToParams(filters: DesignFilters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.occasion) params.set("occasion", filters.occasion);
  if (filters.kind) params.set("tradition", filters.kind);
  if (filters.format) params.set("format", filters.format);
  if (filters.photos) params.set("photos", filters.photos);
  if (filters.price) params.set("price", filters.price);
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  const text = params.toString();
  return text ? `?${text}` : "";
}
