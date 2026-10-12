"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { MusicBars } from "@/components/invitation/music-bars";
import type { RagaMusic } from "@/components/invitation/use-raga-music";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** How long a full-screen section stays before the page moves on, unless it names its own. */
const DWELL_SECONDS = 7;
/** A section taller than the screen moves on a screen at a time, this long each. */
const PART_SECONDS = 5;
/** After the guest scrolls or taps, the page waits this long before carrying on. */
const IDLE_MS = 7000;
/** A section counts as the one showing once its top is above this share of the screen. */
const SHOWING_AT = 0.35;

type TourState = "off" | "on" | "idle" | "paused";

/** The full-screen sections below the pages, top to bottom (each marked `data-tour`). */
function tourStops(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("[data-tour]")];
}

function scrollToStop(stop: HTMLElement, still: boolean) {
  const top = stop.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
}

/** The section the guest is looking at now. */
function showing(stops: readonly HTMLElement[]): number {
  const line = window.innerHeight * SHOWING_AT;
  let at = 0;
  stops.forEach((stop, index) => {
    if (stop.getBoundingClientRect().top <= line) at = index;
  });
  return at;
}

/**
 * Once the pages end, the invitation carries on down the guest page like a reel: each
 * section fills the screen, stays a few seconds and gives way to the next, ending at the
 * reply form, while the music plays on until the reply comes into view. The guest can
 * scroll freely at any time (the page waits, then carries on from where they are), or hold
 * it with the button at the foot of the screen. Still mode only takes the guest to the
 * first section and lets them scroll.
 */
export function GuestTour({
  root,
  run,
  music,
  labels,
  musicLabels,
}: {
  root: RefObject<HTMLElement | null>;
  /** Goes up by one each time the pages end, which starts the tour from the top. */
  run: number;
  music: RagaMusic;
  labels: { label: string; pause: string; play: string };
  /** A music button beside the hold button, on pages without a music button of their own. */
  musicLabels?: { play: string; pause: string } | null;
}) {
  const still = useReducedMotion();
  const [state, setState] = useState<TourState>("off");
  // Each move forward, so the progress line starts again
  const [step, setStep] = useState(0);
  const [dwell, setDwell] = useState(DWELL_SECONDS);
  const latestMusic = useRef(music);
  useEffect(() => {
    latestMusic.current = music;
  });

  // The pages have ended: down to the first section
  useEffect(() => {
    if (run === 0) return;
    const node = root.current;
    const first = node && tourStops(node)[0];
    if (!first) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    // The pages' cover has just let the page scroll again; move on the frame after
    const frame = requestAnimationFrame(() => {
      scrollToStop(first, still);
      setDwell(Number(first.dataset.tour) || DWELL_SECONDS);
      setStep((was) => was + 1);
      setState(still ? "off" : "on");
    });
    return () => cancelAnimationFrame(frame);
  }, [run, root, still]);

  // The music plays on until the reply form comes into view, then comes to rest
  useEffect(() => {
    if (run === 0) return;
    const reply = document.getElementById("rsvp");
    if (!reply || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (latestMusic.current.playing) latestMusic.current.rest();
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(reply);
    return () => observer.disconnect();
  }, [run]);

  // Each few seconds, on to the next section (or the next screen of a tall one)
  useEffect(() => {
    if (state !== "on") return;
    const timer = window.setTimeout(() => {
      const node = root.current;
      if (!node) return setState("off");
      const stops = tourStops(node);
      const at = showing(stops);
      const current = stops[at];
      if (!current) return setState("off");
      const box = current.getBoundingClientRect();
      const height = window.innerHeight;
      if (box.bottom > height + 24 && current.dataset.tour !== "end") {
        window.scrollBy({
          top: Math.min(box.bottom - height, height * 0.8),
          behavior: "smooth",
        });
        setDwell(PART_SECONDS);
      } else {
        const next = stops[at + 1];
        if (!next || current.dataset.tour === "end") {
          // The end of the page: the tour stops, and the music with it
          if (latestMusic.current.playing) latestMusic.current.rest();
          return setState("off");
        }
        scrollToStop(next, false);
        // The reply form is where the guest takes over
        if (next.dataset.tour === "end") return setState("off");
        setDwell(Number(next.dataset.tour) || DWELL_SECONDS);
      }
      setStep((was) => was + 1);
    }, dwell * 1000);
    return () => window.clearTimeout(timer);
  }, [state, step, dwell, root]);

  // The guest's own scrolling or tapping holds the tour; it carries on once they stop
  useEffect(() => {
    if (state !== "on" && state !== "idle") return;
    let timer = 0;
    const hold = (event: Event) => {
      if ((event.target as Element | null)?.closest?.("[data-tour-controls]")) return;
      setState("idle");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setState((was) => (was === "idle" ? "on" : was));
        setStep((was) => was + 1);
      }, IDLE_MS);
    };
    const options = { passive: true, capture: true } as const;
    window.addEventListener("wheel", hold, options);
    window.addEventListener("touchstart", hold, options);
    window.addEventListener("keydown", hold, options);
    window.addEventListener("pointerdown", hold, options);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", hold, options);
      window.removeEventListener("touchstart", hold, options);
      window.removeEventListener("keydown", hold, options);
      window.removeEventListener("pointerdown", hold, options);
    };
  }, [state]);

  if (state === "off") return null;
  const moving = state === "on";
  const held = state === "paused";
  return (
    <div
      role="group"
      aria-label={labels.label}
      data-tour-controls
      className="fixed start-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex animate-[pop-in_500ms_ease-out_both] items-center gap-1 rounded-full bg-night/70 p-1 text-card-ivory shadow-overlay backdrop-blur-md motion-still:animate-none"
    >
      <button
        type="button"
        aria-pressed={held}
        onClick={() => {
          setState(held ? "on" : "paused");
          setStep((was) => was + 1);
        }}
        className="relative flex min-h-11 items-center gap-2 overflow-hidden rounded-full ps-3 pe-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {held ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
        {held ? labels.play : labels.pause}
        {/* How long until the page moves on */}
        <span
          aria-hidden
          className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-card-ivory/25"
        >
          <span
            key={step}
            className={cn("block h-full rounded-full bg-card-gold", moving && "story-progress")}
            style={
              {
                "--story-duration": `${dwell}s`,
                animationPlayState: moving ? "running" : "paused",
                transform: moving ? undefined : "scaleX(0)",
              } as CSSProperties
            }
          />
        </span>
      </button>
      {musicLabels && (
        <button
          type="button"
          aria-pressed={music.playing}
          aria-label={music.playing ? musicLabels.pause : musicLabels.play}
          onClick={music.toggle}
          className="grid size-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <MusicBars playing={music.playing} className="size-5" />
        </button>
      )}
    </div>
  );
}
