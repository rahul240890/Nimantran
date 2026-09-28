"use client";

import { format, parseISO } from "date-fns";
import { CalendarPlus, Flower2, Music, Pause } from "lucide-react";
import Image from "next/image";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { Button } from "@/components/ui/button";
import { useLocale, useText } from "@/i18n/client";
import { dateLocale } from "@/i18n/dates";
import { publishText } from "@/i18n/copy/publish";
import { cn } from "@/lib/cn";
import type { PublicPhoto } from "@/lib/invites/public";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { CardCopy } from "@/lib/templates/content";
import { FlowerDefs, FlowerFrame, Garland, PetalDrift, PetalShower } from "./flowers";
import { Festoon, FloorArt, Houseboat, Lamps, PalaceSkyline, Palm } from "./scenery";
import { useInView, useOnScreen } from "./use-in-view";

const noSubscribe = () => () => {};
/** True in the browser once hydrated: sections wait to play their entrance only there. */
const useMounted = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

type Music = { playing: boolean; toggle: () => void };

type FamilyBlock = { id: string; title: string; text: string };

/**
 * The guest page below a painted theme's pages (Step 12q). Scrolling down, the guest lives
 * through the day in the theme's own colours: a dawn welcome under a garland, where they
 * can shower the couple with flowers; the date drawn in a floor pattern by day; each
 * celebration in its own hour; photos and family at dusk; and at night, lamps to light
 * before the reply. Palace themes hang torans over arches and a skyline; garden themes
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
  lang: string;
  functions: readonly GuestFunction[];
  /** The main event's date (YYYY-MM-DD) and venue, for "Save the date". */
  main: { date: string; venue: string } | null;
  photos: readonly PublicPhoto[];
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

  return (
    <div
      ref={top}
      data-suite={suite}
      data-guest={look.style}
      className="guest-themed relative isolate overflow-hidden"
    >
      <FlowerDefs />
      <Welcome
        copy={copy}
        lang={lang}
        look={look}
        photo={photos[0]}
        onShower={() => setBurst((was) => was + 1)}
        showered={burst > 0}
      />
      {main && <SaveTheDate main={main} look={look} />}
      <Celebrations suite={suite} look={look} functions={functions} allIcsUrl={allIcsUrl} />
      {(photos.length > 0 || family.length > 0) && (
        <Dusk photos={photos} family={family} familyLang={familyLang} look={look} />
      )}
      <Night copy={copy} lang={lang} look={look} reply={reply} />
      {onScreen && <FloatingMusic music={music} />}
      <PetalShower flowers={flowers} burst={burst} />
    </div>
  );
}

