"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { IconButton } from "@/components/ui/icon-button";
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
import { shelfHref, traditionShelf } from "@/lib/gallery/shelves";
import type { TemplateId } from "@/lib/templates/ids";
import { useReducedMotion } from "@/lib/use-reduced-motion";
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
export function ShelfRow({
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
      <ul className="relative -mx-4 flex snap-x scroll-px-4 [scrollbar-width:thin] gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-9 lg:overflow-visible lg:px-0">
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
      </ul>
    </section>
  );
}
