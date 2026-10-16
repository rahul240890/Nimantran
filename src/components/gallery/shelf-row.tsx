"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { RowArrows, ScrollRow, useScrollRow } from "@/components/ui/scroll-row";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { WEDDING_KINDS, WEDDING_KIND_ENTRIES, suiteImage } from "@/lib/gallery/catalog";
import {
  NO_FILTERS,
  catalogCategory,
  catalogHref,
  type CatalogEntry,
  type DesignFilters,
} from "@/lib/gallery/filters";
import { designPhotos } from "@/lib/gallery/photos";
import { samplePath } from "@/lib/sample/paths";
import { shelfHref, traditionShelf } from "@/lib/gallery/shelves";
import type { TemplateId } from "@/lib/templates/ids";
import { DesignCard } from "./design-card";
import { designWords } from "./design-words";

/*
 * The pieces a catalogue is browsed with, shared by the Designs page and the home page:
 * the wedding traditions as round paintings, and rows of designs that scroll sideways.
 */

export type Covers = Partial<Record<TemplateId, ReactNode>>;

/** One design in a grid or a row. */
export function CatalogCard({
  entry,
  filters,
  covers,
  priority,
  compact,
}: {
  entry: CatalogEntry;
  filters: DesignFilters;
  covers: Covers;
  priority: boolean;
  /** In a sideways row (see DesignCard). */
  compact?: boolean;
}) {
  const locale = useLocale();
  const { name, description } = designWords(entry.design, locale);
  return (
    <DesignCard
      design={entry.design}
      name={name}
      description={description}
      href={catalogHref(entry, filters)}
      sampleHref={samplePath(entry.design.id, filters)}
      photos={designPhotos(entry.design, catalogCategory(entry, filters))}
      priority={priority}
      cover={entry.design.suite === "classic" ? covers[entry.design.template] : undefined}
      compact={compact}
    />
  );
}

/**
 * A row of a few designs that scrolls sideways, with View all for the rest: the way large
 * shops show a big catalogue. The next design peeks in at the edge, so the row reads as
 * one to swipe; on a wider screen a pair of arrows beside View all scrolls it, its edges
 * fade while there is more, and a thin gold line under it shows how far along it is.
 */
