"use client";

import {
  Flame,
  Clapperboard,
  ArrowRight,
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  Layers,
  Rotate3d,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useState, type ReactNode } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { DesignPackages } from "@/components/pricing/design-packages";
import { TierBadge } from "@/components/pricing/tier-badge";
import { Button } from "@/components/ui/button";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import { funnel } from "@/lib/funnel";
import { samplePath } from "@/lib/sample/paths";
import { isMoving } from "@/lib/suites/moving";
import type { GalleryDesign } from "@/lib/gallery/catalog";
import type { PhotoNeed } from "@/lib/gallery/photos";
import { PAGE_ARTS, SUITES, type PageArt } from "@/lib/suites/catalog";
import { ScenePoster, SceneSample } from "./scene-poster";
import { useTrending } from "./use-trending";
import { StorySample } from "./story-sample";

type DesignCardProps = {
  design: GalleryDesign;
  name: string;
  description: string;
  /** Where Use this design leads: the editor, set up for this choice. */
  href: string;
  /**
   * Where Open it as a guest leads: the design's sample, naming the listing it is shown in
   * so the sample's Previous and Next walk that listing (samplePath). Its own, if missing.
   */
  sampleHref?: string;
  /** What photos the design takes (designPhotos), shown under its name. */
  photos: PhotoNeed;
  priority?: boolean;
  /**
   * A card design's cover, drawn on the server: its art uses trigonometry whose last digits
   * differ between server and browser, so drawing it in both would not match.
   */
  cover?: ReactNode;
  /**
   * For a sideways row: the painting stands on its own with its price over it, and the words
   * under it lead to the editor, without the card's box and its full-width button.
   */
  compact?: boolean;
};

/** The pages a design has paintings for, in the order guests see them. */
export function paintedPages(design: GalleryDesign): { page: PageArt; src: string }[] {
  const { images } = SUITES[design.suite];
  return PAGE_ARTS.flatMap((page) => (images[page] ? [{ page, src: images[page]! }] : []));
}

/**
 * A design in the gallery: its painted cover (or its 3D card), what it is, and two ways
 * on: Preview, which shows every page it has, and Use this design.
 */
