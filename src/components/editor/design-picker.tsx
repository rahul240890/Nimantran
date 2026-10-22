"use client";

import {
  BookOpen,
  Camera,
  CameraOff,
  Check,
  Clapperboard,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Rotate3d,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { usePaidOn } from "@/components/editions/use-invite-edition";
import { ChipRow } from "@/components/gallery/chip-row";
import { ScenePoster } from "@/components/gallery/scene-poster";
import { warmLettering } from "@/components/invitation/type/warm-lettering";
import { usePricing } from "@/components/pricing/pricing-provider";
import { TierBadge } from "@/components/pricing/tier-badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import { UI_LOCALES } from "@/i18n/locales";
import type { InviteDraft } from "@/lib/editor/draft";
import { occasionEntries, pickerDesigns, withDesign } from "@/lib/editor/design-picker";
import { WEDDING_KINDS, type GalleryDesign, type WeddingKind } from "@/lib/gallery/catalog";
import { COLLECTION_IDS, type CollectionId } from "@/lib/gallery/collections";
import {
  CATALOG_SORTS,
  DESIGN_FORMATS,
  NO_FILTERS,
  PHOTO_GROUPS,
  designCatalog,
  filtersToParams,
  tierOf,
  type CatalogEntry,
  type CatalogSort,
  type DesignFilters,
  type DesignFormat,
  type PhotoGroup,
} from "@/lib/gallery/filters";
import { designPhotos } from "@/lib/gallery/photos";
import { designPicture } from "@/lib/gallery/pictures";
import { normalize } from "@/lib/gallery/search";
import { formatRupees, type PlanId } from "@/lib/plans/catalog";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { DESIGN_TIERS, tierPricePaise, type DesignTier } from "@/lib/plans/design-tiers";

/*
 * The design step's designs (owner, 2026-10-22): a grid of small tiles for the invite's
 * occasion, a dozen at a time, with the Designs page's filters above them (kind, photos,
 * price, tradition, collection, search and sort). Picking one changes the preview at once
 * and keeps everything the host has filled in. Only designs here: how the invitation opens
 * is chosen with the music, so this screen stays short.
 */

/** How many designs the grid draws at first, and adds with each Show more. */
const PAGE = 12;

const FORMAT_ICONS = {
  all: LayoutGrid,
  moving: Clapperboard,
  storybook: BookOpen,
  scene: ImageIcon,
  story: Layers,
  card: Rotate3d,
} as const;

type Words = { name: string; description: string };

/** A design's name and line in one site language: its theme's, or its card's. */
function wordsIn(copy: (typeof editorText)["en"], design: GalleryDesign): Words {
  return design.suite === "classic"
    ? copy.designCopy[design.template]
    : {
        name: copy.suiteCopy.names[design.suite],
        description: copy.suiteCopy.descriptions[design.suite],
      };
}

export function DesignPicker({
  draft,
  update,
}: {
  draft: InviteDraft;
  update: (change: (draft: InviteDraft) => InviteDraft) => void;
}) {
  const locale = useLocale();
  const { suiteCopy, editor } = useText(editorText);
  const { galleryCopy, catalogCopy, weddingKindCopy, collectionCopy } = useText(galleryText);
  const pricing = usePricing();
  const paidOn = usePaidOn(draft.remoteId ?? null);
  const headingId = useId();
  const moreId = useId();

  // A design in another voice draws its lettering at once when the host picks it
  const languages = draft.languages.join(" ");
  useEffect(() => {
    warmLettering(languages.split(" ") as InviteDraft["languages"]);
  }, [languages]);

  const all = useMemo(() => designCatalog(), []);
  const mine = useMemo(() => occasionEntries(all, draft), [all, draft]);
  const chosen = draftDesignId(draft);

  const [filters, setFilters] = useState<DesignFilters>(NO_FILTERS);
  const deferred = useDeferredValue(filters);
  const set = (change: Partial<DesignFilters>) => setFilters((was) => ({ ...was, ...change }));

  // Search finds a design by its name or line in any site language, or its tradition
  const searching = deferred.query.trim() !== "";
  const formatNames = galleryCopy.formats;
  const searchText = useMemo(
    () =>
      searching
        ? new Map(
            mine.map((entry) => [
              entry.design.id,
              normalize(
                [
                  ...UI_LOCALES.flatMap((ui) => {
                    const own = wordsIn(editorText[ui], entry.design);
                    return [own.name, own.description];
                  }),
                  ...entry.kinds.map((kind) => weddingKindCopy[kind].name),
                  formatNames[entry.format],
                ].join(" "),
              ),
            ]),
          )
        : null,
    [mine, searching, weddingKindCopy, formatNames],
  );
  const shown = useMemo(
    () =>
      pickerDesigns(all, draft, deferred, (design) => searchText?.get(design.id) ?? "", pricing),
    [all, draft, deferred, searchText, pricing],
  );
  // A dozen at first; Show more adds a dozen, until the filters change
  const signature = filtersToParams(deferred);
  const [more, setMore] = useState({ signature, count: PAGE });
  const count = more.signature === signature ? more.count : PAGE;
  const drawn = shown.slice(0, count);
  const left = shown.length - drawn.length;

  // Only what some design for this occasion has: no Storybook chip for a birthday
  const formats = DESIGN_FORMATS.filter((format) => mine.some((entry) => entry.format === format));
  const prices = DESIGN_TIERS.filter((tier) =>
    mine.some((entry) => tierOf(pricing, entry.design.id) === tier),
  );
  const kinds = WEDDING_KINDS.filter((kind) => mine.some((entry) => entry.kinds.includes(kind)));
  const collections = COLLECTION_IDS.filter((id) => mine.some((entry) => entry.collection === id));
  const priceLabel = (tier: DesignTier) => {
    const paise = tierPricePaise(pricing, tier);
    return paise
      ? galleryCopy.tierPrice(galleryCopy.tiers[tier], formatRupees(paise))
      : galleryCopy.tiers[tier];
  };
  const extras = [filters.kind, filters.collection, filters.price].filter(Boolean).length;
  const [moreOpen, setMoreOpen] = useState(false);
  const filtered =
    filters.query.trim() !== "" ||
    !!(filters.format || filters.photos || filters.kind || filters.collection || filters.price);

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      {/* The step's title and intro say it all; the heading names the designs for a reader */}
      <h3 id={headingId} className="sr-only">
        {suiteCopy.heading}
      </h3>

      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface/70 p-4 shadow-raised sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div role="search" className="relative flex min-w-0 flex-1 items-center">
            <label htmlFor={`${headingId}-search`} className="sr-only">
              {catalogCopy.searchLabel}
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute start-4 size-5 text-ink-muted"
            />
            <input
              id={`${headingId}-search`}
              type="search"
              value={filters.query}
              onChange={(event) => set({ query: event.target.value })}
              // Enter would submit the step's form and move on; here it only searches
              onKeyDown={(event) => event.key === "Enter" && event.preventDefault()}
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
          </div>
          <Select
            aria-label={catalogCopy.sortLabel}
            value={filters.sort}
            onValueChange={(sort) => set({ sort: sort as CatalogSort })}
            options={CATALOG_SORTS.map((sort) => ({ value: sort, label: catalogCopy.sorts[sort] }))}
            className="w-full sm:w-auto sm:min-w-48"
          />
        </div>

        {formats.length > 1 && (
          <RadioGroup
            label={galleryCopy.formats.label}
            variant="segment"
            value={filters.format ?? "all"}
            onValueChange={(value) =>
              set({ format: value === "all" ? null : (value as DesignFormat) })
            }
            className="w-full"
          >
            {(["all", ...formats] as const).map((choice) => {
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
        )}

        <ChipRow<PhotoGroup>
          label={catalogCopy.photosLabel}
          allLabel={catalogCopy.allPhotos}
          value={filters.photos}
          options={PHOTO_GROUPS.map((id) => ({ id, label: catalogCopy.photoGroups[id] }))}
          onChange={(photos) => set({ photos })}
        />

        <div className="flex flex-col gap-4 border-t border-line pt-3">
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
          <div id={moreId} hidden={!moreOpen} className="flex flex-col gap-4">
            {prices.length > 1 && (
              <ChipRow<DesignTier>
                label={catalogCopy.priceLabel}
                allLabel={catalogCopy.allPrices}
                value={filters.price}
                options={prices.map((id) => ({ id, label: priceLabel(id) }))}
                onChange={(price) => set({ price })}
              />
            )}
            {draft.categoryId === "wedding" && kinds.length > 1 && (
              <ChipRow<WeddingKind>
                label={catalogCopy.traditionLabel}
                allLabel={catalogCopy.allTraditions}
                value={filters.kind}
                options={kinds.map((id) => ({ id, label: weddingKindCopy[id].name }))}
                onChange={(kind) => set({ kind })}
              />
            )}
            {collections.length > 1 && (
              <ChipRow<CollectionId>
                label={collectionCopy.label}
                allLabel={collectionCopy.all}
                value={filters.collection}
                options={collections.map((id) => ({ id, label: collectionCopy.names[id].name }))}
                onChange={(collection) => set({ collection })}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-11 flex-wrap items-center justify-between gap-2">
        {/* The count is read out as the filters change it */}
        <p aria-live="polite" className="font-semibold text-ink">
          {catalogCopy.count(shown.length)}
        </p>
        {filtered && (
          <Button variant="ghost" size="sm" onClick={() => setFilters(NO_FILTERS)}>
            <X aria-hidden />
            {catalogCopy.clear}
          </Button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line-strong bg-surface-2 px-6 py-10 text-center">
          <p className="max-w-md text-ink-muted">{catalogCopy.empty}</p>
          <Button variant="secondary" onClick={() => setFilters(NO_FILTERS)}>
            {catalogCopy.clear}
          </Button>
        </div>
      ) : (
        <RadioPrimitive.Root
          aria-labelledby={headingId}
          value={chosen}
          onValueChange={(id) => {
            const entry = shown.find((one) => one.design.id === id);
            if (entry) update((current) => withDesign(current, entry.design));
          }}
          className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 xl:grid-cols-4"
        >
          {drawn.map((entry, index) => (
            <DesignTile
              key={entry.design.id}
              entry={entry}
              words={wordsIn(editorText[locale], entry.design)}
              categoryId={draft.categoryId}
              chosenLabel={editor.designChosen}
              kindLabel={galleryCopy.formats[entry.format]}
              photosLabel={galleryCopy.photoNeeds[designPhotos(entry.design, draft.categoryId)]}
              paid={paidOn(entry.design.id)}
              priority={index < 4}
            />
          ))}
        </RadioPrimitive.Root>
      )}

      {left > 0 && (
        <Button
          variant="secondary"
          onClick={() => setMore({ signature, count: count + PAGE })}
          className="self-center"
        >
          {suiteCopy.moreDesigns(Math.min(PAGE, left))}
        </Button>
      )}
    </section>
  );
}

/** One design: its picture with its kind, its name, price and the photos it takes. */
function DesignTile({
  entry,
  words,
  categoryId,
  chosenLabel,
  kindLabel,
  photosLabel,
  paid,
  priority,
}: {
  entry: CatalogEntry;
  words: Words;
  categoryId: InviteDraft["categoryId"];
  chosenLabel: string;
  kindLabel: string;
  photosLabel: string;
  /** The package already paid for this design, which its badge shows in place of a price. */
  paid: PlanId;
  priority: boolean;
}) {
  const { design } = entry;
  const locale = useLocale();
  const detailsId = useId();
  const picture = designPicture(design);
  const Icon = FORMAT_ICONS[entry.format];
  const photos = designPhotos(design, categoryId);
  return (
    <RadioPrimitive.Item
      value={design.id}
      data-design={design.id}
      aria-label={`${words.name}, ${kindLabel}`}
      aria-describedby={detailsId}
      className="group flex min-w-0 cursor-pointer flex-col gap-2 rounded-xl text-start outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-night shadow-raised ring-1 ring-line transition-shadow group-hover:shadow-float group-data-[state=checked]:ring-3 group-data-[state=checked]:ring-marigold">
        {design.format === "scene" ? (
          // The sample photos show through the Scene's frames, as the couple's own will
          <ScenePoster suite={design.suite} priority={priority} />
        ) : picture ? (
          <Image
            src={picture}
            alt=""
            fill
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 80rem) 11rem, (min-width: 40rem) 30vw, 46vw"
            className="object-cover object-top"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-surface-2 p-[14%]">
            <TemplateCover id={design.template} locale={locale} className="w-full" />
          </span>
        )}
        <span className="absolute start-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 overflow-hidden rounded-full bg-night/70 px-2 py-0.5 font-label text-[0.6rem] tracking-[0.12em] whitespace-nowrap text-card-ivory uppercase backdrop-blur-sm">
          <Icon aria-hidden className="size-3 shrink-0" />
          {kindLabel}
        </span>
        <span className="absolute inset-x-2 bottom-2 hidden items-center justify-center gap-1 rounded-full bg-marigold px-2 py-1 text-xs font-semibold text-on-marigold shadow-raised group-data-[state=checked]:flex">
          <Check aria-hidden className="size-3.5 shrink-0" />
          {chosenLabel}
        </span>
      </span>
      <span className="flex min-w-0 flex-col gap-1 px-0.5">
        <span className="truncate font-display text-base leading-tight text-ink">{words.name}</span>
        <span id={detailsId} className="flex min-w-0 flex-col items-start gap-1">
          <TierBadge designId={design.id} variant="plain" paid={paid} className="max-w-full" />
          <span className="flex min-w-0 items-center gap-1 text-xs text-ink-muted">
            {photos === "none" ? (
              <CameraOff aria-hidden className="size-3.5 shrink-0" />
            ) : (
              <Camera aria-hidden className="size-3.5 shrink-0" />
            )}
            <span className="line-clamp-1">{photosLabel}</span>
          </span>
        </span>
      </span>
    </RadioPrimitive.Item>
  );
}
