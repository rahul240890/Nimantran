"use client";

import { ChevronLeft, ChevronRight, MailCheck, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { DecorSvg } from "@/components/invitation/art/decor-svg";
import { SYMBOLS } from "@/components/invitation/art/symbols";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { lineDelay, type LineStyle, type StoryBeat } from "@/lib/engine/story";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { stockStyle } from "@/lib/templates/stock";
import { StoryScene } from "./story-scenes";

export type StoryLabels = {
  story: string;
  pause: string;
  play: string;
  next: string;
  previous: string;
  skip: string;
  /** The last beat's way back to the card. */
  done: string;
};

type StoryPlayerProps = {
  beats: readonly StoryBeat[];
  copy: CardCopy;
  template: Template;
  /** Still mode: no movement and no timer; the guest steps through with Next. */
  still: boolean;
  labels: StoryLabels;
  lang?: string;
  /** The last beat's button, to the reply form. */
  reply?: { href: string; label: string } | null;
  /** Move keyboard focus into the story (when the guest asked for it with a button). */
  autoFocus?: boolean;
  /** `hadFocus` says whether keyboard focus was inside the story as it closed. */
  onDone: (hadFocus: boolean) => void;
};

/* Sizes follow the panel (cqmin), within bounds that keep every line readable */
const LINE_CLASS: Record<LineStyle, string> = {
  symbol: "",
  label:
    "font-label text-[clamp(0.8rem,3.4cqmin,1.05rem)] tracking-[0.28em] text-card-gold-text uppercase",
  script: "font-display text-[clamp(1.2rem,6cqmin,2rem)] leading-tight text-card-accent-text",
  display: "font-display text-[clamp(1.55rem,8cqmin,2.7rem)] leading-[1.08] text-card-ink",
  joiner: "font-display text-[clamp(1.2rem,6cqmin,2rem)] leading-none text-card-accent-text",
  body: "font-sans text-[clamp(1rem,4.2cqmin,1.3rem)] text-card-ink-muted",
  small: "font-sans text-[clamp(0.9rem,3.6cqmin,1.1rem)] text-card-ink-muted",
};
/** The couple's names are the largest words in the story. */
const NAME_CLASS = "font-display text-[clamp(2rem,12cqmin,3.8rem)] leading-[1.02] text-card-ink";

/**
 * Plays an invitation's story over the opened card, beat by beat, with a progress bar
 * like a status update. Tap the right of the panel (or Next) to move on, the left to go
 * back; it pauses in a background tab. It uses the card's own colours and fonts.
 */
export function StoryPlayer({
  beats,
  copy,
  template,
  still,
  labels,
  lang,
  reply,
  autoFocus = false,
  onDone: onDoneProp,
}: StoryPlayerProps) {
  const root = useRef<HTMLElement>(null);
  const onDone = useCallback(
    () => onDoneProp(Boolean(root.current?.contains(document.activeElement))),
    [onDoneProp],
  );
  useEffect(() => {
    if (autoFocus) root.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const beat = beats[index];
  const last = index >= beats.length - 1;
  const running = !still && !paused && !hidden;

  const next = useCallback(() => {
    if (last) onDone();
    else setIndex((i) => i + 1);
  }, [last, onDone]);
  const previous = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  // Time spent on the current beat before a pause, so resuming carries on where it was
  const spent = useRef({ index: -1, ms: 0 });
  const seconds = beat?.seconds ?? 0;
  useEffect(() => {
    if (!running) return;
    const already = spent.current.index === index ? spent.current.ms : 0;
    const start = performance.now();
    // The last beat stays until the guest acts, so the reply button can be pressed
    const timer = last ? null : window.setTimeout(next, Math.max(0, seconds * 1000 - already));
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      spent.current = { index, ms: already + performance.now() - start };
    };
  }, [running, index, seconds, last, next]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!beat) return null;
  const sacred = beat.symbol && copy.symbol ? SYMBOLS[copy.symbol] : null;
  const delay = (i: number) =>
    still ? undefined : ({ "--story-delay": `${lineDelay(i)}s` } as CSSProperties);
  const offset = sacred ? 1 : 0;

  return (
    <section
      ref={root}
      tabIndex={-1}
      aria-label={labels.story}
      lang={lang}
      data-story-beat={beat.id}
      className="absolute inset-0 z-10 flex justify-center outline-none"
      style={stockStyle(template)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        else if (event.key === "ArrowLeft") previous();
        else if (event.key === "Escape") onDone();
        else return;
        event.preventDefault();
      }}
    >
      <div
        className="[container-type:size] relative h-full w-full max-w-[34rem] animate-fade-in overflow-hidden rounded-xl border border-card-gold/50 bg-card-ivory shadow-raised"
        onClick={(event) => {
          // A tap on the left third goes back, anywhere else moves on (not on the buttons)
          if ((event.target as HTMLElement).closest("button, a")) return;
          const box = event.currentTarget.getBoundingClientRect();
          const fromStart =
            getComputedStyle(event.currentTarget).direction === "rtl"
              ? box.right - event.clientX
              : event.clientX - box.left;
          if (fromStart < box.width / 3) previous();
          else next();
        }}
      >
        <StoryScene key={`scene-${beat.id}`} scene={beat.scene} />

        {/* One bar per beat: done, playing, or still to come */}
        <div aria-hidden className="absolute inset-x-3 top-3 flex gap-1">
          {beats.map((b, i) => (
            <span key={b.id} className="h-1 flex-1 overflow-hidden rounded-full bg-card-ink/15">
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

        {/* Back and Next at the start, Pause and Skip at the end, under the progress bar */}
        <div className="absolute inset-x-2 top-6 z-10 flex items-center justify-between gap-2">
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
              className="bg-surface/85 backdrop-blur-sm"
            >
              {last ? labels.done : labels.skip}
            </Button>
          </div>
        </div>

        <div
          key={`words-${beat.id}`}
          className="absolute inset-x-[9%] top-[24%] bottom-[20%] flex flex-col items-center justify-center gap-[1.8cqmin] text-center"
        >
          {sacred && (
            <span
              className="story-line mb-[1cqmin] block size-[clamp(4rem,26cqmin,7.5rem)]"
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
                    "block text-center text-[clamp(3.4rem,22cqmin,6.5rem)] leading-none text-card-accent-text",
                    sacred.font === "display" ? "font-display" : "font-sans",
                  )}
                >
                  {sacred.text}
                </span>
              )}
            </span>
          )}
          {beat.lines.map((line, i) => (
            <p
              key={i}
              lang={line.lang}
              className={cn(
                "story-line max-w-full text-balance break-words",
                beat.scene === "names" && line.style === "display"
                  ? NAME_CLASS
                  : LINE_CLASS[line.style],
              )}
              style={delay(i + offset)}
            >
              {line.text}
            </p>
          ))}
          {last && reply && (
            <span className="story-line mt-[2cqmin]" style={delay(beat.lines.length)}>
              <Button asChild size="lg">
                <a href={reply.href} onClick={onDone}>
                  <MailCheck aria-hidden />
                  {reply.label}
                </a>
              </Button>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