export function DesignCard({
  design,
  name,
  description,
  href,
  sampleHref,
  photos,
  priority,
  cover,
  compact = false,
}: DesignCardProps) {
  const { galleryCopy } = useText(galleryText);
  const locale = useLocale();
  const pages = paintedPages(design);
  const scene = design.format === "scene";
  const moving = isMoving(design.suite);
  const painted = pages.length > 0;
  const [open, setOpen] = useState(false);
  const trending = useTrending().includes(design.id);

  return (
    <article
      data-design={design.id}
      data-format={scene ? "scene" : painted ? "story" : "card"}
      className={cn(
        "group flex h-full flex-col",
        compact
          ? "gap-3"
          : "overflow-hidden rounded-xl border border-line bg-surface shadow-raised transition-shadow duration-300 hover:shadow-float",
      )}
    >
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          funnel("Design previewed", { design: design.id });
        }}
        aria-label={galleryCopy.preview(name)}
        className={cn(
          "@container/tile relative isolate block aspect-[3/4] w-full cursor-pointer overflow-hidden bg-night focus-visible:outline-2 focus-visible:outline-ring",
          compact
            ? "rounded-2xl shadow-raised ring-1 ring-line outline-offset-3 transition-[transform,box-shadow] duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:shadow-float motion-still:transition-none motion-still:group-hover:translate-y-0"
            : "outline-offset-[-3px]",
        )}
      >
        {scene ? (
          <>
            <ScenePoster
              suite={design.suite}
              priority={priority}
              className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-still:transition-none motion-still:group-hover:scale-100"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night/70 to-transparent"
            />
          </>
        ) : painted ? (
          <>
            <Image
              src={pages[0]!.src}
              alt=""
              fill
              loading={priority ? "eager" : "lazy"}
              sizes="(min-width: 80rem) 22vw, (min-width: 40rem) 33vw, 50vw"
              className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-still:transition-none motion-still:group-hover:scale-100"
            />
            {/* A soft shade at the foot keeps the badge and button readable */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night/70 to-transparent"
            />
          </>
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-surface-2 p-[12%]">
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 aspect-square w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 28%, transparent), transparent)",
              }}
            />
            {cover ?? (
              <TemplateCover id={design.template} locale={locale} className="max-w-[16rem]" />
            )}
          </span>
        )}
        <span className="absolute start-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 overflow-hidden rounded-full bg-night/70 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.14em] whitespace-nowrap text-card-ivory uppercase backdrop-blur-sm">
          {moving ? (
            <Clapperboard aria-hidden className="size-3.5" />
          ) : scene ? (
            <ImageIcon aria-hidden className="size-3.5" />
          ) : painted ? (
            <Layers aria-hidden className="size-3.5" />
          ) : (
            <Rotate3d aria-hidden className="size-3.5" />
          )}
          {moving
            ? galleryCopy.movingBadge
            : scene
              ? galleryCopy.sceneBadge
              : painted
                ? galleryCopy.storyBadge(pages.length)
                : galleryCopy.card}
        </span>
        {trending && (
          <span
            data-trending
            className="absolute start-3 top-10 inline-flex items-center gap-1 rounded-full bg-marigold px-2.5 py-1 font-label text-[0.65rem] tracking-[0.14em] whitespace-nowrap text-on-marigold uppercase shadow-raised"
          >
            <Flame aria-hidden className="size-3.5" />
            {galleryCopy.trendingBadge}
          </span>
        )}
        {compact && (
          <TierBadge designId={design.id} className="absolute start-3 bottom-3 max-w-[60%]" />
        )}
        <span className="absolute end-3 bottom-3 grid size-11 place-items-center rounded-full bg-card-ivory/90 text-card-ink opacity-0 shadow-raised transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
          <Eye aria-hidden className="size-5" />
        </span>
      </button>
      {compact ? (
        <Link
          href={href}
          className="group/use flex flex-1 flex-col gap-1 rounded-lg px-0.5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <h3 className="truncate font-display text-lg leading-tight text-ink">{name}</h3>
          <p className="line-clamp-1 text-sm text-ink-muted">{description}</p>
          <p data-photos={photos} className="flex items-center gap-1.5 text-xs text-ink-muted">
            {photos === "none" ? (
              <CameraOff aria-hidden className="size-3.5 shrink-0" />
            ) : (
              <Camera aria-hidden className="size-3.5 shrink-0" />
            )}
            <span className="truncate">{galleryCopy.photoNeeds[photos]}</span>
          </p>
          <span className="mt-auto inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent-text">
            {galleryCopy.useDesign}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover/use:translate-x-1 rtl:rotate-180 motion-still:transition-none motion-still:group-hover/use:translate-x-0"
            />
          </span>
        </Link>
      ) : (
        /* Named "tile" so a narrow card's price badge drops its tier name */
        <div className="@container/tile flex flex-1 flex-col gap-3 p-3 sm:p-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-xl leading-tight">{name}</h3>
            <p className="line-clamp-2 text-sm text-ink-muted">{description}</p>
          </div>
          {/* What it costs and what photos it takes, the two things a host weighs first */}
          <div className="flex flex-col items-start gap-2">
            <TierBadge designId={design.id} variant="plain" className="max-w-full" />
            <p data-photos={photos} className="flex items-start gap-1.5 text-xs text-ink-muted">
              {photos === "none" ? (
                <CameraOff aria-hidden className="mt-px size-3.5 shrink-0" />
              ) : (
                <Camera aria-hidden className="mt-px size-3.5 shrink-0" />
              )}
              {galleryCopy.photoNeeds[photos]}
            </p>
          </div>
          {/* Two cards to a row on a phone leave little room: the arrow goes and the words
            may wrap before they would ever touch the button's edge */}
          <Button
            asChild
            size="sm"
            className="mt-auto h-auto min-h-11 w-full px-3 py-2 text-center leading-tight whitespace-normal"
          >
            <Link href={href}>
              {galleryCopy.useDesign}
              <ArrowRight aria-hidden className="@max-[10.5rem]:hidden rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      )}
      <DesignPreview
        open={open}
        onOpenChange={setOpen}
        design={design}
        name={name}
        description={description}
        href={href}
        sampleHref={sampleHref}
        photos={photos}
        pages={pages}
      />
    </article>
  );
}

/**
 * Every page of a design, full height like the guest's phone: step through them with the
 * arrows, the thumbnails or the arrow keys, then Use this design. Admin, Designs shows it
 * with its own badge and, in place of Use this design, the design's tier.
 */
