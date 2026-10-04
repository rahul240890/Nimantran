"use client";

import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  MailCheck,
  Music,
  Navigation,
  Pause,
  Play,
  RectangleHorizontal,
  X,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { DecorSvg } from "@/components/invitation/art/decor-svg";
import { SYMBOLS } from "@/components/invitation/art/symbols";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import type { PageType } from "@/lib/editor/type";
import { lineDelay, type StoryBeat } from "@/lib/engine/story";
import { textArea, type TextArea } from "@/lib/suites/areas";
import { fitScale } from "@/lib/suites/fit";
import {
  ROLES,
  keepDate,
  lettering,
  lineSpace,
  roleOf,
  ruleAt,
  roleSizeCss,
  type TypeRole,
  type Voice,
} from "@/lib/suites/lettering";
import { SUITES, hasGodAtTop, paintedTone, pageLook, type SuiteId } from "@/lib/suites/catalog";
import { CONTROLS_CLEAR } from "@/lib/suites/controls";
import { PAINTING_ASPECT, photoPage } from "@/lib/suites/photo-frames";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { stockStyle } from "@/lib/templates/stock";
import { StoryScene } from "./story-scenes";
import { PageEffects } from "./page-effects";
import { PhotoArches, PhotoWindows } from "./photo-windows";
import { SuiteBackdrop } from "./suite-backdrop";
import "@/components/invitation/type/fonts.css";

export type StoryLabels = {
  story: string;
  pause: string;
  play: string;
  next: string;
  previous: string;
  skip: string;
  /** The last page's way back to the card. */
  done: string;
  directions: string;
  calendar: string;
  textBox: string;
};

type StoryPlayerProps = {
  beats: readonly StoryBeat[];
  copy: CardCopy;
  template: Template;
  /** The theme the pages are painted in (Step 12e). */
  suite?: SuiteId;
  /** A box behind the words on painted pages; off prints them on the painting. */
  textBox?: boolean;
  /** When set, the pages carry a switch for the box, so the host can compare live. */
  onTextBox?: (on: boolean) => void;
  /** The host's lettering (Step 12n); left out, the theme's own. */
  type?: PageType;
  /** Still mode: no movement and no timer; the guest steps through with Next. */
  still: boolean;
  labels: StoryLabels;
  lang?: string;
  /** The last page's button, to the reply form. */
  reply?: { href: string; label: string } | null;
  /** The card's music, so it can be paused without leaving the pages. */
  music?: { playing: boolean; toggle: () => void; play: string; pause: string } | null;
  /** `hadFocus` says whether keyboard focus was inside the pages as they closed. */
  onDone: (hadFocus: boolean) => void;
};

/* Each kind of line's ink; sizes, faces and spacing come from the lettering spec */
const LINE_COLOUR: Record<TypeRole, string> = {
  names: "text-card-ink",
  display: "text-card-ink",
  date: "text-card-ink",
  script: "text-card-accent-text",
  joiner: "text-card-accent-text",
  body: "text-card-ink-muted",
  small: "text-card-ink-muted",
  venue: "text-card-ink",
  label: "text-card-gold-text",
};

const TURN_CLASS = {
  fade: "suite-turn-fade",
  arch: "suite-turn-arch",
  sweep: "suite-turn-sweep",
  ripple: "suite-turn-ripple",
} as const;
/** How long the page underneath stays while the next one turns over it. */
const TURN_MS = 1300;

const subscribeNothing = () => () => {};

/**
 * Plays an invitation's event pages over the whole screen, one page at a time, with a
 * progress bar like a status update. Tap the right of the page (or swipe, or Next) to move
 * on, the left to go back; it pauses in a background tab. Each page sits in its theme's
 * landscape, with the words on a reading plate so they stay clear over any art.
 */
