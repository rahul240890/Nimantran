"use client";

import { ChevronDown, DoorOpen, LoaderCircle, MailCheck } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import { pageImage, StoryPlayer } from "@/components/invitation/story/story-player";
import { MusicBars } from "@/components/invitation/music-bars";
import { OPEN_LEAD_S, musicMuted, type RagaMusic } from "@/components/invitation/use-raga-music";
import { Button, buttonClasses } from "@/components/ui/button";
import { useGuestText } from "@/components/guest/guest-language";
import { cn } from "@/lib/cn";
import type { PageType } from "@/lib/editor/type";
import type { StoryBeat } from "@/lib/engine/story";
import {
  bloomBeyond,
  depthBeyond,
  isBloomOpening,
  isDepthOpening,
  isFreshOpening,
  isPaintedGate,
  isThemedOpening,
  isTiedGate,
  openingNames,
  tiedBeyond,
  tiedSpec,
  welcomeScene,
  type OpeningGod,
  type OpeningStyle,
  type WelcomeScene,
} from "@/lib/opening/catalog";
import { firstGrapheme } from "@/lib/initials";
import { warmBlurs, warmPaintings } from "@/lib/paintings";
import { daysBetween, remaining, todayInIndia } from "@/lib/publish/countdown";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import { lettering, type TypeRole } from "@/lib/suites/lettering";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { CARD_COUNTDOWN_WORDS, CARD_GREETING_WORDS, daysAway } from "@/lib/templates/story-words";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { GodCrest, LotusBloom, OPENING_LAYOUT, OpeningArt, OpeningPetals } from "./opening-art";
import { freshBackdrop } from "./opening-fresh";
import { OPENING_PACE, useOpeningPace, useOpeningReady } from "./opening-pace";
import { OpeningWelcome } from "./opening-welcome";

/** How long the opening takes to open before the pages come in, at the opening's pace. */
export const OPEN_MS = 1500 * OPENING_PACE;
/**
 * A painted gate takes longer: the doors open, then the guest walks through the arch. A
 * fresh or themed opening takes as long, its painting going its own way.
 */
const GATE_OPEN_MS = 2500 * OPENING_PACE;
/** A tied gate's tie comes undone first, then its doors open (tied-gates.css). */
const TIED_OPEN_MS = 3200 * OPENING_PACE;
/** A depth opening's three frames go by one after another (depth-openings.css). */
const DEPTH_OPEN_MS = 2800 * OPENING_PACE;
/** A bloom opening's heart goes, then its rings open one after another (bloom-openings.css). */
const BLOOM_OPEN_MS = 2600 * OPENING_PACE;
/** How long the welcome stays between the opening and the invitation, unless tapped. */
export const WELCOME_MS = 4400;

const noSubscribe = () => () => {};

const QUIET_LINK =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm text-card-ivory/90 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring";

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

export type OpeningProps = {
  suite: SuiteId;
  style: OpeningStyle;
  god: OpeningGod | null;
  /** The host's own welcome scene; none picks one that suits the opening, each visit. */
  welcomeChoice?: WelcomeScene | null;
  /** Keeps the welcome up until Continue, for reviewing a scene. */
  holdWelcome?: boolean;
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
  /**
   * The pages flow on into the details below once they end: the opening closes behind them
   * and this takes the guest down the page. Without it the last page waits for the guest.
   */
  onCarryOn?: () => void;
  /**
   * Goes up by one each time the guest asks to open the invitation again (from the page
   * below): the opening plays again from the start, as if they had tapped it.
   */
  replay?: number;
  /** What comes once it opens: the event pages, or (for One Scene) the page behind it. */
  after:
    | { kind: "pages"; template: Template; beats: readonly StoryBeat[]; textBox: boolean }
    | { kind: "enter"; onEnter: () => void };
};

/** The opening's lettering for one role, in the theme's own voice; the host's face wins. */
function openingFace(suite: SuiteId, lang: CardLanguage) {
  const voice = SUITES[suite].voice ?? "regal";
  return (role: TypeRole, own: string | undefined): CSSProperties => {
    const set = lettering(voice, role, lang);
    return {
      fontFamily: own ?? set.family,
      ...(own || !set.weight ? {} : { fontWeight: set.weight }),
      lineHeight: set.leading,
    };
  };
}

/**
 * The names, never on a box over the painting: how they sit depends on the opening. The
 * guest's first screen is named by them; the editor's small copy of it is no heading.
 */
