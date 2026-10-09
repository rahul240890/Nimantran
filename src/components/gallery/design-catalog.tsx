"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Rotate3d,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useMemo, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { cn } from "@/lib/cn";
import {
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  suiteImage,
  type WeddingKind,
} from "@/lib/gallery/catalog";
import {
  NO_FILTERS,
  PHOTO_GROUPS,
  catalogCategory,
  catalogHref,
  designCatalog,
  filterCatalog,
  filtersFromParams,
  filtersToParams,
  hasFilters,
  type CatalogEntry,
  type DesignFilters,
  type DesignFormat,
  type PhotoGroup,
} from "@/lib/gallery/filters";
import { designPhotos } from "@/lib/gallery/photos";
import { normalize } from "@/lib/gallery/search";
import {
  SHELVES,
  shelfEntries,
  shelfHref,
  traditionShelf,
  type Shelf,
} from "@/lib/gallery/shelves";
import { pagePath } from "@/lib/seo/paths";
import type { TemplateId } from "@/lib/templates/ids";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { DesignCard } from "./design-card";
import { designWords, searchWords } from "./design-words";

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

const FORMAT_ICONS = { all: LayoutGrid, scene: ImageIcon, story: Layers, card: Rotate3d } as const;

type Covers = Partial<Record<TemplateId, ReactNode>>;

const chipClass = (pressed: boolean) =>
  cn(
    "inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    pressed
      ? "border-transparent bg-ink text-paper"
      : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
  );

