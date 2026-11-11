"use client";

import { format, parseISO } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { Image } from "@/components/ui/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { GuestFunction } from "@/components/guest/guest-view";
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
import { blessings, type LampBlessing } from "@/lib/suites/blessings";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import { eventBox, type EventBox as Box } from "@/lib/suites/event-boxes";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { SectionLayouts } from "@/lib/suites/section-layouts";
import { sectionDress, type Motif, type SectionDress } from "@/lib/suites/section-dress";
import { usePaintingBlur, warmBlurs } from "@/lib/paintings";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_THEMED_WORDS, cardMonth } from "@/lib/templates/themed-words";
import { photoWords, type PhotoWords } from "@/lib/templates/photo-words";
import type { CategoryId } from "@/lib/categories/catalog";
import { OrnateCard } from "./ornate-card";
import { FlowerDefs, FlowerFrame, Garland, PetalDrift, PetalShower } from "./flowers";
import { LampStage } from "./lamp-blessing";
import { Balloons, Bunting, Festoon, FloorArt, Houseboat, PalaceSkyline, Palm } from "./scenery";
import { useInView, useOnScreen } from "./use-in-view";
import "@/app/guest-sections.css";
import "@/app/guest-blessings.css";
import "@fontsource/cormorant-garamond/500.css";

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
  main,
  welcome,
  photos,
  family,
  familyLang,
  allIcsUrl,
  music,
  reply,
  countdown,
  onPhotoFail,
  occasion,
  seed = 0,
}: {
  suite: SuiteId;
  look: GuestLook;
  /** The card's words, in the card's language. */
  copy: CardCopy;
  /** The card's language: the page's own words follow it, like the pages above. */
  lang: CardLanguage;
  functions: readonly GuestFunction[];
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
  /** The countdown to the day, after the reply. */
  countdown?: ReactNode;
  /** A photo whose file can't be shown, so the page takes it away. */
  onPhotoFail?: (id: string) => void;
  /** The occasion, so the photos' heading speaks of it (a wedding's couple, a child's day). */
  occasion?: CategoryId;
  /** This visit's draw of the page's dress (section-dress.ts). */
  seed?: number;
}) {
  // The music button floats while the guest reads this page
  const [top, onScreen] = useOnScreen<HTMLDivElement>();
  const [burst, setBurst] = useState(0);
  const flowers = [look.flower, look.secondFlower] as const;
  // Each visit dresses the page afresh from the theme's own choices (section-dress.ts)
  const dress = sectionDress(suite, look.style, seed);
  const layouts = dress.layouts;
  const ways = blessings(suite);
  const images = SUITES[suite].images;
  // The sections lie on their paintings' blurred copies, a few kilobytes for the theme
  useEffect(() => warmBlurs(Object.values(images)), [images]);

  return (
    <div
      ref={top}
      data-suite={suite}
      data-guest={look.style}
      className="guest-themed relative isolate overflow-clip"
    >
      <FlowerDefs />
      <Welcome
        copy={copy}
        lang={lang}
        look={look}
        dress={dress}
        painting={images.cover}
        photos={welcome}
        onFail={onPhotoFail}
        // Petals fall over the couple by themselves as the welcome comes in
        onSeen={() => setBurst((was) => was + 1)}
      />
      {main && (
        <SaveTheDate
          // A new layout is a new date to watch come into view
          key={layouts.date}
          main={main}
          look={look}
          lang={lang}
          dress={dress}
          painting={images.wedding ?? images.cover}
        />
      )}
      <Celebrations
        suite={suite}
        look={look}
        lang={lang}
        functions={functions}
        allIcsUrl={allIcsUrl}
        layouts={layouts}
        dress={dress}
        box={eventBox(suite, look.style)}
      />
      {(photos.length > 0 || family.length > 0) && (
        <Dusk
          before={welcome.length}
          photoHeading={photoWords(occasion, lang)}
          photos={photos}
          family={family}
          familyLang={familyLang}
          look={look}
          lang={lang}
          layouts={layouts}
          dress={dress}
          painting={images.family ?? images.reception ?? images.cover}
          onFail={onPhotoFail}
        />
      )}
      <Night
        dress={dress}
        painting={images.reply ?? images.reception ?? images.cover}
        copy={copy}
        lang={lang}
        look={look}
        way={ways.lamp}
        reply={reply}
        countdown={countdown}
      />
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

/**
 * A section's ground: its painting from the theme blurred to a soft wash of colour under a
 * veil of the theme's paper (or its deep colour at dusk and night), the visit's motif
 * printed faintly at the edges, and on some sections a fine gilt border (guest-sections.css).
 */
function Wash({
  painting,
  motif,
  framed = false,
}: {
  painting: string | undefined;
  motif: Motif;
  framed?: boolean;
}) {
  const blur = usePaintingBlur(painting);
  return (
    <>
      <span
        aria-hidden
        data-painted={blur ? "" : undefined}
        className="guest-wash"
        style={blur ? ({ "--wash": `url("${blur}")` } as CSSProperties) : undefined}
      />
      <span aria-hidden data-motif={motif} className="guest-motif" />
      {framed && <span aria-hidden className="guest-border" />}
    </>
  );
}

/** Plays its entrance (the style's own, in globals.css) once scrolled into view. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
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

/** The first letter of a name as a reader sees it (a whole Devanagari syllable, say). */
function initial(name: string): string {
  const text = name.trim();
  if (!text) return "";
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const [first] = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text);
    return first?.segment ?? "";
  }
  return Array.from(text)[0] ?? "";
}