function OpeningNames({
  style,
  suite,
  copy,
  lang,
  type,
  heading = true,
}: {
  style: OpeningStyle;
  suite: SuiteId;
  copy: CardCopy;
  lang: CardLanguage;
  type: PageType;
  heading?: boolean;
}) {
  const face = openingFace(suite, lang);
  const Title = heading ? "h1" : "p";
  const id = heading ? "guest-names" : undefined;
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const namesLook = openingNames(style);
  const nameFace: CSSProperties = {
    ...face("names", type.names),
    ...(type.bold ? { fontWeight: 700 } : {}),
    fontStyle: type.italic ? "italic" : undefined,
  };
  const spoken = joiner ? `${copy.first} ${joiner} ${copy.second}` : copy.first;
  return namesLook === "print" ? (
    <div
      lang={lang}
      className="opening-fade opening-print relative isolate flex max-h-full max-w-[min(84cqw,30rem)] flex-col items-center gap-[1.2cqh] text-center text-card-ivory"
    >
      <Title id={id} className="flex flex-col items-center break-words" style={nameFace}>
        <span className="text-[length:calc(clamp(2rem,min(11.5cqw,6.6cqh),4.2rem)*var(--story-scale,1))]">
          {copy.first}
        </span>{" "}
        {joiner && (
          <>
            <span className="opening-joiner text-[length:calc(clamp(1.2rem,min(6.5cqw,4.2cqh),2.4rem)*var(--story-scale,1))]">
              {joiner}
            </span>{" "}
            <span className="text-[length:calc(clamp(2rem,min(11.5cqw,6.6cqh),4.2rem)*var(--story-scale,1))]">
              {copy.second}
            </span>
          </>
        )}
      </Title>
      {copy.date && (
        <>
          <span aria-hidden className="opening-rule" />
          <p
            className="text-[clamp(0.85rem,3.6cqw,1.2rem)] text-card-ivory/90 [font-variant-numeric:lining-nums]"
            style={face("body", type.words)}
          >
            {copy.date}
          </p>
        </>
      )}
    </div>
  ) : namesLook === "foot" ? (
    <div lang={lang} className="opening-foot flex max-w-full flex-col items-center text-center">
      <Title
        id={id}
        className="max-w-[22ch] text-[length:calc(clamp(1.5rem,min(8cqw,4.6cqh),2.4rem)*var(--story-scale,1))] leading-tight break-words text-card-ivory"
        style={nameFace}
      >
        {copy.first}
        {joiner && (
          <>
            {" "}
            <span className="opening-joiner text-[0.62em]">{joiner}</span> {copy.second}
          </>
        )}
      </Title>
      {copy.date && (
        <p
          className="mt-1 text-[clamp(0.8rem,3.4cqw,1rem)] text-card-ivory/85 [font-variant-numeric:lining-nums]"
          style={face("body", type.words)}
        >
          {copy.date}
        </p>
      )}
    </div>
  ) : namesLook === "seal" ? (
    <div lang={lang} className="flex max-w-full flex-col items-center gap-2 text-center">
      <span
        aria-hidden
        className="opening-seal grid size-[clamp(3.75rem,17cqw,5rem)] place-items-center rounded-full text-card-ivory"
        style={nameFace}
      >
        <span className="flex items-baseline gap-[0.12em] text-[clamp(1.35rem,6.5cqw,1.9rem)] leading-none">
          {firstGrapheme(copy.first.trim())}
          {joiner && (
            <>
              <span className="opening-joiner text-[0.55em]">&amp;</span>
              {firstGrapheme(copy.second.trim())}
            </>
          )}
        </span>
      </span>
      <Title
        id={id}
        className={cn(
          "max-w-[28ch] text-sm break-words text-card-ivory/90",
          lang === "en" && "font-label tracking-[0.2em] uppercase",
        )}
      >
        {spoken}
      </Title>
    </div>
  ) : (
    <Title id={id} lang={lang} className="sr-only">
      {spoken}
    </Title>
  );
}

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
  onCarryOn,
  replay = 0,
  after,
  welcomeChoice = null,
  holdWelcome = false,
}: OpeningProps) {
  const { guestCopy, invitation } = useGuestText();
  const still = useReducedMotion();
  const [asked, setAsked] = useState(false);
  const [pages, setPages] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  // The move waits for its paintings, so it never plays over empty space; still mode needn't
  const ready = useOpeningReady(stage, `${suite}/${style}`);
  const open = asked && (ready || still);
  const waiting = asked && !open;
  // Once the opening's own paintings are in, the pages' paintings load while the guest is
  // still on it, so the pages come in whole the moment it opens
  const pageBeats = after.kind === "pages" ? after.beats : null;
  useEffect(() => {
    if (ready && pageBeats) warmPaintings(pageBeats.map((beat) => pageImage(suite, beat)));
  }, [ready, pageBeats, suite]);
  // The pages' blurred copies, a few kilobytes, come at once: on a slow connection a page can
  // come in on its blurred painting while the painting itself is still on its way
  useEffect(() => {
    if (pageBeats) warmBlurs(pageBeats.map((beat) => pageImage(suite, beat)));
  }, [pageBeats, suite]);
  useOpeningPace(stage, open, still);
  const theme = SUITES[suite];
  const cover = theme.images.cover;
  const gate = isPaintedGate(style);
  const tied = isTiedGate(style);
  const depth = isDepthOpening(style);
  const bloom = isBloomOpening(style);
  const fresh = isFreshOpening(style);
  const themed = isThemedOpening(style);
  const layout = OPENING_LAYOUT[style];
  // The words in the theme's own lettering, as on the pages inside; the host's face wins
  const face = openingFace(suite, lang);

  // The invitation follows the opening; in still mode it comes at once
  const latest = useRef(after);
  useEffect(() => {
    latest.current = after;
  });
  const [welcome, setWelcome] = useState(false);
  // Which of the welcomes that suit this opening comes this time: another each visit
  const [pick, setPick] = useState(0);
  const goIn = () => {
    setWelcome(false);
    const next = latest.current;
    if (next.kind === "enter") next.onEnter();
    else setPages(true);
  };
  const goInLatest = useRef(goIn);
  useEffect(() => {
    goInLatest.current = goIn;
  });
  // Once open, a moment of welcome with the names (Step 12y); still mode goes straight in
  useEffect(() => {
    if (!open || pages || welcome) return;
    const timer = window.setTimeout(
      () => {
        if (still) return goInLatest.current();
        setPick(Math.random());
        setWelcome(true);
      },
      still
        ? 0
        : tied
          ? TIED_OPEN_MS
          : depth
            ? DEPTH_OPEN_MS
            : bloom
              ? BLOOM_OPEN_MS
              : gate || fresh || themed
                ? GATE_OPEN_MS
                : OPEN_MS,
    );
    return () => window.clearTimeout(timer);
  }, [open, pages, welcome, still, gate, tied, depth, bloom, fresh, themed]);
  useEffect(() => {
    if (!welcome || holdWelcome) return;
    const timer = window.setTimeout(() => goInLatest.current(), WELCOME_MS);
    return () => window.clearTimeout(timer);
  }, [welcome, holdWelcome]);

  const button = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current = false;
      button.current?.focus();
    }
  }, [open]);

  /*
   * Opening plays in place, on the screen the guest already has. It no longer asks the
   * browser for full screen (owner, 2026-10-25): switching to it blanks the screen until the
   * whole page has been redrawn at the new size, which a phone or laptop took 2 to 4
   * seconds to do, black, before the doors moved.
   */
  const enter = () => {
    setAsked(true);
    // Any page painting not yet on its way starts now, so no page comes in empty
    const next = latest.current;
    if (next.kind === "pages") warmPaintings(next.beats.map((beat) => pageImage(suite, beat)));
    // The music swells in with the opening (it fades up over its first seconds), its first
    // notes a moment after the doors start to move
    if (musicOnOpen && !music.playing && !musicMuted()) {
      void music.play(OPEN_LEAD_S);
    }
  };
  const leave = (hadFocus: boolean) => {
    returnFocus.current = hadFocus;
    setWelcome(false);
    setPages(false);
    setAsked(false);
  };
  // The pages are done: they close without taking focus back to the top, and the page
  // below carries on with the music still playing
  const carryOn = onCarryOn
    ? () => {
        returnFocus.current = false;
        // The music plays on under the page below, softer
        music.soften();
        setWelcome(false);
        setPages(false);
        setAsked(false);
        onCarryOn();
      }
    : undefined;

  // Opening it again from the page below: the guest's tap there has just brought them back
  // up here, so the opening plays as if tapped (the music was started from that tap)
  const enterLatest = useRef(enter);
  useEffect(() => {
    enterLatest.current = enter;
  });
  useEffect(() => {
    if (replay > 0) enterLatest.current();
  }, [replay]);

  // The names: in the painting's middle on a drawn opening, else over the ground
  const namesLook = openingNames(style);
  const names = <OpeningNames style={style} suite={suite} copy={copy} lang={lang} type={type} />;

  return (
    <section
      aria-labelledby="guest-names"
      data-snap
      data-suite={suite}
      data-mood="dusk"
      data-doorway={open ? "open" : "closed"}
      data-opening={style}
      style={{ "--story-scale": type.scale } as CSSProperties}
      data-invitation
      className="opening-page relative isolate flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Around the frame on a wide screen: the painting softly, or the theme's own colours */}
      <div aria-hidden className="absolute inset-0 -z-10 max-sm:hidden">
        {gate || tied || depth || bloom || fresh || themed || cover ? (
          <Image
            // A painted opening's own place beyond, so the wide screen matches it
            src={
              gate
                ? `/openings/gates/${style}/beyond.webp`
                : tied
                  ? tiedBeyond(style)
                  : depth
                    ? depthBeyond(style)
                    : bloom
                      ? bloomBeyond(style)
                      : fresh
                        ? freshBackdrop(style)
                        : themed
                          ? `/suites/${style}/scene.webp`
                          : (cover as string)
            }
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="scale-110 object-cover blur-2xl"
          />
        ) : null}
        <div className="opening-surround absolute inset-0" />
      </div>

      <div
        ref={stage}
        data-open={open}
        className="opening-stage [container-type:size] relative h-svh w-full overflow-hidden sm:aspect-[9/16] sm:w-auto sm:max-w-full sm:shadow-overlay"
      >
        <OpeningArt style={style} cover={cover} />
        {open && !still && <OpeningPetals />}

        <div className="absolute inset-0 z-30 flex flex-col">
          {tied && !open && (
            // A tap on the tie opens the gate too; the button below stays the way in for
            // keyboards and screen readers
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={enter}
              className="absolute left-1/2 z-10 h-[24cqw] w-[48cqw] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
              style={{ top: `${tiedSpec(style).at}%` }}
            />
          )}
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

          {/* The middle is the painting's own; only a drawn opening has the names here */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-[7cqw]">
            {style === "lotus" && <LotusBloom />}
            {namesLook === "print" && names}
          </div>

          {/* The countdown and the way in, over the ground */}
          <div className="opening-fade flex flex-none flex-col items-center gap-3 bg-linear-to-t from-night/90 via-night/65 to-transparent px-4 pt-10 pb-[max(1rem,env(safe-area-inset-bottom))] [@media(min-height:700px)]:gap-4">
            {guest && <GuestGreeting name={guest} lang={lang} />}
            {namesLook !== "print" && names}
            {main && (
              <Countdown
                target={main.at}
                date={main.date}
                lang={lang}
                label={guestCopy.doorway.counting}
              />
            )}
            <Button
              ref={button}
              size="lg"
              leadingIcon={
                waiting ? (
                  <LoaderCircle aria-hidden className="animate-spin motion-still:animate-none" />
                ) : (
                  <DoorOpen aria-hidden />
                )
              }
              onClick={enter}
              aria-expanded={open}
              aria-busy={waiting || undefined}
              disabled={open}
              // Its words wrap within the doorway on a narrow phone, in a longer language
              className="max-w-[92cqw] min-w-[min(16rem,80cqw)]"
            >
              {guestCopy.doorway.open}
            </Button>
            {/* The quieter ways on, in one line under the way in */}
            <div className="flex flex-wrap items-center justify-center gap-x-1">
              {reply && (
                <a href={reply.href} className={QUIET_LINK}>
                  <MailCheck aria-hidden className="size-4" />
                  {reply.label}
                </a>
              )}
              <a href="#guest-functions" className={QUIET_LINK}>
                {guestCopy.doorway.details}
                <ChevronDown aria-hidden className="size-4" />
              </a>
            </div>
          </div>
        </div>
        {welcome && (
          <OpeningWelcome
            scene={welcomeScene({ welcome: welcomeChoice }, style, pick)}
            // A template's own painted centre, unless the host picked a scene of their own
            centre={
              theme.centre && !welcomeChoice
                ? { src: `/suites/${suite}/centre.webp`, ...theme.centre }
                : undefined
            }
            seconds={WELCOME_MS / 1000}
            copy={copy}
            lang={lang}
            guest={guest}
            names={face("names", type.names)}
            script={face("script", type.words)}
            skip={guestCopy.doorway.skip}
            over={fresh}
            onSkip={goIn}
          />
        )}
        {/* The music's button comes in with the welcome, in the corner it keeps on the pages */}
        {welcome && (
          <button
            type="button"
            aria-pressed={music.playing}
            aria-label={music.playing ? invitation.pauseMusic : invitation.playMusic}
            onClick={music.toggle}
            className="absolute end-2 top-[calc(max(0.75rem,env(safe-area-inset-top))+0.75rem)] z-50 grid size-11 animate-fade-in place-items-center rounded-full bg-night/35 text-card-ivory backdrop-blur-sm hover:bg-night/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-still:animate-none"
          >
            <MusicBars playing={music.playing} className="size-5" />
          </button>
        )}
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
          labels={invitation.story}
          lang={lang}
          reply={reply}
          music={{
            playing: music.playing,
            toggle: music.toggle,
            play: invitation.playMusic,
            pause: invitation.pauseMusic,
          }}
          onDone={leave}
          onFinished={music.rest}
          onCarryOn={carryOn}
        />
      )}
    </section>
  );
}

