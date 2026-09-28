"use client";

import { format, parseISO } from "date-fns";
import { CalendarPlus, Music, Pause } from "lucide-react";
import Image from "next/image";
import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { Button } from "@/components/ui/button";
import { useLocale, useText } from "@/i18n/client";
import { dateLocale } from "@/i18n/dates";
import { publishText } from "@/i18n/copy/publish";
import { cn } from "@/lib/cn";
import type { PublicPhoto } from "@/lib/invites/public";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import { monogram, type GuestLook, type GuestStyle } from "@/lib/suites/guest-look";
import type { CardCopy } from "@/lib/templates/content";
import { LightArt, Ornament, PlayerArt, SealArt } from "./touches";
import { useInView } from "./use-in-view";

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
 * The guest page below a painted theme's pages (Step 12q), in the theme's own colours and
 * touches: a welcome to reveal and a player for the music, a string of lights to switch
 * on, the date revealed, the celebrations each under its own painting, photos in the
 * theme's frames, the family, and the reply. Every choice comes from the theme's
 * `GuestLook`, so a new theme gets all of this by naming a style.
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
  const { guestCopy, rsvpCopy } = useText(publishText);
  const words = guestCopy.themed;
  const mark = monogram(copy.first, copy.second);
  const [top, topSeen] = useInView<HTMLDivElement>("0px");

  return (
    <div
      ref={top}
      data-suite={suite}
      data-mood={look.mood}
      data-guest={look.style}
      className="guest-themed relative isolate overflow-hidden"
    >
      <Welcome copy={copy} lang={lang} look={look} mark={mark} music={music} photo={photos[0]} />
      <Lights copy={copy} lang={lang} look={look} />
      {main && <SaveTheDate main={main} look={look} />}
      <Celebrations suite={suite} style={look.style} functions={functions} allIcsUrl={allIcsUrl} />
      {photos.length > 0 && <Photos photos={photos} look={look} />}
      {family.length > 0 && <Family blocks={family} lang={familyLang} style={look.style} />}
      {reply && (
        <section
          id="rsvp"
          aria-labelledby="guest-rsvp"
          className="guest-reply relative scroll-mt-4 px-4 pt-8 pb-14 sm:px-6 sm:pb-20"
        >
          <ReplyArt suite={suite} />
          <Reveal className="relative mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-[1.75rem] border border-line bg-surface/85 px-4 py-8 shadow-float backdrop-blur-sm sm:px-10">
            <Heading
              id="guest-rsvp"
              label={words.replyLabel}
              title={rsvpCopy.heading}
              style={look.style}
            />
            <p className="-mt-3 text-center text-ink-muted">{rsvpCopy.intro}</p>
            {reply}
          </Reveal>
        </section>
      )}
      <p className="px-6 pb-12 text-center font-display text-xl text-balance text-ink-muted italic">
        {words.closing}
      </p>
      {topSeen && <FloatingMusic music={music} />}
    </div>
  );
}

/** A section's small label, the theme's ornament and its title. */
function Heading({
  id,
  label,
  title,
  style,
}: {
  id?: string;
  label: string;
  title: string;
  style: GuestStyle;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">{label}</p>
      <h2
        id={id}
        className="font-display text-[2rem] leading-tight text-balance break-words text-ink sm:text-[2.6rem]"
      >
        {title}
      </h2>
      <Ornament style={style} />
    </div>
  );
}

/** Plays its entrance (the theme's own, in globals.css) once scrolled into view. */
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

