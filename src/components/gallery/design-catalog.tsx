"use client";

import {
  BookOpen,
  Clapperboard,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Rotate3d,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useId, useMemo, useState } from "react";
import { usePricing } from "@/components/pricing/pricing-provider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { ScrollRow } from "@/components/ui/scroll-row";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { cn } from "@/lib/cn";
import { WEDDING_KINDS, type WeddingKind } from "@/lib/gallery/catalog";
import { formatRupees } from "@/lib/plans/catalog";
import { DESIGN_TIERS, tierPricePaise, type DesignTier } from "@/lib/plans/design-tiers";
import {
  CATALOG_SORTS,
  NO_FILTERS,
  PHOTO_GROUPS,
  designCatalog,
  filterCatalog,
  filtersFromParams,
  filtersToParams,
  hasFilters,
  tierOf,
  type CatalogEntry,
  type CatalogSort,
  type DesignFilters,
  type DesignFormat,
  type PhotoGroup,
} from "@/lib/gallery/filters";
import { normalize } from "@/lib/gallery/search";
import { COLLECTION_IDS, type CollectionId } from "@/lib/gallery/collections";
import {
  COLLECTION_SHELVES,
  SHELVES,
  shelfEntries,
  shelfHref,
  type Shelf,
} from "@/lib/gallery/shelves";
import { ChipRow, chipClass } from "./chip-row";
import { CollectionTiles } from "./collection-tiles";
import { TrendingRow } from "./trending-row";
import { pagePath } from "@/lib/seo/paths";
import { useEarlyInput } from "@/lib/use-early-input";
import type { DesignNames } from "./design-name";
import { DesignNamesProvider, useDesignNames, useSearchWords } from "./design-names";
import { CatalogCard, ShelfRow, TraditionTiles, type Covers } from "./shelf-row";

/** The occasions offered as quick links at the head of the page; All occasions has the rest. */
const CHIP_OCCASIONS = [
  "engagement",
  "haldi",
  "mehendi",
  "sangeet",
  "reception",
  "save-the-date",
  "birthday",
  "anniversary",
  "baby-shower",
  "naming-ceremony",
  "housewarming",
  "puja",
  "diwali",
  "shop-opening",
] as const satisfies readonly CategoryId[];

/** The occasions the filters show first: the wedding and the quick links above. */
const QUICK_OCCASIONS: readonly CategoryId[] = ["wedding", ...CHIP_OCCASIONS];

const FORMAT_ICONS = {
  all: LayoutGrid,
  moving: Clapperboard,
  storybook: BookOpen,
  scene: ImageIcon,
  story: Layers,
  card: Rotate3d,
} as const;

/** Every design's searchable words by design id: in every site language once searching. */
function useSearchText(entries: readonly CatalogEntry[], searching: boolean) {
  const words = useSearchWords(useDesignNames(), searching);
  return useMemo(() => {
    const map = new Map(
      entries.map((entry) => [entry.design.id, normalize(words.design(entry.design).join(" "))]),
    );
    return (id: string) => map.get(id) ?? "";
  }, [entries, words]);
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { galleryCopy, catalogCopy } = useText(galleryText);
  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="relative flex items-center"
    >
      <label htmlFor="catalog-search" className="sr-only">
        {catalogCopy.searchLabel}
      </label>
      <Search aria-hidden className="pointer-events-none absolute start-4 size-5 text-ink-muted" />
      <input
        id="catalog-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={catalogCopy.searchPlaceholder}
        autoComplete="off"
        enterKeyHint="search"
        className="h-12 w-full rounded-full border border-line-control bg-surface ps-12 pe-12 text-base text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={galleryCopy.clearSearch}
          className="absolute end-0.5 grid size-11 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X aria-hidden className="size-5" />
        </button>
      )}
    </form>
  );
}

/**
 * The page with nothing chosen: tradition tiles, occasions, the collections as tiles, then
 * the moving scenes and a row per collection.
 */
