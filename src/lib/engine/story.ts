/*
 * Story reveal (Step 12d) and event pages (Step 12e): once the doors have opened, the
 * invitation turns into full-screen pages, one thing at a time, like the short wedding
 * films families share: the cover (blessing and names), the family, one page per
 * function, then the question "Will you join us?". Data and pure timing only, so the
 * player, the review page and the tests read the same.
 */

import { FUNCTION_IDS, type FunctionId } from "@/lib/events/functions";
import type { CardCopy } from "@/lib/templates/content";

/** The page a beat is, and so the scene painted behind it. Functions each have their own. */
export const STORY_SCENES = ["cover", "family", ...FUNCTION_IDS, "reply"] as const;
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
  /** "In 5 days", "Tomorrow" or "Today" on the guest page, in the card's language. */
  countdown?: string;
  /** Directions and the calendar, on the guest page (the editor's preview has none). */
  mapsUrl?: string | null;
  icsUrl?: string | null;
  googleCalendarUrl?: string | null;
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
  /** Draw the card's sacred symbol above the lines (the cover only). */
  symbol: boolean;
  /** Seconds the beat stays before the next one begins. */
  seconds: number;
  /** A function page's Directions and Add to calendar links. */
  links?: { maps: string | null; calendar: string | null };
  /** The couple's photos on their photo page: one of them together, or one each. */
  photos?: readonly StoryPhoto[];
};

/** A photo on the couple's page: where it loads from and what it shows. */
export type StoryPhoto = { src: string; alt: string };

export type StoryInput = {
  copy: CardCopy;
  functions: readonly StoryFunction[];
  /** Whether the invite takes replies, so the last beat asks for one. */
  replies: boolean;
  words: StoryWords;
  /** The tradition's family wording (blessings from, hosts), as the family wrote it. */
  family?: readonly FamilyLine[];
  /** The couple's photos (one or two) for a photo page after the cover; none skips it. */
  couple?: readonly StoryPhoto[];
};

/** One labelled block of the family's wording: "आशीर्वाद" over the grandparents' names. */
export type FamilyLine = { title: string; text: string; lang?: string };

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
const READ_PER_WORD = 0.32;
const READ_MIN = 3;
const READ_MAX = 5.5;
/** A whole story never runs longer than this; long lists of functions read faster. */
export const STORY_MAX_SECONDS = 75;
/** Nor any page shorter than this, however it is squeezed. */
export const BEAT_MIN = 4.5;

const words = (lines: readonly StoryLine[]) =>
  lines.reduce((sum, line) => sum + line.text.split(/\s+/).filter(Boolean).length, 0);

/** Seconds a beat needs: its lines arriving one after another, then time to read them. */
export function beatSeconds(lines: readonly StoryLine[], symbol = false): number {
  const count = lines.length + (symbol ? 1 : 0);
  const arrive = Math.max(0, count - 1) * LINE_STAGGER + LINE_IN;
  const read = Math.min(READ_MAX, Math.max(READ_MIN, words(lines) * READ_PER_WORD));
  return Number(Math.max(BEAT_MIN, arrive + read).toFixed(2));
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

/** The pages an invitation turns through, from what the host has written. */
export function storyBeats({
  copy,
  functions,
  replies,
  words: w,
  family = [],
  couple = [],
}: StoryInput): StoryBeat[] {
  const beats: StoryBeat[] = [];
  const joiner = !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  // With one function, its own page carries the date
  const single = functions.length === 1;

  // The cover: the sacred symbol and blessing over the couple's names
  beats.push(
    beat(
      "cover",
      "cover",
      [
        ...line(copy.blessing, "script"),
        ...line(copy.first, "display"),
        ...line(joiner, "joiner"),
        ...line(copy.second, "display"),
      ],
      Boolean(copy.symbol),
    ),
  );

  // The couple's photo page: their photo in the theme's own frame, their names beneath
  if (couple.length > 0) {
    // One-name occasions (a birthday) have no joiner or second name
    const names = [
      ...line(copy.first, "display"),
      ...(copy.second.trim() ? line(joiner, "joiner") : []),
      ...line(copy.second, "display"),
    ];
    // A photo takes a moment longer to take in than a line of words
    const page = beat("couple", "cover", names);
    beats.push({ ...page, seconds: Math.max(page.seconds, 6), photos: couple.slice(0, 2) });
  }

  // The family page: who invites, their words, and the day itself
  const blessings = [
    ...line(copy.families, "small"),
    ...family.flatMap((block) => [
      ...line(block.title, "label", block.lang),
      ...line(block.text, "body", block.lang),
    ]),
  ];
  const invite = [
    ...line(copy.line, "body"),
    ...(single || !copy.date
      ? []
      : [...line(w.saveTheDate, "label"), ...line(copy.date, "display")]),
    ...(functions.length === 0 ? line(copy.date, "display") : []),
  ];
  // A family's own blessings fill a page, so the invitation and the day turn to the next
  if (family.length > 0 && invite.length > 0) {
    beats.push(beat("family", "family", blessings), beat("invite", "family", invite));
  } else if (blessings.length + invite.length > 0) {
    beats.push(beat("family", "family", [...blessings, ...invite]));
  }

  for (const fn of functions) {
    beats.push(
      beat(`fn-${fn.kind}`, fn.kind, [
        ...line(fn.countdown ?? "", "small"),
        ...line(fn.name, "label"),
        ...(fn.localName ? line(fn.localName.text, "script", fn.localName.lang) : []),
        ...line(fn.date, "display"),
        ...(fn.muhurat && fn.time ? line(fn.muhurat.text, "small", fn.muhurat.lang) : []),
        ...line(fn.time, "body"),
        ...line(fn.venue, "small"),
      ]),
    );
    const maps = fn.mapsUrl ?? null;
    const calendar = fn.icsUrl ?? fn.googleCalendarUrl ?? null;
    if (maps || calendar) beats[beats.length - 1]!.links = { maps, calendar };
  }

  // One function's venue is on its own page; a single card venue closes the story instead
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
