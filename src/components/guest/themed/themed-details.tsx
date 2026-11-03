"use client";

import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Flower2, Pause, Play, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { GuestFunction } from "@/components/guest/guest-view";
import type { FunctionId } from "@/lib/events/functions";
import { Button } from "@/components/ui/button";
import { useGuestText } from "@/components/guest/guest-language";
import { cn } from "@/lib/cn";
import {
  FamilyWords,
  pairedSide,
  useNamesFit,
  type FamilyBlock,
} from "@/components/guest/family-words";
import { GALLERY_ASPECT, type GuestPhoto } from "@/components/guest/guest-photo";
import { MusicBars } from "@/components/invitation/music-bars";
import { FramedPhoto } from "@/components/invitation/story/framed-photo";
import { blessings, type FlowerBlessing, type LampBlessing } from "@/lib/suites/blessings";
import type { SuiteId } from "@/lib/suites/catalog";
import type { GuestLook } from "@/lib/suites/guest-look";
import { sectionLayouts, type SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_THEMED_WORDS, cardMonth } from "@/lib/templates/themed-words";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { FlowerStage } from "./flower-blessing";
import { FlowerDefs, FlowerFrame, Garland, PetalDrift, PetalShower } from "./flowers";
import { GiftWrap } from "./gift-wrap";
import { LampStage } from "./lamp-blessing";
import { FloorArt, Houseboat } from "./scenery";
import { ScratchCard } from "./scratch-card";
import { EventsTimeline } from "./timeline";
import { useInView, useOnScreen } from "./use-in-view";
import "@/app/guest-sections.css";
import "@/app/guest-blessings.css";

const noSubscribe = () => () => {};
/** True in the browser once hydrated: sections wait to play their entrance only there. */
const useMounted = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

type Music = { playing: boolean; toggle: () => void };

/** Each ground's colours come from one hour of the theme's day: its day, dawn or night. */
const GROUND_MOODS = { cloth: "day", blend: "dawn", deep: "night" } as const;

/**
 * The guest page below a painted theme's pages (owner, 2026-10-26 and 2026-10-27). Every
 * celebration is told once, on the day's timeline, never a screen each; everything else
 * keeps its section: the welcome, the names with the couple's photos; flowers to give in
 * the theme's own way; the date under gold foil to scratch free; the timeline, with what a
 * guest needs on the day; the rest of the photos, each opening full screen; the family; a
 * lamp to light with the blessing; and the reply, just a name and whether they are coming,
 * met with a shower of petals when it is a yes. It sits on a ground of the theme's own
 * colours (plain, blended or deep; section-layouts.ts), never a painting, with the theme's
 * garland at the top and petals drifting down.
 */