function Browse({
  entries,
  covers,
  designsPath,
}: {
  entries: readonly CatalogEntry[];
  covers: Covers;
  designsPath: string;
}) {
  const locale = useLocale();
  const { shelfCopy, catalogCopy, weddingKindCopy, occasionTaglines, collectionCopy } =
    useText(galleryText);
  const occasionsPath = pagePath({ kind: "gallery" }, locale);
  const kindTitle = (kind: WeddingKind) => shelfCopy.tradition(weddingKindCopy[kind].name);
  // The moving scenes head the rows in a group of their own, then a row per collection
  const groups = [
    {
      group: "moving",
      title: shelfCopy.groups.moving,
      shelves: SHELVES.filter((shelf) => shelf.kind === "format" && shelf.value === "moving"),
    },
    { group: "collections", title: collectionCopy.rowsHeading, shelves: COLLECTION_SHELVES },
  ] as const;
  const words = (shelf: Shelf) => {
    switch (shelf.kind) {
      case "photos":
        return shelfCopy.photos[shelf.value];
      case "format":
        return shelfCopy.format[shelf.value];
      case "tradition":
        return {
          title: kindTitle(shelf.value),
          intro: weddingKindCopy[shelf.value].description,
        };
      case "occasion":
        return {
          title: CATEGORIES[shelf.value].names[locale],
          intro: occasionTaglines[shelf.value] ?? "",
        };
      case "collection":
        return {
          title: collectionCopy.name(collectionCopy.names[shelf.value].name),
          intro: collectionCopy.names[shelf.value].intro,
        };
    }
  };

  return (
    <>
      <TraditionTiles designsPath={designsPath} />

      <section aria-labelledby="occasions-heading" className="flex flex-col gap-2">
        <h2
          id="occasions-heading"
          className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
        >
          {shelfCopy.occasionsHeading}
        </h2>
        <ScrollRow
          labels={shelfCopy}
          className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
        >
          {CHIP_OCCASIONS.map((id) => (
            <li key={id} className="shrink-0">
              <Link
                href={shelfHref({ id: `occasion-${id}`, kind: "occasion", value: id }, designsPath)}
                className={chipClass(false)}
              >
                {CATEGORIES[id].names[locale]}
              </Link>
            </li>
          ))}
          <li className="shrink-0">
            <Link href={occasionsPath} className={cn(chipClass(false), "gap-1.5 text-accent-text")}>
              {catalogCopy.allOccasions}
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
            </Link>
          </li>
        </ScrollRow>
      </section>

      <CollectionTiles entries={entries} covers={covers} designsPath={designsPath} />

      <section
        aria-labelledby="group-trending"
        className="flex flex-col gap-8 border-t border-line pt-8"
      >
        <h2
          id="group-trending"
          className="flex items-center gap-3 font-label text-xs tracking-[0.24em] text-accent-text uppercase"
        >
          <span aria-hidden className="h-px w-6 bg-marigold" />
          {shelfCopy.trending.group}
        </h2>
        <TrendingRow id="trending" covers={covers} entries={entries} />
      </section>

      {groups.map(({ group, title, shelves }, groupIndex) => (
        <section
          key={group}
          aria-labelledby={`group-${group}`}
          className="flex flex-col gap-8 border-t border-line pt-8"
        >
          <h2
            id={`group-${group}`}
            className="flex items-center gap-3 font-label text-xs tracking-[0.24em] text-accent-text uppercase"
          >
            <span aria-hidden className="h-px w-6 bg-marigold" />
            {title}
          </h2>
          {shelves.map((shelf, index) => {
            const { shown, total } = shelfEntries(entries, shelf);
            const { title, intro } = words(shelf);
            return (
              <ShelfRow
                key={shelf.id}
                id={shelf.id}
                title={title}
                intro={intro}
                href={shelfHref(shelf, designsPath)}
                entries={shown}
                total={total}
                covers={covers}
                priority={false}
                // Only the first row draws its designs with the page; on a phone every row
                // is below the fold, and each card is work before the page can respond
                lazy={groupIndex > 0 || index > 0}
              />
            );
          })}
        </section>
      ))}
    </>
  );
}

