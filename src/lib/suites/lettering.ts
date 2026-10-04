import type { LineStyle, StoryBeat } from "@/lib/engine/story";
import { FUNCTION_IDS } from "@/lib/events/functions";
import type { FontScript } from "@/lib/editor/type";

/*
 * How the words on an event page are typeset, the way a stationery studio sets a printed
 * card: one spec shared by the live pages and the MP4, so both read the same.
 *
 * - A theme has a voice (regal, romantic, modern, playful), and each voice has a face for
 *   the names, one for reading and one for small headings in every script the cards are
 *   written in. Gujarati, Bengali and Tamil get their own faces instead of the phone's
 *   plain fallback.
 * - Each kind of line has its own size, leading and spacing. Indian scripts carry vowel
 *   signs above and below the letters, so their lines are taller; Gujarati letters sit
 *   small on the line, so they are set a little larger; Tamil words run long, so a little
 *   smaller. Headings are spaced capitals in Latin letters only.
 * - Lines are grouped: a heading sits close to what it heads, and the groups breathe.
 */

export type Voice = "regal" | "romantic" | "modern" | "playful";
/** Which face a line is set in: the names' face, the reading face or the headings' face. */
export type Face = "names" | "words" | "label";

/** A face for one script: its family as @font-face names it, and its size beside others. */
type FaceChoice = { family: string; fallback: string; size?: number; weight?: number };

const SERIF = "Georgia, serif";
const SANS = "system-ui, sans-serif";

const face = (family: string, fallback = SERIF, size?: number, weight?: number): FaceChoice => ({
  family,
  fallback,
  ...(size ? { size } : {}),
  ...(weight ? { weight } : {}),
});

/* Every face here is loaded by src/components/invitation/type/fonts.css */
const TIRO_HINDI = face("Tiro Devanagari Hindi");
const TIRO_BANGLA = face("Tiro Bangla");
const TIRO_TAMIL = face("Tiro Tamil");
const RASA = face("Rasa", SERIF, 1.06);

export const VOICES: Record<Voice, Record<Face, Record<FontScript, FaceChoice>>> = {
  // Palaces, courtyards and crafts: a high-contrast serif for the names, inscriptional
  // capitals for the headings, Rozha One's strong strokes for Devanagari names
  regal: {
    names: {
      latin: face("Playfair Display"),
      devanagari: face("Rozha One"),
      gujarati: face("Rasa", SERIF, 1.06, 700),
      bengali: TIRO_BANGLA,
      tamil: face("Arima", SERIF, 1, 700),
    },
    words: {
      latin: face("Marcellus"),
      devanagari: TIRO_HINDI,
      gujarati: RASA,
      bengali: TIRO_BANGLA,
      tamil: TIRO_TAMIL,
    },
    label: {
      latin: face("Cinzel", SERIF, 1, 700),
      devanagari: TIRO_HINDI,
      gujarati: face("Rasa", SERIF, 1.06, 700),
      bengali: TIRO_BANGLA,
      tamil: TIRO_TAMIL,
    },
  },
  // Flowers, gardens, beaches and chapels: a flowing hand for Latin names, calligraphic
  // Devanagari and Bengali, and a light book face to read
  romantic: {
    names: {
      latin: face("Great Vibes", "cursive", 1.32),
      devanagari: face("Amita", "cursive", 1, 700),
      gujarati: face("Rasa", SERIF, 1.06, 700),
      bengali: face("Galada", SERIF, 1.04),
      tamil: face("Arima", SERIF, 1, 700),
    },
    words: {
      latin: face("Cormorant Garamond", SERIF, 1.14, 700),
      devanagari: TIRO_HINDI,
      gujarati: RASA,
      bengali: TIRO_BANGLA,
      tamil: TIRO_TAMIL,
    },
    label: {
      latin: face("Cinzel", SERIF, 0.96),
      devanagari: TIRO_HINDI,
      gujarati: face("Rasa", SERIF, 1.06, 700),
      bengali: TIRO_BANGLA,
      tamil: TIRO_TAMIL,
    },
  },
  // Art deco, night skies and paper-cut: tall roman capitals and clean reading faces
  modern: {
    names: {
      latin: face("Cinzel", SERIF, 0.92, 700),
      devanagari: face("Martel", SERIF, 1, 700),
      gujarati: face("Hind Vadodara", SANS, 1.06, 700),
      bengali: face("Baloo Da 2", SANS, 1, 700),
      tamil: face("Catamaran", SANS, 1, 700),
    },
    words: {
      latin: face("Marcellus"),
      devanagari: face("Martel"),
      gujarati: face("Hind Vadodara", SANS, 1.06),
      bengali: face("Baloo Da 2", SANS),
      tamil: face("Catamaran", SANS),
    },
    label: {
      latin: face("Marcellus"),
      devanagari: face("Martel", SERIF, 1, 700),
      gujarati: face("Hind Vadodara", SANS, 1.06, 700),
      bengali: face("Baloo Da 2", SANS, 1, 700),
      tamil: face("Catamaran", SANS, 1, 700),
    },
  },
  // Birthdays and baby showers: round, friendly letters in every script
  playful: {
    names: {
      latin: face("Baloo Bhai 2", SANS, 1, 700),
      devanagari: face("Yatra One"),
      gujarati: face("Baloo Bhai 2", SANS, 1.04, 700),
      bengali: face("Baloo Da 2", SANS, 1, 700),
      tamil: face("Catamaran", SANS, 1, 700),
    },
    words: {
      latin: face("Baloo Bhai 2", SANS),
      devanagari: face("Martel"),
      gujarati: face("Baloo Bhai 2", SANS, 1.04),
      bengali: face("Baloo Da 2", SANS),
      tamil: face("Catamaran", SANS),
    },
    label: {
      latin: face("Baloo Bhai 2", SANS, 1, 700),
      devanagari: face("Martel", SERIF, 1, 700),
      gujarati: face("Baloo Bhai 2", SANS, 1.04, 700),
      bengali: face("Baloo Da 2", SANS, 1, 700),
      tamil: face("Catamaran", SANS, 1, 700),
    },
  },
};

