"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Eye, Layers, Rotate3d, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useState, type ReactNode } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { Button } from "@/components/ui/button";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import type { GalleryDesign } from "@/lib/gallery/catalog";
import { PAGE_ARTS, SUITES, type PageArt } from "@/lib/suites/catalog";

type DesignCardProps = {
  design: GalleryDesign;
  name: string;
  description: string;
  /** Where Use this design leads: the editor, set up for this choice. */
  href: string;
  priority?: boolean;
  /**
   * A card design's cover, drawn on the server: its art uses trigonometry whose last digits
   * differ between server and browser, so drawing it in both would not match.
   */
  cover?: ReactNode;
};

/** The pages a design has paintings for, in the order guests see them. */
function paintedPages(design: GalleryDesign): { page: PageArt; src: string }[] {
  const { images } = SUITES[design.suite];
  return PAGE_ARTS.flatMap((page) => (images[page] ? [{ page, src: images[page]! }] : []));
}

/**
 * A design in the gallery: its painted cover (or its 3D card), what it is, and two ways
 * on: Preview, which shows every page it has, and Use this design.
 */
export function DesignCard({ design, name, description, href, priority, cover }: DesignCardProps) {
  const { galleryCopy } = useText(galleryText);
  const locale = useLocale();
  const pages = paintedPages(design);
  const painted = pages.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <article
      data-design={design.id}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-raised transition-shadow duration-300 hover:shadow-float"
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={galleryCopy.preview(name)}
        className="relative isolate block aspect-[3/4] w-full cursor-pointer overflow-hidden bg-night outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-ring"
      >
        {painted ? (
          <>
            <Image
              src={pages[0]!.src}
              alt=""
              fill
              priority={priority}
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
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-night/70 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.14em] text-card-ivory uppercase backdrop-blur-sm">
          {painted ? (
            <Layers aria-hidden className="size-3.5" />
          ) : (
            <Rotate3d aria-hidden className="size-3.5" />
          )}
          {painted ? galleryCopy.pagesCount(pages.length) : galleryCopy.card}
        </span>
        <span className="absolute end-3 bottom-3 grid size-11 place-items-center rounded-full bg-card-ivory/90 text-card-ink opacity-0 shadow-raised transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
          <Eye aria-hidden className="size-5" />
        </span>
      </button>
      <div className="@container flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-xl leading-tight">{name}</h3>
          <p className="line-clamp-2 text-sm text-ink-muted">{description}</p>
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
      <DesignPreview
        open={open}
        onOpenChange={setOpen}
        design={design}
        name={name}
        description={description}
        href={href}
        pages={pages}
      />
    </article>
  );
}

/**
 * Every page of a design, full height like the guest's phone: step through them with the
 * arrows, the thumbnails or the arrow keys, then Use this design.
 */
function DesignPreview({
  open,
  onOpenChange,
  design,
  name,
  description,
  href,
  pages,
}: DesignCardProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pages: { page: PageArt; src: string }[];
}) {
  const { galleryCopy } = useText(galleryText);
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const total = pages.length;
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
            if (total < 2) return;
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
            <div className="relative aspect-[9/16] h-[min(68dvh,52rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.75rem] border border-card-ivory/15 bg-night shadow-overlay lg:h-[min(84dvh,52rem)]">
              {current ? (
                <Image
                  key={current.src}
                  src={current.src}
                  alt=""
                  fill
                  sizes="(min-width: 64rem) 30rem, 90vw"
                  className="animate-fade-in object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center bg-card-ivory p-[14%]">
                  <TemplateCover id={design.template} locale={locale} />
                </span>
              )}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label={galleryCopy.previous}
                    className="absolute start-2 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-night/55 text-card-ivory backdrop-blur-sm transition-colors hover:bg-night/75 focus-visible:outline-2 focus-visible:outline-card-ivory"
                  >
                    <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    aria-label={galleryCopy.next}
                    className="absolute end-2 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-night/55 text-card-ivory backdrop-blur-sm transition-colors hover:bg-night/75 focus-visible:outline-2 focus-visible:outline-card-ivory"
                  >
                    <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
                  </button>
                  <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 bg-linear-to-t from-night/80 to-transparent px-4 pt-10 pb-4">
                    <span className="font-label text-xs tracking-[0.2em] uppercase">
                      {galleryCopy.pageNames[current!.page]}
                    </span>
                    <span aria-live="polite" className="text-xs text-card-ivory/75">
                      {galleryCopy.pageOf(index + 1, total)}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* What it is, every page as a thumbnail, and the way into the editor */}
          <div className="flex w-full max-w-md flex-col gap-5 self-center px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:px-0 lg:py-0">
            <div className="flex flex-col gap-2">
              <DialogPrimitive.Title className="font-display text-[2rem] leading-tight sm:text-[2.4rem]">
                {name}
              </DialogPrimitive.Title>
              <p className="text-card-ivory/80">{total > 0 ? description : galleryCopy.cardNote}</p>
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
            <Button asChild size="lg" fullWidth>
              <Link href={href}>
                {galleryCopy.useDesign}
                <ArrowRight aria-hidden className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
