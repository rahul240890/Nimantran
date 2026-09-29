import type { CardLanguage } from "@/lib/templates/card-languages";

/*
 * Names typed in English letters, offered back in a card's own script. Google's input
 * tools do the spelling; only the name itself is sent, from our server, never the rest
 * of the invitation (see the privacy policy's "Who else handles it").
 */

export type ScriptLanguage = Exclude<CardLanguage, "en">;

/** Google input tools' code for each card language, typed phonetically in English letters. */
const INPUT_TOOLS: Record<ScriptLanguage, string> = {
  hi: "hi-t-i0-und",
  mr: "mr-t-i0-und",
  gu: "gu-t-i0-und",
  bn: "bn-t-i0-und",
  ta: "ta-t-i0-und",
};

export const NAME_MAX = 60;
const WORDS_MAX = 6;
const CHOICES = 3;

/** True for a name written only in English letters, which the card's script could spell. */
export function isLatinName(value: string): boolean {
  return /[A-Za-z]/.test(value) && /^[A-Za-z .'-]+$/.test(value.trim());
}

/** The words worth spelling: letters only, at most a few. */
export function nameWords(value: string): string[] {
  return value
    .trim()
    .split(/\s+/)
    .filter((word) => /[A-Za-z]/.test(word))
    .slice(0, WORDS_MAX);
}

/** Google's answer for one word: ["SUCCESS", [[word, [choices…], …]]]. */
export function parseChoices(body: unknown): string[] {
  if (!Array.isArray(body) || body[0] !== "SUCCESS" || !Array.isArray(body[1])) return [];
  const first: unknown = body[1][0];
  if (!Array.isArray(first) || !Array.isArray(first[1])) return [];
  return first[1].filter((choice): choice is string => typeof choice === "string" && !!choice);
}

/**
 * Whole-name choices from each word's choices: the best spelling of every word first, then
 * the next best for each word that has one.
 */
export function combineChoices(perWord: readonly string[][]): string[] {
  if (perWord.length === 0 || perWord.some((choices) => choices.length === 0)) return [];
  const names: string[] = [];
  for (let rank = 0; rank < CHOICES; rank++) {
    const name = perWord.map((choices) => choices[Math.min(rank, choices.length - 1)]).join(" ");
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

/** Spells `name` in `language`'s script; an empty list when the service can't be reached. */
export async function transliterateName(
  name: string,
  language: ScriptLanguage,
  fetcher: typeof fetch = fetch,
): Promise<string[]> {
  const words = nameWords(name);
  if (words.length === 0) return [];
  try {
    const perWord = await Promise.all(
      words.map(async (word) => {
        const url = new URL("https://inputtools.google.com/request");
        url.searchParams.set("text", word.toLowerCase());
        url.searchParams.set("itc", INPUT_TOOLS[language]);
        url.searchParams.set("num", String(CHOICES));
        url.searchParams.set("cp", "0");
        url.searchParams.set("cs", "1");
        url.searchParams.set("ie", "utf-8");
        url.searchParams.set("oe", "utf-8");
        const response = await fetcher(url, { signal: AbortSignal.timeout(3000) });
        if (!response.ok) return [];
        return parseChoices(await response.json());
      }),
    );
    return combineChoices(perWord);
  } catch {
    return [];
  }
}