function Welcome({
  copy,
  lang,
  look,
  mark,
  music,
  photo,
}: {
  copy: CardCopy;
  lang: string;
  look: GuestLook;
  mark: string;
  music: Music;
  photo: PublicPhoto | undefined;
}) {
  const { guestCopy } = useText(publishText);
  const words = guestCopy.themed;
  const [open, setOpen] = useState(false);
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const welcome = [copy.families, copy.line].filter((text) => text.trim());

  return (
    <section
      aria-labelledby="guest-welcome"
      className="guest-welcome relative px-4 pt-16 pb-14 sm:px-6 sm:pt-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_minmax(0,22rem)_1fr]">
        <Reveal className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-start">
          <p className="font-label text-xs tracking-[0.34em] text-accent-text uppercase">
            {words.invitedTo}
          </p>
          <h2
            id="guest-welcome"
            lang={lang}
            className="font-display text-[2.6rem] leading-[1.05] break-words text-ink sm:text-[3.4rem]"
          >
            {copy.first}
            {joiner && (
              <>
                {" "}
                <span className="text-[0.6em] text-accent-text">{joiner}</span> {copy.second}
              </>
            )}
          </h2>
          <div className="guest-seal-band relative flex w-full max-w-sm flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen((was) => !was)}
              aria-expanded={open}
              aria-controls="guest-welcome-words"
              data-open={open || undefined}
              data-seal={look.seal}
              className="guest-seal relative size-28 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <SealArt kind={look.seal} monogram={mark} />
              <span className="sr-only">{words.seal[look.seal]}</span>
            </button>
            {!open && (
              <p
                aria-hidden
                className="font-label text-xs tracking-[0.3em] text-accent-text uppercase"
              >
                {words.tapToReveal}
              </p>
            )}
          </div>
          <div
            id="guest-welcome-words"
            hidden={!open}
            lang={lang}
            className="guest-unfold flex max-w-md flex-col gap-2 text-lg text-ink-muted"
          >
            {welcome.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {copy.date && <p className="font-display text-xl text-ink">{copy.date}</p>}
          </div>
        </Reveal>

        {photo ? (
          <Reveal className="mx-auto w-full max-w-[16rem] sm:max-w-[22rem]">
            <figure data-frame={look.frame} className="guest-frame guest-frame-hero">
              {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
              <img
                src={photo.url}
                alt=""
                width={photo.width}
                height={photo.height}
                decoding="async"
                className="aspect-[4/5] h-full w-full object-cover"
              />
            </figure>
          </Reveal>
        ) : (
          <div aria-hidden className="max-lg:hidden" />
        )}

        <Reveal className="mx-auto w-full max-w-[16rem] sm:max-w-xs">
          <button
            type="button"
            onClick={music.toggle}
            aria-pressed={music.playing}
            data-playing={music.playing || undefined}
            className="guest-player group flex w-full flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-surface/70 p-5 shadow-float transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-still:transition-none"
          >
            <PlayerArt kind={look.player} monogram={mark} />
            <span className="flex items-center gap-2 font-label text-xs tracking-[0.3em] text-accent-text uppercase">
              {music.playing ? (
                <Pause aria-hidden className="size-4" />
              ) : (
                <Music aria-hidden className="size-4" />
              )}
              {music.playing ? words.music.pause : words.music.play}
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/** The blessing line under a string of lights the guest switches on. */
function Lights({ copy, lang, look }: { copy: CardCopy; lang: string; look: GuestLook }) {
  const { guestCopy } = useText(publishText);
  const words = guestCopy.themed;
  const [lit, setLit] = useState(false);
  return (
    <section
      aria-label={words.blessingLabel}
      data-lit={lit || undefined}
      data-lights={look.lights}
      className="guest-lights relative px-4 pt-4 pb-14 sm:px-6"
    >
      <ul aria-hidden className="guest-light-string mx-auto flex max-w-6xl justify-between">
        {Array.from({ length: 9 }, (_, index) => (
          <li
            key={index}
            className="h-16 w-9 sm:h-20 sm:w-11"
            style={{ animationDelay: `${index * 0.18}s` }}
          >
            <LightArt kind={look.lights} index={index} />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-5 text-center">
        <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
          {words.blessingLabel}
        </p>
        {copy.blessing && (
          <p lang={lang} className="font-display text-2xl text-balance text-ink italic sm:text-3xl">
            {copy.blessing}
          </p>
        )}
        <Button
          variant="secondary"
          onClick={() => setLit((was) => !was)}
          aria-pressed={lit}
          className="rounded-full"
        >
          {words.lights[look.lights]}
        </Button>
      </div>
    </section>
  );
}

function SaveTheDate({ main, look }: { main: { date: string; venue: string }; look: GuestLook }) {
  const { guestCopy } = useText(publishText);
  const locale = useLocale();
  const words = guestCopy.themed;
  const day = parseISO(main.date);
  const [ref, seen] = useInView<HTMLDivElement>("0px 0px -25% 0px");
  const mounted = useMounted();
  return (
    <section aria-labelledby="guest-save-date" className="relative px-4 py-14 sm:px-6">
      <Heading
        id="guest-save-date"
        label={words.saveDateLabel}
        title={words.saveDate}
        style={look.style}
      />
      <div
        ref={ref}
        data-reveal={mounted ? (seen ? "in" : "wait") : undefined}
        data-kind={look.reveal}
        className="guest-date relative mx-auto mt-8 max-w-xl overflow-hidden rounded-[1.75rem] border border-line bg-surface/80 px-6 py-12 text-center shadow-float"
      >
        <p className="font-label text-sm tracking-[0.4em] text-accent-text uppercase">
          {format(day, "LLLL", { locale: dateLocale[locale] })}
        </p>
        <p className="font-display text-[5.5rem] leading-none text-ink tabular-nums">
          {format(day, "d")}
        </p>
        <p className="font-label text-lg tracking-[0.4em] text-accent-text">
          {format(day, "yyyy")}
        </p>
        {main.venue && (
          <>
            <span aria-hidden className="mx-auto my-5 block h-px w-24 bg-line-strong" />
            <p className="text-lg tracking-[0.12em] text-ink-muted italic">{main.venue}</p>
          </>
        )}
        {/* What opens to show the date: doors, a curtain, ripples or confetti */}
        <span aria-hidden className="guest-date-cover guest-date-a" />
        <span aria-hidden className="guest-date-cover guest-date-b" />
      </div>
    </section>
  );
}

/** Each celebration under its own painting from the theme. */
function Celebrations({
  suite,
  style,
  functions,
  allIcsUrl,
}: {
  suite: SuiteId;
  style: GuestStyle;
  functions: readonly GuestFunction[];
  allIcsUrl: string | null;
}) {
  const { guestCopy } = useText(publishText);
  const images = SUITES[suite].images;
  return (
    <section aria-labelledby="guest-functions" className="relative px-4 py-14 sm:px-6">
      <Heading
        id="guest-functions"
        label={guestCopy.themed.eventsLabel}
        title={guestCopy.functions}
        style={style}
      />
      {allIcsUrl && (
        <div className="mt-5 flex justify-center">
          <Button asChild variant="secondary" className="rounded-full">
            <a href={allIcsUrl} download>
              <CalendarPlus aria-hidden />
              {guestCopy.addAll}
            </a>
          </Button>
        </div>
      )}
      <ol className="guest-trail mx-auto mt-10 grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-8">
        {functions.map((fn, index) => {
          const art = images[pageLook(fn.kind).art] ?? images.cover;
          const headingId = `fn-${fn.kind}`;
          return (
            <li key={fn.kind} className="guest-stop" style={{ "--i": index } as CSSProperties}>
              <Reveal className="h-full">
                <article
                  aria-labelledby={headingId}
                  className="guest-stop-card flex h-full flex-col gap-4 border border-line bg-surface/90 p-4 shadow-float sm:p-5"
                >
                  {art && (
                    <div className="guest-stop-art relative overflow-hidden">
                      <Image
                        src={art}
                        alt=""
                        fill
                        sizes="(min-width: 64rem) 28rem, 90vw"
                        className="object-cover object-[50%_35%]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-4 px-1">
                    <h3
                      id={headingId}
                      className="flex flex-col font-display text-[1.75rem] leading-tight text-ink"
                    >
                      {fn.name}
                      {fn.localName && (
                        <span
                          lang={fn.localName.lang}
                          className="font-sans text-lg text-accent-text"
                        >
                          {fn.localName.text}
                        </span>
                      )}
                    </h3>
                    <FunctionFacts fn={fn} />
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Photos({ photos, look }: { photos: readonly PublicPhoto[]; look: GuestLook }) {
  const { guestCopy } = useText(publishText);
  return (
    <section aria-labelledby="guest-photos" className="relative py-14">
      <div className="px-4 sm:px-6">
        <Heading
          id="guest-photos"
          label={guestCopy.themed.photosLabel}
          title={guestCopy.photos}
          style={look.style}
        />
      </div>
      {/* Scrolls sideways; focusable so a keyboard can scroll it too */}
      <div
        role="region"
        aria-labelledby="guest-photos"
        tabIndex={0}
        className="guest-frames mt-10 snap-x snap-mandatory overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <ul className="flex w-max gap-6 px-[max(1rem,calc(50vw-32rem))] pt-4 pb-8">
          {photos.map((photo, index) => (
            <li key={photo.id} className="w-[min(70vw,17rem)] shrink-0 snap-center">
              <figure data-frame={look.frame} className="guest-frame">
                {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
                <img
                  src={photo.url}
                  alt={guestCopy.photoAlt(index + 1)}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Family({
  blocks,
  lang,
  style,
}: {
  blocks: readonly FamilyBlock[];
  lang: string | undefined;
  style: GuestStyle;
}) {
  const { guestCopy } = useText(publishText);
  return (
    <section aria-labelledby="guest-family" className="relative px-4 py-14 sm:px-6">
      <Heading
        id="guest-family"
        label={guestCopy.themed.familyLabel}
        title={guestCopy.family}
        style={style}
      />
      <Reveal className="mx-auto mt-10 w-full max-w-4xl">
        <dl lang={lang} className="grid gap-5 sm:grid-cols-2">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="guest-family-panel relative flex flex-col items-center gap-2 border border-line bg-surface/80 px-5 py-7 text-center shadow-raised"
            >
              <span aria-hidden className="guest-sparks" />
              <dt className="font-label text-xs tracking-[0.25em] text-accent-text uppercase">
                {block.title}
              </dt>
              <dd className="font-display text-xl break-words text-ink">{block.text}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

/** The theme's closing painting, softly, above the reply. */
function ReplyArt({ suite }: { suite: SuiteId }) {
  const image = SUITES[suite].images.reply;
  if (!image) return null;
  return (
    <div aria-hidden className="guest-reply-art absolute inset-x-0 top-0 -z-10 h-[28rem]">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover object-[50%_60%]" />
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
      className="guest-float-music fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 grid size-14 place-items-center rounded-full border border-line-strong bg-surface text-accent-text shadow-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {music.playing ? (
        <Pause aria-hidden className="size-6" />
      ) : (
        <Music aria-hidden className="size-6" />
      )}
    </button>
  );
}