export function StoryPlayer({
  beats,
  copy,
  template,
  suite: suiteId = "classic",
  textBox = false,
  onTextBox,
  type,
  still,
  labels,
  lang,
  reply,
  music,
  onDone: onDoneProp,
}: StoryPlayerProps) {
  const suite = SUITES[suiteId];
  const themed = suite.art !== "card";
  const root = useRef<HTMLElement>(null);
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const onDone = useCallback(
    () => onDoneProp(Boolean(root.current?.contains(document.activeElement))),
    [onDoneProp],
  );

  const [turn, setTurn] = useState<{ index: number; from: number | null }>({
    index: 0,
    from: null,
  });
  const index = turn.index;
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const beat = beats[index];
  const last = index >= beats.length - 1;
  const running = !still && !paused && !hidden;

  const go = useCallback(
    (to: number) =>
      setTurn((t) =>
        to === t.index || to < 0 || to >= beats.length
          ? t
          : { index: to, from: still ? null : t.index },
      ),
    [beats.length, still],
  );
  const next = useCallback(() => {
    if (last) onDone();
    else go(index + 1);
  }, [last, onDone, go, index]);
  const previous = useCallback(() => go(index - 1), [go, index]);

  // The page underneath goes once the new one has turned over it
  useEffect(() => {
    if (turn.from === null) return;
    const timer = window.setTimeout(() => setTurn((t) => ({ ...t, from: null })), TURN_MS);
    return () => window.clearTimeout(timer);
  }, [turn]);

  // Time spent on the current page before a pause, so resuming carries on where it was
  const spent = useRef({ index: -1, ms: 0 });
  const seconds = beat?.seconds ?? 0;
  useEffect(() => {
    if (!running) return;
    const already = spent.current.index === index ? spent.current.ms : 0;
    const start = performance.now();
    // The last page stays until the guest acts, so the reply button can be pressed
    const timer = last ? null : window.setTimeout(next, Math.max(0, seconds * 1000 - already));
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      spent.current = { index, ms: already + performance.now() - start };
    };
  }, [running, index, seconds, last, next]);

  // Fetch the next page's painting ahead, so it is ready when the page turns
  const upcoming = beats[index + 1];
  const nextImage = upcoming ? pageImage(suiteId, upcoming) : undefined;
  useEffect(() => {
    if (!nextImage) return;
    const image = new Image();
    image.decoding = "async";
    image.src = nextImage;
  }, [nextImage]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // The pages cover the whole screen: take focus, and keep the page behind from scrolling
  useEffect(() => {
    if (!mounted) return;
    root.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, [mounted]);

  // A swipe turns the page; the click that follows it is ignored
  const swipe = useRef<{ x: number; y: number; swiped: boolean } | null>(null);

  if (!beat || !mounted) return null;
  const rtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";
  const look = pageLook(beat.scene);
  const pages = turn.from !== null && beats[turn.from] ? [turn.from, index] : [index];

  return createPortal(
    <section
      ref={root}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={labels.story}
      lang={lang}
      data-story-beat={beat.id}
      data-suite={suite.id}
      data-mood={look.mood}
      className={cn(
        "fixed inset-0 z-[70] flex justify-center overflow-hidden outline-none",
        themed ? "bg-suite-near" : "bg-card-back",
      )}
      style={themed ? undefined : stockStyle(template)}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          // Keep keyboard focus inside the pages while they cover the screen
          const focusable = [
            ...(root.current?.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)") ??
              []),
            // Controls hidden at this width (the narrow-phone skip icon) take no focus
          ].filter((el) => el.getClientRects().length > 0);
          const first = focusable[0];
          const final = focusable.at(-1);
          if (!first || !final) return;
          const active = document.activeElement;
          if (event.shiftKey && (active === first || active === root.current)) final.focus();
          else if (!event.shiftKey && active === final) first.focus();
          else return;
        } else if (event.key === "ArrowRight") (rtl ? previous : next)();
        else if (event.key === "ArrowLeft") (rtl ? next : previous)();
        else if (event.key === "Escape") onDone();
        else return;
        event.preventDefault();
      }}
    >
      {/* On wide screens the page's own landscape, blurred, fills the sides */}
      {themed && (
        <div aria-hidden data-mood={look.mood} className="absolute inset-0 hidden md:block">
          <SuiteBackdrop
            suite={suite}
            image={pageImage(suiteId, beat)}
            className="absolute inset-0 scale-110 opacity-70 blur-2xl"
          />
          <div className="absolute inset-0 bg-scrim/40" />
        </div>
      )}

      <div
        className="[container-type:size] relative h-full w-full overflow-hidden md:max-w-[min(100%,calc(100dvh*0.62))] md:shadow-overlay"
        onPointerDown={(event) => {
          swipe.current = { x: event.clientX, y: event.clientY, swiped: false };
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            start.swiped = true;
            // Swiping left brings the next page, as in a book (reversed right to left)
            if (dx < 0 !== rtl) next();
            else previous();
          }
        }}
        onClick={(event) => {
          if (swipe.current?.swiped) {
            swipe.current = null;
            return;
          }
          // A tap on the start third goes back, anywhere else moves on (not on the buttons)
          if ((event.target as HTMLElement).closest("button, a")) return;
          const box = event.currentTarget.getBoundingClientRect();
          const fromStart = rtl ? box.right - event.clientX : event.clientX - box.left;
          if (fromStart < box.width / 3) previous();
          else next();
        }}
      >
        {pages.map((i) => {
          const b = beats[i]!;
          const current = i === index;
          return (
            <StoryPage
              key={b.id}
              beat={b}
              copy={copy}
              suite={suiteId}
              textBox={textBox}
              type={type}
              still={still}
              reply={last && current ? reply : null}
              labels={labels}
              onReply={onDone}
              inert={!current}
              lang={lang}
              className={cn(
                current && pages.length > 1 && TURN_CLASS[suite.turn],
                !current && "pointer-events-none",
              )}
            />
          );
        })}

        {/* One bar per page: done, showing, or still to come */}
        <div
          aria-hidden
          className="absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex gap-1"
        >
          {beats.map((b, i) => (
            <span
              key={b.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-card-ivory/40 shadow-raised"
            >
              {i < index && <span className="block h-full w-full bg-card-gold" />}
              {i === index && (
                <span
                  key={`${b.id}-${still}`}
                  className={cn(
                    "block h-full w-full bg-card-gold",
                    !still && !last && "story-progress",
                  )}
                  style={
                    {
                      "--story-duration": `${b.seconds}s`,
                      animationPlayState: running ? "running" : "paused",
                    } as CSSProperties
                  }
                />
              )}
            </span>
          ))}
        </div>

        {/* Back and Next at the start; music, Pause and Skip at the end */}
        <div className="absolute inset-x-2 top-[calc(max(0.75rem,env(safe-area-inset-top))+0.75rem)] z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <IconButton
              label={labels.previous}
              icon={<ChevronLeft className="rtl:rotate-180" />}
              size="sm"
              onClick={previous}
              disabled={index === 0}
              className="bg-surface/85 backdrop-blur-sm"
            />
            {!last && (
              <IconButton
                label={labels.next}
                icon={<ChevronRight className="rtl:rotate-180" />}
                size="sm"
                onClick={next}
                className="bg-surface/85 backdrop-blur-sm"
              />
            )}
          </div>
          <div className="flex items-center gap-1">
            {onTextBox && themed && (
              <IconButton
                label={labels.textBox}
                aria-pressed={textBox}
                icon={<RectangleHorizontal />}
                size="sm"
                onClick={() => onTextBox(!textBox)}
                className={cn(
                  "backdrop-blur-sm",
                  textBox ? "bg-marigold text-on-marigold" : "bg-surface/85",
                )}
              />
            )}
            {music && (
              <IconButton
                label={music.playing ? music.pause : music.play}
                icon={music.playing ? <Pause /> : <Music />}
                size="sm"
                onClick={music.toggle}
                className="bg-surface/85 backdrop-blur-sm"
              />
            )}
            {!still && !last && (
              <IconButton
                label={paused ? labels.play : labels.pause}
                icon={paused ? <Play /> : <Pause />}
                size="sm"
                onClick={() => setPaused((p) => !p)}
                className="bg-surface/85 backdrop-blur-sm"
              />
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={onDone}
              className="bg-surface/85 backdrop-blur-sm @max-[22rem]:hidden"
            >
              {last ? labels.done : labels.skip}
            </Button>
            {/* On the narrowest phones the way back to the card is an icon, so every control fits */}
            <IconButton
              label={last ? labels.done : labels.skip}
              icon={<X />}
              size="sm"
              onClick={onDone}
              className="hidden bg-surface/85 backdrop-blur-sm @max-[22rem]:inline-flex"
            />
          </div>
        </div>
      </div>
    </section>,
    document.body,
  );
}

/** The painting behind a page: the couple's framed one on their photo page. */
function pageImage(suiteId: SuiteId, beat: StoryBeat): string | undefined {
  const frames = beat.photos?.length ? photoPage(suiteId, beat.photos.length) : null;
  return frames?.image ?? SUITES[suiteId].images[pageLook(beat.scene).art];
}

/** Places a painting's words in its calm area, clear of the controls and the phone's edges. */
function areaStyle(area: TextArea, whole = false, lifted = false): CSSProperties {
  if (lifted) {
    // The whole painting sits at the foot of the page, below the controls
    const height = `min(calc(100cqh - ${CONTROLS_CLEAR}), calc(100cqw / ${PAINTING_ASPECT}))`;
    const at = (percent: number) => `calc(100cqh - ${height} + ${height} * ${percent / 100})`;
    return {
      top: `max(calc(max(0.75rem, env(safe-area-inset-top)) + 4.25rem), ${at(area.top)})`,
      bottom: `max(calc(${height} * ${area.bottom / 100}), env(safe-area-inset-bottom))`,
      left: `${area.left}%`,
      right: `${area.right}%`,
    };
  }
  if (whole) {
    // The whole painting shows, centred: place the area on it rather than on the page
    const height = `min(100cqh, calc(100cqw / ${PAINTING_ASPECT}))`;
    const at = (percent: number) => `calc((100cqh - ${height}) / 2 + ${height} * ${percent / 100})`;
    return {
      top: `max(calc(max(0.75rem, env(safe-area-inset-top)) + 4.25rem), ${at(area.top)})`,
      bottom: `max(${at(area.bottom)}, env(safe-area-inset-bottom))`,
      left: `${area.left}%`,
      right: `${area.right}%`,
    };
  }
  return {
    top: `max(calc(max(0.75rem, env(safe-area-inset-top)) + 4.25rem), ${area.top}%)`,
    bottom: `max(${area.bottom}%, env(safe-area-inset-bottom))`,
    left: `${area.left}%`,
    right: `${area.right}%`,
  };
}

/**
 * How one line is set: the theme's voice in the line's own script (lettering.ts), the
 * host's lettering over it (Step 12n), and the space that groups it with its neighbours.
 */
function lineStyle(
  voice: Voice,
  role: TypeRole,
  lang: string | undefined,
  type: PageType | undefined,
  space: number,
): CSSProperties {
  const set = lettering(voice, role, lang);
  const names = ROLES[role].face === "names";
  const own = names ? type?.names : type?.words;
  const name = role === "names";
  // A face the host picked has its own proportions, so only the script's size applies
  const size = own ? set.size / set.faceSize : set.size;
  return {
    fontFamily: own ?? set.family,
    fontWeight: names && type?.bold ? 700 : own ? undefined : set.weight,
    ...(names && type?.italic ? { fontStyle: "italic" } : {}),
    fontSize: `calc(${roleSizeCss(role)} * ${size.toFixed(3)} * var(--story-scale, 1) * var(--story-fit, 1))`,
    lineHeight: set.leading,
    letterSpacing:
      name && type?.capitals ? "0.04em" : set.tracking ? `${set.tracking}em` : "normal",
    ...(set.upper || (name && type?.capitals) ? { textTransform: "uppercase" } : {}),
    ...(name && type?.colour ? { color: type.colour } : {}),
    ...(space ? { marginTop: `calc(${space}cqmin * var(--story-fit, 1))` } : {}),
  };
}

/**
 * One full-screen page: its landscape, its function scene, and its words on the plate.
 * The player shows it over the whole screen; the editor shows it inside a phone frame.
 */
export function StoryPage({
  beat,
  copy,
  suite: suiteId,
  textBox,
  type,
  still,
  reply,
  labels,
  onReply,
  inert,
  className,
  onOverflow,
  lang,
}: {
  beat: StoryBeat;
  copy: CardCopy;
  suite: SuiteId;
  textBox: boolean;
  type?: PageType;
  still: boolean;
  reply: { href: string; label: string } | null | undefined;
  labels: StoryLabels;
  onReply: () => void;
  inert: boolean;
  className?: string;
  /** Told whether the words still overflow at the smallest size, so the editor can say so. */
  onOverflow?: (overflow: boolean) => void;
  /** The card language the page is written in; a line in another language says so itself. */
  lang?: string;
}) {
  const suite = SUITES[suiteId];
  const themed = suite.art !== "card";
  const look = pageLook(beat.scene);
  // The couple's photo page uses the theme's framed painting, the photos showing through
  const photos = beat.photos ?? [];
  const frames = photos.length > 0 ? photoPage(suiteId, photos.length) : null;
  const image = frames?.image ?? suite.images[look.art];
  const painted = themed && Boolean(image);
  // Themes without one hang the photos in plain arches over the page instead
  const arches = photos.length > 0 && !frames;
  // Words print straight onto a painting unless the host asked for the box, here or for all
  const layout = beat.layout;
  const printed = painted && !(layout?.box ?? textBox);
  const sacred = beat.symbol && copy.symbol ? SYMBOLS[copy.symbol] : null;
  const delay = (i: number) =>
    still ? undefined : ({ "--story-delay": `${lineDelay(i) + 0.3}s` } as CSSProperties);
  const offset = sacred ? 1 : 0;
  const after = beat.lines.length + offset;
  // A page painted with a god near its top shows the whole painting below the controls, so
  // the buttons never cover the god
  const lifted = !frames && painted && hasGodAtTop(suiteId, look.art);
  const whole = Boolean(frames);
  // A blessing nobody wrote leaves the god's page to itself, with no empty glow
  const empty = beat.lines.length === 0 && !sacred;
  const voice = suite.voice ?? "regal";
  // A function's page sets a fine rule between its name and its day, as a printed card does
  const rule = ruleAt(beat);
  const middle = layout?.place !== "top" && layout?.place !== "bottom";
  const overflowed = useRef(onOverflow);
  useEffect(() => {
    overflowed.current = onOverflow;
  });
  const fitArea = useRef<HTMLDivElement>(null);
  const fitWords = useRef<HTMLDivElement>(null);
  const fitKey = JSON.stringify([
    beat.lines,
    type,
    printed,
    reply?.label,
    Boolean(beat.links),
    suiteId,
    lang,
  ]);
  /*
   * Sizes the words to fit the area: tries sizes until they fit its height and no word runs
   * past the width, then keeps the largest. Runs again when the words, the area or the fonts
   * change. Too many words even at the smallest size mark the page as overflowing, and only
   * then may a long word break.
   */
  useLayoutEffect(() => {
    const outer = fitArea.current;
    const inner = fitWords.current;
    if (!outer || !inner) return;
    const fit = () => {
      if (outer.clientHeight === 0) return;
      const lines = [...inner.querySelectorAll<HTMLElement>(".story-line")];
      const fits = (scale: number) => {
        inner.style.setProperty("--story-fit", String(scale));
        // The words' height from their layout, not scrollHeight: lines rising in are still
        // shifted by their animation, which scrollHeight would count
        const bottom = Math.max(0, ...lines.map((line) => line.offsetTop + line.offsetHeight));
        const height = bottom + parseFloat(getComputedStyle(inner).paddingBottom || "0");
        // Each line on its own: the glow behind printed words reaches past the edges on purpose
        return (
          height <= outer.clientHeight + 1 &&
          // The sacred symbol is drawn in its own square, so its width never decides the fit
          lines.every(
            (line) =>
              line.classList.contains("story-symbol") || line.scrollWidth <= line.clientWidth + 1,
          )
        );
      };
      delete inner.dataset.overflow;
      const { scale, overflow } = fitScale(fits);
      inner.style.setProperty("--story-fit", String(scale));
      if (overflow) inner.dataset.overflow = "true";
      overflowed.current?.(overflow);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    // Web fonts arrive after the first layout, and Indian scripts' fonts load on demand
    document.fonts?.addEventListener("loadingdone", fit);
    void document.fonts?.ready.then(fit);
    // Once the page has painted and its lines have risen in, the sizes are settled; in
    // Still mode a script's face can land between the first fit and the first frame
    let frame = requestAnimationFrame(() => (frame = requestAnimationFrame(fit)));
    inner.addEventListener("animationend", fit);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      inner.removeEventListener("animationend", fit);
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, [fitKey]);

  return (
    <div
      data-mood={look.mood}
      data-page={beat.id}
      inert={inert}
      className={cn("absolute inset-0 bg-card-ivory", className)}
      style={type ? ({ "--story-scale": type.scale } as CSSProperties) : undefined}
    >
      {themed && (
        <SuiteBackdrop
          suite={suite}
          image={image}
          seconds={still ? undefined : beat.seconds}
          className="absolute inset-0 overflow-hidden"
          contain={whole || lifted}
          lifted={lifted}
          under={frames ? <PhotoWindows frames={frames.frames} photos={photos} /> : undefined}
        />
      )}
      {painted && !still && <PageEffects art={look.art} />}
      {/* A painting brings its own garlands and ground, so the drawn scene stays for vector pages */}
      {!painted && <StoryScene scene={beat.scene} themed={themed} />}
      {arches && <PhotoArches photos={photos} />}

      <div
        ref={fitArea}
        className={cn(
          "absolute flex flex-col items-center",
          layout?.place === "top"
            ? "justify-start"
            : layout?.place === "bottom"
              ? "justify-end"
              : "justify-center",
          empty && "invisible",
          arches
            ? "inset-x-[5%] top-[58%] bottom-[max(4%,env(safe-area-inset-bottom))]"
            : painted
              ? "[container-type:size]"
              : "inset-x-[5%] top-[calc(max(0.75rem,env(safe-area-inset-top))+4.25rem)] bottom-[max(4%,env(safe-area-inset-bottom))]",
        )}
        style={
          frames
            ? areaStyle(frames.area, true)
            : painted && !arches
              ? areaStyle(textArea(suiteId, look.art), whole, lifted)
              : undefined
        }
      >
        {/* Centred words sit a little above the middle, where the eye takes the centre to be */}
        {middle && <span aria-hidden className="min-h-0 grow-[0.8]" />}
        <div
          ref={fitWords}
          data-tone={printed ? paintedTone(look.art, suiteId) : undefined}
          className={cn(
            "story-fit relative flex max-h-full w-[min(100%,36rem)] flex-col [font-variant-numeric:lining-nums]",
            layout?.align === "start" ? "items-start text-start" : "items-center text-center",
            printed
              ? "story-print isolate px-[5cqmin] py-[6cqmin]"
              : themed &&
                  "rounded-[1.75rem] border border-card-gold/70 bg-card-ivory/90 px-[6cqmin] py-[6cqmin] shadow-overlay backdrop-blur-md",
          )}
        >
          {printed && (
            <span
              aria-hidden
              className="story-print-haze absolute -inset-x-[12%] -inset-y-[18%] -z-10"
            />
          )}
          {sacred && (
            <span
              className="story-line story-symbol mb-[1cqmin] flex size-[calc(clamp(calc(4rem*var(--type-floor,1)),22cqmin,7.5rem)*var(--story-fit,1))] shrink-0 items-center justify-center"
              style={delay(0)}
            >
              {sacred.kind === "art" ? (
                <DecorSvg
                  layers={[{ items: [{ at: [1, 1], scale: 0.92, shapes: sacred.shapes }] }]}
                  width={2}
                  height={2}
                  className="size-full"
                />
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    "block text-center text-[length:calc(clamp(calc(3.4rem*var(--type-floor,1)),20cqmin,6.5rem)*var(--story-fit,1))] leading-none whitespace-nowrap text-card-accent-text",
                    sacred.font === "display" ? "font-display" : "font-sans",
                  )}
                >
                  {sacred.text}
                </span>
              )}
            </span>
          )}
          {photos.length > 0 && (
            <p className="sr-only">{photos.map((photo) => photo.alt).join(", ")}</p>
          )}
          {beat.lines.map((line, i) => {
            const role = roleOf(beat, line.style);
            return (
              <Fragment key={i}>
                {i > 0 && i === rule && (
                  <span
                    aria-hidden
                    className="story-line story-rule mt-[calc(2.2cqmin*var(--story-fit,1))]"
                    style={delay(i + offset)}
                  />
                )}
                <p
                  lang={line.lang}
                  className={cn(
                    "story-line text-balance",
                    // Names may run the full width; reading lines keep clear of the art's edges
                    ROLES[role].face === "names" && role !== "date" ? "max-w-full" : "max-w-[88%]",
                    LINE_COLOUR[role],
                  )}
                  style={{
                    ...delay(i + offset),
                    ...lineStyle(
                      voice,
                      role,
                      line.lang ?? lang,
                      type,
                      lineSpace(beat, i, Boolean(sacred)),
                    ),
                  }}
                >
                  {role === "date" ? keepDate(line.text) : line.text}
                </p>
              </Fragment>
            );
          })}
          {beat.links && (
            <span
              className="story-line mt-[1.5cqmin] flex flex-wrap justify-center gap-2"
              style={delay(after)}
            >
              {beat.links.maps && (
                <Button asChild variant="secondary" size="sm">
                  <a href={beat.links.maps} target="_blank" rel="noopener noreferrer">
                    <Navigation aria-hidden />
                    {labels.directions}
                  </a>
                </Button>
              )}
              {beat.links.calendar && (
                <Button asChild variant="secondary" size="sm">
                  <a href={beat.links.calendar} download>
                    <CalendarPlus aria-hidden />
                    {labels.calendar}
                  </a>
                </Button>
              )}
            </span>
          )}
          {reply && (
            <span className="story-line mt-[2cqmin]" style={delay(after)}>
              <Button asChild size="lg">
                <a href={reply.href} onClick={onReply}>
                  <MailCheck aria-hidden />
                  {reply.label}
                </a>
              </Button>
            </span>
          )}
        </div>
        {middle && <span aria-hidden className="min-h-0 grow-[1.2]" />}
      </div>
    </div>
  );
}