export function ShelfRow({
  id,
  title,
  intro,
  href,
  entries,
  total,
  covers,
  priority,
  lazy = false,
}: {
  id: string;
  title: string;
  intro: string;
  /** View all; a row without one (Trending) shows only its own designs. */
  href?: string;
  entries: readonly CatalogEntry[];
  total: number;
  covers: Covers;
  priority: boolean;
  /**
   * Far down a long page: its heading and View all come with the page, its designs once
   * it scrolls near, so a phone doesn't lay out every row's paintings before the first.
   */
  lazy?: boolean;
}) {
  const { shelfCopy, catalogCopy } = useText(galleryText);
  const label = shelfCopy.viewAllLabel(title, total);
  const row = useScrollRow();
  const [near, watch] = useNear(lazy);
  const item =
    "w-[44%] max-w-60 min-w-36 shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-4.5rem)/4.4)] xl:w-[calc((100%-6rem)/5.3)]";

  return (
    <section
      ref={watch}
      aria-labelledby={`${id}-heading`}
      data-shelf={id}
      className="flex flex-col gap-4"
    >
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3
            id={`${id}-heading`}
            className="font-display text-[1.35rem] leading-tight sm:text-[1.75rem]"
          >
            {title}
          </h3>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ink-muted">
            <span className="min-w-0">{intro}</span>
            <span className="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-ink-muted ring-1 ring-line">
              {catalogCopy.count(total)}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && (
            <Link
              href={href}
              aria-label={label}
              className="group/all inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold whitespace-nowrap text-accent-text transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {shelfCopy.viewAll}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover/all:translate-x-0.5 rtl:rotate-180 motion-still:transition-none"
              />
            </Link>
          )}
          <RowArrows row={row} />
        </div>
      </div>
      <ScrollRow
        row={row}
        track
        className="relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pt-1 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-5 lg:px-0"
      >
        {/* Until the row is near, empty tiles of the same size hold its place */}
        {!near &&
          entries.slice(0, 6).map((entry) => (
            <li key={entry.design.id} aria-hidden className={item}>
              <span className="block aspect-[3/4] rounded-2xl bg-surface-2" />
              <span className="block h-16" />
            </li>
          ))}
        {near &&
          entries.map((entry, index) => (
            <li key={entry.design.id} data-format-item={entry.format} className={item}>
              <CatalogCard
                entry={entry}
                filters={NO_FILTERS}
                covers={covers}
                priority={priority && index < 2}
                compact
              />
            </li>
          ))}
        {near && href && total > entries.length && (
          <li className={item}>
            <Link
              href={href}
              aria-label={label}
              className="group/more relative isolate flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-night p-4 text-center shadow-raised ring-1 ring-line transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-float focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring motion-still:transition-none motion-still:hover:translate-y-0"
            >
              {/* A glow of marigold behind the words, like lamplight */}
              <span
                aria-hidden
                className="absolute inset-0 -z-10 opacity-70"
                style={{
                  background:
                    "radial-gradient(70% 55% at 50% 45%, color-mix(in srgb, var(--marigold) 32%, transparent), transparent)",
                }}
              />
              <span className="grid size-14 place-items-center rounded-full bg-marigold text-on-marigold shadow-float transition-transform duration-300 group-hover/more:scale-110 motion-still:transition-none motion-still:group-hover/more:scale-100">
                <ArrowRight aria-hidden className="size-6 rtl:rotate-180" />
              </span>
              <span className="font-display text-xl leading-tight text-card-ivory">
                {shelfCopy.viewAll}
              </span>
              <span className="text-sm text-card-ivory/80">{catalogCopy.count(total)}</span>
            </Link>
          </li>
        )}
      </ScrollRow>
    </section>
  );
}

/** The wedding traditions as a strip of round paintings, each opening its View all. */
export function TraditionTiles({
  designsPath,
  headingId = "traditions-heading",
  eager = true,
  level = 2,
}: {
  designsPath: string;
  headingId?: string;
  /** The tiles are near the top of the page, so their paintings load straight away. */
  eager?: boolean;
  /** The heading's level: 3 when the strip sits inside a section of its own. */
  level?: 2 | 3;
}) {
  const { shelfCopy, weddingKindCopy } = useText(galleryText);
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <Heading id={headingId} className="font-display text-2xl sm:text-[1.7rem]">
        {shelfCopy.traditionsHeading}
      </Heading>
      {/* A strip of round paintings, as shops head a catalogue with its main kinds */}
      <ScrollRow className="relative -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-9 lg:overflow-visible lg:px-0">
        {WEDDING_KINDS.map((kind, index) => {
          const entry = WEDDING_KIND_ENTRIES[kind];
          return (
            <li key={kind} data-kind={kind} className="w-24 shrink-0 snap-start sm:w-28 lg:w-auto">
              <Link
                href={shelfHref(traditionShelf(kind), designsPath)}
                className="group flex h-full flex-col items-center gap-2 rounded-xl p-1.5 text-center outline-offset-2 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="relative block size-20 shrink-0 overflow-hidden rounded-full border-2 border-line bg-night shadow-raised transition-[border-color] group-hover:border-marigold sm:size-24">
                  <Image
                    src={suiteImage(entry.art.suite, entry.art.page) ?? ""}
                    alt=""
                    fill
                    priority={eager && index < 4}
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
      </ScrollRow>
    </section>
  );
}

/** Whether a lazy row has come near the screen (600px ahead), and the ref that watches for it. */
function useNear(lazy: boolean) {
  const [element, watch] = useState<HTMLElement | null>(null);
  const [near, setNear] = useState(!lazy);
  useEffect(() => {
    if (near || !element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (seen) => {
        if (seen.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, element]);
  return [near, watch] as const;
}