/** A row of choices, one pressed at a time, that scrolls sideways on a phone. */
function ChipRow<T extends string>({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: T | null;
  options: readonly { id: T; label: string }[];
  onChange: (value: T | null) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">{label}</p>
      <div
        role="group"
        aria-label={label}
        className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <button
          type="button"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
          className={chipClass(value === null)}
        >
          {allLabel}
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(value === option.id ? null : option.id)}
            className={chipClass(value === option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Every design's searchable words, in every site language, by design id. */
function useSearchText(entries: readonly CatalogEntry[]) {
  return useMemo(() => {
    const words = searchWords();
    const map = new Map(
      entries.map((entry) => [entry.design.id, normalize(words.design(entry.design).join(" "))]),
    );
    return (id: string) => map.get(id) ?? "";
  }, [entries]);
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

/** One design in a grid or a row. */
function CatalogCard({
  entry,
  filters,
  covers,
  priority,
}: {
  entry: CatalogEntry;
  filters: DesignFilters;
  covers: Covers;
  priority: boolean;
}) {
  const locale = useLocale();
  const { name, description } = designWords(entry.design, locale);
  return (
    <DesignCard
      design={entry.design}
      name={name}
      description={description}
      href={catalogHref(entry, filters)}
      photos={designPhotos(entry.design, catalogCategory(entry, filters))}
      priority={priority}
      cover={entry.design.suite === "classic" ? covers[entry.design.template] : undefined}
    />
  );
}

/**
 * A row of a few designs that scrolls sideways, with View all for the rest: the way large
 * shops show a big catalogue. The next design peeks in at the edge, so the row reads as
 * one to swipe; on a wider screen arrows scroll it too.
 */
function ShelfRow({
  id,
  title,
  intro,
  href,
  entries,
  total,
  covers,
  priority,
}: {
  id: string;
  title: string;
  intro: string;
  href: string;
  entries: readonly CatalogEntry[];
  total: number;
  covers: Covers;
  priority: boolean;
}) {
  const { shelfCopy, catalogCopy } = useText(galleryText);
  const list = useRef<HTMLUListElement>(null);
  const still = useReducedMotion();
  const scroll = (way: 1 | -1) => {
    const row = list.current;
    if (!row) return;
    const rtl = getComputedStyle(row).direction === "rtl" ? -1 : 1;
    row.scrollBy({ left: way * rtl * row.clientWidth * 0.85, behavior: still ? "auto" : "smooth" });
  };
  const label = shelfCopy.viewAllLabel(title, total);

  return (
    <section aria-labelledby={`${id}-heading`} data-shelf={id} className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 id={`${id}-heading`} className="font-display text-xl leading-tight sm:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-ink-muted">
            {intro} <span className="whitespace-nowrap">· {catalogCopy.count(total)}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <IconButton
            label={shelfCopy.back}
            icon={<ChevronLeft className="rtl:rotate-180" />}
            size="sm"
            variant="ghost"
            onClick={() => scroll(-1)}
            className="hidden md:inline-flex"
          />
          <IconButton
            label={shelfCopy.next}
            icon={<ChevronRight className="rtl:rotate-180" />}
            size="sm"
            variant="ghost"
            onClick={() => scroll(1)}
            className="hidden md:inline-flex"
          />
          <Link
            href={href}
            aria-label={label}
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line bg-surface px-4 text-sm font-semibold whitespace-nowrap text-accent-text transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {shelfCopy.viewAll}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
      <ul
        ref={list}
        className="relative -mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:thin] gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {entries.map((entry, index) => (
          <li
            key={entry.design.id}
            data-format-item={entry.format}
            className="w-[44%] max-w-60 min-w-36 shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-4rem)/4.3)] xl:w-[calc((100%-5rem)/5.25)]"
          >
            <CatalogCard
              entry={entry}
              filters={NO_FILTERS}
              covers={covers}
              priority={priority && index < 2}
            />
          </li>
        ))}
        {total > entries.length && (
          <li className="w-[44%] max-w-60 min-w-36 shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-4rem)/4.3)] xl:w-[calc((100%-5rem)/5.25)]">
            <Link
              href={href}
              aria-label={label}
              className="flex aspect-[3/4] h-auto w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface-2 p-4 text-center transition-colors hover:border-marigold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="grid size-12 place-items-center rounded-full bg-marigold/15 text-accent-text">
                <ArrowRight aria-hidden className="size-5 rtl:rotate-180" />
              </span>
              <span className="font-display text-lg leading-tight text-ink">
                {shelfCopy.viewAll}
              </span>
              <span className="text-sm text-ink-muted">{catalogCopy.count(total)}</span>
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}

/** The page with nothing chosen: tradition tiles, occasions, then rows of designs by kind. */
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
  const { shelfCopy, catalogCopy, weddingKindCopy, occasionTaglines } = useText(galleryText);
  const occasionsPath = pagePath({ kind: "gallery" }, locale);
  const kindTitle = (kind: WeddingKind) => shelfCopy.tradition(weddingKindCopy[kind].name);
  const groups = (["photos", "format", "occasion"] as const).map((group) => ({
    group,
    shelves: SHELVES.filter((shelf) => shelf.kind === group),
  }));
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
    }
  };

  return (
    <>
      <section aria-labelledby="traditions-heading" className="flex flex-col gap-3">
        <h2 id="traditions-heading" className="font-display text-2xl sm:text-[1.7rem]">
          {shelfCopy.traditionsHeading}
        </h2>
        {/* A strip of round paintings, as shops head a catalogue with its main kinds */}
        <ul className="relative -mx-4 flex snap-x scroll-px-4 [scrollbar-width:thin] gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-9 lg:overflow-visible lg:px-0">
          {WEDDING_KINDS.map((kind, index) => {
            const entry = WEDDING_KIND_ENTRIES[kind];
            return (
              <li
                key={kind}
                data-kind={kind}
                className="w-24 shrink-0 snap-start sm:w-28 lg:w-auto"
              >
                <Link
                  href={shelfHref(traditionShelf(kind), designsPath)}
                  className="group flex h-full flex-col items-center gap-2 rounded-xl p-1.5 text-center outline-offset-2 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="relative block size-20 shrink-0 overflow-hidden rounded-full border-2 border-line bg-night shadow-raised transition-[border-color] group-hover:border-marigold sm:size-24">
                    <Image
                      src={suiteImage(entry.art.suite, entry.art.page) ?? ""}
                      alt=""
                      fill
                      priority={index < 4}
                      sizes="6rem"
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110 motion-still:transition-none motion-still:group-hover:scale-100"
                    />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    {entry.nativeName && (
                      <span lang={entry.nativeName.lang} className="text-xs text-accent-text">
                        {entry.nativeName.text}
                      </span>
                    )}
                    <span className="text-sm leading-snug font-semibold text-ink">
                      {weddingKindCopy[kind].name}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="occasions-heading" className="flex flex-col gap-2">
        <h2
          id="occasions-heading"
          className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
        >
          {shelfCopy.occasionsHeading}
        </h2>
        <ul className="relative -mx-4 flex [scrollbar-width:thin] gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
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
        </ul>
      </section>

      {groups.map(({ group, shelves }, groupIndex) => (
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
            {shelfCopy.groups[group]}
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
                priority={groupIndex === 0 && index === 0}
              />
            );
          })}
        </section>
      ))}
    </>
  );
}

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
  const { galleryCopy, catalogCopy, shelfCopy, weddingKindCopy } = useText(galleryText);
  const text = useSearchText(entries);
  const deferred = useDeferredValue(filters);
  const shown = useMemo(
    () => filterCatalog(entries, deferred, (design) => text(design.id)),
    [entries, deferred, text],
  );
  const set = (change: Partial<DesignFilters>) => onChange({ ...filters, ...change });
  const showKinds = !filters.occasion || filters.occasion === "wedding";
  // A View all names its row: "No photo needed · 89 designs"
  const { query, kind, photos, format, occasion } = filters;
  const only = (chosen: unknown) =>
    !query.trim() && [kind ?? occasion, photos, format].filter(Boolean).length === 1 && !!chosen;
  const title = only(kind)
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
        <RadioGroup
          label={galleryCopy.formats.label}
          variant="segment"
          value={filters.format ?? "all"}
          onValueChange={(value) =>
            set({ format: value === "all" ? null : (value as DesignFormat) })
          }
          className="w-full max-w-xl"
        >
          {(["all", "scene", "story", "card"] as const).map((choice) => {
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

        <ChipRow<CategoryId>
          label={catalogCopy.occasionLabel}
          allLabel={catalogCopy.allOccasions}
          value={filters.kind ? "wedding" : filters.occasion}
          options={CATEGORY_IDS.map((id) => ({ id, label: CATEGORIES[id].names[locale] }))}
          onChange={(occasion) =>
            set({ occasion, kind: occasion === "wedding" ? filters.kind : null })
          }
        />

        {showKinds && (
          <ChipRow<WeddingKind>
            label={catalogCopy.traditionLabel}
            allLabel={catalogCopy.allTraditions}
            value={filters.kind}
            options={WEDDING_KINDS.map((id) => ({ id, label: weddingKindCopy[id].name }))}
            onChange={(kind) => set({ kind })}
          />
        )}
      </div>

      <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
        {/* The count heads the list of designs, and is read out as filters change it */}
        <h2 aria-live="polite" className="font-display text-xl sm:text-2xl">
          {title
            ? `${title} · ${catalogCopy.count(shown.length)}`
            : catalogCopy.count(shown.length)}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => onChange(NO_FILTERS)}>
          <X aria-hidden />
          {catalogCopy.clear}
        </Button>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line-strong bg-surface-2 px-6 py-14 text-center">
          <p className="max-w-md text-lg text-ink-muted">{catalogCopy.empty}</p>
          <Button variant="secondary" onClick={() => onChange(NO_FILTERS)}>
            {catalogCopy.clear}
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {shown.map((entry, index) => (
            <li key={entry.design.id} data-format-item={entry.format}>
              <CatalogCard entry={entry} filters={deferred} covers={covers} priority={index < 4} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Catalog({
  filters,
  covers,
  designsPath,
  onChange,
}: {
  filters: DesignFilters;
  covers: Covers;
  designsPath: string;
  onChange: (next: DesignFilters) => void;
}) {
  const entries = useMemo(() => designCatalog(), []);
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8">
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
  return (
    <Catalog
      filters={filters}
      covers={covers}
      designsPath={pathname}
      onChange={(next) => {
        const url = `${pathname}${filtersToParams(next)}`;
        // Moving between the rows and a list is a new step Back returns from; a change
        // within the list replaces it, so Back does not walk through every letter typed
        if (hasFilters(next) !== hasFilters(filters)) {
          window.history.pushState(null, "", url);
        } else {
          window.history.replaceState(null, "", url);
        }
      }}
    />
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
}: {
  /** The 3D cards' covers, drawn on the server (see DesignCard). */
  covers: Covers;
  /** This page's address in the site language, for View all. */
  designsPath: string;
}) {
  return (
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
  );
}