/** A section's small label, a flower and its title. */
function Heading({ id, label, title }: { id?: string; label: string; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
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
  const shape = look.style === "garden" ? "ring" : "arch";
  return (
    <div className={cn("relative", className)}>
      <div data-shape={shape} className="guest-frame relative aspect-[4/5] overflow-hidden">
        {children}
      </div>
      <FlowerFrame shape={shape} flower={look.flower} second={look.secondFlower} />
    </div>
  );
}

/** The scenery along the foot of a section: a palace skyline, or water. */
function Ground({ look, className }: { look: GuestLook; className?: string }) {
  if (look.style === "garden") return <span aria-hidden className={cn("guest-water", className)} />;
  return <PalaceSkyline className={cn("guest-skyline", className)} />;
}

function Welcome({
  copy,
  lang,
  look,
  photo,
  onShower,
  showered,
}: {
  copy: CardCopy;
  lang: string;
  look: GuestLook;
  photo: PublicPhoto | undefined;
  onShower: () => void;
  showered: boolean;
}) {
  const { guestCopy } = useText(publishText);
  const words = guestCopy.themed;
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const welcome = [copy.families, copy.line].filter((text) => text.trim());
  const garden = look.style === "garden";

  return (
    <section
      aria-labelledby="guest-welcome"
      data-mood="dawn"
      className="guest-sky relative isolate pb-28 sm:pb-36"
    >
      <Garland
        flower={look.flower}
        second={look.secondFlower}
        className="guest-garland relative z-10 h-24 w-full sm:h-32 lg:h-40"
      />
      <PetalDrift flowers={[look.flower, look.secondFlower]} />
      {garden && (
        <>
          <Palm className="guest-palm absolute -start-10 bottom-8 -z-10 h-72 sm:h-96" />
          <Palm flip className="guest-palm absolute -end-10 bottom-8 -z-10 h-64 sm:h-88" />
        </>
      )}
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-24 w-full sm:h-32" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-start">
          <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
            {words.invitedTo}
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
          <div className="flex flex-col items-center gap-2 lg:items-start">
            <Button onClick={onShower} size="lg" className="rounded-full">
              <Flower2 aria-hidden />
              {words.shower}
            </Button>
            <p aria-live="polite" className="min-h-6 text-sm text-ink-muted">
              {showered ? words.showered : ""}
            </p>
          </div>
        </Reveal>

        {photo && (
          <Reveal className="mx-auto w-[min(72vw,22rem)] lg:me-8">
            <Framed look={look}>
              {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
              <img
                src={photo.url}
                alt=""
                width={photo.width}
                height={photo.height}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </Framed>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function SaveTheDate({ main, look }: { main: { date: string; venue: string }; look: GuestLook }) {
  const { guestCopy } = useText(publishText);
  const locale = useLocale();
  const words = guestCopy.themed;
  const day = parseISO(main.date);
  const [ref, seen] = useInView<HTMLDivElement>("0px 0px -20% 0px");
  const mounted = useMounted();
  return (
    <section
      aria-labelledby="guest-save-date"
      data-mood="day"
      className="guest-sky relative isolate px-4 py-16 sm:px-6 sm:py-20"
    >
      {look.style === "garden" && (
        <Houseboat className="guest-boat absolute bottom-6 -z-10 w-40 sm:w-56" />
      )}
      <Heading id="guest-save-date" label={words.saveDateLabel} title={words.saveDate} />
      <div
        ref={ref}
        data-reveal={mounted ? (seen ? "in" : "wait") : undefined}
        className="guest-medallion relative mx-auto mt-10 grid aspect-square w-[min(88vw,26rem)] place-items-center"
      >
        <FloorArt pattern={look.pattern} flower={look.flower} second={look.secondFlower} />
        <div className="guest-date-disc relative grid aspect-square w-[48%] place-content-center rounded-full text-center">
          <p className="font-label text-[0.7rem] tracking-[0.25em] text-accent-text uppercase sm:text-xs">
            {format(day, "LLLL", { locale: dateLocale[locale] })}
          </p>
          <p className="font-display text-[3.4rem] leading-none text-ink tabular-nums sm:text-[4.5rem]">
            {format(day, "d")}
          </p>
          <p className="font-label text-sm tracking-[0.3em] text-accent-text">
            {format(day, "yyyy")}
          </p>
        </div>
      </div>
      {main.venue && (
        <p className="mt-8 text-center font-display text-2xl text-balance text-ink">{main.venue}</p>
      )}
    </section>
  );
}

/** Each celebration in its own hour of the day, under its own painting from the theme. */
function Celebrations({
  suite,
  look,
  functions,
  allIcsUrl,
}: {
  suite: SuiteId;
  look: GuestLook;
  functions: readonly GuestFunction[];
  allIcsUrl: string | null;
}) {
  const { guestCopy } = useText(publishText);
  const images = SUITES[suite].images;
  return (
    <section aria-labelledby="guest-functions" className="relative isolate">
      <div data-mood="day" className="guest-sky guest-sky-flat px-4 pt-4 pb-10 sm:px-6">
        <Heading
          id="guest-functions"
          label={guestCopy.themed.eventsLabel}
          title={guestCopy.functions}
        />
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
      <ol>
        {functions.map((fn) => {
          const { art, mood } = pageLook(fn.kind);
          const image = images[art] ?? images.cover;
          const headingId = `fn-${fn.kind}`;
          return (
            <li
              key={fn.kind}
              data-mood={mood}
              className="guest-sky guest-hour relative isolate px-4 pt-6 pb-16 sm:px-6 sm:pb-20"
            >
              {look.style === "garden" ? (
                <span aria-hidden className="guest-kasavu absolute inset-x-0 top-0" />
              ) : (
                <Garland
                  flower={look.flower}
                  second={look.secondFlower}
                  swags={8}
                  className="guest-garland guest-garland-small absolute inset-x-0 top-0 h-14 w-full sm:h-20"
                />
              )}
              <Reveal className="guest-hour-body mx-auto grid w-full max-w-5xl items-center gap-10 pt-12 md:grid-cols-2 md:gap-14 md:pt-16">
                {image && (
                  <Framed look={look} className="guest-hour-art mx-auto w-[min(68vw,20rem)]">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 48rem) 20rem, 68vw"
                      className="object-cover object-[50%_40%]"
                    />
                  </Framed>
                )}
                <article
                  aria-labelledby={headingId}
                  className="guest-card flex flex-col gap-4 p-5 sm:p-7"
                >
                  <h3
                    id={headingId}
                    className="flex flex-col font-display text-[1.9rem] leading-tight text-ink"
                  >
                    {fn.name}
                    {fn.localName && (
                      <span lang={fn.localName.lang} className="font-sans text-lg text-accent-text">
                        {fn.localName.text}
                      </span>
                    )}
                  </h3>
                  <FunctionFacts fn={fn} />
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Photos and family at dusk, under hanging lamps in a palace or over the water. */
function Dusk({
  photos,
  family,
  familyLang,
  look,
}: {
  photos: readonly PublicPhoto[];
  family: readonly FamilyBlock[];
  familyLang: string | undefined;
  look: GuestLook;
}) {
  const { guestCopy } = useText(publishText);
  return (
    <div data-mood="dusk" className="guest-sky relative isolate pb-16">
      {look.style === "garden" ? (
        <span aria-hidden className="guest-kasavu absolute inset-x-0 top-0" />
      ) : (
        <Garland
          flower={look.flower}
          second={look.secondFlower}
          swags={8}
          className="guest-garland guest-garland-small absolute inset-x-0 top-0 h-14 w-full sm:h-20"
        />
      )}
      <PetalDrift flowers={[look.secondFlower, look.flower]} count={8} />
      {photos.length > 0 && (
        <section aria-labelledby="guest-photos" className="relative pt-20 pb-6">
          <div className="px-4 sm:px-6">
            <Heading
              id="guest-photos"
              label={guestCopy.themed.photosLabel}
              title={guestCopy.photos}
            />
          </div>
          {/* Scrolls sideways; focusable so a keyboard can scroll it too */}
          <div
            role="group"
            aria-labelledby="guest-photos"
            tabIndex={0}
            className="guest-gallery mt-10 snap-x snap-mandatory overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            <ul className="flex w-max gap-10 px-[max(2rem,calc(50vw-32rem))] pt-8 pb-12">
              {photos.map((photo, index) => (
                <li key={photo.id} className="guest-photo w-[min(62vw,15rem)] shrink-0 snap-center">
                  <Framed look={look}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
                    <img
                      src={photo.url}
                      alt={guestCopy.photoAlt(index + 1)}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </Framed>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {family.length > 0 && (
        <section aria-labelledby="guest-family" className="relative px-4 pt-10 sm:px-6">
          <Heading
            id="guest-family"
            label={guestCopy.themed.familyLabel}
            title={guestCopy.family}
          />
          <Reveal className="mx-auto mt-10 w-full max-w-4xl">
            <dl lang={familyLang} className="flex flex-wrap justify-center gap-6">
              {family.map((block) => (
                <div
                  key={block.id}
                  className="guest-card guest-family flex w-full flex-col items-center gap-2 px-6 py-8 text-center sm:w-[calc(50%-0.75rem)]"
                >
                  <dt className="font-label text-xs tracking-[0.25em] text-accent-text uppercase">
                    {block.title}
                  </dt>
                  <dd className="font-display text-xl break-words text-ink">{block.text}</dd>
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
function Night({
  copy,
  lang,
  look,
  reply,
}: {
  copy: CardCopy;
  lang: string;
  look: GuestLook;
  reply: ReactNode;
}) {
  const { guestCopy, rsvpCopy } = useText(publishText);
  const words = guestCopy.themed;
  const [lit, setLit] = useState(false);
  return (
    <div
      data-mood="night"
      data-lit={lit || undefined}
      className="guest-sky guest-night relative isolate pb-10"
    >
      <Festoon className="guest-festoon h-12 w-full sm:h-16" />
      <section aria-label={words.lampsLabel} className="relative px-4 pt-10 pb-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
            {words.blessingLabel}
          </p>
          {copy.blessing && (
            <p lang={lang} className="font-display text-2xl text-balance text-ink sm:text-3xl">
              {copy.blessing}
            </p>
          )}
          <div className="guest-lamps flex w-full justify-center">
            <Lamps lamp={look.lamp} flower={look.flower} />
          </div>
          <Button
            variant={lit ? "secondary" : "primary"}
            size="lg"
            onClick={() => setLit((was) => !was)}
            aria-pressed={lit}
            className="rounded-full"
          >
            {words.lamps[look.lamp]}
          </Button>
          <p aria-live="polite" className="min-h-6 text-sm text-ink-muted">
            {lit ? words.lit : ""}
          </p>
        </div>
      </section>
      {reply && (
        <section
          id="rsvp"
          aria-labelledby="guest-rsvp"
          className="relative scroll-mt-4 px-4 pt-6 pb-12 sm:px-6 sm:pb-16"
        >
          <Reveal className="guest-card mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-9 sm:px-10">
            <Heading id="guest-rsvp" label={words.replyLabel} title={rsvpCopy.heading} />
            <p className="-mt-3 text-center text-ink-muted">{rsvpCopy.intro}</p>
            {reply}
          </Reveal>
        </section>
      )}
      <p className="relative px-6 pb-40 text-center font-display text-xl text-balance text-ink-muted sm:pb-48">
        {words.closing}
      </p>
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-28 w-full sm:h-36" />
    </div>
  );
}

/** The music, one tap away while the guest reads on. */
function FloatingMusic({ music }: { music: Music }) {
  const { guestCopy } = useText(publishText);
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
      {music.playing ? (
        <Pause aria-hidden className="size-6" />
      ) : (
        <Music aria-hidden className="size-6" />
      )}
    </button>
  );
}
