"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MailCheck,
  Navigation,
  Pause,
  Play,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { PageEffects } from "@/components/invitation/story/page-effects";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { StoryFunction, StoryPhoto } from "@/lib/engine/story";
import type { PageType } from "@/lib/editor/type";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import { fitScale } from "@/lib/suites/fit";
import { keepDate, type Voice } from "@/lib/suites/lettering";
import { sceneLine } from "@/lib/suites/scene-type";
import { PAINTING_ASPECT, photoBox, type FrameBox } from "@/lib/suites/photo-frames";
import { frameAspectOf } from "@/lib/editor/photo-fit";
import { FramedPhoto } from "@/components/invitation/story/framed-photo";
import {
  SCENE_HOLD_MS,
  SCENE_SWAP_MS,
  entranceFor,
  sceneLight,
  type Entrance,
  type PaintedCard,
  type Piece,
  type ScenePage,
} from "@/lib/suites/scene";
import type { CardCopy } from "@/lib/templates/content";
import "@/components/invitation/type/fonts.css";

/*
 * One Scene (pilot): the whole invitation on one painting. The photos show through the
 * painting's frames, the names and a line are printed under them, and the slot brings in
 * each function in turn from its own side, pushing the last one out the other way. The
 * painting's light follows the function in the slot: gold for a haldi morning, dusk for a
 * baraat, night with twinkling lights for a sangeet. Tap the slot to hold a function.
 * With reduced motion nothing moves by itself; the arrows step through the functions.
 */

type SceneItem = { kind: "line"; text: string } | { kind: "function"; fn: StoryFunction };

/** The function in the slot, the side it came from, and which turn brought it. */
type Shown = { index: number; from: Entrance; turn: number };

/** How the words in a box came out: their scale, and whether even the smallest overflowed. */
type Fitted = { scale: number; overflow: boolean };

/**
 * Shrinks (or grows a little) the words in `box` until `words` fits inside it, by setting
 * `--scene-fit` on `box`. When the words would have to set small, lines marked
 * `data-fit-optional` (a painted card's countdown) step aside first. Words that don't
 * fit at `min` may go down to `floor` rather than spill out; only past that may they break.
 */
function fitWords(
  box: HTMLElement,
  words: HTMLElement,
  max: number,
  min: number,
  floor: number,
): Fitted {
  // Computed sizes, to the fraction of a pixel and untouched by a card's flying transform
  const pad = getComputedStyle(box);
  const room =
    parseFloat(pad.height) -
    (pad.boxSizing === "border-box"
      ? parseFloat(pad.paddingTop || "0") + parseFloat(pad.paddingBottom || "0")
      : 0);
  const fits = (scale: number) => {
    box.style.setProperty("--scene-fit", String(scale));
    const height = parseFloat(getComputedStyle(words).height) || words.offsetHeight;
    return height <= room + 0.5 && words.scrollWidth <= words.clientWidth + 1;
  };
  const optional = [...words.querySelectorAll<HTMLElement>("[data-fit-optional]")];
  for (const line of optional) line.hidden = false;
  let fitted = fitScale(fits, { min, max });
  if (optional.length && fitted.scale < 0.9) {
    for (const line of optional) line.hidden = true;
    fitted = fitScale(fits, { min, max });
  }
  if (fitted.overflow && floor < min) fitted = fitScale(fits, { min: floor, max: min });
  box.style.setProperty("--scene-fit", String(fitted.scale));
  if (fitted.overflow) box.dataset.overflow = "";
  else delete box.dataset.overflow;
  return fitted;
}

/**
 * Fits the words now, and again when the painting changes size or a font arrives (a
 * script's face loads only once its words are on the page, after the first fit).
 */
