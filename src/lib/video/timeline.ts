/*
 * The story reveal as a short vertical video (Step 17c) for WhatsApp Status and Instagram
 * Reels: the same pages in the same order, timed to land between 30 and 45 seconds, then
 * a closing card with the invitation's link. Pure timing, shared by the renderer and tests.
 */

import { LINE_IN, LINE_STAGGER, type StoryBeat } from "@/lib/engine/story";

/** WhatsApp Status takes up to about a minute per update; Reels feel right under 45 seconds. */
export const VIDEO_MIN_SECONDS = 30;
export const VIDEO_MAX_SECONDS = 45;
/** With the host's fixed time on each page, the video runs as long as that, up to a minute. */
export const VIDEO_FIXED_MAX_SECONDS = 60;
/** The closing card with the link. */
export const END_SECONDS = 4;
/** No page flashes by faster than this, however many functions there are. */
export const VIDEO_BEAT_MIN = 2.6;
/** One page fades into the next over this long. */
export const CROSSFADE = 0.7;
/** Lines wait this long after their page appears before the first one rises in. */
export const LINES_START = 0.35;

/** 1080 × 1920: full HD, portrait, 9:16 as both apps want it. */
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const FRAME_RATE = 30;

export type VideoBeat = {
  beat: StoryBeat;
  start: number;
  seconds: number;
  /** How far apart the lines rise in, squeezed with the page. */
  stagger: number;
  /** How long each line takes to arrive. */
  lineIn: number;
};

export type VideoTimeline = {
  beats: VideoBeat[];
  /** When the closing card begins. */
  end: number;
  /** The whole video, in seconds. */
  total: number;
};

/**
 * Times each page so the whole video, closing card included, is 30 to 45 seconds. With
 * `fixed` (the host set a time for every page) each page keeps it, so the video and its
 * music run exactly as long as the pages need, squeezed only past a minute.
 */
export function videoTimeline(
  story: readonly StoryBeat[],
  { fixed = false }: { fixed?: boolean } = {},
): VideoTimeline {
  const room = (fixed ? VIDEO_FIXED_MAX_SECONDS : VIDEO_MAX_SECONDS) - END_SECONDS;
  const floor = Math.min(VIDEO_BEAT_MIN, room / Math.max(story.length, 1));
  const natural = story.reduce((sum, beat) => sum + beat.seconds, 0);
  let lengths = story.map((beat) => beat.seconds);
  if (natural > room) {
    // Only the time above each page's floor shrinks, as fitStory does for the live story
    const spare = natural - story.length * floor;
    const scale = Math.max(0, (room - story.length * floor) / Math.max(spare, 0.001));
    lengths = story.map((beat) => floor + Math.max(0, beat.seconds - floor) * scale);
  } else if (!fixed && natural + END_SECONDS < VIDEO_MIN_SECONDS && natural > 0) {
    // A short story lingers a little on each page instead of ending early
    const scale = (VIDEO_MIN_SECONDS - END_SECONDS) / natural;
    lengths = story.map((beat) => beat.seconds * scale);
  }

  let start = 0;
  const beats = story.map((beat, i) => {
    const seconds = round(lengths[i]!);
    // Lines keep their pace unless the page is too short for it
    const squeeze = Math.min(1, seconds / beat.seconds);
    const entry: VideoBeat = {
      beat,
      start: round(start),
      seconds,
      stagger: round(LINE_STAGGER * squeeze),
      lineIn: round(LINE_IN * Math.max(squeeze, 0.6)),
    };
    start += seconds;
    return entry;
  });
  const end = round(start);
  return { beats, end, total: round(end + END_SECONDS) };
}

/** 0 before a line starts to rise, 1 once it has arrived. */
export function lineProgress(entry: VideoBeat, index: number, seconds: number): number {
  const local = seconds - entry.start - LINES_START - index * entry.stagger;
  return Math.max(0, Math.min(1, local / entry.lineIn));
}

/** The page showing at a moment, and the one fading out under it, if any. */
export function pagesAt(
  timeline: VideoTimeline,
  seconds: number,
): { current: number | "end"; previous: number | null; fade: number } {
  const { beats, end } = timeline;
  const index = seconds >= end ? "end" : beats.findLastIndex((entry) => seconds >= entry.start);
  const current = index === -1 ? 0 : index;
  const startedAt = current === "end" ? end : beats[current]!.start;
  const previous =
    current === "end" ? (beats.length ? beats.length - 1 : null) : current > 0 ? current - 1 : null;
  const fade = previous === null ? 1 : Math.min(1, (seconds - startedAt) / CROSSFADE);
  return { current, previous: fade < 1 ? previous : null, fade };
}

const round = (value: number) => Number(value.toFixed(3));