/** How many matching designs the grid draws before Show all. */
const FIRST_RESULTS = 48;

/** The page with filters chosen: every matching design in a grid, and the filters to change. */
function Results({
  entries,
  filters,
  covers,
  designsPath,
  onChange,
}: {
  entries: readonly CatalogEntry[];
  filters: DesignFilters;
  covers: Covers;
  designsPath: string;
  onChange: (next: DesignFilters) => void;
}) {
  const locale = useLocale();
  const { galleryCopy, catalogCopy, shelfCopy, weddingKindCopy, collectionCopy } =
    useText(galleryText);
  const text = useSearchText(entries, filters.query.trim().length > 0);
  const pricing = usePricing();
  const deferred = useDeferredValue(filters);
  const shown = useMemo(
    () => filterCatalog(entries, deferred, (design) => text(design.id), pricing),
    [entries, deferred, text, pricing],
  );
  // A long list draws its first designs; Show all draws the rest, until the filters change
  const signature = filtersToParams(deferred);
  const [allFor, setAllFor] = useState<string | null>(null);
  const drawn = allFor === signature ? shown : shown.slice(0, FIRST_RESULTS);
  const set = (change: Partial<DesignFilters>) => onChange({ ...filters, ...change });
  const showKinds = !filters.occasion || filters.occasion === "wedding";
  // The occasions most families look for first; the rest are one tap away
  const chosenOccasion = filters.kind ? "wedding" : filters.occasion;
  const [allOccasions, setAllOccasions] = useState(
    () => !!chosenOccasion && !QUICK_OCCASIONS.includes(chosenOccasion),
  );
  // Tradition, collection and price wait behind More filters, open while one is chosen
  const extras = [showKinds && filters.kind, filters.collection, filters.price].filter(
    Boolean,
  ).length;
  const [moreOpen, setMoreOpen] = useState(extras > 0);
  const moreId = useId();
  // Only the prices some design has (Signature is empty until the admin moves a design there)
  const prices = DESIGN_TIERS.filter((tier) =>
    entries.some((entry) => tierOf(pricing, entry.design.id) === tier),
  );
  const priceLabel = (tier: DesignTier) => {
    const paise = tierPricePaise(pricing, tier);
    return paise
      ? galleryCopy.tierPrice(galleryCopy.tiers[tier], formatRupees(paise))
      : galleryCopy.tiers[tier];
  };
  // A View all names its row: "Illustrated invitations · 89 designs"
  const { query, kind, photos, format, occasion, collection, price } = filters;
  const only = (chosen: unknown) =>
    !query.trim() &&
    [kind ?? occasion, photos, format, collection, price].filter(Boolean).length === 1 &&
    !!chosen;
  const title = only(collection)
    ? collectionCopy.name(collectionCopy.names[collection!].name)
    : only(kind)
      ? shelfCopy.tradition(weddingKindCopy[kind!].name)
      : only(occasion)
        ? CATEGORIES[occasion!].names[locale]
        : only(photos)
          ? shelfCopy.photos[photos!].title
          : only(format)
            ? shelfCopy.format[format!].title
            : null;

  return (
    <>
      <Link
        href={designsPath}
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-full px-1 font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        {catalogCopy.allDesigns}
      </Link>

      <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface/70 p-4 shadow-raised sm:p-5">
        <ChipRow<CategoryId>
          label={catalogCopy.occasionLabel}
          allLabel={catalogCopy.allOccasions}
          value={chosenOccasion}
          options={(allOccasions ? CATEGORY_IDS : QUICK_OCCASIONS).map((id) => ({
            id,
            label: CATEGORIES[id].names[locale],
          }))}
          onChange={(occasion) =>
            set({ occasion, kind: occasion === "wedding" ? filters.kind : null })
          }
          after={
            <button
              type="button"
              aria-expanded={allOccasions}
              onClick={() => setAllOccasions((open) => !open)}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full px-3 text-sm font-semibold whitespace-nowrap text-accent-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {allOccasions ? catalogCopy.fewerOccasions : catalogCopy.moreOccasions}
            </button>
          }
        />

        <RadioGroup
          label={galleryCopy.formats.label}
          variant="segment"
          value={filters.format ?? "all"}
          onValueChange={(value) =>
            set({ format: value === "all" ? null : (value as DesignFormat) })
          }
          className="w-full max-w-2xl"
        >
          {(["all", "moving", "storybook", "scene", "story", "card"] as const).map((choice) => {
            const Icon = FORMAT_ICONS[choice];
            return (
              <RadioItem
                key={choice}
                value={choice}
                label={galleryCopy.formats[choice]}
                icon={<Icon />}
              />
            );
          })}
        </RadioGroup>

        <ChipRow<PhotoGroup>
          label={catalogCopy.photosLabel}
          allLabel={catalogCopy.allPhotos}
          value={filters.photos}
          options={PHOTO_GROUPS.map((id) => ({ id, label: catalogCopy.photoGroups[id] }))}
          onChange={(photos) => set({ photos })}
        />

        <div className="flex flex-col gap-5 border-t border-line pt-4">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={moreOpen}
            aria-controls={moreId}
            onClick={() => setMoreOpen((open) => !open)}
            className="self-start"
          >
            <SlidersHorizontal aria-hidden />
            {moreOpen ? catalogCopy.fewerFilters : catalogCopy.moreFilters(extras)}
          </Button>
          <div id={moreId} hidden={!moreOpen} className="flex flex-col gap-5">
            {showKinds && (
              <ChipRow<WeddingKind>
                label={catalogCopy.traditionLabel}
                allLabel={catalogCopy.allTraditions}
                value={filters.kind}
                options={WEDDING_KINDS.map((id) => ({ id, label: weddingKindCopy[id].name }))}
                onChange={(kind) => set({ kind })}
              />
            )}
            <ChipRow<DesignTier>
              label={catalogCopy.priceLabel}
              allLabel={catalogCopy.allPrices}
              value={filters.price}
              options={prices.map((id) => ({ id, label: priceLabel(id) }))}
              onChange={(price) => set({ price })}
            />
            <ChipRow<CollectionId>
              label={collectionCopy.label}
              allLabel={collectionCopy.all}
              value={filters.collection}
              options={COLLECTION_IDS.map((id) => ({ id, label: collectionCopy.names[id].name }))}
              onChange={(collection) => set({ collection })}
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
        {/* The count heads the list of designs, and is read out as filters change it */}
        <h2 aria-live="polite" className="font-display text-xl sm:text-2xl">
          {title
            ? `${title} · ${catalogCopy.count(shown.length)}`
            : catalogCopy.count(shown.length)}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label={catalogCopy.sortLabel}
            value={filters.sort}
            onValueChange={(sort) => set({ sort: sort as CatalogSort })}
            options={CATALOG_SORTS.map((sort) => ({ value: sort, label: catalogCopy.sorts[sort] }))}
            className="w-auto min-w-48"
          />
          <Button variant="ghost" size="sm" onClick={() => onChange(NO_FILTERS)}>
            <X aria-hidden />
            {catalogCopy.clear}
          </Button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line-strong bg-surface-2 px-6 py-14 text-center">
          <p className="max-w-md text-lg text-ink-muted">{catalogCopy.empty}</p>
          <Button variant="secondary" onClick={() => onChange(NO_FILTERS)}>
            {catalogCopy.clear}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {drawn.map((entry, index) => (
              <li key={entry.design.id} data-format-item={entry.format}>
                <CatalogCard
                  entry={entry}
                  filters={deferred}
                  covers={covers}
                  priority={index < 4}
                />
              </li>
            ))}
          </ul>
          {drawn.length < shown.length && (
            <Button
              variant="secondary"
              size="lg"
              className="self-center"
              onClick={() => setAllFor(signature)}
            >
              {galleryCopy.showAll(shown.length)}
              <ChevronDown aria-hidden />
            </Button>
          )}
        </div>
      )}
    </>
  );
}

