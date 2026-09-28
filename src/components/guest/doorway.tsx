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
import { remaining, todayInIndia } from "@/lib/publish/countdown";
import { textArea } from "@/lib/suites/areas";
import { SUITES, paintedTone, type SuiteId } from "@/lib/suites/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { CARD_COUNTDOWN_WORDS, daysAway } from "@/lib/templates/story-words";
import { daysBetween } from "@/lib/publish/countdown";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** How long the doors take to swing open before the pages come in. */
const OPEN_MS = 1100;

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
      className="flex animate-fade-in items-stretch gap-2 motion-still:animate-none"
    >
      {cells.map(([value, unit]) => (
        <span
          key={unit}
          aria-hidden
          className="flex min-w-[4.25rem] flex-col items-center rounded-xl border border-card-ivory/30 bg-night/35 px-2.5 pt-2 pb-1.5 backdrop-blur-sm"
        >
          <span className="font-display text-[1.9rem] leading-none text-card-ivory tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
          <span
            lang={lang}
            className={cn(
              "mt-1 text-[0.7rem] text-card-ivory/85",
              lang === "en" && "font-label tracking-[0.18em] uppercase",
            )}
          >
            {unit}
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * The guest's first screen for a painted theme (Step 12o): the theme's cover painting as a
 * doorway, the couple's names printed on it in the card's language, and a countdown to the
 * main event. Opening it swings the two halves of the painting apart and the event pages
 * come in; closing the pages shuts the doors again.
 */
export function Doorway({
  suite,
  template,
  copy,
  lang,
  languages,
  onLanguage,
  beats,
  textBox,
  type,
  main,
  reply,
  music,
  musicOnOpen,
}: {
  suite: SuiteId;
  template: Template;
  copy: CardCopy;
  lang: CardLanguage;
  languages: readonly CardLanguage[];
  onLanguage: (language: CardLanguage) => void;
  beats: readonly StoryBeat[];
  textBox: boolean;
  type: PageType;
  /** The main event's date and start, for the countdown; null without a date. */
  main: { date: string; at: number } | null;
  reply: { href: string; label: string } | null;
  /** The page's music, shared with the player further down. */
  music: RagaMusic;
  musicOnOpen: boolean;
}) {
  const { guestCopy } = useText(publishText);
  const { uiStrings } = useText(uiText);
  const still = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState(false);
  const theme = SUITES[suite];
  const cover = theme.images.cover!;
  const area = textArea(suite, "cover");
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;

  // The pages follow the doors; in still mode they come at once
  useEffect(() => {
    if (!open || pages) return;
    const timer = window.setTimeout(() => setPages(true), still ? 0 : OPEN_MS);
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

  const door = (side: "left" | "right") => (
    <div
      aria-hidden
      className={cn(
        "absolute inset-y-0 w-1/2 overflow-hidden [backface-visibility:hidden]",
        "transition-transform duration-[1100ms] ease-[cubic-bezier(0.7,0,0.25,1)] motion-still:transition-none",
        side === "left" ? "left-0 origin-left" : "right-0 origin-right",
      )}
      style={{
        transform: open ? `rotateY(${side === "left" ? -104 : 104}deg)` : undefined,
      }}
    >
      <div className={cn("absolute inset-y-0 w-[200%]", side === "left" ? "left-0" : "right-0")}>
        <Image
          src={cover}
          alt=""
          fill
          priority
          sizes="(min-width: 40rem) 32rem, 100vw"
          className="object-cover"
        />
      </div>
      {/* The seam where the two halves meet */}
      <span
        className={cn(
          "absolute inset-y-0 w-px bg-card-gold/50",
          side === "left" ? "right-0" : "left-0",
        )}
      />
    </div>
  );

  return (
    <section
      aria-labelledby="guest-names"
      data-suite={suite}
      data-mood="dusk"
      data-doorway={open ? "open" : "closed"}
      style={{ "--story-scale": type.scale } as CSSProperties}
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-suite-near sm:py-6"
    >
      {/* The painting again, softly, filling a wide screen around the doorway */}
      <div aria-hidden className="absolute inset-0 -z-10 max-sm:hidden">
        <Image src={cover} alt="" fill sizes="100vw" className="scale-110 object-cover blur-2xl" />
        <div className="absolute inset-0 bg-night/45" />
      </div>

      <div className="relative h-svh w-full overflow-hidden [perspective:1600px] sm:aspect-[9/16] sm:h-[min(calc(100svh-3rem),58rem)] sm:w-auto sm:rounded-[1.75rem] sm:border sm:border-card-ivory/40 sm:shadow-overlay">
        {/* The light beyond the doors */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 70%, var(--suite-plate)), var(--suite-near))",
          }}
        />
        {door("left")}
        {door("right")}

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500 motion-still:transition-none",
            open && "pointer-events-none opacity-0",
          )}
        >
          {/* The names, printed on the painting's calm space like the pages inside */}
          <div
            className="[container-type:size] absolute flex items-center justify-center"
            style={{
              top: `${area.top}%`,
              bottom: `${area.bottom}%`,
              left: `${area.left}%`,
              right: `${area.right}%`,
            }}
          >
            <div
              lang={lang}
              data-tone={paintedTone("cover", suite)}
              className="story-print isolate flex max-h-full w-full flex-col items-center gap-[2cqmin] px-[4cqmin] text-center text-card-ink"
            >
              <span
                aria-hidden
                className="story-print-haze absolute -inset-x-[12%] -inset-y-[18%] -z-10"
              />
              {copy.blessing && (
                <p
                  className="font-display text-[clamp(1.1rem,6cqmin,2rem)] leading-tight text-card-accent-text"
                  style={type.words ? { fontFamily: type.words } : undefined}
                >
                  {copy.blessing}
                </p>
              )}
              <h1
                id="guest-names"
                className="flex flex-col items-center font-display leading-[1.02] break-words text-card-ink"
                style={{
                  fontFamily: type.names,
                  fontWeight: type.bold ? 700 : undefined,
                  fontStyle: type.italic ? "italic" : undefined,
                  color: type.colour,
                }}
              >
                <span className="text-[length:calc(clamp(2.3rem,13cqmin,4.4rem)*var(--story-scale,1))]">
                  {copy.first}
                </span>{" "}
                {joiner && (
                  <>
                    <span className="text-[length:calc(clamp(1.3rem,7cqmin,2.4rem)*var(--story-scale,1))] text-card-accent-text">
                      {joiner}
                    </span>{" "}
                    <span className="text-[length:calc(clamp(2.3rem,13cqmin,4.4rem)*var(--story-scale,1))]">
                      {copy.second}
                    </span>
                  </>
                )}
              </h1>
              {copy.date && (
                <p
                  className="text-[clamp(0.95rem,4.4cqmin,1.3rem)] text-card-ink-muted"
                  style={type.words ? { fontFamily: type.words } : undefined}
                >
                  {copy.date}
                </p>
              )}
            </div>
          </div>

          {languages.length > 1 && (
            <div className="absolute inset-x-0 top-0 flex justify-center pt-[max(0.75rem,env(safe-area-inset-top))]">
              <CardLanguageToggle
                label={guestCopy.cardLanguage}
                languages={languages}
                value={lang}
                onValueChange={onLanguage}
              />
            </div>
          )}

          {/* The countdown and the way in, over the painting's ground */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 bg-linear-to-t from-night/90 via-night/60 to-transparent px-4 pt-20 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
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

      {pages && (
        <StoryPlayer
          beats={beats}
          copy={copy}
          template={template}
          suite={suite}
          textBox={textBox}
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
