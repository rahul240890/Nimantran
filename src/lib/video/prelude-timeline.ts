/*
 * The video's first seconds, before the pages: the guest's opening as it waits, closed,
 * with the names on it; the opening's own move; then the welcome with the names, the line
 * and the day. Then the pages (or the scene) cross-fade in. No countdown: a video is
 * watched days later. Pure timing, shared by the renderer and tests.
 */

import {
  isDepthOpening,
  isFreshOpening,
  isPaintedGate,
  isThemedOpening,
  isTiedGate,
  type OpeningStyle,
} from "@/lib/opening/catalog";
import { CROSSFADE } from "./timeline";

/**
 * How much slower the video's opening moves than they were drawn (2026-10-22): the same
 * calmer step the guest's link took, from OPENING_PACE 1.6 to 2.2.
 */
export const PRELUDE_PACE = 2.2 / 1.6;
/** The opening holds closed this long, the names on it, before it opens. */
export const PRELUDE_IDLE = 2.4;
/** A painted, tied, depth, fresh or themed opening opens over this long, as on the guest's link. */
export const PRELUDE_OPEN_PAINTED = 2.6 * PRELUDE_PACE;
/** A drawn opening (doors, curtains, the envelope) opens sooner. */
export const PRELUDE_OPEN_DRAWN = 1.8 * PRELUDE_PACE;
/** The welcome with the names stays this long, as WELCOME_MS does on the link. */
export const PRELUDE_WELCOME = 3.6;
/** The welcome fades in over the last of the opening's move. */
export const WELCOME_IN = 0.6;

export type PreludeTimeline = {
  /** When the opening starts to open. */
  open: number;
  /** When the welcome starts to fade in. */
  welcome: number;
  /** When the pages start to fade in over the welcome. */
  pages: number;
  /** The whole prelude, up to the moment the pages have fully come in. */
  total: number;
};

/** Whether a style is one of the painted openings, which take longer to open. */
export function paintedOpening(style: OpeningStyle): boolean {
  return (
    isPaintedGate(style) ||
    isTiedGate(style) ||
    isDepthOpening(style) ||
    isFreshOpening(style) ||
    isThemedOpening(style)
  );
}

/** The prelude's timing for an opening style; null without an opening. */
export function preludeTimeline(style: OpeningStyle): PreludeTimeline | null {
  if (style === "none") return null;
  const opening = paintedOpening(style) ? PRELUDE_OPEN_PAINTED : PRELUDE_OPEN_DRAWN;
  const open = PRELUDE_IDLE;
  const welcome = round(open + opening - WELCOME_IN);
  const pages = round(welcome + PRELUDE_WELCOME);
  return { open, welcome, pages, total: round(pages + CROSSFADE) };
}

const round = (value: number) => Number(value.toFixed(3));