function Welcome({
  copy,
  lang,
  look,
  dress,
  painting,
  photos,
  onFail,
  onSeen,
}: {
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  dress: SectionDress;
  /** The theme's cover, whose colours the welcome lies on. */
  painting: string | undefined;
  /** The couple together, or one each, by the names in the card's order. */
  photos: readonly GuestPhoto[];
  onFail?: (id: string) => void;
  /** Once, when the welcome first comes into view. */
  onSeen?: () => void;
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const welcome = [copy.families, copy.line].filter((text) => text.trim());
  const garden = look.style === "garden";
  const layout = dress.welcome;
  const [seenRef, seen] = useInView<HTMLElement>("0px 0px -30% 0px");
  const latestSeen = useRef(onSeen);
  useEffect(() => {
    latestSeen.current = onSeen;
  });
  useEffect(() => {
    if (seen) latestSeen.current?.();
  }, [seen]);

  const label = (
    <p lang={lang} className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
      {cardWords.invitedTo}
    </p>
  );
  const words = (
    <div lang={lang} className="flex max-w-md flex-col gap-2 text-lg text-ink-muted">
      {welcome.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
  const date = copy.date && (
    <p lang={lang} className="guest-date-chip font-display text-xl text-ink">
      {copy.date}
    </p>
  );
  const names = (
    <h2
      id="guest-welcome"
      lang={lang}
      className={cn(
        "font-display leading-[1.02] break-words text-ink",
        layout === "monogram"
          ? "text-[2.25rem] sm:text-[3rem]"
          : "text-[2.75rem] sm:text-[3.75rem]",
      )}
    >
      {copy.first}
      {joiner && (
        <>
          <span
            className={cn(
              "text-[0.5em] leading-snug text-accent-text",
              layout === "monogram" ? "mx-3 inline-block" : "block",
            )}
          >
            {joiner}
          </span>
          {layout === "monogram" ? " " : null}
          {copy.second}
        </>
      )}
    </h2>
  );
  // One photo in its frame, or one each side by side, each over its own name
  const shown =
    photos.length === 1 ? (
      <Reveal
        className={cn(
          "mx-auto",
          layout === "card"
            ? "w-[min(46vw,13rem,calc(30svh*0.8))] lg:w-[min(24rem,calc(60svh*0.8))]"
            : "w-[min(64vw,22rem,calc(40svh*0.8))] lg:me-8",
        )}
      >
        <Framed look={look}>
          <FramedPhoto
            photo={{ src: photos[0]!.url, alt: "", fit: photos[0]!.fit }}
            alt={guestCopy.photoAlt(1)}
            onFail={onFail && (() => onFail(photos[0]!.id))}
            frameAspect={GALLERY_ASPECT}
            className="size-full"
          />
        </Framed>
      </Reveal>
    ) : photos.length > 1 ? (
      <Reveal
        className={cn(
          "mx-auto flex w-full items-start justify-center gap-5 sm:gap-8",
          layout === "card" ? "max-w-[20rem] lg:max-w-[28rem]" : "max-w-[28rem] lg:me-8",
        )}
      >
        {photos.slice(0, 2).map((photo, index) => {
          const name = index === 0 ? copy.first : copy.second;
          return (
            <figure
              key={photo.id}
              className={cn(
                "flex min-w-0 flex-col items-center gap-4",
                layout === "card"
                  ? "w-[min(34vw,9rem,calc(26svh*0.8))] lg:w-[min(13rem,calc(48svh*0.8))]"
                  : "w-[min(40vw,15rem,calc(34svh*0.8))]",
                index === 1 && layout !== "card" && "mt-12 sm:mt-16",
              )}
            >
              <Framed look={look} className="w-full">
                <FramedPhoto
                  photo={{ src: photo.url, alt: "", fit: photo.fit }}
                  alt={guestCopy.photoAlt(index + 1)}
                  frameAspect={GALLERY_ASPECT}
                  onFail={onFail && (() => onFail(photo.id))}
                  className="size-full"
                />
              </Framed>
              {name.trim() && layout !== "card" && (
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
    ) : null;

  return (
    <section
      ref={seenRef}
      aria-labelledby="guest-welcome"
      data-mood="dawn"
      data-tour="8"
      data-layout={layout}
      className="guest-sky relative isolate flex min-h-svh flex-col pb-28 sm:pb-36"
    >
      <Wash painting={painting} motif={dress.motif} framed={dress.framed.welcome} />
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

      {layout === "arch" && (
        <div className="mx-auto my-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-4 sm:gap-12 sm:px-6 sm:pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="guest-stagger flex flex-col items-center gap-4 text-center sm:gap-5 lg:items-start lg:text-start">
            {label}
            {names}
            {words}
            {date}
          </Reveal>
          {shown}
        </div>
      )}

      {/* The names on a printed card held over the cover's colours, the photo above it */}
      {layout === "card" && (
        <div className="mx-auto my-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 pt-2 sm:px-6 lg:max-w-5xl lg:flex-row lg:justify-center lg:gap-14">
          {shown}
          <Reveal className="guest-invite-card guest-stagger flex w-full flex-col items-center gap-4 px-6 py-9 text-center sm:px-10 sm:py-11 lg:max-w-lg">
            {label}
            {names}
            {words}
            {date}
          </Reveal>
        </div>
      )}

      {/* Their initials in a gilt ring, the names in one line under it, the photos beside */}
      {layout === "monogram" && (
        <div className="mx-auto my-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-2 sm:gap-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="hidden lg:block">{shown}</div>
          <Reveal className="guest-stagger flex flex-col items-center gap-4 text-center sm:gap-5">
            <span aria-hidden lang={lang} className="guest-monogram font-display">
              <span>{initial(copy.first)}</span>
              {copy.second.trim() && (
                <>
                  <span className="guest-monogram-bar" />
                  <span>{initial(copy.second)}</span>
                </>
              )}
            </span>
            {label}
            {names}
            {words}
            {date}
          </Reveal>
          <div className="lg:hidden">{shown}</div>
        </div>
      )}
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
  dress,
  painting,
}: {
  main: { date: string; venue: string };
  look: GuestLook;
  lang: CardLanguage;
  dress: SectionDress;
  painting: string | undefined;
}) {
  const layout = dress.layouts.date;
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
      data-mood={dress.deepDate ? "dusk" : "day"}
      data-tour="8"
      data-layout={layout}
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6 sm:py-20"
    >
      <Wash painting={painting} motif={dress.motif} framed={dress.framed.date} />
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
  allIcsUrl,
  layouts,
  dress,
  box,
}: {
  suite: SuiteId;
  look: GuestLook;
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  allIcsUrl: string | null;
  layouts: SectionLayouts;
  dress: SectionDress;
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
          "guest-sky guest-sky-flat relative isolate px-4 pt-4 pb-10 sm:px-6",
          // With more than one celebration, the day's plan fills a screen of its own first
          functions.length > 1 && "flex min-h-svh flex-col justify-center py-16",
        )}
      >
        <Wash
          painting={images.haldi ?? images.mehendi ?? images.cover}
          motif={dress.motif}
          framed={dress.framed.plan && functions.length > 1}
        />
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
          <Timeline look={look} box={box} images={images} lang={lang} functions={functions} />
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
            return (
              <li
                key={fn.kind}
                data-mood={mood}
                data-tour="8"
                className="guest-sky guest-hour relative isolate flex min-h-svh flex-col justify-center px-4 pt-6 pb-16 sm:px-6 sm:pb-20"
              >
                <Divider look={look} />
                {!overlay && <Wash painting={image} motif={dress.motif} />}
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
                {/* Each card carries its own painting; the hour's fills the screen behind it on an overlay */}
                <Reveal className="guest-hour-body mx-auto w-full max-w-lg pt-12 md:pt-16">
                  <OrnateCard
                    box={box}
                    fn={fn}
                    index={index}
                    count={functions.length}
                    headingId={headingId}
                    flower={look.flower}
                    second={look.secondFlower}
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
}: {
  look: GuestLook;
  box: Box;
  images: (typeof SUITES)[SuiteId]["images"];
  lang: CardLanguage;
  functions: readonly GuestFunction[];
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
              <OrnateCard
                box={box}
                fn={fn}
                index={index}
                count={functions.length}
                headingId={`fn-${fn.kind}`}
                flower={look.flower}
                second={look.secondFlower}
              />
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

/** A cascade photo's tilt, and which side it sways in from, by its place in the column. */
const CASCADE_TILT = [-2.5, 2, -1.5, 2.5, -2, 1.5] as const;

/**
 * One photo in a column that comes in by itself as the guest scrolls to it: a cascade's
 * photo sways in from its own side, an arch blooms open. Each watches its own place on the
 * page, so a long column plays as the guest goes down it rather than all at once.
 */
function PhotoTile({
  layout,
  index,
  className,
  style,
  children,
}: {
  layout: "cascade" | "arches";
  index: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [ref, seen] = useInView<HTMLLIElement>("0px 0px -10% 0px");
  const mounted = useMounted();
  return (
    <li
      ref={ref}
      data-reveal={mounted ? (seen ? "in" : "wait") : undefined}
      data-side={index % 2 === 0 ? "start" : "end"}
      className={cn(layout === "cascade" ? "guest-cascade" : "guest-arch-tile", className)}
      style={style}
    >
      {children}
    </li>
  );
}

/** Photos and family at dusk, under hanging lamps in a palace or over the water. */
function Dusk({
  before,
  photoHeading,
  photos,
  family,
  familyLang,
  look,
  lang,
  layouts,
  dress,
  painting,
  onFail,
}: {
  /** How many photos the welcome already shows, so these count on from there. */
  before: number;
  /** The words over the photos, for the occasion (photo-words.ts). */
  photoHeading: PhotoWords;
  photos: readonly GuestPhoto[];
  family: readonly FamilyBlock[];
  familyLang: string | undefined;
  look: GuestLook;
  lang: CardLanguage;
  layouts: SectionLayouts;
  dress: SectionDress;
  painting: string | undefined;
  onFail?: (id: string) => void;
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const names = useNamesFit<HTMLDListElement>(family.map((block) => block.text).join("|"));
  return (
    <div data-mood="dusk" className="guest-sky relative isolate pb-16">
      <Wash painting={painting} motif={dress.motif} />
      <Divider look={look} />
      <PetalDrift flowers={[look.secondFlower, look.flower]} count={8} />
      {photos.length > 0 && (
        <section
          aria-labelledby="guest-photos"
          data-tour="9"
          data-layout={layouts.photos}
          className="relative isolate flex min-h-svh flex-col justify-center pt-20 pb-6"
        >
          {dress.framed.photos && <span aria-hidden className="guest-border" />}
          <div className="px-4 sm:px-6">
            <Heading
              id="guest-photos"
              lang={lang}
              label={photoHeading.label}
              title={photoHeading.title}
            />
          </div>
          {(layouts.photos === "polaroids" || layouts.photos === "mosaic") && (
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
                      onFail={onFail && (() => onFail(photo.id))}
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
          {layouts.photos === "cascade" && (
            // One column down the page, each photo set a little to its own side and tilted
            <ul className="mx-auto mt-12 flex w-full max-w-2xl flex-col gap-12 px-4 pb-10 sm:gap-16 sm:px-6">
              {photos.map((photo, index) => (
                <PhotoTile
                  key={photo.id}
                  layout="cascade"
                  index={index}
                  className={cn(
                    "w-[min(76vw,20rem)]",
                    index % 2 === 0 ? "self-center sm:self-start" : "self-center sm:self-end",
                  )}
                  style={
                    { "--tilt": `${CASCADE_TILT[index % CASCADE_TILT.length]}deg` } as CSSProperties
                  }
                >
                  {/* By the water each photo bobs on its reflection (globals.css) */}
                  <div className="guest-photo">
                    <Framed look={look}>
                      <FramedPhoto
                        photo={{ src: photo.url, alt: "", fit: photo.fit }}
                        alt={guestCopy.photoAlt(index + before + 1)}
                        frameAspect={GALLERY_ASPECT}
                        lazy
                        onFail={onFail && (() => onFail(photo.id))}
                        className="size-full"
                      />
                    </Framed>
                  </div>
                </PhotoTile>
              ))}
            </ul>
          )}
          {layouts.photos === "arches" && (
            // Two rows side by side, the second set lower, like windows down a haveli's wall
            <ul className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-2 gap-x-4 gap-y-8 px-4 pb-16 sm:gap-x-10 sm:gap-y-12 sm:px-6">
              {photos.map((photo, index) => (
                <PhotoTile
                  key={photo.id}
                  layout="arches"
                  index={index}
                  className={cn(
                    // One photo alone sits in the middle; otherwise the second row steps down
                    photos.length === 1 && "col-span-2 mx-auto w-1/2",
                    index % 2 === 1 && "translate-y-10 sm:translate-y-16",
                  )}
                >
                  <div className="guest-arch-photo relative aspect-[3/4] overflow-hidden">
                    <FramedPhoto
                      photo={{ src: photo.url, alt: "", fit: photo.fit }}
                      alt={guestCopy.photoAlt(index + before + 1)}
                      frameAspect={GALLERY_ASPECT}
                      lazy
                      onFail={onFail && (() => onFail(photo.id))}
                      className="size-full"
                    />
                  </div>
                </PhotoTile>
              ))}
            </ul>
          )}
        </section>
      )}
      {family.length > 0 && (
        <section
          aria-labelledby="guest-family"
          data-tour="9"
          data-layout={layouts.family}
          className="relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6"
        >
          {dress.framed.family && <span aria-hidden className="guest-border" />}
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
                    className="font-display text-2xl text-ink"
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

/**
 * Night: the lamps light themselves for the couple as the guest comes to them (owner,
 * 2026-11-07: no taps to give), then the blessing and the reply.
 */
function Night({
  copy,
  lang,
  look,
  way,
  reply,
  countdown,
  dress,
  painting,
}: {
  dress: SectionDress;
  painting: string | undefined;
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  way: LampBlessing;
  reply: ReactNode;
  countdown?: ReactNode;
}) {
  const { guestCopy, rsvpCopy } = useGuestText();
  const words = guestCopy.themed;
  const light = words.lights[way];
  const cardWords = CARD_THEMED_WORDS[lang];
  const [lampsRef, lit] = useInView<HTMLElement>("0px 0px -35% 0px");
  return (
    <div
      data-mood="night"
      data-lit={lit || undefined}
      className="guest-sky guest-night relative isolate pb-10"
    >
      <Wash painting={painting} motif={dress.motif} />
      <Festoon className="guest-festoon h-12 w-full sm:h-16" />
      <section
        ref={lampsRef}
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
          <p className="min-h-6 text-sm text-balance text-ink-muted">{lit ? light.given : ""}</p>
        </Reveal>
      </section>
      {reply && (
        <section
          id="rsvp"
          aria-labelledby="guest-rsvp"
          data-tour="end"
          className="relative isolate flex min-h-svh scroll-mt-4 flex-col justify-center px-4 pt-6 pb-12 sm:px-6 sm:pb-16"
        >
          {dress.framed.reply && <span aria-hidden className="guest-border" />}
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
      {countdown}
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
