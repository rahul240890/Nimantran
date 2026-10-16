import type { GalleryDesign } from "@/lib/gallery/catalog";
import {
  NO_FILTERS,
  catalogCategory,
  catalogEntry,
  catalogHref,
  designCatalog,
  filterCatalog,
  filtersFromParams,
  filtersToParams,
  hasFilters,
  type DesignFilters,
} from "@/lib/gallery/filters";
import { LIVE_DEMOS, isTourSeed, samplePath, tourOrder, tourPath } from "./paths";

/*
 * The bar over a sample walks the visitor on without going back: Previous and Next through
 * the home page's tour, or through the designs of the listing the sample was opened from
 * (an occasion, a wedding tradition, a collection). With no listing, the designs made for
 * the same occasion, so a birthday sample leads to other birthdays.
 */

export type SampleWalk = {
  previous: string | null;
  next: string | null;
  /** Use this design, set up for the listing's occasion and tradition; null for the sample's own. */
  choose: string | null;
  /** The listing walked, for Back from a sample opened from outside; null on the tour. */
  listing: DesignFilters | null;
};

/** The listing a sample's address names, with nothing that would need the search words. */
function listing(search: URLSearchParams): DesignFilters {
  const { occasion, kind, collection, format, photos } = filtersFromParams(search);
  return { ...NO_FILTERS, occasion, kind, collection, format, photos };
}

/** The listing to walk when the address names none, or one the design isn't in. */
function ownListing(design: GalleryDesign): DesignFilters {
  const entry = catalogEntry(design);
  return design.suite === "classic"
    ? { ...NO_FILTERS, format: "card" }
    : { ...NO_FILTERS, occasion: catalogCategory(entry, NO_FILTERS) };
}

/** The designs either side of this one, wrapping round at the ends. */
function around(ids: readonly string[], id: string): [string, string] | null {
  const at = ids.indexOf(id);
  if (at < 0 || ids.length < 2) return null;
  return [ids[(at - 1 + ids.length) % ids.length]!, ids[(at + 1) % ids.length]!];
}

export function sampleWalk(design: GalleryDesign, search: URLSearchParams): SampleWalk {
  const tour = search.get("tour");
  if (isTourSeed(tour) && (LIVE_DEMOS as readonly string[]).includes(design.id)) {
    const [previous, next] = around(tourOrder(tour), design.id)!;
    return {
      previous: tourPath(previous, tour),
      next: tourPath(next, tour),
      choose: null,
      listing: null,
    };
  }
  const named = listing(search);
  const catalog = designCatalog();
  const ids = (filters: DesignFilters) =>
    filterCatalog(catalog, filters, () => "").map((item) => item.design.id);
  const own = !hasFilters(named) || !around(ids(named), design.id);
  const filters = own ? ownListing(design) : named;
  const walk = around(ids(filters), design.id);
  const entry = catalogEntry(design);
  const context = {
    occasion: filters.occasion,
    kind: filters.kind,
    collection: filters.collection,
    format: filters.format,
    photos: filters.photos,
  };
  return {
    previous: walk ? samplePath(walk[0], context) : null,
    next: walk ? samplePath(walk[1], context) : null,
    choose: own ? null : catalogHref(entry, filters),
    listing: filters,
  };
}

/** The page a listing is: its occasion's or wedding tradition's, else the Designs page filtered. */
export function listingPath(
  listing: DesignFilters,
  paths: {
    occasion: (id: string) => string;
    kind: (id: string) => string;
    designs: string;
  },
): string {
  const narrowed = listing.collection || listing.format || listing.photos;
  if (listing.kind && !narrowed) return paths.kind(listing.kind);
  if (listing.occasion && !narrowed) return paths.occasion(listing.occasion);
  return `${paths.designs}${filtersToParams(listing)}`;
}
