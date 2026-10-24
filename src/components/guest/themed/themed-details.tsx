"use client";

import { format, parseISO } from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight, Flower2, Pause, Play } from "lucide-react";
import { Image } from "@/components/ui/image";
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
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import { eventBox, type EventBox as Box } from "@/lib/suites/event-boxes";
import type { GuestLook } from "@/lib/suites/guest-look";
import { sectionLayouts, type SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_THEMED_WORDS, cardMonth } from "@/lib/templates/themed-words";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EventBox } from "./event-box";
import { FlowerStage } from "./flower-blessing";
import { FlowerDefs, FlowerFrame, Garland, PetalDrift, PetalShower } from "./flowers";
import { LampStage } from "./lamp-blessing";
import { Balloons, Bunting, Festoon, FloorArt, Houseboat, PalaceSkyline, Palm } from "./scenery";
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

/**
 * The guest page below a painted theme's pages (Step 12q). Scrolling down, the guest lives
 * through the day in the theme's own colours: a dawn welcome under a garland, then
 * flowers to give the family in the theme's own way; the date drawn in a floor pattern by
 * day; each celebration in its own hour; photos and family at dusk; and at night, a light
 * to give before the reply (each theme's two ways are in blessings.ts). Palace themes hang torans over arches and a skyline; garden themes
 * sit by the water with palms, a houseboat and a brass lamp. Every choice comes from the
 * theme's `GuestLook`, so a new theme gets all of this by naming a style.
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
  music,
  reply,
}: {
  suite: SuiteId;
  look: GuestLook;
  /** The card's words, in the card's language. */
  copy: CardCopy;
  /** The card's language: the page's own words follow it, like the pages above. */
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  /** Each celebration's date (YYYY-MM-DD), for the date seals and stubs on its box. */
  days: Readonly<Partial<Record<FunctionId, string>>>;
  /** The main event's date (YYYY-MM-DD) and venue, for "Save the date". */
  main: { date: string; venue: string } | null;
  /** The photos the welcome shows: the couple's, or one each, from the design's own frames. */
  welcome: readonly GuestPhoto[];
  /** The other photos, for the gallery at dusk: each photo shows once on the page. */
  photos: readonly GuestPhoto[];
  family: readonly FamilyBlock[];
  familyLang: string | undefined;
  allIcsUrl: string | null;
  music: Music;
  /** The reply form, drawn in the theme's colours. */
  reply: ReactNode;
}) {
  // The music button floats while the guest reads this page
  const [top, onScreen] = useOnScreen<HTMLDivElement>();
  const [burst, setBurst] = useState(0);
  const flowers = [look.flower, look.secondFlower] as const;
  // Each theme lays its parts out its own way (section-layouts.ts), and gives its own way
  const layouts = sectionLayouts(suite);
  const ways = blessings(suite);

  return (
    <div
      ref={top}
      data-suite={suite}
      data-guest={look.style}
      className="guest-themed relative isolate overflow-clip"
    >
      <FlowerDefs />
      <Welcome copy={copy} lang={lang} look={look} photos={welcome} />
      <GiveFlowers
        way={ways.flowers}
        look={look}
        lang={lang}
        onGive={() => {
          if (ways.flowers === "shower") setBurst((was) => was + 1);
        }}
      />
      {main && <SaveTheDate main={main} look={look} lang={lang} layout={layouts.date} />}
      <Celebrations
        suite={suite}
        look={look}
        lang={lang}
        functions={functions}
        days={days}
        allIcsUrl={allIcsUrl}
        layouts={layouts}
        box={eventBox(suite, look.style)}
      />
      {(photos.length > 0 || family.length > 0) && (
        <Dusk
          before={welcome.length}
          photos={photos}
          family={family}
          familyLang={familyLang}
          look={look}
          lang={lang}
          layouts={layouts}
        />
      )}
      <Night copy={copy} lang={lang} look={look} way={ways.lamp} reply={reply} />
      {onScreen && <FloatingMusic music={music} />}
      <PetalShower flowers={flowers} burst={burst} />
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

/** The scenery along the foot of a section: water, a skyline, or nothing at a party. */
function Ground({ look, className }: { look: GuestLook; className?: string }) {
  if (look.style === "garden") return <span aria-hidden className={cn("guest-water", className)} />;
  if (look.style === "party") return null;
  return <PalaceSkyline className={cn("guest-skyline", className)} />;
}

/**
 * What hangs between the hours: a garland in a palace, mirror-work bunting on a
 * procession, a kasavu border by the water, coloured bulbs at a party.
 */
function Divider({ look }: { look: GuestLook }) {
  if (look.style === "garden")
    return <span aria-hidden className="guest-kasavu absolute inset-x-0 top-0" />;
  if (look.style === "procession")
    return <Bunting className="guest-garland absolute inset-x-0 top-0 h-12 w-full sm:h-16" />;
  if (look.style === "party")
    return <Festoon className="guest-festoon absolute inset-x-0 top-0 h-10 w-full sm:h-14" />;
  return (
    <Garland
      flower={look.flower}
      second={look.secondFlower}
      swags={8}
      className="guest-garland absolute inset-x-0 top-0 h-14 w-full sm:h-20"
    />
  );
}

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
  const welcome = [copy.families, copy.line].filter((text) => text.trim());
  const garden = look.style === "garden";

  return (
    <section
      aria-labelledby="guest-welcome"
      data-mood="dawn"
      data-tour="8"
      className="guest-sky relative isolate flex min-h-svh flex-col pb-28 sm:pb-36"
    >
      <Garland
        flower={look.flower}
        second={look.secondFlower}
        className="guest-garland relative z-10 h-24 w-full sm:h-32 lg:h-40"
      />
      <PetalDrift flowers={[look.flower, look.secondFlower]} />
      {look.style === "party" && <Balloons className="guest-balloons absolute inset-0 -z-10" />}
      {garden && (
        <>
          <Palm className="guest-palm absolute -start-10 bottom-8 -z-10 h-72 sm:h-96" />
          <Palm flip className="guest-palm absolute -end-10 bottom-8 -z-10 h-64 sm:h-88" />
        </>
      )}
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-24 w-full sm:h-32" />

      <div className="mx-auto my-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-4 sm:gap-12 sm:px-6 sm:pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
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
          <div lang={lang} className="flex max-w-md flex-col gap-2 text-lg text-ink-muted">
            {welcome.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          {copy.date && (
            <p lang={lang} className="guest-date-chip font-display text-xl text-ink">
              {copy.date}
            </p>
          )}
        </Reveal>

        {photos.length === 1 && (
          <Reveal className="mx-auto w-[min(64vw,22rem,calc(40svh*0.8))] lg:me-8">
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
          <Reveal className="mx-auto flex w-full max-w-[28rem] items-start justify-center gap-5 sm:gap-8 lg:me-8">
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

function SaveTheDate({
  main,
  look,
  lang,
  layout,
}: {
  main: { date: string; venue: string };
  look: GuestLook;
  lang: CardLanguage;
  layout: SectionLayouts["date"];
}) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const day = parseISO(main.date);
  const [ref, seen] = useInView<HTMLDivElement>("0px 0px -20% 0px");
  const mounted = useMounted();
  const month = cardMonth(main.date, lang);
  const weekday = new Intl.DateTimeFormat(`${lang}-IN`, { weekday: "narrow", timeZone: "UTC" });
  const longDay = new Intl.DateTimeFormat(`${lang}-IN`, { weekday: "long", timeZone: "UTC" });
  const reveal = mounted ? (seen ? "in" : "wait") : undefined;
  return (
    <section
      aria-labelledby="guest-save-date"
      data-mood="day"
      data-tour="8"
      data-layout={layout}
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6 sm:py-20"
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
          <div className="guest-date-disc relative grid aspect-square w-[48%] place-content-center rounded-full text-center">
            <p className="font-label text-[0.7rem] tracking-[0.25em] text-accent-text uppercase sm:text-xs">
              {month}
            </p>
            <p className="font-display text-[3.4rem] leading-none text-ink tabular-nums sm:text-[4.5rem]">
              {format(day, "d")}
            </p>
            <p className="font-label text-sm tracking-[0.3em] text-accent-text">
              {format(day, "yyyy")}
            </p>
          </div>
        </div>
      )}
      {layout === "calendar" && (
        // A page torn from the month's calendar, the day ringed in flowers
        <div
          ref={ref}
          data-reveal={reveal}
          lang={lang}
          className="guest-reveal guest-card guest-calendar mx-auto mt-10 w-[min(88vw,24rem)] px-5 pt-6 pb-7"
        >
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
            {longDay.format(new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())))},{" "}
            {format(day, "d")} {month}
          </p>
        </div>
      )}
      {layout === "ticket" && (
        // A ticket to the day: the date large on the stub, the place on the counterfoil
        <div
          ref={ref}
          data-reveal={reveal}
          lang={lang}
          className="guest-reveal guest-ticket mx-auto mt-10 grid w-[min(92vw,30rem)] grid-cols-[auto_1fr] items-stretch"
        >
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
              {longDay.format(new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())))}
            </p>
            <p className="font-display text-2xl leading-tight text-ink tabular-nums">
              {format(day, "yyyy")}
            </p>
            {main.venue && <p className="text-sm text-balance text-ink-muted">{main.venue}</p>}
          </div>
        </div>
      )}
      {main.venue && layout !== "ticket" && (
        <p className="mt-8 text-center font-display text-2xl text-balance text-ink">{main.venue}</p>
      )}
    </section>
  );
}

