"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGuestText } from "@/components/guest/guest-language";
import {
  FamilyWords,
  pairedSide,
  useNamesFit,
  type FamilyBlock,
} from "@/components/guest/family-words";
import { GALLERY_ASPECT, type GuestPhoto } from "@/components/guest/guest-photo";
import { FramedPhoto } from "@/components/invitation/story/framed-photo";
import { cn } from "@/lib/cn";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_THEMED_WORDS } from "@/lib/templates/themed-words";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PetalDrift } from "../flowers";
import { useOnScreen } from "../use-in-view";
import { Divider, Framed, Heading, Reveal } from "./parts";

/** How long each photo shows before the next comes by itself. */
const PHOTO_MS = 4500;

/** Scrolls the carousel so its photo at `index` sits in the middle. */
export function centre(list: HTMLElement, index: number, smooth: boolean) {
  const item = list.children[index] as HTMLElement | undefined;
  if (!item) return;
  list.scrollTo({
    left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
    behavior: smooth ? "smooth" : "auto",
  });
}

/** The photo nearest the middle of the strip. */
export function nearestPhoto(list: HTMLElement): number {
  const middle = list.scrollLeft + list.clientWidth / 2;
  let nearest = 0;
  let gap = Infinity;
  Array.from(list.children).forEach((child, i) => {
    const item = child as HTMLElement;
    const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - middle);
    if (distance < gap) {
      gap = distance;
      nearest = i;
    }
  });
  return nearest;
}

/**
 * The photos one after another (owner, 2026-10-24: guests had to scroll sideways to find
 * them): each comes to the middle by itself while the section is on screen, and the guest
 * can step back and forward, swipe, or pause. Hovering or a button in focus holds it, and
 * in still mode nothing moves by itself.
 */
