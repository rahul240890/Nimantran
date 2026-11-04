import { romanize } from "@/lib/names/romanize";

/**
 * "Meera Iyer" → "MI", "aarav" → "A", "राहुल शर्मा" → "RS". Initials are always English
 * letters, whatever script the name is in (owner, 2026-11-04: a Hindi or Gujarati letter
 * does not sit well as an initial, so Rahul is "R" and Nita is "N" in every language).
 */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = englishInitial(words[0] ?? "");
  const last = words.length > 1 ? englishInitial(words[words.length - 1] ?? "") : "";
  return first + last;
}

/**
 * A name's first letter in English, capitalised: "rahul" → "R", "નીતા" → "N",
 * "செந்தில்" → "S". A name in a script with no English reading keeps its own first letter.
 */
export function englishInitial(name: string): string {
  const latin = romanize(name.trim()).match(/\p{Script=Latin}/u)?.[0];
  if (latin) return latin.toLocaleUpperCase("en");
  return firstGrapheme(name.trim()).toLocaleUpperCase();
}

/** The first whole character of a word (मी, not म). */
export function firstGrapheme(word: string): string {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  for (const { segment } of segmenter.segment(word)) return segment;
  return "";
}

/** Picks the same tint for the same name every time. */
export function tintIndex(name: string, count: number): number {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  return hash % count;
}