export function DesignPreview({
  open,
  onOpenChange,
  design,
  name,
  description,
  href,
  sampleHref,
  photos,
  pages,
  badge,
  action,
}: Omit<DesignCardProps, "href" | "priority" | "cover"> & {
  href?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pages: { page: PageArt; src: string }[];
  /** In place of the design's live tier badge. */
  badge?: ReactNode;
  /** In place of Use this design. */
  action?: ReactNode;
}) {
  const { galleryCopy } = useText(galleryText);
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  // Moved on to another design while open: start on its first page
  const [shownId, setShownId] = useState(design.id);
  if (shownId !== design.id) {
    setShownId(design.id);
    setIndex(0);
  }
  // A Scene plays itself; a Story steps through its pages
  const scene = design.format === "scene";
  const total = scene ? 0 : pages.length;
  const current = pages[index];
  const go = (next: number) => setIndex((next + total) % total);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) setIndex(0);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-night/90 backdrop-blur-md data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          onKeyDown={(event) => {
            // Arrow keys inside a choice (a tier) move that choice, not the page
            if (total < 2 || (event.target as HTMLElement).closest("[role=radiogroup]")) return;
            const rtl = document.dir === "rtl";
            if (event.key === "ArrowRight") go(index + (rtl ? -1 : 1));
            if (event.key === "ArrowLeft") go(index + (rtl ? 1 : -1));
          }}
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto text-card-ivory outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in lg:flex-row lg:items-center lg:justify-center lg:gap-14 lg:overflow-hidden lg:px-10"
        >
          <DialogPrimitive.Close
            aria-label={galleryCopy.close}
            className="fixed end-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-card-ivory/10 text-card-ivory transition-colors hover:bg-card-ivory/20 focus-visible:outline-2 focus-visible:outline-card-ivory"
          >
            <X aria-hidden className="size-5" />
          </DialogPrimitive.Close>

          {/* The page, shaped like a phone screen */}
          <div className="flex shrink-0 flex-col items-center gap-4 px-4 pt-16 lg:p-0">
            <div
              className={cn(
                "relative aspect-[9/16] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.75rem] border border-card-ivory/15 bg-night shadow-overlay lg:h-[min(84dvh,52rem)]",
                // A Scene keeps its controls under the painting, so it takes more height
                scene ? "h-[min(76dvh,52rem)]" : "h-[min(68dvh,52rem)]",
              )}
            >
              {scene ? (
                <SceneSample suite={design.suite} />
              ) : current ? (
                <StorySample key={current.page} suite={design.suite} art={current.page} />
              ) : (
                <span className="absolute inset-0 grid place-items-center bg-card-ivory p-[14%]">
                  <TemplateCover id={design.template} locale={locale} />
                </span>
              )}
            </div>
            {/* Which page this is, between its arrows, under the page so they never cover the words */}
            {total > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label={galleryCopy.previous}
                  className="grid size-11 cursor-pointer place-items-center rounded-full bg-card-ivory/10 text-card-ivory transition-colors hover:bg-card-ivory/20 focus-visible:outline-2 focus-visible:outline-card-ivory"
                >
                  <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
                </button>
                <p className="flex min-w-36 flex-col items-center gap-0.5 text-center">
                  <span className="font-label text-xs tracking-[0.2em] uppercase">
                    {galleryCopy.pageNames[current!.page]}
                  </span>
                  <span aria-live="polite" className="text-xs text-card-ivory/75">
                    {galleryCopy.pageOf(index + 1, total)}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label={galleryCopy.next}
                  className="grid size-11 cursor-pointer place-items-center rounded-full bg-card-ivory/10 text-card-ivory transition-colors hover:bg-card-ivory/20 focus-visible:outline-2 focus-visible:outline-card-ivory"
                >
                  <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>

          {/* What it is, every page as a thumbnail, and the way into the editor */}
          <div className="flex w-full max-w-md flex-col gap-5 self-center px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:px-0 lg:py-0">
            <div className="flex flex-col gap-2">
              {badge ?? <TierBadge designId={design.id} className="self-start" />}
              <DialogPrimitive.Title className="font-display text-[2rem] leading-tight sm:text-[2.4rem]">
                {name}
              </DialogPrimitive.Title>
              <p className="flex items-center gap-1.5 text-sm text-card-ivory/80">
                {photos === "none" ? (
                  <CameraOff aria-hidden className="size-4 shrink-0" />
                ) : (
                  <Camera aria-hidden className="size-4 shrink-0" />
                )}
                {galleryCopy.photoNeeds[photos]}
              </p>
              <p className="text-card-ivory/80">
                {scene ? galleryCopy.sceneNote : total > 0 ? description : galleryCopy.cardNote}
              </p>
            </div>
            {total > 1 && (
              <ul
                aria-label={galleryCopy.pagesLabel}
                className="grid grid-cols-5 gap-2 sm:grid-cols-9 lg:grid-cols-5"
              >
                {pages.map((page, i) => (
                  <li key={page.page}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={galleryCopy.pageNames[page.page]}
                      aria-current={i === index ? "true" : undefined}
                      className={cn(
                        "relative block aspect-[9/16] min-h-11 w-full cursor-pointer overflow-hidden rounded-md border-2 transition-[border-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-card-ivory",
                        i === index
                          ? "border-marigold"
                          : "border-transparent opacity-65 hover:opacity-100",
                      )}
                    >
                      <Image src={page.src} alt="" fill sizes="5rem" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* Admin, Designs brings its own badge and choice of tier in place of the prices */}
            {!badge && <DesignPackages designId={design.id} />}
            {action ??
              (href && (
                <div className="flex flex-col gap-3">
                  <Button asChild size="lg" fullWidth>
                    <Link href={href}>
                      {galleryCopy.useDesign}
                      <ArrowRight aria-hidden className="rtl:rotate-180" />
                    </Link>
                  </Button>
                  {/* The whole invitation as a guest gets it: opening, music and replies */}
                  <Link
                    href={sampleHref ?? samplePath(design.id)}
                    data-sample-link
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-card-ivory/30 px-4 font-semibold text-card-ivory transition-colors hover:bg-card-ivory/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-card-ivory"
                  >
                    <Eye aria-hidden className="size-5" />
                    {galleryCopy.seeSample}
                  </Link>
                </div>
              ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