export function ThemedDetails({
  suite,
  look,
  copy,
  lang,
  functions,
  days,
  main,
  welcome,
  photos,
  family,
  familyLang,
  allIcsUrl,
  previewNow,
  cheer,
  music,
  reply,
}: {
  suite: SuiteId;
  look: GuestLook;
  copy: CardCopy;
  /** The card's language: the page's own words follow it, like the pages above. */
  lang: CardLanguage;
  /** With how far off each is ("In 5 days"), once the browser knows today. */
  functions: readonly (GuestFunction & { countdown?: string })[];
  /** Each celebration's date (YYYY-MM-DD), for its day on the timeline. */
  days: Readonly<Partial<Record<FunctionId, string>>>;
  /** The main event's date (YYYY-MM-DD) and venue, for "Save the date". */
  main: { date: string; venue: string } | null;
  /** The photos the welcome shows: the couple's, or one each. */
  welcome: readonly GuestPhoto[];
  /** The rest of the photos the family shared. */
  photos: readonly GuestPhoto[];
  /** The family's blocks (blessings, parents, hosts), in the language the guest reads. */
  family: readonly FamilyBlock[];
  familyLang: string | undefined;
  allIcsUrl: string | null;
  /** A fixed moment, for review pages. */
  previewNow?: number;
  /** Counts each "yes" to the reply, for a shower of petals. */
  cheer: number;
  music: Music;
  /** The reply form, drawn in the theme's colours. */
  reply: ReactNode;
}) {
  // The music button floats while the guest reads this page
  const [top, onScreen] = useOnScreen<HTMLDivElement>();
  const { rsvpCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  // Each theme lays its parts out its own way, on its own ground (section-layouts.ts)
  const layouts = sectionLayouts(suite);
  // ...and gives its own flowers and lamps (blessings.ts)
  const ways = blessings(suite);
  // Petals for each "yes" to the reply, when the date is scratched free, and for flowers
  const [revealed, setRevealed] = useState(0);
  const celebrate = () => setRevealed((was) => was + 1);

  return (
    <div
      ref={top}
      data-suite={suite}
      data-guest={look.style}
      data-ground={layouts.ground}
      // The hour whose light the ground takes its sky colours from (globals.css)
      data-mood={GROUND_MOODS[layouts.ground]}
      className="guest-themed guest-ground relative isolate overflow-clip"
    >
      <FlowerDefs />
      <Garland
        flower={look.flower}
        second={look.secondFlower}
        className="guest-garland relative z-10 h-20 w-full sm:h-28"
      />
      <PetalDrift flowers={[look.flower, look.secondFlower]} count={8} />
      <PetalShower flowers={[look.flower, look.secondFlower]} burst={cheer + revealed} />

      <Welcome copy={copy} lang={lang} look={look} photos={welcome} />
      <span aria-hidden className="guest-band" />
      <GiveFlowers
        way={ways.flowers}
        look={look}
        lang={lang}
        onGive={() => {
          if (ways.flowers === "shower") celebrate();
        }}
      />
      {main && (
        <>
          <span aria-hidden className="guest-band" />
          <SaveTheDate
            main={main}
            look={look}
            lang={lang}
            layout={layouts.date}
            onReveal={celebrate}
          />
        </>
      )}
      <span aria-hidden className="guest-band" />

      <section
        aria-labelledby="guest-functions"
        data-tour={functions.length > 1 ? "6" : "8"}
        data-layout={layouts.timeline}
        className="relative px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-24"
      >
        <Heading
          id="guest-functions"
          lang={lang}
          label={cardWords.eventsLabel}
          title={cardWords.celebrations}
        />
        <div className="mt-12">
          <EventsTimeline
            functions={functions}
            days={days}
            lang={lang}
            layout={layouts.timeline}
            allIcsUrl={allIcsUrl}
            previewNow={previewNow}
          />
        </div>
      </section>

      {photos.length > 0 && (
        <>
          <span aria-hidden className="guest-band" />
          <Memories
            photos={photos}
            before={welcome.length}
            look={look}
            lang={lang}
            layouts={layouts}
          />
        </>
      )}

      {family.length > 0 && (
        <>
          <span aria-hidden className="guest-band" />
          <Family family={family} familyLang={familyLang} lang={lang} layout={layouts.family} />
        </>
      )}

      <span aria-hidden className="guest-band" />
      <Blessing copy={copy} lang={lang} look={look} way={ways.lamp} />

      {reply && (
        <>
          <span aria-hidden className="guest-band" />
          <section
            id="rsvp"
            aria-labelledby="guest-rsvp"
            data-tour="end"
            className="relative flex min-h-svh scroll-mt-4 flex-col justify-center px-4 pt-12 pb-12 sm:px-6 sm:pb-16"
          >
            <Reveal className="guest-card mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-9 sm:px-10">
              <Heading
                id="guest-rsvp"
                lang={lang}
                label={cardWords.replyLabel}
                title={cardWords.joinUs}
              />
              <p className="-mt-3 text-center text-ink-muted">{rsvpCopy.intro}</p>
              {reply}
            </Reveal>
          </section>
        </>
      )}
      <p
        lang={lang}
        data-snap
        className="relative px-6 pt-6 pb-32 text-center font-display text-xl text-balance text-ink-muted sm:pb-40"
      >
        {cardWords.closing}
      </p>
      {onScreen && <FloatingMusic music={music} />}
    </div>
  );
}

/** A section's small label, a flower and its title. */
function Heading({
  id,
  lang,
  label,
  title,
}: {
  id?: string;
  lang: string;
  label: string;
  title: string;
}) {
  return (
    <div lang={lang} className="flex flex-col items-center gap-2 text-center">
      <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">{label}</p>
      <h2
        id={id}
        className="font-display text-[2rem] leading-tight text-balance break-words text-ink sm:text-[2.75rem]"
      >
        {title}
      </h2>
      <span aria-hidden className="guest-rule" />
    </div>
  );
}

/** Plays its entrance (the style's own, in globals.css) once scrolled into view. */
function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const mounted = useMounted();
  return (
    <div
      ref={ref}
      data-reveal={mounted ? (seen ? "in" : "wait") : undefined}
      className={cn("guest-reveal", className)}
    >
      {children}
    </div>
  );
}