/**
 * A function's day as it should break: after the weekday, never inside "18 November 2026",
 * so a narrow card reads "Sunday, / 18 November 2026". A long day keeps its plain spaces.
 */
export function keepDate(date: string): string {
  const comma = date.indexOf(", ");
  if (comma < 0) return date;
  const rest = date.slice(comma + 2);
  return rest.length > 18 ? date : `${date.slice(0, comma + 2)}${rest.replace(/ /g, "\u00a0")}`;
}

/** The script a language is written in; anything unknown is set as Latin. */
export function scriptOfLang(lang: string | undefined): FontScript {
  const code = (lang ?? "en").toLowerCase().split("-")[0];
  if (code === "hi" || code === "mr") return "devanagari";
  if (code === "gu") return "gujarati";
  if (code === "bn") return "bengali";
  if (code === "ta") return "tamil";
  return "latin";
}

/**
 * A kind of line on the page. The couple's names on the cover are their own kind, the
 * largest on any page; "date" is a function's day, set below its name, and "venue" its
 * place, below the day.
 */
export type TypeRole = Exclude<LineStyle, "symbol"> | "names";

type RoleSpec = {
  face: Face;
  /** Size in rem at the least and most, and in between a share of the page (cqmin). */
  min: number;
  fluid: number;
  max: number;
  /** Line height for Latin letters, then for Indian scripts. */
  leading: readonly [latin: number, indic: number];
};

export const ROLES: Record<TypeRole, RoleSpec> = {
  names: { face: "names", min: 2.3, fluid: 11.5, max: 4.4, leading: [1.04, 1.28] },
  display: { face: "names", min: 1.8, fluid: 9.8, max: 3.7, leading: [1.1, 1.32] },
  date: { face: "names", min: 1.2, fluid: 5.4, max: 2, leading: [1.18, 1.4] },
  script: { face: "names", min: 1.2, fluid: 5.6, max: 2.1, leading: [1.2, 1.42] },
  joiner: { face: "names", min: 1.15, fluid: 5.6, max: 2.1, leading: [1, 1.2] },
  body: { face: "words", min: 1, fluid: 4.4, max: 1.38, leading: [1.42, 1.62] },
  venue: { face: "words", min: 1.06, fluid: 4.8, max: 1.5, leading: [1.32, 1.52] },
  small: { face: "words", min: 0.92, fluid: 3.8, max: 1.18, leading: [1.42, 1.6] },
  label: { face: "label", min: 0.78, fluid: 3.2, max: 1.04, leading: [1.3, 1.5] },
};

/**
 * How much larger or smaller each script is set than Latin at the same size, so a line
 * looks the same weight in every language.
 */
export const SCRIPT_SIZE: Record<FontScript, number> = {
  latin: 1,
  devanagari: 1.04,
  gujarati: 1.08,
  bengali: 1.04,
  tamil: 0.9,
};
/** Indian scripts have no capitals, so their small headings are set larger instead. */
export const INDIC_LABEL = 1.26;
/** The spacing of Latin headings, in em; spaced Indian letters fall apart. */
export const LABEL_TRACKING = 0.22;