/** A guest's phone, as wide as most: the editor's copy of the first screen is drawn this wide. */
const GUEST_WIDTH = 390;

/**
 * The guest's first screen, small, for the editor's preview (owner, 2026-10-25): the gate
 * the host chose with its god or symbol, the names and the way in, playing its opening move
 * while `open` (and still in still mode). It is drawn at a guest phone's width and shrunk
 * to the space it has, so every word keeps its true share of the screen; nothing on it can
 * be tapped.
 */
export function OpeningPreview({
  suite,
  style,
  god,
  copy,
  lang,
  type,
  main,
  open,
  words,
}: {
  suite: SuiteId;
  style: OpeningStyle;
  god: OpeningGod | null;
  copy: CardCopy;
  lang: CardLanguage;
  type: PageType;
  /** The main event's date and start, for the countdown; null without a date. */
  main: { date: string; at: number } | null;
  open: boolean;
  /** The countdown's name and the way in's words, as guests read them. */
  words: { counting: string; open: string };
}) {
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useOpeningPace(stage, open, useReducedMotion());
  const layout = OPENING_LAYOUT[style];
  const namesLook = openingNames(style);
  const names = (
    <OpeningNames style={style} suite={suite} copy={copy} lang={lang} type={type} heading={false} />
  );
  const scale = size ? size.width / GUEST_WIDTH : 1;

  return (
    <div ref={box} aria-hidden className="absolute inset-0 overflow-hidden">
      {size && (
        <div
          data-suite={suite}
          data-mood="dusk"
          data-doorway={open ? "open" : "closed"}
          data-opening={style}
          data-invitation
          className="opening-page absolute top-0 left-0 isolate origin-top-left overflow-hidden"
          style={
            {
              width: GUEST_WIDTH,
              height: size.height / scale,
              transform: `scale(${scale})`,
              "--story-scale": type.scale,
            } as CSSProperties
          }
        >
          <div
            ref={stage}
            data-open={open}
            className="opening-stage [container-type:size] absolute inset-0"
          >
            <OpeningArt style={style} cover={SUITES[suite].images.cover} sample />
            <div className="absolute inset-0 z-30 flex flex-col">
              <div
                className="opening-crest flex flex-none items-end justify-center px-[10cqw] pt-[max(1.5rem,5cqh)] pb-[1.5cqh]"
                style={{ height: god || style === "envelope" ? `${layout.crest}%` : undefined }}
              >
                {god && <GodCrest god={god} />}
              </div>
              <div className="flex-none" style={{ height: `${layout.gap}%` }} />
              <div className="relative flex min-h-0 flex-1 items-center justify-center px-[7cqw]">
                {style === "lotus" && <LotusBloom />}
                {namesLook === "print" && names}
              </div>
              <div className="opening-fade flex flex-none flex-col items-center gap-4 bg-linear-to-t from-night/90 via-night/65 to-transparent px-4 pt-10 pb-6">
                {namesLook !== "print" && names}
                {main && (
                  <Countdown target={main.at} date={main.date} lang={lang} label={words.counting} />
                )}
                <span
                  className={buttonClasses({
                    size: "lg",
                    className: "pointer-events-none max-w-[92cqw] min-w-[min(16rem,80cqw)]",
                  })}
                >
                  <DoorOpen aria-hidden />
                  {words.open}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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
}: {
  suite: SuiteId;
  style: OpeningStyle;
  god: OpeningGod | null;
  open: boolean;
}) {
  const layout = OPENING_LAYOUT[style];
  const stage = useRef<HTMLDivElement>(null);
  useOpeningPace(stage, open, useReducedMotion());
  return (
    <div
      data-suite={suite}
      data-opening={style}
      data-invitation
      className="opening-page relative aspect-[9/16] w-full overflow-hidden rounded-lg"
    >
      <div
        ref={stage}
        data-open={open}
        className="opening-stage [container-type:size] absolute inset-0"
      >
        <OpeningArt style={style} cover={SUITES[suite].images.cover} sample />
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
