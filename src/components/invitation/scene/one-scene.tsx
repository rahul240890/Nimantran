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
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { PageEffects } from "@/components/invitation/story/page-effects";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { StoryFunction, StoryPhoto } from "@/lib/engine/story";
import type { SuiteId } from "@/lib/suites/catalog";
import { PAINTING_ASPECT, type FrameBox } from "@/lib/suites/photo-frames";
import {
  SCENE_HOLD_MS,
  SCENE_SWAP_MS,
  entranceFor,
  sceneLight,
  type Entrance,
  type ScenePage,
} from "@/lib/suites/scene";
import type { CardCopy } from "@/lib/templates/content";

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
          className="scene-painting [container-type:inline-size] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
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
            id="scene-names"
            lang={lang}
            data-tone={tone}
            className="story-print scene-print absolute flex items-center justify-center text-center font-display text-[7.4cqw] leading-none text-card-ink"
            style={box(page.names)}
          >
            <span className="break-words">
              {names[0]}
              {names[1] && (
                <>
                  <span className="mx-[0.3em] text-[0.7em] text-card-accent-text">{joiner}</span>
                  {names[1]}
                </>
              )}
            </span>
          </Names>
          {page.line && copy.line.trim() && (
            <p
              lang={lang}
              data-tone={tone}
              className="story-print scene-print absolute flex items-start justify-center text-center text-[3.4cqw] leading-snug text-balance text-card-ink"
              style={box(page.line)}
            >
              {copy.line}
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

/** One function (or the opening line) on the slot's own card, arriving or leaving. */
function SlotCard({
  item,
  style,
  lang,
  motion,
  side,
  reduced,
}: {
  item: SceneItem;
  style: ScenePage["style"];
  lang: string;
  motion: "in" | "out";
  side: Entrance;
  reduced: boolean;
}) {
  return (
    <div
      aria-hidden={motion === "out" || undefined}
      data-slot={style}
      data-motion={reduced ? `${motion}-still` : motion}
      data-side={side}
      className="scene-slot absolute inset-0 flex flex-col items-center justify-center gap-[0.8cqw] px-[5cqw] text-center text-card-ink"
      style={{ "--swap": `${SCENE_SWAP_MS}ms` } as CSSProperties}
    >
      {item.kind === "line" ? (
        <p lang={lang} className="text-[3.6cqw] leading-snug text-balance">
          {item.text}
        </p>
      ) : (
        <>
          <p lang={lang} className="font-display text-[6.4cqw] leading-none">
            {item.fn.name}
          </p>
          {item.fn.date && (
            <p
              lang={lang}
              className="text-[3.2cqw] leading-tight font-semibold text-card-accent-text"
            >
              {item.fn.date}
              {item.fn.time && (
                <span className="block font-normal text-card-ink">
                  {item.fn.muhurat && (
                    <span lang={item.fn.muhurat.lang}>{item.fn.muhurat.text} · </span>
                  )}
                  {item.fn.time}
                </span>
              )}
            </p>
          )}
          {item.fn.venue && (
            <p lang={lang} className="line-clamp-2 text-[3cqw] leading-tight text-card-ink-muted">
              {item.fn.venue}
            </p>
          )}
          {item.fn.countdown && (
            <p className="font-label text-[2.4cqw] tracking-[0.2em] text-card-gold-text uppercase">
              {item.fn.countdown}
            </p>
          )}
        </>
      )}
    </div>
  );
}