export type Lettering = {
  /** A CSS font-family list, the chosen face first. */
  family: string;
  weight: number | undefined;
  /** The size as a share of the role's designed size (script, face and heading together). */
  size: number;
  /** The face's own part of that size, left out when the host picks another face. */
  faceSize: number;
  leading: number;
  /** Letter spacing in em. */
  tracking: number;
  upper: boolean;
};

/** How one kind of line is set in a voice and a language. */
export function lettering(voice: Voice, role: TypeRole, lang: string | undefined): Lettering {
  const script = scriptOfLang(lang);
  const spec = ROLES[role];
  const named = VOICES[voice][spec.face][script];
  // A day in a flowing hand is hard to read at a glance, so it takes the reading face instead
  const choice =
    role === "date" && named.fallback === "cursive" ? VOICES[voice].words[script] : named;
  const indic = script !== "latin";
  const label = role === "label";
  return {
    family: `"${choice.family}", ${choice.fallback}`,
    weight: choice.weight,
    size: (choice.size ?? 1) * SCRIPT_SIZE[script] * (label && indic ? INDIC_LABEL : 1),
    faceSize: choice.size ?? 1,
    leading: spec.leading[indic ? 1 : 0],
    tracking: label && !indic ? LABEL_TRACKING : 0,
    upper: label && !indic,
  };
}

/** A role's designed size in px for a page whose shorter side is 100 × `cq` px. */
export function roleSize(role: TypeRole, cq: number, rem = 16): number {
  const { min, fluid, max } = ROLES[role];
  return Math.min(max * rem, Math.max(min * rem, fluid * cq));
}

/** The same size as CSS, before the page's own scales multiply it. */
export function roleSizeCss(role: TypeRole): string {
  const { min, fluid, max } = ROLES[role];
  // A small copy of a page (the editor's phone) sets --type-floor: 0, so it shrinks as a whole
  return `clamp(calc(${min}rem * var(--type-floor, 1)), ${fluid}cqmin, ${max}rem)`;
}

/** Space above a line, in cqmin: groups breathe, a heading stays close to what it heads. */
export function spaceBefore(role: TypeRole, previous: TypeRole | null): number {
  if (previous === null) return 0;
  if (role === "label") return 4.4;
  // The place is its own group below the day and time
  if (role === "venue") return 3;
  if (previous === "label") return 0.8;
  if (role === "joiner" || previous === "joiner") return 0.4;
  if (previous === "display" || previous === "names" || role === "display") return 2.2;
  return 1.3;
}

/** A line's kind on its page: the couple's names on the cover are a kind of their own. */
export function roleOf(beat: StoryBeat, style: LineStyle): TypeRole {
  if (style === "display" && beat.scene === "cover") return "names";
  return style === "symbol" ? "label" : style;
}

/**
 * Where a function's page draws its fine rule between its name and its day: before the
 * first line after the name (a local name in its own script stays with it), or nowhere.
 */
export function ruleAt(beat: StoryBeat): number {
  if (!(FUNCTION_IDS as readonly string[]).includes(beat.scene)) return -1;
  const hero = beat.lines.findIndex((line) => line.style === "display");
  if (hero < 0) return -1;
  let after = hero + 1;
  while (beat.lines[after]?.style === "script") after++;
  return after < beat.lines.length ? after : -1;
}

/** The space above a line on its page, in cqmin, with the rule's own gap. */
export function lineSpace(beat: StoryBeat, index: number, symbol: boolean): number {
  if (index === ruleAt(beat)) return 2.2;
  const role = roleOf(beat, beat.lines[index]!.style);
  if (index === 0) return symbol ? spaceBefore(role, "display") : 0;
  return spaceBefore(role, roleOf(beat, beat.lines[index - 1]!.style));
}

/**
 * Every face a voice sets in one script and in Latin letters (dates, times, typed English),
 * as CSS font shorthands, so the video can load them all before it draws.
 */
export function voiceFaces(voice: Voice, lang: string | undefined): string[] {
  const scripts = new Set<FontScript>(["latin", scriptOfLang(lang)]);
  const faces = new Set<string>();
  for (const role of Object.values(VOICES[voice])) {
    for (const script of scripts) {
      const choice = role[script];
      faces.add(`${choice.weight ?? 400} 32px "${choice.family}"`);
    }
  }
  return [...faces];
}
