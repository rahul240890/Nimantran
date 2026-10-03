/*
 * One Scene as a short vertical video: the painting with the couple's photo and names,
 * then each celebration's card flying in from its own side, as the live scene does, and
 * the closing card with the link. Timed to land between 30 and 45 seconds, like the
 * story's video (timeline.ts). Pure timing, shared by the renderer and tests.
 */

import { entranceFor, type Entrance } from "@/lib/suites/scene";
import { END_SECONDS, VIDEO_BEAT_MIN, VIDEO_MAX_SECONDS, VIDEO_MIN_SECONDS } from "./timeline";

/** The painting, photo and names settle before the first card flies in. */
export const SCENE_INTRO = 1.8;
/** A card's way in (and the last one's way out). */
export const SCENE_FLY = 0.9;
/** How long a card stays when there is time to spare: long enough to read, not to wait. */
export const SCENE_HOLD = 4.6;
/** Few celebrations come round again rather than one card waiting too long. */
const HOLD_MOST = 8;

export type SceneShot = {
  /** Which card: the opening line or a celebration, in the scene's order. */
  item: number;
  start: number;
  seconds: number;
  /** The side it comes in from; the card before leaves the other way. */
  from: Entrance;
};

export type SceneTimeline = {
  shots: SceneShot[];
  /** When the closing card begins. */
  end: number;
  total: number;
};

/** Times `count` cards so the whole video, closing card included, is 30 to 45 seconds. */
export function sceneTimeline(count: number): SceneTimeline {
  if (count < 1) {
    const end = VIDEO_MIN_SECONDS - END_SECONDS;
    return { shots: [], end, total: VIDEO_MIN_SECONDS };
  }
  const least = VIDEO_MIN_SECONDS - END_SECONDS - SCENE_INTRO;
  const most = VIDEO_MAX_SECONDS - END_SECONDS - SCENE_INTRO;
  let rounds = 1;
  let hold = SCENE_HOLD;
  if (count * hold > most) hold = Math.max(VIDEO_BEAT_MIN, most / count);
  else if (count * hold < least) {
    // Stretch each card, up to a point; past it the cards come round again
    rounds = Math.ceil(least / (count * HOLD_MOST));
    hold = least / (count * rounds);
  }
  const shots: SceneShot[] = [];
  for (let turn = 0; turn < count * rounds; turn++) {
    shots.push({
      item: turn % count,
      start: round(SCENE_INTRO + turn * hold),
      seconds: round(hold),
      from: entranceFor(turn),
    });
  }
  const end = round(SCENE_INTRO + shots.length * hold);
  return { shots, end, total: round(end + END_SECONDS) };
}

/** The card showing at a moment, and the one leaving as it arrives. */
export function shotsAt(
  timeline: SceneTimeline,
  seconds: number,
): { current: SceneShot | null; leaving: SceneShot | null; flight: number } {
  const index = timeline.shots.findLastIndex((shot) => seconds >= shot.start);
  if (index === -1) return { current: null, leaving: null, flight: 0 };
  const current = timeline.shots[index]!;
  const flight = Math.min(1, (seconds - current.start) / SCENE_FLY);
  const leaving = flight < 1 && index > 0 ? timeline.shots[index - 1]! : null;
  return { current, leaving, flight };
}

const round = (value: number) => Number(value.toFixed(3));
