"use client";

import {
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Crown,
  Eye,
  Gift,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Rotate3d,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { DesignPreview, paintedPages } from "@/components/gallery/design-card";
import { searchWords } from "@/components/gallery/design-words";
import { ScenePoster } from "@/components/gallery/scene-poster";
import type { Covers } from "@/components/gallery/shelf-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { cn } from "@/lib/cn";
import { WEDDING_KINDS, type WeddingKind } from "@/lib/gallery/catalog";
import {
  DESIGN_FORMATS,
  NO_FILTERS,
  PHOTO_GROUPS,
  filterCatalog,
  hasFilters,
  type CatalogEntry,
  type DesignFilters,
  type DesignFormat,
  type PhotoGroup,
} from "@/lib/gallery/filters";
import { normalize } from "@/lib/gallery/search";
import { formatRupees } from "@/lib/plans/catalog";
import {
  DESIGN_TIERS,
  isDesignTier,
  tierPricePaise,
  type DesignTier,
  type Pricing,
} from "@/lib/plans/design-tiers";

/*
 * Admin, Designs: every design as the gallery shows it, with the gallery's own filters
 * (kind, photos, occasion, wedding tradition) and a tier filter, so the admin can open a
 * design's demo, see every page of it, and set its tier there or on its tile.
 */

export type DesignRow = CatalogEntry & {
  id: string;
  name: string;
  description: string;
  tier: DesignTier;
  defaultTier: DesignTier;
};

export const TIER_NAMES: Record<DesignTier, string> = {
  free: "Free",
  premium: "Premium",
  royal: "Royal",
  signature: "Signature",
};
const TIER_ICONS = { free: Gift, premium: Sparkles, royal: Crown, signature: Clapperboard };

const FORMAT_NAMES: Record<DesignFormat, string> = {
  moving: "Moving scene",
  scene: "Scene",
  story: "Story",
  card: "3D card",
};
const FORMAT_ICONS = {
  all: LayoutGrid,
  moving: Clapperboard,
  scene: ImageIcon,
  story: Layers,
  card: Rotate3d,
} as const;

const PHOTO_NAMES: Record<PhotoGroup, string> = {
  none: "No photos",
  one: "One photo",
  two: "Two photos",
};

type TierFilter = "all" | DesignTier | "changed";

const { galleryCopy, weddingKindCopy } = galleryText.en;

/** "Story · 7 pages", "Moving scene", "3D card". */
function formatLine(row: DesignRow): string {
  if (row.format !== "story") return FORMAT_NAMES[row.format];
  return `Story · ${galleryCopy.pagesCount(paintedPages(row.design).length)}`;
}

const chipClass = (pressed: boolean) =>
  cn(
    "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    pressed
      ? "border-transparent bg-ink text-paper"
      : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
  );

/** A row of choices, one pressed at a time, as on the Designs page. */
function ChipRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { id: T; label: string; count?: number }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
            className={chipClass(value === option.id)}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="font-normal tabular-nums">{option.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A design's four tiers, each with what it costs now. */
function TierPicker({
  row,
  tier,
  prices,
  onChange,
  large = false,
}: {
  row: DesignRow;
  tier: DesignTier;
  prices: Pick<Pricing, "designs">;
  onChange: (tier: DesignTier) => void;
  /** In the preview: one row of four, with icons. */
  large?: boolean;
}) {
  return (
    <RadioGroup
      label={`${row.name} (${FORMAT_NAMES[row.format]}) tier`}
      variant="segment"
      value={tier}
      onValueChange={(value) => isDesignTier(value) && onChange(value)}
      className={cn("grid grid-cols-2", large && "sm:grid-cols-4")}
    >
      {DESIGN_TIERS.map((option) => {
        const Icon = TIER_ICONS[option];
        const paise = tierPricePaise(prices, option);
        return (
          <RadioItem
            key={option}
            value={option}
            icon={large ? <Icon /> : undefined}
            label={
              <span className="flex flex-col items-center leading-tight">
                <span>{TIER_NAMES[option]}</span>
                {paise > 0 && (
                  <span className="text-xs font-normal tabular-nums">{formatRupees(paise)}</span>
                )}
              </span>
            }
          />
        );
      })}
    </RadioGroup>
  );
}

/** The design's picture: its scene, its first page or its 3D card. */
function DesignArt({ row, covers }: { row: DesignRow; covers: Covers }) {
  const { design } = row;
  if (design.format === "scene") return <ScenePoster suite={design.suite} />;
  const first = paintedPages(design)[0];
  if (first) {
    return (
      <Image
        src={first.src}
        alt=""
        fill
        sizes="(min-width: 64rem) 16rem, (min-width: 40rem) 30vw, 6rem"
        className="object-cover object-top"
      />
    );
  }
  return (
    <span className="absolute inset-0 grid place-items-center bg-surface-2 p-[12%]">
      {covers[design.template]}
    </span>
  );
}

function DesignTile({
  row,
  tier,
  prices,
  covers,
  onTier,
  onPreview,
}: {
  row: DesignRow;
  tier: DesignTier;
  prices: Pick<Pricing, "designs">;
  covers: Covers;
  onTier: (tier: DesignTier) => void;
  onPreview: () => void;
}) {
  const FormatIcon = FORMAT_ICONS[row.format];
  return (
    <article
      data-design-row={row.id}
      className={cn(
        // A phone: the picture beside the words, the tiers across the foot; wider, one column
        "grid h-full grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-3 overflow-hidden rounded-xl border bg-surface p-2 shadow-raised sm:flex sm:flex-col sm:gap-0 sm:p-0",
        tier !== row.tier ? "border-marigold" : "border-line",
      )}
    >
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Preview ${row.name}`}
        className="group relative isolate block aspect-[3/4] w-full shrink-0 cursor-pointer self-start overflow-hidden rounded-lg bg-night outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-ring sm:w-full sm:rounded-none"
      >
        <DesignArt row={row} covers={covers} />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night/70 to-transparent"
        />
        <span
          aria-hidden
          className="absolute end-1.5 bottom-1.5 inline-flex items-center gap-1.5 rounded-full bg-card-ivory/90 px-2 py-1 text-xs font-semibold text-card-ink shadow-raised sm:end-3 sm:bottom-3 sm:px-3"
        >
          <Eye className="size-4" />
          <span className="max-sm:sr-only">Preview</span>
        </span>
      </button>
      <div className="flex min-w-0 flex-col gap-1 sm:p-3 sm:pb-2">
        <h3 className="font-display text-lg leading-tight break-words">{row.name}</h3>
        <p className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <FormatIcon aria-hidden className="size-3.5 shrink-0" />
            {formatLine(row)}
          </span>
          <span data-photos={row.photos} className="inline-flex items-center gap-1">
            {row.photos === "none" ? (
              <CameraOff aria-hidden className="size-3.5 shrink-0" />
            ) : (
              <Camera aria-hidden className="size-3.5 shrink-0" />
            )}
            {galleryCopy.photoNeeds[row.photos]}
          </span>
        </p>
        {(tier !== row.defaultTier || tier !== row.tier) && (
          <p className="flex flex-wrap gap-x-3 text-xs text-ink-muted">
            {tier !== row.defaultTier && <span>Default {TIER_NAMES[row.defaultTier]}</span>}
            {tier !== row.tier && <span className="font-semibold text-accent-text">Not saved</span>}
          </p>
        )}
      </div>
      <div className="col-span-2 sm:mt-auto sm:px-3 sm:pb-3">
        <TierPicker row={row} tier={tier} prices={prices} onChange={onTier} />
      </div>
    </article>
  );
}

/** Every design's tier, filtered like the Designs page, each one opening its demo. */
export function DesignTierList({
  rows,
  tiers,
  onTiersChange,
  designPrices,
  covers,
}: {
  rows: DesignRow[];
  tiers: Record<string, DesignTier>;
  onTiersChange: (
    update: (current: Record<string, DesignTier>) => Record<string, DesignTier>,
  ) => void;
  /** What each paid tier costs, as typed above when the prices are valid. */
  designPrices: Pricing["designs"];
  covers: Covers;
}) {
  const [filters, setFilters] = useState<DesignFilters>(NO_FILTERS);
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [bulk, setBulk] = useState<DesignTier>("premium");
  // The design open in the preview, and the list it steps through
  const [preview, setPreview] = useState<{ id: string; list: string[] } | null>(null);
  const deferred = useDeferredValue(filters);
  const prices = { designs: designPrices };
  const tierOf = (row: DesignRow) => tiers[row.id] ?? row.tier;
  const setTier = (id: string, tier: DesignTier) =>
    onTiersChange((current) => ({ ...current, [id]: tier }));

  const text = useMemo(() => {
    const words = searchWords();
    const map = new Map(
      rows.map((row) => [row.id, normalize(`${words.design(row.design).join(" ")} ${row.id}`)]),
    );
    return (id: string) => map.get(id) ?? "";
  }, [rows]);

  // Designs matching the gallery filters, with and without the kind chosen (for its counts)
  const matched = useMemo(
    () => filterCatalog(rows, deferred, (design) => text(design.id)) as DesignRow[],
    [rows, deferred, text],
  );
  const anyFormat = useMemo(
    () =>
      filterCatalog(rows, { ...deferred, format: null }, (design) =>
        text(design.id),
      ) as DesignRow[],
    [rows, deferred, text],
  );
  const inTier = (row: DesignRow, filter: TierFilter) =>
    filter === "all" || (filter === "changed" ? tierOf(row) !== row.tier : tierOf(row) === filter);
  const shown = matched.filter((row) => inTier(row, tierFilter));
  const formatCount = (format: DesignFormat | "all") =>
    anyFormat.filter(
      (row) => (format === "all" || row.format === format) && inTier(row, tierFilter),
    ).length;
  const totals = DESIGN_TIERS.map(
    (tier) => [tier, rows.filter((row) => tierOf(row) === tier).length] as const,
  );
  const filtered = hasFilters(filters) || tierFilter !== "all";

  const open = preview ? rows.find((row) => row.id === preview.id) : undefined;
  const at = preview && open ? preview.list.indexOf(open.id) : -1;
  const step = (way: 1 | -1) => {
    if (!preview || at < 0) return;
    const list = preview.list;
    setPreview({ list, id: list[(at + way + list.length) % list.length]! });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          Designs
          {totals.map(([tier, count]) => (
            <Badge key={tier} tone={tier === "free" ? "success" : "gold"}>
              {count} {TIER_NAMES[tier]}
            </Badge>
          ))}
        </CardTitle>
        <CardDescription>
          Open any design to play its demo and step through every page, then set its tier there or
          on its tile. New designs start as Premium Scenes or Stories and free 3D cards until you
          change them. The grandest wedding Stories, which open with a painted god, start as Royal,
          and the moving scenes start as Signature.
        </CardDescription>
      </CardHeader>
      <CardBody className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 rounded-lg border border-line bg-surface-2 p-4">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
            <Field label="Search designs">
              <Input
                type="search"
                value={filters.query}
                onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                placeholder="Kayal, birthday, Gujarati…"
                leading={<Search />}
              />
            </Field>
            <Field label="Occasion">
              <Select
                value={filters.kind ? "wedding" : (filters.occasion ?? "all")}
                onValueChange={(value) => {
                  const occasion = value === "all" ? null : (value as CategoryId);
                  setFilters({
                    ...filters,
                    occasion,
                    kind: occasion === "wedding" ? filters.kind : null,
                  });
                }}
                options={[
                  { value: "all", label: "Every occasion" },
                  ...CATEGORY_IDS.map((id) => ({ value: id, label: CATEGORIES[id].names.en })),
                ]}
              />
            </Field>
            <Field label="Wedding tradition">
              <Select
                value={filters.kind ?? "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    kind: value === "all" ? null : (value as WeddingKind),
                  })
                }
                options={[
                  { value: "all", label: "Every tradition" },
                  ...WEDDING_KINDS.map((id) => ({ value: id, label: weddingKindCopy[id].name })),
                ]}
              />
            </Field>
          </div>

          <RadioGroup
            label="Kind of design"
            variant="segment"
            value={filters.format ?? "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, format: value === "all" ? null : (value as DesignFormat) })
            }
          >
            {(["all", ...DESIGN_FORMATS] as const).map((choice) => {
              const Icon = FORMAT_ICONS[choice];
              return (
                <RadioItem
                  key={choice}
                  value={choice}
                  icon={<Icon />}
                  label={
                    <>
                      {choice === "all"
                        ? "All"
                        : choice === "moving"
                          ? "Moving"
                          : FORMAT_NAMES[choice]}{" "}
                      <span className="font-normal tabular-nums">{formatCount(choice)}</span>
                    </>
                  }
                />
              );
            })}
          </RadioGroup>

          <div className="grid gap-5 xl:grid-cols-2">
            <ChipRow<PhotoGroup | "all">
              label="Photos"
              value={filters.photos ?? "all"}
              options={[
                { id: "all", label: "Any" },
                ...PHOTO_GROUPS.map((id) => ({ id, label: PHOTO_NAMES[id] })),
              ]}
              onChange={(photos) =>
                setFilters({ ...filters, photos: photos === "all" ? null : photos })
              }
            />
            <ChipRow<TierFilter>
              label="Tier"
              value={tierFilter}
              options={[
                { id: "all", label: "Every tier", count: matched.length },
                ...DESIGN_TIERS.map((tier) => ({
                  id: tier,
                  label: TIER_NAMES[tier],
                  count: matched.filter((row) => tierOf(row) === tier).length,
                })),
                {
                  id: "changed",
                  label: "Changed",
                  count: matched.filter((row) => tierOf(row) !== row.tier).length,
                },
              ]}
              onChange={setTierFilter}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface-2 p-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-h-11 flex-wrap items-center gap-3">
            <h3 aria-live="polite" className="font-display text-xl">
              {shown.length === 1 ? "1 design" : `${shown.length} designs`}
            </h3>
            {filtered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters(NO_FILTERS);
                  setTierFilter("all");
                }}
              >
                <X aria-hidden />
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label={`Set the ${shown.length} designs shown to`} className="sm:w-56">
              <Select
                value={bulk}
                onValueChange={(value) => isDesignTier(value) && setBulk(value)}
                options={DESIGN_TIERS.map((tier) => ({ value: tier, label: TIER_NAMES[tier] }))}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                disabled={shown.length === 0}
                onClick={() =>
                  onTiersChange((current) => ({
                    ...current,
                    ...Object.fromEntries(shown.map((row) => [row.id, bulk])),
                  }))
                }
              >
                Apply
              </Button>
              <Button
                variant="ghost"
                disabled={shown.length === 0}
                onClick={() =>
                  onTiersChange((current) => ({
                    ...current,
                    ...Object.fromEntries(shown.map((row) => [row.id, row.defaultTier])),
                  }))
                }
              >
                Back to defaults
              </Button>
            </div>
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="py-6 text-center text-ink-muted">
            No design matches all of these. Try fewer filters.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {shown.map((row) => (
              <li key={row.id}>
                <DesignTile
                  row={row}
                  tier={tierOf(row)}
                  prices={prices}
                  covers={covers}
                  onTier={(tier) => setTier(row.id, tier)}
                  onPreview={() =>
                    setPreview({ id: row.id, list: shown.map((design) => design.id) })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </CardBody>

      {open && preview && (
        <DesignPreview
          open
          onOpenChange={(next) => !next && setPreview(null)}
          design={open.design}
          name={open.name}
          description={open.description}
          photos={open.photos}
          pages={paintedPages(open.design)}
          badge={
            <p className="flex flex-wrap items-center gap-2 text-sm text-card-ivory/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-marigold px-2.5 py-1 font-label text-[0.65rem] tracking-[0.12em] text-on-marigold uppercase">
                {TIER_NAMES[tierOf(open)]}
                {tierOf(open) !== "free" &&
                  ` · ${formatRupees(tierPricePaise(prices, tierOf(open)))}`}
              </span>
              {formatLine(open)}
            </p>
          }
          action={
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-label text-xs tracking-[0.2em] text-card-ivory/80 uppercase">
                  Tier
                  {tierOf(open) !== open.tier && (
                    <span className="ms-2 tracking-normal text-marigold normal-case">
                      Not saved
                    </span>
                  )}
                </p>
                <TierPicker
                  row={open}
                  tier={tierOf(open)}
                  prices={prices}
                  onChange={(tier) => setTier(open.id, tier)}
                  large
                />
                <p className="text-xs text-card-ivory/70">
                  Default {TIER_NAMES[open.defaultTier]}
                  {open.occasions.length > 0 &&
                    ` · For ${open.occasions
                      .slice(0, 4)
                      .map((id) => CATEGORIES[id].names.en)
                      .join(
                        ", ",
                      )}${open.occasions.length > 4 ? ` and ${open.occasions.length - 4} more` : ""}`}
                </p>
              </div>
              {preview.list.length > 1 && (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full bg-card-ivory/10 ps-2 pe-4 text-sm font-semibold text-card-ivory transition-colors hover:bg-card-ivory/20 focus-visible:outline-2 focus-visible:outline-card-ivory"
                  >
                    <ChevronLeft aria-hidden className="size-5" />
                    Previous<span className="max-sm:sr-only">&nbsp;design</span>
                  </button>
                  <span className="text-xs text-card-ivory/75 tabular-nums">
                    {at + 1} of {preview.list.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full bg-card-ivory/10 ps-4 pe-2 text-sm font-semibold text-card-ivory transition-colors hover:bg-card-ivory/20 focus-visible:outline-2 focus-visible:outline-card-ivory"
                  >
                    Next<span className="max-sm:sr-only">&nbsp;design</span>
                    <ChevronRight aria-hidden className="size-5" />
                  </button>
                </div>
              )}
            </div>
          }
        />
      )}
    </Card>
  );
}
