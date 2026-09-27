/*
 * Story reveal (Step 12d): once the doors have opened, the invitation tells itself one
 * thing at a time, like the short wedding films families share: the blessing, the couple,
 * the date, each function in its own scene, then the question "Will you join us?".
 * Data and pure timing only, so the player, the review page and the tests read the same.
 */

import { FUNCTION_IDS, type FunctionId } from "@/lib/events/functions";
import type { CardCopy } from "@/lib/templates/content";

/** The painted scene behind a beat. Functions each have their own. */
export const STORY_SCENES = ["blessing", "names", "date", ...FUNCTION_IDS, "reply"] as const;
export type StorySceneId = (typeof STORY_SCENES)[number];

/** A function as the story tells it: the words the guest page already shows. */
export type StoryFunction = {
  kind: FunctionId;
  name: string;
  localName: { text: string; lang: string } | null;
  /** "Saturday, 14 February 2027", or empty. */
  date: string;
  /** "7:30 PM", or "9:47 AM to 10:31 AM", or empty. */
  time: string;
  muhurat: { text: string; lang: string } | null;
  venue: string;
};

/** How a line is set: which font and how large, from the story's own small type scale. */
export type LineStyle = "symbol" | "label" | "script" | "display" | "joiner" | "body" | "small";

export type StoryLine = {
  text: string;
  style: LineStyle;
  /** Its own language when it differs from the card's (a local ceremony name, a muhurat). */
  lang?: string;
};

export type StoryBeat = {
  id: string;
  scene: StorySceneId;
  lines: readonly StoryLine[];
  /** Draw the card's sacred symbol above the lines (the blessing beat only). */
  symbol: boolean;
  /** Seconds the beat stays before the next one begins. */
  seconds: number;
};

export type StoryInput = {
  copy: CardCopy;
  functions: readonly StoryFunction[];
  /** Whether the invite takes replies, so the last beat asks for one. */
  replies: boolean;
  words: StoryWords;
};

/** The few words the story adds of its own, in the page's language. */
export type StoryWords = {
  saveTheDate: string;
  joinUs: string;
  withLove: string;
  and: string;
};

/** Each line after the first waits this long before it rises in. */
export const LINE_STAGGER = 0.45;
/** How long a line takes to arrive. */
export const LINE_IN = 0.9;
/** Time left to read once the last line has arrived, per word, within bounds. */
const READ_PER_WORD = 0.28;
const READ_MIN = 1.6;
const READ_MAX = 3.6;
/** A whole story never runs longer than this; long lists of functions read faster. */
export const STORY_MAX_SECONDS = 45;
/** Nor any beat shorter than this, however it is squeezed. */
const BEAT_MIN = 2.8;

const words = (lines: readonly StoryLine[]) =>
  lines.reduce((sum, line) => sum + line.text.split(/\s+/).filter(Boolean).length, 0);

/** Seconds a beat needs: its lines arriving one after another, then time to read them. */
export function beatSeconds(lines: readonly StoryLine[], symbol = false): number {
  const count = lines.length + (symbol ? 1 : 0);
  const arrive = Math.max(0, count - 1) * LINE_STAGGER + LINE_IN;
  const read = Math.min(READ_MAX, Math.max(READ_MIN, words(lines) * READ_PER_WORD));
  return Number((arrive + read).toFixed(2));
}

/** When a line (by its place in the beat) starts to rise in. */
export function lineDelay(index: number): number {
  return Number((index * LINE_STAGGER).toFixed(2));
}

const line = (text: string, style: LineStyle, lang?: string): StoryLine[] =>
  text.trim() ? [{ text: text.trim(), style, ...(lang ? { lang } : {}) }] : [];

function beat(id: string, scene: StorySceneId, lines: StoryLine[], symbol = false): StoryBeat {
  return { id, scene, lines, symbol, seconds: beatSeconds(lines, symbol) };
}

/** The story an invitation tells, beat by beat, from what the host has written. */
export function storyBeats({ copy, functions, replies, words: w }: StoryInput): StoryBeat[] {
  const beats: StoryBeat[] = [];

  // The blessing, under the sacred symbol when there is one; sacred art only glows
  if (copy.blessing || copy.symbol) {
    beats.push(beat("blessing", "blessing", line(copy.blessing, "script"), Boolean(copy.symbol)));
  }

  const joiner = !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  // With one function, its own beat carries the date, so the card's line joins the names
  const single = functions.length === 1;
  beats.push(
    beat("names", "names", [
      ...line(copy.families, "small"),
      ...line(copy.first, "display"),
      ...line(joiner, "joiner"),
      ...line(copy.second, "display"),
      ...(single ? line(copy.line, "body") : []),
    ]),
  );

  // The day itself, like the "save the date" card of the films
  if (!single && (copy.date || copy.line)) {
    beats.push(
      beat("date", "date", [
        ...line(w.saveTheDate, "label"),
        ...line(copy.date, "display"),
        ...line(copy.line, "body"),
      ]),
    );
  }

  for (const fn of functions) {
    beats.push(
      beat(`fn-${fn.kind}`, fn.kind, [
        ...line(fn.name, "label"),
        ...(fn.localName ? line(fn.localName.text, "script", fn.localName.lang) : []),
        ...line(fn.date, "display"),
        ...(fn.muhurat && fn.time ? line(fn.muhurat.text, "small", fn.muhurat.lang) : []),
        ...line(fn.time, "body"),
        ...line(fn.venue, "small"),
      ]),
    );
  }

  // One function's venue is on its own beat; a single card venue closes the story instead
  const closing = [...line(replies ? w.joinUs : w.withLove, "display")];
  if (functions.length === 0) closing.push(...line(copy.venue, "body"));
  beats.push(beat("reply", "reply", closing));

  return fitStory(beats);
}

/**
 * Squeezes a long story so it stays under STORY_MAX_SECONDS, each beat keeping its share.
 * No beat drops below its floor, so a kankotri with a dozen functions runs a little longer
 * rather than too fast to read.
 */
export function fitStory(beats: StoryBeat[]): StoryBeat[] {
  const total = storyLength(beats);
  if (total <= STORY_MAX_SECONDS) return beats;
  // Only the time above each beat's floor shrinks, so the whole lands on the limit
  const floor = beats.length * BEAT_MIN;
  const scale = Math.max(0, (STORY_MAX_SECONDS - floor) / Math.max(total - floor, 0.001));
  return beats.map((b) => ({
    ...b,
    seconds: Number((BEAT_MIN + Math.max(0, b.seconds - BEAT_MIN) * scale).toFixed(2)),
  }));
}

export function storyLength(beats: readonly StoryBeat[]): number {
  return Number(beats.reduce((sum, b) => sum + b.seconds, 0).toFixed(2));
}

/** Which beat is showing `seconds` into the story, and how far through it (0 to 1). */
export function beatAt(
  beats: readonly StoryBeat[],
  seconds: number,
): { index: number; progress: number; done: boolean } {
  let start = 0;
  for (let index = 0; index < beats.length; index++) {
    const length = beats[index]!.seconds;
    if (seconds < start + length) {
      return { index, progress: Math.max(0, (seconds - start) / length), done: false };
    }
    start += length;
  }
  return { index: Math.max(0, beats.length - 1), progress: 1, done: true };
}