/** Each celebration in its own hour of the day, under its own painting from the theme. */
function Celebrations({
  suite,
  look,
  lang,
  functions,
  days,
  allIcsUrl,
  layouts,
  box,
}: {
  suite: SuiteId;
  look: GuestLook;
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  days: Readonly<Partial<Record<FunctionId, string>>>;
  allIcsUrl: string | null;
  layouts: SectionLayouts;
  /** The theme's box for each celebration's details (event-boxes.ts). */
  box: Box;
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const images = SUITES[suite].images;
  const plan = layouts.plan;
  // On a timeline the thread itself is the day's plan, so the list above it is left out
  const line = layouts.hours === "timeline";
  return (
    <section aria-labelledby="guest-functions" className="relative isolate">
      <div
        data-mood="day"
        data-tour={functions.length > 1 ? "6" : undefined}
        className={cn(
          "guest-sky guest-sky-flat px-4 pt-4 pb-10 sm:px-6",
          // With more than one celebration, the day's plan fills a screen of its own first
          functions.length > 1 && "flex min-h-svh flex-col justify-center py-16",
        )}
      >
        <Heading
          id="guest-functions"
          lang={lang}
          label={cardWords.eventsLabel}
          title={cardWords.celebrations}
        />
        {functions.length > 1 && !line && (
          <Reveal
            className={cn("mx-auto mt-8 w-full", plan === "tiles" ? "max-w-2xl" : "max-w-md")}
          >
            <ol
              lang={lang}
              data-layout={plan}
              className={cn(
                "guest-stagger",
                plan === "cards" && "flex flex-col gap-3",
                plan === "timeline" && "guest-timeline flex flex-col gap-1 ps-2",
                plan === "tiles" && "grid grid-cols-2 gap-3 sm:grid-cols-3",
              )}
            >
              {functions.map((fn) => (
                <li key={fn.kind} className={cn(plan === "timeline" && "relative ps-9")}>
                  {plan === "timeline" && (
                    <span aria-hidden className="guest-timeline-dot absolute start-0 top-4" />
                  )}
                  <a
                    href={`#fn-${fn.kind}`}
                    className={cn(
                      "flex min-h-14 flex-col gap-0.5 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-still:transition-none motion-still:hover:translate-y-0",
                      plan === "cards" && "guest-card items-center px-5 py-3 text-center",
                      plan === "timeline" && "rounded-xl px-2 py-2.5 text-start",
                      plan === "tiles" &&
                        "guest-card guest-tile h-full items-center justify-center px-3 py-5 text-center",
                    )}
                  >
                    <span className="max-w-full font-display text-xl leading-tight break-words text-ink">
                      {fn.name}
                    </span>
                    {(fn.date || fn.time) && (
                      <span className="text-sm text-ink-muted">
                        {[fn.date, fn.time].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
        {line && (
          <Timeline
            look={look}
            box={box}
            images={images}
            lang={lang}
            functions={functions}
            days={days}
          />
        )}
        {allIcsUrl && (
          <div className="mt-6 flex justify-center">
            <Button asChild variant="secondary" className="rounded-full">
              <a href={allIcsUrl} download>
                <CalendarPlus aria-hidden />
                {guestCopy.addAll}
              </a>
            </Button>
          </div>
        )}
      </div>
      {!line && (
        <ol data-layout={layouts.hours}>
          {functions.map((fn, index) => {
            const { art, mood } = pageLook(fn.kind);
            const image = images[art] ?? images.cover;
            const headingId = `fn-${fn.kind}`;
            const overlay = layouts.hours === "overlay" && Boolean(image);
            // Zigzag: every other hour sets its painting on the far side
            const flipped = layouts.hours === "zigzag" && index % 2 === 1;
            return (
              <li
                key={fn.kind}
                data-mood={mood}
                data-tour="8"
                className="guest-sky guest-hour relative isolate flex min-h-svh flex-col justify-center px-4 pt-6 pb-16 sm:px-6 sm:pb-20"
              >
                <Divider look={look} />
                {overlay && image && (
                  // The hour's painting fills the screen, the card held over it
                  <div aria-hidden className="guest-hour-backdrop absolute inset-0 -z-10">
                    <Image
                      src={image}
                      alt=""
                      fill
                      unoptimized
                      sizes="100vw"
                      className="object-cover object-[50%_40%]"
                    />
                  </div>
                )}
                <Reveal
                  className={cn(
                    "guest-hour-body mx-auto grid w-full items-center gap-6 pt-12 sm:gap-10 md:pt-16",
                    overlay ? "max-w-lg" : "max-w-5xl md:grid-cols-2 md:gap-14",
                  )}
                >
                  {image && !overlay && (
                    <Framed
                      look={look}
                      className={cn(
                        "guest-hour-art mx-auto w-[min(60vw,20rem,calc(34svh*0.8))] md:w-[min(68vw,20rem)]",
                        flipped && "md:order-2",
                      )}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 48rem) 20rem, 68vw"
                        className="object-cover object-[50%_40%]"
                      />
                    </Framed>
                  )}
                  <EventBox
                    box={box}
                    fn={fn}
                    day={days[fn.kind] ?? ""}
                    index={index}
                    count={functions.length}
                    lang={lang}
                    headingId={headingId}
                  />
                </Reveal>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

/**
 * Every celebration on one thread through the day (guest-sections.css): a bead with the
 * hour's painting at each box, and on wider screens the day and time across the thread.
 */
function Timeline({
  look,
  box,
  images,
  lang,
  functions,
  days,
}: {
  look: GuestLook;
  box: Box;
  images: (typeof SUITES)[SuiteId]["images"];
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  days: Readonly<Partial<Record<FunctionId, string>>>;
}) {
  return (
    <ol
      lang={lang}
      data-layout="timeline"
      className="guest-line mx-auto mt-10 flex w-full max-w-5xl flex-col gap-12 sm:gap-16"
    >
      {functions.map((fn, index) => {
        const { art, mood } = pageLook(fn.kind);
        const image = images[art] ?? images.cover;
        // Wider screens set every other box on the far side of the thread
        const far = index % 2 === 1;
        return (
          <li
            key={fn.kind}
            data-mood={mood}
            className="guest-hour relative grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 md:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] md:gap-x-8"
          >
            <span
              aria-hidden
              className="guest-line-bead relative col-start-1 row-start-1 md:col-start-2 md:mt-6"
            >
              {image && <Image src={image} alt="" fill sizes="5.5rem" className="object-cover" />}
            </span>
            {/* Across the thread: the day and time, and wider, the hour's painting under them */}
            <div
              className={cn(
                "col-start-2 row-start-1 flex flex-col gap-6 md:row-start-1 md:mt-6",
                far ? "md:col-start-1 md:items-end md:text-end" : "md:col-start-3",
              )}
            >
              {(fn.date || fn.time) && (
                <p className="flex min-h-12 flex-col justify-center md:min-h-22">
                  <span className="font-display text-xl leading-tight text-ink md:text-2xl">
                    {fn.date}
                  </span>
                  {fn.time && <span className="text-sm text-ink">{fn.time}</span>}
                </p>
              )}
              {image && (
                <Framed look={look} className="hidden w-[min(100%,12rem)] md:block">
                  <Image src={image} alt="" fill sizes="12rem" className="object-cover" />
                </Framed>
              )}
            </div>
            <Reveal
              className={cn(
                "col-span-2 col-start-1 row-start-2 md:col-span-1 md:row-start-1",
                far ? "md:col-start-3" : "md:col-start-1",
              )}
            >
              <EventBox
                box={box}
                fn={fn}
                day={days[fn.kind] ?? ""}
                index={index}
                count={functions.length}
                lang={lang}
                headingId={`fn-${fn.kind}`}
              />
            </Reveal>
          </li>
        );
      })}
    </ol>
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
function Dusk({
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

/** Night: lamps the guest lights for the couple, the blessing, and the reply. */
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
      data-mood="dawn"
      data-tour="8"
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6"
    >
      <PetalDrift flowers={[look.secondFlower, look.flower]} count={8} />
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

function Night({
  copy,
  lang,
  look,
  way,
  reply,
}: {
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  way: LampBlessing;
  reply: ReactNode;
}) {
  const { guestCopy, rsvpCopy } = useGuestText();
  const words = guestCopy.themed;
  const light = words.lights[way];
  const cardWords = CARD_THEMED_WORDS[lang];
  const [lit, setLit] = useState(false);
  return (
    <div
      data-mood="night"
      data-lit={lit || undefined}
      className="guest-sky guest-night relative isolate pb-10"
    >
      <Festoon className="guest-festoon h-12 w-full sm:h-16" />
      <section
        aria-label={words.lampsLabel}
        data-tour="7"
        className="relative flex min-h-svh flex-col justify-center px-4 pt-10 pb-6 sm:px-6"
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
      {reply && (
        <section
          id="rsvp"
          aria-labelledby="guest-rsvp"
          data-tour="end"
          className="relative flex min-h-svh scroll-mt-4 flex-col justify-center px-4 pt-6 pb-12 sm:px-6 sm:pb-16"
        >
          <Reveal className="guest-card mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-9 sm:px-10">
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
      )}
      <p
        lang={lang}
        data-snap
        className="relative px-6 pt-10 pb-40 text-center font-display text-xl text-balance text-ink-muted sm:pb-48"
      >
        {cardWords.closing}
      </p>
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-28 w-full sm:h-36" />
    </div>
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