/**
 * The welcome, first below the pages (owner, 2026-10-27): who invites the guest, the names
 * and the couple's photos, on the theme's own ground, with a halo of its gilt behind them.
 */
function Welcome({
  copy,
  lang,
  look,
  photos,
}: {
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  /** The couple together, or one each, by the names in the card's order. */
  photos: readonly GuestPhoto[];
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const lines = [copy.families, copy.line].filter((text) => text.trim());

  return (
    <section
      aria-labelledby="guest-welcome"
      data-tour="8"
      className="relative flex min-h-svh flex-col justify-center px-4 pt-4 pb-16 sm:px-6 sm:pb-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="guest-stagger flex flex-col items-center gap-4 text-center sm:gap-5 lg:items-start lg:text-start">
          <p lang={lang} className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
            {cardWords.invitedTo}
          </p>
          <h2
            id="guest-welcome"
            lang={lang}
            className="font-display text-[2.75rem] leading-[1.02] break-words text-ink sm:text-[4rem]"
          >
            {copy.first}
            {joiner && (
              <>
                <span className="block text-[0.5em] leading-snug text-accent-text">{joiner}</span>
                {copy.second}
              </>
            )}
          </h2>
          <span aria-hidden className="guest-rule" />
          {lines.length > 0 && (
            <div lang={lang} className="flex max-w-md flex-col gap-2 text-lg text-ink-muted">
              {lines.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          )}
        </Reveal>

        {photos.length === 1 && (
          <Reveal className="guest-welcome-photos mx-auto w-[min(64vw,22rem,calc(40svh*0.8))] lg:me-8">
            <Framed look={look}>
              <FramedPhoto
                photo={{ src: photos[0]!.url, alt: "", fit: photos[0]!.fit }}
                alt={guestCopy.photoAlt(1)}
                frameAspect={GALLERY_ASPECT}
                className="size-full"
              />
            </Framed>
          </Reveal>
        )}
        {/* One each, side by side, each over its own name */}
        {photos.length > 1 && (
          <Reveal className="guest-welcome-photos mx-auto flex w-full max-w-[28rem] items-start justify-center gap-5 sm:gap-8 lg:me-8">
            {photos.slice(0, 2).map((photo, index) => {
              const name = index === 0 ? copy.first : copy.second;
              return (
                <figure
                  key={photo.id}
                  className={cn(
                    "flex w-[min(40vw,15rem,calc(34svh*0.8))] min-w-0 flex-col items-center gap-4",
                    index === 1 && "mt-12 sm:mt-16",
                  )}
                >
                  <Framed look={look} className="w-full">
                    <FramedPhoto
                      photo={{ src: photo.url, alt: "", fit: photo.fit }}
                      alt={guestCopy.photoAlt(index + 1)}
                      frameAspect={GALLERY_ASPECT}
                      className="size-full"
                    />
                  </Framed>
                  {name.trim() && (
                    <figcaption
                      lang={lang}
                      className="max-w-full text-center font-display text-xl leading-tight break-words text-ink"
                    >
                      {name}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/**
 * The flowers the guest gives after the welcome, in this theme's own way (blessings.ts):
 * a drawing that moves each time they give, and words that thank them.
 */
function GiveFlowers({
  way,
  look,
  lang,
  onGive,
}: {
  way: FlowerBlessing;
  look: GuestLook;
  lang: CardLanguage;
  onGive: () => void;
}) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.themed;
  const gift = words.flowers[way];
  const [given, setGiven] = useState(0);
  return (
    <section
      aria-labelledby="guest-flowers"
      data-tour="8"
      className="relative flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6"
    >
      <Reveal className="guest-stagger mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center sm:gap-6">
        <Heading
          id="guest-flowers"
          lang={lang}
          label={words.flowersLabel}
          title={words.flowersTitle}
        />
        <FlowerStage
          way={way}
          flower={look.flower}
          second={look.secondFlower}
          given={given}
          className="bl-stage w-full max-w-[34rem]"
        />
        <Button
          onClick={() => {
            setGiven((was) => was + 1);
            onGive();
          }}
          size="lg"
          className="max-w-full rounded-full"
        >
          <Flower2 aria-hidden />
          {gift.give}
        </Button>
        <p aria-live="polite" className="-mt-2 min-h-6 text-sm text-balance text-ink-muted">
          {given > 0 ? gift.given : ""}
        </p>
      </Reveal>
    </section>
  );
}

/** Monday to Sunday in a known week, for a calendar page's head in the card's language. */
const WEEK = [1, 2, 3, 4, 5, 6, 7].map((day) => new Date(Date.UTC(2024, 0, day)));

/** The days of the date's month, Monday first, with blanks before the first. */
function monthGrid(date: Date): (number | null)[] {
  const first = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  const blanks = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)).getUTCDate();
  return [
    ...Array.from({ length: blanks }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
}

/**
 * Save the date, in the theme's own way: drawn in a floor pattern, a calendar page or a
 * ticket, under the theme's gold foil for the guest to scratch free (owner, 2026-10-27).
 */
function SaveTheDate({
  main,
  look,
  lang,
  layout,
  onReveal,
}: {
  main: { date: string; venue: string };
  look: GuestLook;
  lang: CardLanguage;
  layout: SectionLayouts["date"];
  /** Called when the guest has scratched the date free. */
  onReveal: () => void;
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const day = parseISO(main.date);
  const [ref, seen] = useInView<HTMLDivElement>("0px 0px -20% 0px");
  const mounted = useMounted();
  const month = cardMonth(main.date, lang);
  const weekday = new Intl.DateTimeFormat(`${lang}-IN`, { weekday: "narrow", timeZone: "UTC" });
  const longDay = new Intl.DateTimeFormat(`${lang}-IN`, { weekday: "long", timeZone: "UTC" });
  const dayName = longDay.format(
    new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())),
  );
  const reveal = mounted ? (seen ? "in" : "wait") : undefined;
  const foil = { hint: guestCopy.scratch.date, label: guestCopy.scratch.showDate, onReveal };
  return (
    <section
      aria-labelledby="guest-save-date"
      data-tour="8"
      data-layout={layout}
      className="relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6 sm:py-20"
    >
      {look.style === "garden" && (
        <Houseboat className="guest-boat absolute bottom-6 -z-10 w-40 sm:w-56" />
      )}
      <Heading
        id="guest-save-date"
        lang={lang}
        label={cardWords.saveDateLabel}
        title={cardWords.saveDate}
      />
      {layout === "medallion" && (
        <div
          ref={ref}
          data-reveal={reveal}
          className="guest-medallion relative mx-auto mt-10 grid aspect-square w-[min(88vw,26rem,56svh)] place-items-center"
        >
          <FloorArt pattern={look.pattern} flower={look.flower} second={look.secondFlower} />
          <ScratchCard
            {...foil}
            round
            className="guest-date-disc grid aspect-square w-[48%] place-content-center rounded-full text-center"
          >
            <p className="font-label text-[0.7rem] tracking-[0.25em] text-accent-text uppercase sm:text-xs">
              {month}
            </p>
            <p className="font-display text-[3.4rem] leading-none text-ink tabular-nums sm:text-[4.5rem]">
              {format(day, "d")}
            </p>
            <p className="font-label text-sm tracking-[0.3em] text-accent-text">
              {format(day, "yyyy")}
            </p>
          </ScratchCard>
        </div>
      )}
      {layout === "calendar" && (
        // A page torn from the month's calendar, the day ringed in flowers
        <div
          ref={ref}
          data-reveal={reveal}
          lang={lang}
          className="guest-reveal mx-auto mt-10 w-[min(88vw,24rem)]"
        >
          <ScratchCard {...foil} className="guest-card guest-calendar px-5 pt-6 pb-7">
            <p className="text-center font-display text-2xl text-ink">
              {month} <span className="text-accent-text tabular-nums">{format(day, "yyyy")}</span>
            </p>
            <div aria-hidden className="mt-4 grid grid-cols-7 gap-y-1.5 text-center">
              {WEEK.map((date) => (
                <span key={date.getTime()} className="font-label text-[0.7rem] text-ink-muted">
                  {weekday.format(date)}
                </span>
              ))}
              {monthGrid(day).map((number, index) => (
                <span
                  key={index}
                  data-day={number === day.getDate() ? "chosen" : undefined}
                  className="guest-calendar-day mx-auto grid size-9 place-items-center rounded-full text-sm text-ink tabular-nums"
                >
                  {number}
                </span>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-ink-muted">
              {dayName}, {format(day, "d")} {month}
            </p>
          </ScratchCard>
        </div>
      )}
      {layout === "ticket" && (
        // A ticket to the day: the date large on the stub, the place on the counterfoil
        <div
          ref={ref}
          data-reveal={reveal}
          lang={lang}
          className="guest-reveal mx-auto mt-10 w-[min(92vw,30rem)]"
        >
          <ScratchCard {...foil} className="guest-ticket grid grid-cols-[auto_1fr] items-stretch">
            <div className="guest-ticket-stub flex flex-col items-center justify-center px-5 py-6 text-center">
              <p className="font-display text-[3.6rem] leading-none text-ink tabular-nums">
                {format(day, "d")}
              </p>
              <p className="font-label text-[0.7rem] tracking-[0.25em] text-accent-text uppercase">
                {month}
              </p>
            </div>
            <div className="guest-ticket-body flex flex-col justify-center gap-1 px-5 py-6">
              <p className="font-label text-xs tracking-[0.25em] text-accent-text uppercase">
                {dayName}
              </p>
              <p className="font-display text-2xl leading-tight text-ink tabular-nums">
                {format(day, "yyyy")}
              </p>
              {main.venue && <p className="text-sm text-balance text-ink-muted">{main.venue}</p>}
            </div>
          </ScratchCard>
        </div>
      )}
      {main.venue && layout !== "ticket" && (
        <p className="mt-8 text-center font-display text-2xl text-balance text-ink">{main.venue}</p>
      )}
    </section>
  );
}

/** The frame a photo or painting hangs in: an arch in a palace, an oval by the water. */
function Framed({
  look,
  children,
  className,
}: {
  look: GuestLook;
  children: ReactNode;
  className?: string;
}) {
  const shape = look.style === "garden" || look.style === "party" ? "ring" : "arch";
  return (
    <div className={cn("relative", className)}>
      <div data-shape={shape} className="guest-frame relative aspect-[4/5] overflow-hidden">
        {children}
      </div>
      <FlowerFrame shape={shape} flower={look.flower} second={look.secondFlower} />
    </div>
  );
}

/** How long each photo shows before the next comes by itself. */
const PHOTO_MS = 4500;

/** Scrolls the carousel so its photo at `index` sits in the middle. */
function centre(list: HTMLElement, index: number, smooth: boolean) {
  const item = list.children[index] as HTMLElement | undefined;
  if (!item) return;
  list.scrollTo({
    left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
    behavior: smooth ? "smooth" : "auto",
  });
}

/** The photo nearest the middle of the strip. */
function nearestPhoto(list: HTMLElement): number {
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
function PhotoCarousel({
  photos,
  before,
  look,
  onOpen,
  wrap,
}: {
  photos: readonly GuestPhoto[];
  /** How many photos the welcome already shows, so these count on from there. */
  before: number;
  look: GuestLook;
  /** Opens the photo at this index full screen. */
  onOpen: (index: number) => void;
  /** The photos still wrapped like gifts, and how they are unwrapped. */
  wrap: Wrapping;
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
            {wrap.wrapped(i) ? (
              <Framed look={look}>
                <FramedPhoto
                  photo={{ src: photo.url, alt: "", fit: photo.fit }}
                  alt=""
                  frameAspect={GALLERY_ASPECT}
                  lazy={Math.abs(i - index) > 1}
                  className="size-full"
                />
                <GiftWrap
                  label={guestCopy.scratch.unwrap(i + before + 1)}
                  hint={guestCopy.scratch.tap}
                  tabIndex={i === index ? 0 : -1}
                  onOpen={() => wrap.unwrap(i)}
                />
              </Framed>
            ) : (
              <button
                data-photo={i}
                type="button"
                tabIndex={i === index ? 0 : -1}
                onClick={() => onOpen(i)}
                aria-label={words.open(i + before + 1)}
                className="block w-full cursor-zoom-in rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <Framed look={look}>
                  <FramedPhoto
                    photo={{ src: photo.url, alt: "", fit: photo.fit }}
                    alt=""
                    frameAspect={GALLERY_ASPECT}
                    lazy={Math.abs(i - index) > 1}
                    className="size-full"
                  />
                </Framed>
              </button>
            )}
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

/** Which photos are still wrapped like gifts, and how one is unwrapped. */
type Wrapping = {
  wrapped: (index: number) => boolean;
  unwrap: (index: number) => void;
};

/** The photos the family shared, as the theme lays them out: a film, polaroids or a mosaic. */
function Memories({
  photos,
  before,
  look,
  lang,
  layouts,
}: {
  photos: readonly GuestPhoto[];
  /** How many photos the welcome already shows, so these count on from there. */
  before: number;
  look: GuestLook;
  lang: CardLanguage;
  layouts: SectionLayouts;
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  // The photo open full screen, if any
  const [viewing, setViewing] = useState<number | null>(null);
  // Every other photo comes wrapped like a gift, until the guest unwraps it
  const [unwrapped, setUnwrapped] = useState<readonly number[]>([]);
  const section = useRef<HTMLElement>(null);
  const wrap: Wrapping = {
    wrapped: (index) => index % 2 === 1 && !unwrapped.includes(index),
    unwrap: (index) => setUnwrapped((was) => [...was, index]),
  };
  // Focus stays with the photo once its paper has gone
  const last = unwrapped.at(-1);
  useEffect(() => {
    if (last === undefined) return;
    section.current
      ?.querySelector<HTMLButtonElement>(`[data-photo="${last}"]`)
      ?.focus({ preventScroll: true });
  }, [last]);
  return (
    <div className="relative isolate pb-10">
      {photos.length > 0 && (
        <section
          ref={section}
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
                        "guest-polaroid relative w-[min(42vw,13rem)] shrink-0 p-2 pb-8",
                      layouts.photos === "mosaic" &&
                        "guest-mosaic relative overflow-hidden rounded-xl first:col-span-2 first:row-span-2",
                    )}
                    style={
                      layouts.photos === "polaroids"
                        ? { rotate: `${[-3, 2, -1.5, 3, -2.5, 1.5][index % 6]}deg` }
                        : undefined
                    }
                  >
                    {wrap.wrapped(index) && (
                      <GiftWrap
                        label={guestCopy.scratch.unwrap(index + before + 1)}
                        hint={guestCopy.scratch.tap}
                        onOpen={() => wrap.unwrap(index)}
                      />
                    )}
                    <button
                      data-photo={index}
                      type="button"
                      tabIndex={wrap.wrapped(index) ? -1 : undefined}
                      aria-hidden={wrap.wrapped(index) || undefined}
                      onClick={() => setViewing(index)}
                      aria-label={guestCopy.carousel.open(index + before + 1)}
                      className="block size-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <FramedPhoto
                        photo={{ src: photo.url, alt: "", fit: photo.fit }}
                        alt=""
                        frameAspect={GALLERY_ASPECT}
                        lazy
                        className={cn(
                          "w-full",
                          layouts.photos === "polaroids" ? "aspect-[4/5]" : "aspect-[4/5] h-full",
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {layouts.photos === "film" && (
            <PhotoCarousel
              photos={photos}
              before={before}
              look={look}
              onOpen={setViewing}
              wrap={wrap}
            />
          )}
        </section>
      )}
      <PhotoViewer
        photos={photos}
        before={before}
        start={viewing}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}

/**
 * A photo full screen (owner, 2026-10-27), whole and uncropped: swipe, or step with the
 * buttons or arrow keys, to the others. Escape or Close goes back to where the guest was.
 */
function PhotoViewer({
  photos,
  before,
  start,
  onClose,
}: {
  photos: readonly GuestPhoto[];
  before: number;
  /** The photo to open on, or null when closed. */
  start: number | null;
  onClose: () => void;
}) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.carousel;
  return (
    <DialogPrimitive.Root
      open={start !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="guest-viewer fixed inset-0 z-50 flex flex-col text-card-ivory outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
        >
          <div className="flex items-center justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
            <DialogPrimitive.Title className="ps-2 font-label text-xs tracking-[0.2em] uppercase">
              {words.viewer}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label={words.close}
              className="guest-viewer-button grid size-11 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X aria-hidden className="size-5" />
            </DialogPrimitive.Close>
          </div>
          {start !== null && <ViewerStrip photos={photos} before={before} start={start} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function ViewerStrip({
  photos,
  before,
  start,
}: {
  photos: readonly GuestPhoto[];
  before: number;
  start: number;
}) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.carousel;
  const still = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(start);
  const count = photos.length;

  // Opens on the photo the guest tapped
  useEffect(() => {
    if (track.current) centre(track.current, start, false);
  }, [start]);

  const go = (to: number) => {
    const next = Math.min(Math.max(to, 0), count - 1);
    if (track.current) centre(track.current, next, !still);
    setIndex(next);
  };

  // The arrow keys step through the photos wherever focus is in the viewer
  useEffect(() => {
    const step = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const list = track.current;
      if (!list) return;
      event.preventDefault();
      const back = (event.key === "ArrowLeft") !== (getComputedStyle(list).direction === "rtl");
      const next = Math.min(Math.max(index + (back ? -1 : 1), 0), count - 1);
      centre(list, next, !still);
      setIndex(next);
    };
    window.addEventListener("keydown", step);
    return () => window.removeEventListener("keydown", step);
  }, [index, count, still]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ul
        ref={track}
        onScroll={() => {
          if (!track.current) return;
          const nearest = nearestPhoto(track.current);
          if (nearest !== index) setIndex(nearest);
        }}
        // Focusable so a keyboard can reach the scrolling strip
        tabIndex={0}
        className="guest-gallery flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        {photos.map((photo, i) => (
          <li
            key={photo.id}
            aria-hidden={i !== index || undefined}
            className="flex w-full shrink-0 snap-center items-center justify-center p-3 sm:p-8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- the family's own photo, whole */}
            <img
              src={photo.url}
              alt={guestCopy.photoAlt(i + before + 1)}
              loading={Math.abs(i - index) > 1 ? "lazy" : undefined}
              decoding="async"
              draggable={false}
              className="max-h-full max-w-full rounded-md object-contain select-none"
            />
          </li>
        ))}
      </ul>
      {count > 1 && (
        <div className="flex items-center justify-center gap-4 px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label={words.previous}
            className="guest-viewer-button grid size-11 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-40"
          >
            <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
          </button>
          <p
            aria-live="polite"
            className="min-w-14 text-center font-label text-xs tracking-[0.2em] uppercase"
          >
            <span aria-hidden>{`${index + 1} / ${count}`}</span>
            <span className="sr-only">{words.position(index + 1, count)}</span>
          </p>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === count - 1}
            aria-label={words.next}
            className="guest-viewer-button grid size-11 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-40"
          >
            <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}

/** The family, in the theme's own way: cards, ribbons, or one scroll with ornaments between. */
function Family({
  family,
  familyLang,
  lang,
  layout,
}: {
  family: readonly FamilyBlock[];
  familyLang: string | undefined;
  lang: CardLanguage;
  layout: SectionLayouts["family"];
}) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const names = useNamesFit<HTMLDListElement>(family.map((block) => block.text).join("|"));
  return (
    <section
      aria-labelledby="guest-family"
      data-tour="9"
      data-layout={layout}
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
            layout === "scroll"
              ? "guest-card guest-scroll mx-auto flex max-w-xl flex-col items-center gap-0 px-6 py-10"
              : "flex flex-wrap justify-center gap-6",
          )}
        >
          {family.map((block, index) => (
            <div
              key={block.id}
              className={cn(
                "flex w-full flex-col items-center gap-2 text-center",
                layout === "cards" && "guest-card guest-family px-6 py-8",
                layout === "ribbons" && "guest-ribbon-block px-4 pt-2 pb-6",
                layout === "scroll" && "py-5",
                // Both sides' parents side by side; the blessings and hosts each a full row
                layout !== "scroll" && pairedSide(family, block) && "sm:w-[calc(50%-0.75rem)]",
              )}
            >
              {layout === "scroll" && index > 0 && <span aria-hidden className="guest-rule mb-4" />}
              <dt
                className={cn(
                  "font-label text-xs tracking-[0.25em] uppercase",
                  layout === "ribbons" ? "guest-ribbon px-6 py-2" : "text-accent-text",
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
  );
}

/** The blessing, and lamps the guest lights for the couple in the theme's own way. */
function Blessing({
  copy,
  lang,
  look,
  way,
}: {
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  way: LampBlessing;
}) {
  const { guestCopy } = useGuestText();
  const light = guestCopy.themed.lights[way];
  const cardWords = CARD_THEMED_WORDS[lang];
  const [lit, setLit] = useState(false);
  return (
    <section
      aria-label={guestCopy.themed.lampsLabel}
      data-tour="7"
      data-lit={lit || undefined}
      className="guest-night relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6"
    >
      <Reveal className="guest-stagger mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p lang={lang} className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
          {cardWords.blessingLabel}
        </p>
        {copy.blessing && (
          <p lang={lang} className="font-display text-2xl text-balance text-ink sm:text-3xl">
            {copy.blessing}
          </p>
        )}
        <div className="guest-lamps flex w-full justify-center">
          <LampStage way={way} flower={look.flower} />
        </div>
        <Button
          variant={lit ? "secondary" : "primary"}
          size="lg"
          onClick={() => setLit((was) => !was)}
          aria-pressed={lit}
          className="rounded-full"
        >
          {light.give}
        </Button>
        <p aria-live="polite" className="min-h-6 text-sm text-balance text-ink-muted">
          {lit ? light.given : ""}
        </p>
      </Reveal>
    </section>
  );
}

/** The music, one tap away while the guest reads on. */
function FloatingMusic({ music }: { music: Music }) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.themed.music;
  return (
    <button
      type="button"
      onClick={music.toggle}
      aria-pressed={music.playing}
      aria-label={music.playing ? words.pause : words.play}
      data-playing={music.playing || undefined}
      className="guest-float-music fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 grid size-14 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <MusicBars playing={music.playing} className="size-6" />
    </button>
  );
}
