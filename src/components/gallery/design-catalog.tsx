"use client";

import { Image as ImageIcon, Layers, LayoutGrid, Rotate3d, Search, X } from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { cn } from "@/lib/cn";
import { WEDDING_KINDS, type WeddingKind } from "@/lib/gallery/catalog";
import {
  NO_FILTERS,
  catalogCategory,
  catalogHref,
  designCatalog,
  filterCatalog,
  filtersFromParams,
  filtersToParams,
  type DesignFilters,
  type DesignFormat,
} from "@/lib/gallery/filters";
import { designPhotos } from "@/lib/gallery/photos";
import { normalize } from "@/lib/gallery/search";
import type { TemplateId } from "@/lib/templates/ids";
import { DesignCard } from "./design-card";
import { designWords, searchWords } from "./design-words";

const noSubscribe = () => () => {};

const FORMAT_ICONS = { all: LayoutGrid, scene: ImageIcon, story: Layers, card: Rotate3d } as const;

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
  const chip = (pressed: boolean) =>
    cn(
      "inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      pressed
        ? "border-transparent bg-ink text-paper"
        : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
    );
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">{label}</p>
      <div
        role="group"
        aria-label={label}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <button
          type="button"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
          className={chip(value === null)}
        >
          {allLabel}
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(value === option.id ? null : option.id)}
            className={chip(value === option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The Designs page's catalogue: every design, narrowed as the host types or taps, with the
 * choices kept in the address so a filtered list can be shared or come back to. Drawn on the
 * server with no filters, so search engines read every design.
 */
export function DesignCatalog({
  covers,
}: {
  /** The 3D cards' covers, drawn on the server (see DesignCard). */
  covers: Partial<Record<TemplateId, ReactNode>>;
}) {
  const locale = useLocale();
  const { galleryCopy, catalogCopy, weddingKindCopy } = useText(galleryText);
  const entries = useMemo(() => designCatalog(), []);
  const text = useMemo(() => {
    const words = searchWords();
    const map = new Map(
      entries.map((entry) => [entry.design.id, normalize(words.design(entry.design).join(" "))]),
    );
    return (id: string) => map.get(id) ?? "";
  }, [entries]);

  // The address's filters until the host changes one; then the address follows each change
  const address = useSyncExternalStore(
    noSubscribe,
    () => window.location.search,
    () => "",
  );
  const [chosen, setChosen] = useState<DesignFilters | null>(null);
  const filters = useMemo(
    () => chosen ?? filtersFromParams(new URLSearchParams(address)),
    [chosen, address],
  );
  useEffect(() => {
    if (!chosen) return;
    const next = `${window.location.pathname}${filtersToParams(chosen)}`;
    window.history.replaceState(window.history.state, "", next);
  }, [chosen]);
  const setFilters = (next: DesignFilters) => setChosen(next);

  const deferred = useDeferredValue(filters);
  const shown = useMemo(
    () => filterCatalog(entries, deferred, (design) => text(design.id)),
    [entries, deferred, text],
  );
  const filtered =
    filters.query.trim() !== "" || filters.occasion || filters.kind || filters.format;
  const set = (change: Partial<DesignFilters>) => setFilters({ ...filters, ...change });
  const showKinds = !filters.occasion || filters.occasion === "wedding";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface/70 p-4 shadow-raised sm:p-5">
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="relative flex items-center"
        >
          <label htmlFor="catalog-search" className="sr-only">
            {catalogCopy.searchLabel}
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute start-4 size-5 text-ink-muted"
          />
          <input
            id="catalog-search"
            type="search"
            value={filters.query}
            onChange={(event) => set({ query: event.target.value })}
            placeholder={catalogCopy.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-full border border-line-control bg-surface ps-12 pe-12 text-base text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => set({ query: "" })}
              aria-label={galleryCopy.clearSearch}
              className="absolute end-0.5 grid size-11 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X aria-hidden className="size-5" />
            </button>
          )}
        </form>

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
        <h2 aria-live="polite" className="font-display text-xl">
          {catalogCopy.count(shown.length)}
        </h2>
        {filtered && (
          <Button variant="ghost" size="sm" onClick={() => setFilters(NO_FILTERS)}>
            <X aria-hidden />
            {catalogCopy.clear}
          </Button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line-strong bg-surface-2 px-6 py-14 text-center">
          <p className="max-w-md text-lg text-ink-muted">{catalogCopy.empty}</p>
          <Button variant="secondary" onClick={() => setFilters(NO_FILTERS)}>
            {catalogCopy.clear}
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {shown.map((entry, index) => {
            const { name, description } = designWords(entry.design, locale);
            return (
              <li key={entry.design.id} data-format-item={entry.format}>
                <DesignCard
                  design={entry.design}
                  name={name}
                  description={description}
                  href={catalogHref(entry, deferred)}
                  photos={designPhotos(entry.design, catalogCategory(entry, deferred))}
                  priority={index < 4}
                  cover={
                    entry.design.suite === "classic" ? covers[entry.design.template] : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
