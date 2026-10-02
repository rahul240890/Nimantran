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
import type { Voice } from "@/lib/suites/lettering";
import { sceneLine } from "@/lib/suites/scene-type";
import { PAINTING_ASPECT, type FrameBox } from "@/lib/suites/photo-frames";
import {
  SCENE_HOLD_MS,
  SCENE_SWAP_MS,
  entranceFor,
  sceneLight,
  type Entrance,
  type ScenePage,
} from "@/lib/suites/scene";
import { isCardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
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

const FACES = "50% 30%";

/**
 * Shrinks (or grows a little) the words in `box` until `words` fits inside it, by setting
 * `--scene-fit` on `box`. Words too long to fit even at the smallest size may break.
 */
function fitWords(box: HTMLElement, words: HTMLElement, max: number) {
  const pad = getComputedStyle(box);
  const room =
    box.clientHeight - parseFloat(pad.paddingTop || "0") - parseFloat(pad.paddingBottom || "0");
  const fits = (scale: number) => {
    box.style.setProperty("--scene-fit", String(scale));
    return words.offsetHeight <= room + 1 && words.scrollWidth <= words.clientWidth + 1;
  };
  const { scale, overflow } = fitScale(fits, { min: 0.6, max });
  box.style.setProperty("--scene-fit", String(scale));
  if (overflow) box.dataset.overflow = "";
  else delete box.dataset.overflow;
}

/** Fits the words now, and again when the painting changes size or the fonts arrive. */
function useFit(
  outer: RefObject<HTMLElement | null>,
  inner: RefObject<HTMLElement | null>,
  key: string,
  max = 1.1,
) {
  useLayoutEffect(() => {
    const box = outer.current;
    const words = inner.current;
    if (!box || !words) return;
    const measure = () => fitWords(box, words, max);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(box);
    let live = true;
    void document.fonts?.ready.then(() => live && measure());
    return () => {
      live = false;
      resize.disconnect();
    };
  }, [outer, inner, key, max]);
}

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
  type,
  className,
}: OneSceneProps) {
  const { guestCopy } = useText(publishText);
  const words = guestCopy.scene;
  const reduced = useReducedMotion();

  // A painting without room for the line opens the slot with it instead
  const items: SceneItem[] = [
    ...(page.line || !copy.line.trim() ? [] : [{ kind: "line" as const, text: copy.line }]),
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
  const tone = light.mood === "night" ? "dark" : "light";
  const names = [copy.first, copy.second].filter((name) => name.trim());
  const joiner = !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const shownFn = current?.kind === "function" ? current.fn : null;
  // In the editor's phone the page already has its own heading
  const Names = framed ? "p" : "h1";
  const voice = SUITES[suite].voice ?? "regal";
  const namesBox = useRef<HTMLHeadingElement>(null);
  const namesWords = useRef<HTMLSpanElement>(null);
  const lineBox = useRef<HTMLParagraphElement>(null);
  const lineWords = useRef<HTMLSpanElement>(null);
  const typeKey = JSON.stringify(type ?? null);
  useFit(namesBox, namesWords, `${names.join("|")}${joiner}${lang}${typeKey}`);
  useFit(lineBox, lineWords, `${copy.line}${lang}${typeKey}`);

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
            const [x, y, width, height] = frame;
            const style: CSSProperties = {
              left: `${x - 0.8}%`,
              top: `${y - 0.5}%`,
              width: `${width + 1.6}%`,
              height: `${height + 1}%`,
            };
            return photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- the family's own photo
              <img
                key={i}
                src={photo.src}
                alt={photo.alt}
                decoding="async"
                draggable={false}
                className="absolute bg-card-ivory object-cover select-none"
                style={{ ...style, objectPosition: FACES }}
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
          {/* eslint-disable-next-line @next/next/no-img-element -- the painting with its frames cut out */}
          <img
            src={page.image}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 size-full select-none"
          />

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
            className="story-print scene-print scene-words absolute flex items-center justify-center text-center text-card-ink"
            style={box(page.names)}
          >
            <span ref={namesWords} className="block max-w-full text-balance">
              <span style={sceneLine(voice, "names", lang, type)}>{names[0]}</span>
              {names[1] && (
                <>
                  {" "}
                  <span
                    className="text-card-accent-text"
                    style={sceneLine(voice, "joiner", lang, type)}
                  >
                    {joiner}
                  </span>{" "}
                  <span style={sceneLine(voice, "names", lang, type)}>{names[1]}</span>
                </>
              )}
            </span>
          </Names>
          {page.line && copy.line.trim() && (
            <p
              ref={lineBox}
              lang={lang}
              data-tone={tone}
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
                lang={lang}
                motion="out"
                side={shown.from}
                reduced={reduced}
              />
            )}
            {current && (
              <button
                key={`in-${shown.turn}`}
                type="button"
                onClick={() => setHeld((h) => !h)}
                aria-label={playing ? words.pause : words.play}
                className="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <SlotCard
                  item={current}
                  voice={voice}
                  type={type}
                  style={page.style}
                  lang={lang}
                  motion="in"
                  side={shown.from}
                  reduced={reduced}
                />
              </button>
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
        {(count > 1 || shownFn?.mapsUrl || extra) && (
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

/** A small gold label over a group of the slot's details: "Date & time", "शुभ स्थान". */
function SlotLabel({
  voice,
  lang,
  type,
  children,
}: {
  voice: Voice;
  lang: string;
  type: PageType | undefined;
  children: ReactNode;
}) {
  return (
    <p
      lang={lang}
      className="mb-[0.35em] text-card-gold-text"
      style={sceneLine(voice, "countdown", lang, type)}
    >
      {children}
    </p>
  );
}

/** One function (or the opening line) on the slot's own card, arriving or leaving. */
function SlotCard({
  item,
  voice,
  type,
  style,
  lang,
  motion,
  side,
  reduced,
}: {
  item: SceneItem;
  voice: Voice;
  type: PageType | undefined;
  style: ScenePage["style"];
  lang: string;
  motion: "in" | "out";
  side: Entrance;
  reduced: boolean;
}) {
  const card = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const key =
    item.kind === "line"
      ? item.text
      : [item.fn.name, item.fn.date, item.fn.time, item.fn.venue, item.fn.countdown].join("|");
  useFit(card, words, `${key}${lang}${JSON.stringify(type ?? null)}`, 1.15);
  const fn = item.kind === "function" ? item.fn : null;
  const labels = CARD_STORY_WORDS[isCardLanguage(lang) ? lang : "en"];
  const when = Boolean(fn && (fn.date || fn.time));
  return (
    <div
      ref={card}
      aria-hidden={motion === "out" || undefined}
      data-slot={style}
      data-motion={reduced ? `${motion}-still` : motion}
      data-side={side}
      className="scene-slot scene-words absolute inset-0 flex flex-col items-center justify-center text-center text-card-ink [font-variant-numeric:lining-nums]"
      style={{ "--swap": `${SCENE_SWAP_MS}ms` } as CSSProperties}
    >
      <div ref={words} className="flex w-full flex-col items-center">
        {item.kind === "line" ? (
          <p lang={lang} className="text-balance" style={sceneLine(voice, "line", lang, type)}>
            {item.text}
          </p>
        ) : (
          fn && (
            <>
              {/* As on a printed card: how soon, the name, a rule, then the day and the place, each under its label */}
              {fn.countdown && (
                <p
                  lang={lang}
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
              {/* The day and the place side by side, a fine gold line between, so the
                  card stays short enough to set every line at a comfortable size */}
              <div
                className={cn(
                  "grid w-full items-start gap-x-[0.9em]",
                  when && fn.venue ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-1",
                )}
              >
                {when && (
                  <div className="flex flex-col items-center">
                    <SlotLabel voice={voice} lang={lang} type={type}>
                      {labels.when}
                    </SlotLabel>
                    {fn.date && (
                      <p
                        lang={lang}
                        className="text-balance"
                        style={sceneLine(voice, "date", lang, type)}
                      >
                        {fn.date}
                      </p>
                    )}
                    {fn.time && (
                      <p
                        lang={lang}
                        className="mt-[0.15em] text-card-ink-muted"
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
                {when && fn.venue && (
                  <span aria-hidden className="w-px self-stretch bg-card-gold/45" />
                )}
                {fn.venue && (
                  <div className="flex flex-col items-center">
                    <SlotLabel voice={voice} lang={lang} type={type}>
                      {labels.where}
                    </SlotLabel>
                    <p
                      lang={lang}
                      className="max-w-full text-balance"
                      style={sceneLine(voice, "date", lang, type)}
                    >
                      {fn.venue}
                    </p>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