export function PhotoCarousel({
  photos,
  before,
  look,
}: {
  photos: readonly GuestPhoto[];
  /** How many photos the welcome already shows, so these count on from there. */
  before: number;
  look: GuestLook;
}) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.carousel;
  const track = useRef<HTMLUListElement>(null);
  const [area, onScreen] = useOnScreen<HTMLDivElement>();
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  // The photo the strip is gliding to by itself; its scrolling on the way says nothing
  const aim = useRef<number | null>(null);
  const count = photos.length;
  const playing = !still && !paused && count > 1;

  useEffect(() => {
    if (!playing || holding || !onScreen) return;
    const timer = setTimeout(() => {
      const next = (index + 1) % count;
      aim.current = next;
      if (track.current) centre(track.current, next, true);
      setIndex(next);
    }, PHOTO_MS);
    return () => clearTimeout(timer);
  }, [playing, holding, onScreen, index, count]);

  const go = (to: number) => {
    const next = (to + count) % count;
    aim.current = next;
    if (track.current) centre(track.current, next, !still);
    setIndex(next);
  };
  // A swipe settles on a photo; the counter follows it
  const settle = () => {
    const list = track.current;
    if (!list || aim.current !== null) return;
    const nearest = nearestPhoto(list);
    if (nearest !== index) setIndex(nearest);
  };
  // A glide that stopped short (a Next pressed before the last glide began, on a slow phone)
  // goes the rest of the way at once, so the photo shown is always the one counted
  const arrive = () => {
    const list = track.current;
    const target = aim.current;
    aim.current = null;
    if (list && target !== null && nearestPhoto(list) !== target) centre(list, target, false);
  };
  // The guest's own swipe, wheel or key: the counter follows the strip again
  const takeOver = () => {
    aim.current = null;
  };

  return (
    <div
      ref={area}
      role="group"
      aria-roledescription={words.label}
      aria-labelledby="guest-photos"
      className="mt-10 flex flex-col items-center gap-4"
      onPointerEnter={() => setHolding(true)}
      onPointerLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHolding(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const back =
            (event.key === "ArrowLeft") !==
            (getComputedStyle(event.currentTarget).direction === "rtl");
          go(index + (back ? -1 : 1));
        }
      }}
    >
      {/* Focusable so a keyboard can reach the scrolling strip; its arrow keys turn the photos */}
      <ul
        ref={track}
        tabIndex={0}
        onScroll={settle}
        onScrollEnd={arrive}
        onPointerDown={takeOver}
        onWheel={takeOver}
        onKeyDown={takeOver}
        className="guest-gallery flex w-full snap-x snap-mandatory gap-8 overflow-x-auto px-[calc(50%-min(31vw,7.5rem))] pt-8 pb-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:gap-10"
      >
        {photos.map((photo, i) => (
          <li
            key={photo.id}
            data-current={i === index || undefined}
            aria-hidden={i !== index || undefined}
            className="guest-photo guest-slide w-[min(62vw,15rem)] shrink-0 snap-center"
          >
            <Framed look={look}>
              <FramedPhoto
                photo={{ src: photo.url, alt: "", fit: photo.fit }}
                alt={guestCopy.photoAlt(i + before + 1)}
                frameAspect={GALLERY_ASPECT}
                lazy={Math.abs(i - index) > 1}
                className="size-full"
              />
            </Framed>
          </li>
        ))}
      </ul>
      {count > 1 && (
        <div className="flex items-center gap-3">
          {!still && (
            <button
              type="button"
              onClick={() => setPaused((was) => !was)}
              aria-label={paused ? words.play : words.pause}
              className="guest-step grid size-11 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {paused ? (
                <Play aria-hidden className="size-4 fill-current rtl:-scale-x-100" />
              ) : (
                <Pause aria-hidden className="size-4 fill-current" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={words.previous}
            className="guest-step grid size-11 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
          </button>
          <p
            aria-live={playing && !holding ? "off" : "polite"}
            className="min-w-14 text-center font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
          >
            <span aria-hidden>{`${index + 1} / ${count}`}</span>
            <span className="sr-only">{words.position(index + 1, count)}</span>
          </p>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={words.next}
            className="guest-step grid size-11 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Photos and family at dusk, under hanging lamps in a palace or over the water. */
export function Dusk({
  before,
  photos,
  family,
  familyLang,
  look,
  lang,
  layouts,
}: {
  /** How many photos the welcome already shows, so these count on from there. */
  before: number;
  photos: readonly GuestPhoto[];
  family: readonly FamilyBlock[];
  familyLang: string | undefined;
  look: GuestLook;
  lang: CardLanguage;
  layouts: SectionLayouts;
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const names = useNamesFit<HTMLDListElement>(family.map((block) => block.text).join("|"));
  return (
    <div data-mood="dusk" className="guest-sky relative isolate pb-16">
      <Divider look={look} />
      <PetalDrift flowers={[look.secondFlower, look.flower]} count={8} />
      {photos.length > 0 && (
        <section
          aria-labelledby="guest-photos"
          data-tour="9"
          data-layout={layouts.photos}
          className={cn(
            "relative flex min-h-svh flex-col justify-center pt-20",
            // The carousel's buttons stay clear of the floating music button
            layouts.photos === "film" ? "pb-24" : "pb-6",
          )}
        >
          <div className="px-4 sm:px-6">
            <Heading
              id="guest-photos"
              lang={lang}
              label={cardWords.photosLabel}
              title={cardWords.photos}
            />
          </div>
          {layouts.photos !== "film" && (
            <Reveal className="mx-auto mt-10 w-full max-w-4xl px-4 sm:px-6">
              <ul
                className={cn(
                  layouts.photos === "polaroids" &&
                    "flex flex-wrap justify-center gap-x-4 gap-y-8 pt-2 pb-6",
                  layouts.photos === "mosaic" && "grid grid-cols-2 gap-3 sm:grid-cols-3",
                )}
              >
                {photos.map((photo, index) => (
                  <li
                    key={photo.id}
                    className={cn(
                      layouts.photos === "polaroids" &&
                        "guest-polaroid w-[min(42vw,13rem)] shrink-0 p-2 pb-8",
                      layouts.photos === "mosaic" &&
                        "guest-mosaic overflow-hidden rounded-xl first:col-span-2 first:row-span-2",
                    )}
                    style={
                      layouts.photos === "polaroids"
                        ? { rotate: `${[-3, 2, -1.5, 3, -2.5, 1.5][index % 6]}deg` }
                        : undefined
                    }
                  >
                    <FramedPhoto
                      photo={{ src: photo.url, alt: "", fit: photo.fit }}
                      alt={guestCopy.photoAlt(index + before + 1)}
                      frameAspect={GALLERY_ASPECT}
                      lazy
                      className={cn(
                        "w-full",
                        layouts.photos === "polaroids" ? "aspect-[4/5]" : "aspect-[4/5] h-full",
                      )}
                    />
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {layouts.photos === "film" && (
            <PhotoCarousel photos={photos} before={before} look={look} />
          )}
        </section>
      )}
      {family.length > 0 && (
        <section
          aria-labelledby="guest-family"
          data-tour="9"
          data-layout={layouts.family}
          className="relative flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6"
        >
          <Heading
            id="guest-family"
            lang={lang}
            label={cardWords.familyLabel}
            title={cardWords.family}
          />
          <Reveal className="mx-auto mt-10 w-full max-w-4xl">
            <dl
              ref={names}
              lang={familyLang}
              className={cn(
                "guest-stagger",
                layouts.family === "scroll"
                  ? "guest-card guest-scroll mx-auto flex max-w-xl flex-col items-center gap-0 px-6 py-10"
                  : "flex flex-wrap justify-center gap-6",
              )}
            >
              {family.map((block, index) => (
                <div
                  key={block.id}
                  className={cn(
                    "flex w-full flex-col items-center gap-2 text-center",
                    layouts.family === "cards" && "guest-card guest-family px-6 py-8",
                    layouts.family === "ribbons" && "guest-ribbon-block px-4 pt-2 pb-6",
                    layouts.family === "scroll" && "py-5",
                    // Both sides' parents side by side; the blessings and hosts each a full row
                    layouts.family !== "scroll" &&
                      pairedSide(family, block) &&
                      "sm:w-[calc(50%-0.75rem)]",
                  )}
                >
                  {layouts.family === "scroll" && index > 0 && (
                    <span aria-hidden className="guest-rule mb-4" />
                  )}
                  <dt
                    className={cn(
                      "font-label text-xs tracking-[0.25em] uppercase",
                      layouts.family === "ribbons" ? "guest-ribbon px-6 py-2" : "text-accent-text",
                    )}
                  >
                    {block.title}
                  </dt>
                  <FamilyWords
                    block={block}
                    className="font-display text-xl text-ink"
                    soft="text-ink-muted"
                  />
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      )}
    </div>
  );
}