function useFit(
  outer: RefObject<HTMLElement | null>,
  inner: RefObject<HTMLElement | null>,
  key: string,
  { max = 1.1, min = 0.6, floor = min, onFit }: FitOptions = {},
) {
  const report = useRef(onFit);
  useLayoutEffect(() => {
    report.current = onFit;
  });
  useLayoutEffect(() => {
    const box = outer.current;
    const words = inner.current;
    if (!box || !words) return;
    const measure = () => {
      const fitted = fitWords(box, words, max, min, floor);
      report.current?.(fitted);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(box);
    let live = true;
    void document.fonts?.ready.then(() => live && measure());
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      live = false;
      resize.disconnect();
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [outer, inner, key, max, min, floor]);
}

type FitOptions = {
  max?: number;
  min?: number;
  /** The least the words may shrink to before they break, when even `min` overflows. */
  floor?: number;
  /** Told how the words came out each time they are fitted. */
  onFit?: (fitted: Fitted) => void;
};

/** How long an illustrated card takes to come together, its words appearing at the end. */
const OPEN_MS = 1500;

/** Below this share of its size, the line under the names opens the slot instead. */
const LINE_MIN = 0.9;

const box = ([x, y, width, height]: FrameBox): CSSProperties => ({
  left: `${x}%`,
  top: `${y}%`,
  width: `${width}%`,
  height: `${height}%`,
});

export type OneSceneProps = {
  suite: SuiteId;
  page: ScenePage;
  copy: CardCopy;
  lang: string;
  functions: readonly StoryFunction[];
  photos: readonly StoryPhoto[];
  /** Above the painting: the guest's greeting, the card's language. */
  header?: ReactNode;
  /** Beside the slot's arrows: the music button. */
  extra?: ReactNode;
  reply: { href: string; label: string } | null;
  /** Where "All the details" scrolls to; left out, there is no link. */
  detailsHref?: string;
  /** Inside the editor's phone: fills its box instead of the whole screen. */
  framed?: boolean;
  /**
   * A small copy of a phone's scene, as the editor and the gallery show it: every line
   * keeps its share of the painting, without the floors that keep a phone's words
   * readable (on a small copy they would crowd the painting).
   */
  miniature?: boolean;
  /**
   * A picture of the scene inside something tapped as a whole (the editor's floating
   * phone): it plays, but has no buttons of its own.
   */
  still?: boolean;
  /** The host's lettering (Step 12n) over the theme's own. */
  type?: PageType;
  className?: string;
};

export function OneScene({
  suite,
  page,
  copy,
  lang,
  functions,
  photos,
  header,
  extra,
  reply,
  detailsHref,
  framed = false,
  miniature = false,
  still = false,
  type,
  className,
}: OneSceneProps) {
  const { guestCopy } = useText(publishText);
  const words = guestCopy.scene;
  const reduced = useReducedMotion();

  // An illustrated card comes together from its sides once, then shows as one painting
  const pieces = page.pieces.length > 0 && !reduced;
  const [assembled, setAssembled] = useState(false);
  useEffect(() => {
    if (!pieces) return;
    const timer = window.setTimeout(() => setAssembled(true), OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [pieces]);
  const opening = pieces && !assembled;

  // A painting without room for the line opens the slot with it instead
  const typeKey = JSON.stringify(type ?? null);
  const lineKey = `${copy.line}${lang}${typeKey}`;
  // The line under the names that couldn't fit its place on the painting, by its words
  const [crowded, setCrowded] = useState<string | null>(null);
  const lineOnPainting = Boolean(page.line) && crowded !== lineKey;
  const items: SceneItem[] = [
    ...(lineOnPainting || !copy.line.trim() ? [] : [{ kind: "line" as const, text: copy.line }]),
    ...functions.map((fn) => ({ kind: "function" as const, fn })),
  ];
  const count = items.length;

  const [shown, setShown] = useState<Shown>({ index: 0, from: "right", turn: 0 });
  const [leaving, setLeaving] = useState<Shown | null>(null);
  const [held, setHeld] = useState(false);
  const index = count > 0 ? shown.index % count : 0;
  const playing = !held && !reduced && count > 1;

  const go = useCallback(
    (to: number) => {
      if (count < 2) return;
      const next = ((to % count) + count) % count;
      const turn = shown.turn + 1;
      setLeaving(shown);
      setShown({ index: next, from: entranceFor(turn), turn });
    },
    [count, shown],
  );

  // The next function comes in after each one has had its time
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => go(index + 1), SCENE_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, go]);

  // The one pushed out is gone once its way out is over
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setLeaving(null), SCENE_SWAP_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  const current = items[index];
  const light = sceneLight(current?.kind === "function" ? current.fn.kind : "line");
  const tone = page.dark || light.mood === "night" ? "dark" : "light";
  const names = [copy.first, copy.second].filter((name) => name.trim());
  const joiner = !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const shownFn = current?.kind === "function" ? current.fn : null;
  // In the editor's phone the page already has its own heading
  const Names = framed ? "p" : "h1";
  const voice = SUITES[suite].voice ?? "regal";
  const namesLine = sceneLine(voice, "names", lang, type);
  const namesStrut = { fontSize: namesLine.fontSize, lineHeight: namesLine.lineHeight };
  const namesBox = useRef<HTMLHeadingElement>(null);
  const namesWords = useRef<HTMLSpanElement>(null);
  const lineBox = useRef<HTMLParagraphElement>(null);
  const lineWords = useRef<HTMLSpanElement>(null);
  // Long names shrink further rather than run into the photo or the slot
  useFit(namesBox, namesWords, `${names.join("|")}${joiner}${lang}${typeKey}`, { floor: 0.42 });
  // A line that would set too small for its place opens the slot instead, at a size to read
  useFit(lineBox, lineWords, lineKey, {
    onFit: ({ scale, overflow }) => {
      if (overflow || scale < LINE_MIN) setCrowded(lineKey);
    },
  });

  return (
    <section
      data-suite={suite}
      data-mood={light.mood}
      data-scene-mood={light.mood}
      className={cn(
        "relative isolate flex flex-col overflow-hidden bg-card-ink",
        framed ? "h-full" : "h-dvh min-h-[34rem]",
        className,
      )}
      style={miniature ? ({ "--scene-floor": 0 } as CSSProperties) : undefined}
    >
      {/* The painting again, blurred, fills whatever the painting's own shape leaves */}
      {/* eslint-disable-next-line @next/next/no-img-element -- a blurred fill, not content */}
      <img
        src={page.image}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 size-full scale-110 object-cover opacity-80 blur-2xl"
      />
      {header && (
        <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-1">
          {header}
        </div>
      )}

      <div className="[container-type:size] relative min-h-0 flex-1">
        <div
          className="scene-painting [container-type:size] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          style={{
            width: `min(100cqw, calc(100cqh * ${PAINTING_ASPECT}))`,
            aspectRatio: String(PAINTING_ASPECT),
          }}
        >
          {/* The photos lie under the painting and show through its frames */}
          {page.frames.map((frame, i) => {
            const photo = photos[i];
            const style = box(photoBox(frame));
            return photo ? (
              <FramedPhoto
                key={i}
                photo={photo}
                frameAspect={frameAspectOf(photoBox(frame), PAINTING_ASPECT)}
                className="absolute bg-card-ivory"
                style={style}
              />
            ) : (
              <div
                key={i}
                aria-hidden
                className="absolute flex items-center justify-center bg-card-ivory font-display text-[9cqw] text-card-gold-text"
                style={style}
              >
                {(names[page.frames.length > 1 ? i : 0] ?? "").slice(0, 1)}
                {page.frames.length === 1 && names[1] ? ` ${joiner} ${names[1].slice(0, 1)}` : ""}
              </div>
            );
          })}
          {opening ? (
            <PaintingPieces image={page.image} pieces={page.pieces} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- the painting with its frames cut out
            <img
              src={page.image}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 size-full select-none"
            />
          )}

          {/* The light of the hour, over the whole painting */}
          <div aria-hidden className="scene-wash" data-mood="dawn" />
          <div aria-hidden className="scene-wash" data-mood="dusk" />
          <div aria-hidden className="scene-wash" data-mood="night" />
          {!reduced && (
            <div key={light.art} className="scene-effects [container-type:size] absolute inset-0">
              <PageEffects art={light.art} />
            </div>
          )}

          <Names
            ref={namesBox}
            id="scene-names"
            lang={lang}
            data-tone={tone}
            data-after={pieces || undefined}
            className="story-print scene-print scene-words absolute flex items-center justify-center text-center text-card-ink"
            style={box(page.names)}
          >
            {/* Sized as the names, so its own line and the spaces shrink with them */}
            <span ref={namesWords} className="block max-w-full text-balance" style={namesStrut}>
              <span style={namesLine}>{names[0]}</span>
              {names[1] && (
                <>
                  {" "}
                  <span
                    className="text-card-accent-text"
                    style={sceneLine(voice, "joiner", lang, type)}
                  >
                    {joiner}
                  </span>{" "}
                  <span style={namesLine}>{names[1]}</span>
                </>
              )}
            </span>
          </Names>
          {page.line && lineOnPainting && copy.line.trim() && (
            <p
              ref={lineBox}
              lang={lang}
              data-tone={tone}
              data-after={pieces || undefined}
              className="story-print scene-print scene-words absolute flex items-start justify-center text-center text-card-ink-muted"
              style={box(page.line)}
            >
              <span
                ref={lineWords}
                className="block max-w-full text-balance"
                style={sceneLine(voice, "line", lang, type)}
              >
                {copy.line}
              </span>
            </p>
          )}

          {/* The slot: each function comes in from its own side */}
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label={words.label}
            data-after={pieces || undefined}
            className="absolute [perspective:60rem]"
            style={box(page.slot)}
          >
            {leaving && items[leaving.index % count] && (
              <SlotCard
                key={`out-${leaving.turn}`}
                item={items[leaving.index % count]!}
                voice={voice}
                type={type}
                style={page.style}
                card={page.card}
                tone={tone}
                lang={lang}
                motion="out"
                side={shown.from}
                reduced={reduced}
              />
            )}
            {current && (
              <SlotHolder
                key={`in-${shown.turn}`}
                interactive={!still}
                label={playing ? words.pause : words.play}
                onClick={() => setHeld((h) => !h)}
              >
                <SlotCard
                  item={current}
                  voice={voice}
                  type={type}
                  style={page.style}
                  card={page.card}
                  tone={tone}
                  lang={lang}
                  motion="in"
                  side={shown.from}
                  reduced={reduced}
                />
              </SlotHolder>
            )}
          </div>
          {/* Screen readers hear the function in the slot when the guest moves it */}
          <p className="sr-only" aria-live={playing ? "off" : "polite"}>
            {shownFn
              ? `${words.position(index + 1, count)}: ${shownFn.name}, ${[shownFn.date, shownFn.time, shownFn.venue].filter(Boolean).join(", ")}`
              : ""}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {!still && (count > 1 || shownFn?.mapsUrl || extra) && (
          <div className="flex items-center gap-1 rounded-full bg-card-ivory/85 px-1 text-card-ink shadow-raised backdrop-blur">
            {count > 1 && (
              <>
                <SceneButton label={words.previous} onClick={() => go(index - 1)}>
                  <ChevronLeft aria-hidden />
                </SceneButton>
                <span aria-hidden className="flex items-center gap-1.5 px-1">
                  {items.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-[width,background-color] duration-300",
                        i === index ? "w-4 bg-card-accent-text" : "w-1.5 bg-card-ink-muted/50",
                      )}
                    />
                  ))}
                </span>
                <SceneButton label={words.next} onClick={() => go(index + 1)}>
                  <ChevronRight aria-hidden />
                </SceneButton>
                {!reduced && (
                  <SceneButton
                    label={playing ? words.pause : words.play}
                    pressed={!playing}
                    onClick={() => setHeld((h) => !h)}
                  >
                    {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
                  </SceneButton>
                )}
              </>
            )}
            {shownFn?.mapsUrl && (
              <a
                href={shownFn.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${guestCopy.directions}: ${shownFn.name}`}
                title={guestCopy.directions}
                className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-card-ink/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring [&_svg]:size-5"
              >
                <Navigation aria-hidden />
              </a>
            )}
            {extra}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {reply && (
            <Button asChild size="sm">
              <a href={reply.href}>
                <MailCheck aria-hidden />
                {reply.label}
              </a>
            </Button>
          )}
          {detailsHref && (
            <Button asChild variant="secondary" size="sm">
              <a href={detailsHref}>
                <ChevronDown aria-hidden />
                {words.details}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * An illustrated card's painting in parts: its empty space appears, then the art around
 * it comes in from the side it sits on. Each part is the whole painting clipped to its box.
 */
function PaintingPieces({ image, pieces }: { image: string; pieces: readonly Piece[] }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {pieces.map(({ box: [x, y, width, height], from, order }) => (
        // eslint-disable-next-line @next/next/no-img-element -- a part of the painting, flying in
        <img
          key={`${from}-${x}-${y}`}
          src={image}
          alt=""
          draggable={false}
          data-from={from}
          className="scene-piece absolute inset-0 size-full select-none"
          style={
            {
              clipPath: `inset(${y}% ${100 - x - width}% ${100 - y - height}% ${x}%)`,
              "--order": order,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** The slot's card: a button that holds or plays the scene, or a plain box in a picture of it. */
function SlotHolder({
  interactive,
  label,
  onClick,
  children,
}: {
  interactive: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  if (!interactive) return <div className="absolute inset-0">{children}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </button>
  );
}

/** A round 44px button on the scene's control bar. */
export function SceneButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-card-ink/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring [&_svg]:size-5"
    >
      {children}
    </button>
  );
}

/** One function (or the opening line) on the slot's own card, arriving or leaving. */
function SlotCard({
  item,
  voice,
  type,
  style,
  card: painted,
  tone,
  lang,
  motion,
  side,
  reduced,
}: {
  item: SceneItem;
  voice: Voice;
  type: PageType | undefined;
  style: ScenePage["style"];
  /** The theme's own painted card, whose writing area holds the words. */
  card: PaintedCard | null;
  /** Whether words printed straight on the painting (no card) set light or dark. */
  tone: "light" | "dark";
  lang: string;
  motion: "in" | "out";
  side: Entrance;
  reduced: boolean;
}) {
  const card = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const key =
    item.kind === "line"
      ? item.text
      : [item.fn.name, item.fn.date, item.fn.time, item.fn.venue, item.fn.countdown].join("|");
  // A painted card's words fit its writing area; a drawn card's, the card inside its padding
  // A painted card's writing area is fixed by its painting, so its words may set a little smaller
  useFit(painted ? face : card, words, `${key}${lang}${JSON.stringify(type ?? null)}`, {
    max: 1.15,
    min: painted ? 0.5 : 0.6,
    floor: 0.4,
  });
  const fn = item.kind === "function" ? item.fn : null;
  const when = Boolean(fn && (fn.date || fn.time));
  return (
    <div
      ref={card}
      aria-hidden={motion === "out" || undefined}
      data-slot={style}
      data-motion={reduced ? `${motion}-still` : motion}
      data-side={side}
      data-tone={style === "bare" ? tone : undefined}
      className={cn(
        "scene-slot scene-words absolute inset-0 flex flex-col items-center justify-center text-center text-card-ink [font-variant-numeric:lining-nums]",
        // With no card, the words print on the painting with its soft glow behind them
        style === "bare" && "story-print scene-print",
      )}
      style={{ "--swap": `${SCENE_SWAP_MS}ms` } as CSSProperties}
    >
      {painted && (
        // eslint-disable-next-line @next/next/no-img-element -- the theme's painted card, cut out
        <img
          src={painted.image}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 size-full select-none"
        />
      )}
      <div
        ref={face}
        className={cn(
          "flex flex-col items-center justify-center",
          // A margin inside the painted border, so the words never touch it
          painted ? "absolute px-[2.5%] py-[2.5%]" : "contents",
          // A sheet laid over busy art (a wax seal) keeps a wider margin of its own
          painted?.plate && "isolate px-[4.5%] py-[4.5%]",
        )}
        style={painted ? box(painted.text) : undefined}
      >
        {painted?.plate && <span aria-hidden className="scene-plate absolute inset-0 -z-10" />}
        {/* The card's spacing is set in em of this size, so it shrinks with the words */}
        <div ref={words} className="scene-card-words flex w-full flex-col items-center">
          {item.kind === "line" ? (
            <p lang={lang} className="text-balance" style={sceneLine(voice, "line", lang, type)}>
              {item.text}
            </p>
          ) : (
            fn && (
              <>
                {/* As on a printed card: how soon, then the name large and clear, then a rule */}
                {fn.countdown && (
                  <p
                    lang={lang}
                    data-fit-optional={painted ? "" : undefined}
                    className="mb-[0.45em] text-card-gold-text"
                    style={sceneLine(voice, "countdown", lang, type)}
                  >
                    {fn.countdown}
                  </p>
                )}
                <p
                  lang={lang}
                  className="max-w-full text-balance"
                  style={sceneLine(voice, "function", lang, type)}
                >
                  {fn.name}
                </p>
                {fn.localName && (
                  <p
                    lang={fn.localName.lang}
                    className="text-card-accent-text"
                    style={sceneLine(voice, "detail", fn.localName.lang, type)}
                  >
                    {fn.localName.text}
                  </p>
                )}
                {(fn.date || fn.time || fn.venue) && (
                  <span aria-hidden className="story-rule scene-rule" />
                )}
                {/* Then the day with its weekday, the hour, and the place below, unlabelled */}
                {/* The day and its hour share a line where the card is wide enough, and the
                    hour wraps under the day where it is not */}
                {when && (
                  <div className="flex max-w-full flex-wrap items-baseline justify-center gap-x-[0.6em]">
                    {fn.date && (
                      <p
                        lang={lang}
                        className="max-w-full text-balance"
                        style={sceneLine(voice, "date", lang, type)}
                      >
                        {keepDate(fn.date)}
                      </p>
                    )}
                    {fn.time && (
                      <p
                        lang={lang}
                        className="mt-[0.15em] max-w-full text-card-ink-muted"
                        style={sceneLine(voice, "detail", lang, type)}
                      >
                        {fn.muhurat && (
                          <span lang={fn.muhurat.lang} className="text-card-accent-text">
                            {fn.muhurat.text} ·{" "}
                          </span>
                        )}
                        {fn.time}
                      </p>
                    )}
                  </div>
                )}
                {fn.venue && (
                  <p
                    lang={lang}
                    className={cn("scene-venue max-w-full text-balance", when && "mt-[0.55em]")}
                    style={sceneLine(voice, "venue", lang, type)}
                  >
                    {fn.venue}
                  </p>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
