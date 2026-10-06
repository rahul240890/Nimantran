"use client";

import { ChevronDown, DoorOpen, MailCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import { StoryPlayer } from "@/components/invitation/story/story-player";
import { musicMuted, type RagaMusic } from "@/components/invitation/use-raga-music";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { uiText } from "@/i18n/copy/ui";
import { cn } from "@/lib/cn";
import type { PageType } from "@/lib/editor/type";
import type { StoryBeat } from "@/lib/engine/story";
import type { OpeningGod, OpeningStyle } from "@/lib/opening/catalog";
import { daysBetween, remaining, todayInIndia } from "@/lib/publish/countdown";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import { lettering, type TypeRole } from "@/lib/suites/lettering";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { CARD_COUNTDOWN_WORDS, CARD_GREETING_WORDS, daysAway } from "@/lib/templates/story-words";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { GodCrest, LotusBloom, OPENING_LAYOUT, OpeningArt, OpeningPetals } from "./opening-art";

/** How long the opening takes to open before the pages come in. */
export const OPEN_MS = 1500;

const noSubscribe = () => () => {};

/** Seconds since 1970, ticking once a second (once a minute in still mode). */
function useClock(still: boolean): number | null {
  return useSyncExternalStore(
    (onTick) => {
      const timer = window.setInterval(onTick, still ? 30_000 : 1000);
      return () => window.clearInterval(timer);
    },
    () => Math.floor(Date.now() / (still ? 60_000 : 1000)) * (still ? 60 : 1),
    () => null,
  );
}

/**
 * The time left to the main event, in the card's language: days, hours, minutes and
 * seconds, turning over each second. Drawn only in the browser, since the page is cached.
 */
function Countdown({
  target,
  date,
  lang,
  label,
}: {
  /** When the main event starts, in milliseconds. */
  target: number;
  /** Its date, YYYY-MM-DD, for "Today" once it has begun. */
  date: string;
  lang: CardLanguage;
  label: string;
}) {
  const still = useReducedMotion();
  const now = useClock(still);
  const today = useSyncExternalStore(noSubscribe, todayInIndia, () => null);
  if (now === null || today === null) return null;
  const words = CARD_COUNTDOWN_WORDS[lang];
  const days = daysBetween(today, date);
  const left = remaining(target, now * 1000);
  const summary = daysAway(days, words);
  if (!summary) return null;

  if (!left) {
    return (
      <p lang={lang} className="font-display text-3xl text-card-ivory">
        {summary}
      </p>
    );
  }
  const cells = [
    [left.days, words.days],
    [left.hours, words.hours],
    [left.minutes, words.minutes],
    ...(still ? [] : [[left.seconds, words.seconds] as const]),
  ] as const;
  return (
    <div
      role="timer"
      aria-label={`${label}: ${summary}`}
      data-testid="door-countdown"
      className="flex animate-fade-in items-stretch gap-[min(0.5rem,1.8cqw)] motion-still:animate-none"
    >
      {cells.map(([value, unit]) => (
        <span
          key={unit}
          aria-hidden
          className="flex min-w-[min(4.1rem,19cqw)] flex-col items-center rounded-xl border border-card-ivory/30 bg-night/40 px-[min(0.625rem,1.6cqw)] pt-2 pb-1.5 backdrop-blur-sm [@media(max-height:640px)]:pt-1.5 [@media(max-height:640px)]:pb-1"
        >
          <span className="font-display text-[1.8rem] leading-none text-card-ivory tabular-nums [@media(max-height:640px)]:text-[1.45rem]">
            {String(value).padStart(2, "0")}
          </span>
          <span
            lang={lang}
            className={cn(
              "mt-1 text-[min(0.7rem,3.2cqw)] text-card-ivory/85",
              lang === "en" && "font-label tracking-[0.14em] uppercase",
            )}
          >
            {unit}
          </span>
        </span>
      ))}
    </div>
  );
}

/** "Dear Sharma family", in the card's language, for a guest who came by their own link. */
function GuestGreeting({ name, lang }: { name: string; lang: CardLanguage }) {
  const words = CARD_GREETING_WORDS[lang];
  return (
    <p
      lang={lang}
      className="flex max-w-full animate-[pop-in_900ms_ease-out_both] flex-col items-center gap-0.5 text-center text-card-ivory motion-still:animate-none"
    >
      <span
        className={cn(
          "text-sm text-card-ivory/85",
          lang === "en" && "font-label tracking-[0.24em] uppercase",
        )}
      >
        {words.dear}
      </span>
      <span className="max-w-[20ch] font-display text-[clamp(1.4rem,7vw,2.1rem)] leading-tight break-words">
        {name}
      </span>
      <span className="text-sm text-card-ivory/85">{words.invited}</span>
    </p>
  );
}

/** The first letters of the names, for the envelope's wax seal. */
function initials(copy: CardCopy): string {
  const first = Array.from(copy.first.trim())[0] ?? "";
  const second = Array.from(copy.second.trim())[0] ?? "";
  return second ? `${first}${second}` : first;
}

export type OpeningProps = {
  suite: SuiteId;
  style: OpeningStyle;
  god: OpeningGod | null;
  copy: CardCopy;
  lang: CardLanguage;
  languages: readonly CardLanguage[];
  onLanguage: (language: CardLanguage) => void;
  type: PageType;
  /** The main event's date and start, for the countdown; null without a date. */
  main: { date: string; at: number } | null;
  reply: { href: string; label: string } | null;
  /** The page's music, shared with the player further down. */
  music: RagaMusic;
  musicOnOpen: boolean;
  /** The guest's name when they came by their own link: the opening greets them first. */
  guest: string | null;
  /** What comes once it opens: the event pages, or (for One Scene) the page behind it. */
  after:
    | { kind: "pages"; template: Template; beats: readonly StoryBeat[]; textBox: boolean }
    | { kind: "enter"; onEnter: () => void };
};

/**
 * The guest's first screen (Step 12x): a full-height opening in the style the host chose,
 * with the god or symbol they chose top-centre, the names, and a countdown to the main
 * event. Opening it plays the style's move (doors swing, curtains gather, the flap lifts,
 * the lotus blooms), petals fall, and the invitation comes in.
 */
export function Opening({
  suite,
  style,
  god,
  copy,
  lang,
  languages,
  onLanguage,
  type,
  main,
  reply,
  music,
  musicOnOpen,
  guest,
  after,
}: OpeningProps) {
  const { guestCopy } = useText(publishText);
  const { uiStrings } = useText(uiText);
  const still = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState(false);
  const theme = SUITES[suite];
  const cover = theme.images.cover;
  const painted = style === "doors" && Boolean(cover);
  const layout = OPENING_LAYOUT[style];
  // The names in the theme's own lettering, as on the pages inside; the host's face wins
  const voice = theme.voice ?? "regal";
  const face = (role: TypeRole, own: string | undefined): CSSProperties => {
    const set = lettering(voice, role, lang);
    return {
      fontFamily: own ?? set.family,
      ...(own || !set.weight ? {} : { fontWeight: set.weight }),
      lineHeight: set.leading,
    };
  };
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;

  // The invitation follows the opening; in still mode it comes at once
  const latest = useRef(after);
  useEffect(() => {
    latest.current = after;
  });
  useEffect(() => {
    if (!open || pages) return;
    const timer = window.setTimeout(
      () => {
        const next = latest.current;
        if (next.kind === "enter") next.onEnter();
        else setPages(true);
      },
      still ? 0 : OPEN_MS,
    );
    return () => window.clearTimeout(timer);
  }, [open, pages, still]);

  const button = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current = false;
      button.current?.focus();
    }
  }, [open]);

  const enter = () => {
    setOpen(true);
    if (musicOnOpen && !music.playing && !musicMuted()) void music.play();
  };
  const leave = (hadFocus: boolean) => {
    returnFocus.current = hadFocus;
    setPages(false);
    setOpen(false);
  };

  return (
    <section
      aria-labelledby="guest-names"
      data-suite={suite}
      data-mood="dusk"
      data-doorway={open ? "open" : "closed"}
      data-opening={style}
      style={{ "--story-scale": type.scale } as CSSProperties}
      className="opening-page relative isolate flex min-h-svh items-center justify-center overflow-hidden sm:py-6"
    >
      {/* Around the frame on a wide screen: the painting softly, or the theme's own colours */}
      <div aria-hidden className="absolute inset-0 -z-10 max-sm:hidden">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover blur-2xl"
          />
        ) : null}
        <div className="opening-surround absolute inset-0" />
      </div>

      <div
        data-open={open}
        className="opening-stage [container-type:size] relative h-svh w-full overflow-hidden sm:aspect-[9/16] sm:h-[min(calc(100svh-3rem),58rem)] sm:w-auto sm:rounded-[1.75rem] sm:border sm:border-card-ivory/40 sm:shadow-overlay"
      >
        <OpeningArt style={style} cover={cover} seal={initials(copy)} />
        {open && !still && <OpeningPetals />}

        <div className="absolute inset-0 z-30 flex flex-col">
          {languages.length > 1 && (
            <div className="opening-fade absolute inset-x-0 top-0 z-10 flex justify-center pt-[max(0.75rem,env(safe-area-inset-top))]">
              <CardLanguageToggle
                label={guestCopy.cardLanguage}
                languages={languages}
                value={lang}
                onValueChange={onLanguage}
              />
            </div>
          )}

          {/* The god or symbol, top-centre, never under the words */}
          <div
            className={cn(
              "opening-crest flex flex-none items-end justify-center px-[10cqw] pb-[1.5cqh]",
              languages.length > 1 ? "pt-[max(3.75rem,8cqh)]" : "pt-[max(1.5rem,5cqh)]",
            )}
            style={{
              height:
                god || style === "envelope"
                  ? `${layout.crest + (languages.length > 1 ? 4 : 0)}%`
                  : undefined,
            }}
          >
            {god && <GodCrest god={god} />}
          </div>
          <div aria-hidden className="flex-none" style={{ height: `${layout.gap}%` }} />

          {/* The names, on a plate (drawn styles) or printed on the painting (its own doors) */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-[7cqw]">
            {style === "lotus" && <LotusBloom />}
            <div
              lang={lang}
              data-tone={painted ? "light" : undefined}
              className={cn(
                "opening-fade relative isolate flex max-h-full flex-col items-center gap-[1.2cqh] text-center text-card-ink",
                painted
                  ? "story-print w-full px-[3cqw]"
                  : "opening-plate w-auto max-w-[min(80cqw,30rem)] px-[7cqw] py-[2.2cqh]",
              )}
            >
              {painted && (
                <span
                  aria-hidden
                  className="story-print-haze absolute -inset-x-[12%] -inset-y-[18%] -z-10"
                />
              )}
              {copy.blessing && (
                <p
                  className="text-[clamp(0.85rem,4.2cqw,1.5rem)] text-card-accent-text"
                  style={face("script", type.words)}
                >
                  {copy.blessing}
                </p>
              )}
              <h1
                id="guest-names"
                className="flex flex-col items-center break-words text-card-ink"
                style={{
                  ...face("names", type.names),
                  ...(type.bold ? { fontWeight: 700 } : {}),
                  fontStyle: type.italic ? "italic" : undefined,
                  color: type.colour,
                }}
              >
                <span className="text-[length:calc(clamp(1.7rem,min(10cqw,6cqh),3.6rem)*var(--story-scale,1))]">
                  {copy.first}
                </span>{" "}
                {joiner && (
                  <>
                    <span className="text-[length:calc(clamp(1.1rem,min(6cqw,4cqh),2.2rem)*var(--story-scale,1))] text-card-accent-text">
                      {joiner}
                    </span>{" "}
                    <span className="text-[length:calc(clamp(1.7rem,min(10cqw,6cqh),3.6rem)*var(--story-scale,1))]">
                      {copy.second}
                    </span>
                  </>
                )}
              </h1>
              {copy.date && (
                <p
                  className="text-[clamp(0.85rem,3.6cqw,1.2rem)] text-card-ink-muted [font-variant-numeric:lining-nums]"
                  style={face("body", type.words)}
                >
                  {copy.date}
                </p>
              )}
            </div>
          </div>

          {/* The countdown and the way in, over the ground */}
          <div className="opening-fade flex flex-none flex-col items-center gap-3 bg-linear-to-t from-night/90 via-night/65 to-transparent px-4 pt-10 pb-[max(1rem,env(safe-area-inset-bottom))] [@media(min-height:700px)]:gap-4">
            {guest && <GuestGreeting name={guest} lang={lang} />}
            {main && (
              <Countdown
                target={main.at}
                date={main.date}
                lang={lang}
                label={guestCopy.doorway.counting}
              />
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                ref={button}
                size="lg"
                leadingIcon={<DoorOpen aria-hidden />}
                onClick={enter}
                aria-expanded={open}
                disabled={open}
              >
                {guestCopy.doorway.open}
              </Button>
              {reply && (
                <Button asChild size="lg" variant="secondary">
                  <a href={reply.href}>
                    <MailCheck aria-hidden />
                    {reply.label}
                  </a>
                </Button>
              )}
            </div>
            <a
              href="#guest-functions"
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-card-ivory/90 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            >
              {guestCopy.doorway.details}
              <ChevronDown aria-hidden className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {pages && after.kind === "pages" && (
        <StoryPlayer
          beats={after.beats}
          copy={copy}
          template={after.template}
          suite={suite}
          textBox={after.textBox}
          type={type}
          still={still}
          labels={uiStrings.invitation.story}
          lang={lang}
          reply={reply}
          music={{
            playing: music.playing,
            toggle: music.toggle,
            play: uiStrings.invitation.playMusic,
            pause: uiStrings.invitation.pauseMusic,
          }}
          onDone={leave}
        />
      )}
    </section>
  );
}

/**
 * The opening on its own, small and without words, for the host's choice in the editor:
 * it plays its opening move while chosen (and stays still in still mode).
 */
export function OpeningSample({
  suite,
  style,
  god,
  open,
  seal,
}: {
  suite: SuiteId;
  style: OpeningStyle;
  god: OpeningGod | null;
  open: boolean;
  seal: string;
}) {
  const layout = OPENING_LAYOUT[style];
  return (
    <div
      data-suite={suite}
      data-opening={style}
      className="opening-page relative aspect-[9/16] w-full overflow-hidden rounded-lg"
    >
      <div data-open={open} className="opening-stage [container-type:size] absolute inset-0">
        <OpeningArt style={style} cover={SUITES[suite].images.cover} seal={seal} />
        <div className="absolute inset-0 z-30 flex flex-col">
          <div
            className="opening-crest flex flex-none items-end justify-center px-[10cqw] pt-[5cqh] pb-[1.5cqh]"
            style={{ height: god || style === "envelope" ? `${layout.crest}%` : undefined }}
          >
            {god && <GodCrest god={god} />}
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            {style === "lotus" && <LotusBloom />}
          </div>
        </div>
      </div>
    </div>
  );
}
