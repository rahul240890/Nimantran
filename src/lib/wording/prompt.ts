import {
  EDIT_STYLES,
  LINE_MAX,
  MAX_LINES,
  type EditStyle,
  type PageLine,
} from "@/lib/editor/pages";
import type { CardLanguage } from "@/lib/templates/card-languages";

/*
 * What the AI is asked when it writes a card's wording (Step 12s part 4), kept apart from
 * the server call so it can be tested. It rewrites the pages the invite already wrote from
 * the host's own facts, so every name, date, time and place stays exactly as typed.
 */

export const TONES = ["traditional", "warm", "fun"] as const;
export type Tone = (typeof TONES)[number];
export const WORDING_MODES = ["write", "shorten"] as const;
export type WordingMode = (typeof WORDING_MODES)[number];

/** Free invites get this many AI drafts; paid editions have no limit. */
export const FREE_DRAFTS = 3;

export type WordingPage = {
  id: string;
  /** What the page is for: "cover", "family", "haldi", "reply"… */
  scene: string;
  lines: PageLine[];
};

export type WordingRequest = {
  language: CardLanguage;
  tone: Tone;
  mode: WordingMode;
  /** The occasion in plain English ("wedding", "birthday"). */
  occasion: string;
  /** The tradition the card follows, in plain English, when it has one. */
  tradition: string | null;
  pages: WordingPage[];
};

const LANGUAGE_NAMES: Record<CardLanguage, string> = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  mr: "Marathi (Devanagari script)",
  gu: "Gujarati (Gujarati script)",
  bn: "Bengali (Bengali script)",
  ta: "Tamil (Tamil script)",
};

const TONE_WORDS: Record<Tone, string> = {
  traditional:
    "traditional and formal, the way a printed family card reads, with the tradition's customary phrases and honorifics",
  warm: "warm and heartfelt, simple and personal, still respectful to elders",
  fun: "light and joyful, playful where it suits, never disrespectful to elders or the sacred",
};

export const WORDING_SYSTEM = `You write the words for digital invitation cards: Indian weddings and family occasions first, and any celebration anywhere. Each card is a set of pages painted with art, and the words print on a calm part of the painting, so every page holds only a few short lines.

Line kinds (the "style" of each line):
- label: a small heading in capitals, a few words
- script: a blessing, an invocation or a short accent line
- display: large text; on the cover, each name is its own display line
- body: an ordinary sentence
- small: a small note, like a venue or a countdown

Rules:
- Write only in the language you are told, in its own script. Never mix in English words on a card in another language unless the host typed them.
- Keep every name, date, time, venue and phone number exactly as it appears in the page's current lines. Never invent people, places, dates or details.
- Follow the occasion's and tradition's customs; sacred invocations stay respectful.
- Keep each page's lines short: the page must fit a phone screen over a painting.
- Return every page you were given, with the same id.`;

/** The request's user message: the card's facts, its pages as written now, and the task. */
export function wordingPrompt(request: WordingRequest): string {
  const task =
    request.mode === "shorten"
      ? "Shorten these pages so each fits its painting: fewer and shorter lines, same meaning, same facts."
      : `Rewrite these pages as a finished invitation. Tone: ${TONE_WORDS[request.tone]}.`;
  const pages = request.pages.map((page) => ({
    id: page.id,
    page: page.scene,
    lines: page.lines.map((line) => ({ style: line.style, text: line.text })),
  }));
  return [
    `Occasion: ${request.occasion}.`,
    request.tradition ? `Tradition: ${request.tradition}.` : "No particular tradition.",
    `Language of the card: ${LANGUAGE_NAMES[request.language]}.`,
    task,
    `At most ${MAX_PAGE_LINES} lines a page, each under ${LINE_MAX} characters.`,
    "The pages as they are now:",
    JSON.stringify(pages, null, 2),
  ].join("\n\n");
}

/** Fewer than the editor allows, so the AI's pages leave room for the art. */
export const MAX_PAGE_LINES = 7;

/**
 * The AI's answer made safe to store: only the pages that were asked for, only known line
 * kinds, text trimmed to the editor's limits, and no page left without a line.
 */
export function cleanWording(
  answer: { pages: { id: string; lines: { style: string; text: string }[] }[] },
  asked: readonly WordingPage[],
): Record<string, PageLine[]> {
  const ids = new Set(asked.map((page) => page.id));
  const result: Record<string, PageLine[]> = {};
  for (const page of answer.pages) {
    if (!ids.has(page.id) || result[page.id]) continue;
    const lines = page.lines
      .map((line) => ({
        style: (EDIT_STYLES as readonly string[]).includes(line.style)
          ? (line.style as EditStyle)
          : "body",
        text: line.text.replace(/\s+/g, " ").trim().slice(0, LINE_MAX),
      }))
      .filter((line) => line.text)
      .slice(0, MAX_LINES);
    if (lines.length > 0) result[page.id] = lines;
  }
  return result;
}