function Catalog({
  filters,
  covers,
  designsPath,
  onChange,
  live,
}: {
  filters: DesignFilters;
  covers: Covers;
  designsPath: string;
  onChange: (next: DesignFilters) => void;
  /** The catalogue that reads the address, which takes over from the one the server drew. */
  live?: boolean;
}) {
  const entries = useMemo(() => designCatalog(), []);
  return (
    <div
      data-catalog-live={live || undefined}
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8"
    >
      {/* One search box for the rows and the list, so typing the first letter keeps focus */}
      <div className="rounded-xl border border-line bg-surface/70 p-4 shadow-raised sm:p-5">
        <SearchBox value={filters.query} onChange={(query) => onChange({ ...filters, query })} />
      </div>
      {hasFilters(filters) ? (
        <Results
          entries={entries}
          filters={filters}
          covers={covers}
          designsPath={designsPath}
          onChange={onChange}
        />
      ) : (
        <Browse entries={entries} covers={covers} designsPath={designsPath} />
      )}
    </div>
  );
}

/** The catalogue as the address has it; each change is written back to the address. */
function AddressedCatalog({ covers }: { covers: Covers }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const filters = useMemo(() => filtersFromParams(new URLSearchParams(params)), [params]);
  const change = (asked: DesignFilters) => {
    // A long list can still be drawing the last change when the next one comes, so this
    // render's filters may be behind the address: carry over only what this change alters
    const latest = filtersFromParams(new URLSearchParams(window.location.search));
    const next = { ...latest };
    for (const key of Object.keys(asked) as (keyof DesignFilters)[]) {
      if (asked[key] !== filters[key]) Object.assign(next, { [key]: asked[key] });
    }
    const url = `${pathname}${filtersToParams(next)}`;
    // Moving between the rows and a list is a new step Back returns from; a change
    // within the list replaces it, so Back does not walk through every letter typed
    if (hasFilters(next) !== hasFilters(latest)) {
      window.history.pushState(null, "", url);
    } else {
      window.history.replaceState(null, "", url);
    }
  };
  // A search typed into the server's catalogue before this one replaced it still runs
  useEarlyInput("catalog-search", (query) => change({ ...filters, query }));
  return (
    <Catalog filters={filters} covers={covers} designsPath={pathname} onChange={change} live />
  );
}

/**
 * The Designs page's catalogue. With nothing chosen it shows the wedding traditions, the
 * other occasions and rows of designs by photos and kind, each with View all; a View all,
 * search or filter shows every matching design in a grid. The choices live in the address,
 * so a list can be shared, linked from the menu or come back to. Drawn on the server with
 * nothing chosen, so search engines read the rows.
 */
export function DesignCatalog({
  covers,
  designsPath,
  names,
}: {
  /** The 3D cards' covers, drawn on the server (see DesignCard). */
  covers: Covers;
  /** This page's address in the site language, for View all. */
  designsPath: string;
  /** The designs' names in the page's language (design-names.tsx). */
  names: DesignNames;
}) {
  return (
    <DesignNamesProvider names={names}>
      <Suspense
        fallback={
          <Catalog
            filters={NO_FILTERS}
            covers={covers}
            designsPath={designsPath}
            onChange={() => {}}
          />
        }
      >
        <AddressedCatalog covers={covers} />
      </Suspense>
    </DesignNamesProvider>
  );
}
