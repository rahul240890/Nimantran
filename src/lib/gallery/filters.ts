import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { suiteSuits } from "@/lib/suites/catalog";
import {
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  allDesigns,
  designHref,
  suiteOccasion,
  type GalleryDesign,
  type WeddingKind,
} from "./catalog";
import { designPhotos, type PhotoNeed } from "./photos";
import { normalize } from "./search";

/*
 * The Designs page's filters: every design, tagged with its kind (Scene, Story or 3D card),
 * the occasions it suits and the kinds of wedding it is made for, so a host can narrow the
 * whole gallery at once ("Gujarati wedding, Scene") instead of walking occasion by occasion.
 */

export const DESIGN_FORMATS = ["scene", "story", "card"] as const;
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
};

export type DesignFilters = {
  query: string;
  occasion: CategoryId | null;
  /** A kind of wedding; choosing one means a wedding. */
  kind: WeddingKind | null;
  format: DesignFormat | null;
  photos: PhotoGroup | null;
};

export const NO_FILTERS: DesignFilters = {
  query: "",
  occasion: null,
  kind: null,
  format: null,
  photos: null,
};

/** Whether any filter is chosen: if not, the Designs page shows its rows instead of a grid. */
export function hasFilters(filters: DesignFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    !!(filters.occasion || filters.kind || filters.format || filters.photos)
  );
}

export function formatOf(design: GalleryDesign): DesignFormat {
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

/** Every design in the gallery with what it can be filtered by, each kind mixed through. */
export function designCatalog(): CatalogEntry[] {
  return allDesigns().map((design) => ({
    design,
    format: formatOf(design),
    photos: designPhotos(design),
    occasions: occasionsOf(design),
    kinds: kindsOf(design),
  }));
}

/**
 * The designs matching every filter. `words` gives each design's searchable text (its name,
 * description and wedding kinds, in every site language); every word typed must appear.
 */
export function filterCatalog(
  entries: readonly CatalogEntry[],
  filters: DesignFilters,
  words: (design: GalleryDesign) => string,
): CatalogEntry[] {
  const terms = normalize(filters.query).split(" ").filter(Boolean);
  const occasion = filters.kind ? "wedding" : filters.occasion;
  return entries.filter(
    (entry) =>
      (!filters.format || entry.format === filters.format) &&
      (!occasion || entry.occasions.includes(occasion)) &&
      (!filters.kind || entry.kinds.includes(filters.kind)) &&
      (!filters.photos || PHOTO_GROUP_NEEDS[filters.photos].includes(entry.photos)) &&
      (terms.length === 0 || terms.every((term) => words(entry.design).includes(term))),
  );
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

/** The filters in an address (?occasion=haldi&format=scene&photos=none&q=red), ignoring unknown values. */
export function filtersFromParams(params: URLSearchParams): DesignFilters {
  const occasion = params.get("occasion");
  const kind = params.get("tradition");
  const format = params.get("format");
  const photos = params.get("photos");
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
  };
}

export function filtersToParams(filters: DesignFilters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.occasion) params.set("occasion", filters.occasion);
  if (filters.kind) params.set("tradition", filters.kind);
  if (filters.format) params.set("format", filters.format);
  if (filters.photos) params.set("photos", filters.photos);
  const text = params.toString();
  return text ? `?${text}` : "";
}
