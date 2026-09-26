/** "Meera Iyer" → "MI", "aarav" → "A". Uses whole characters so Indic names are not split mid-letter. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = firstGrapheme(words[0] ?? "");
  const last = words.length > 1 ? firstGrapheme(words[words.length - 1] ?? "") : "";
  return (first + last).toLocaleUpperCase();
}

function firstGrapheme(word: string): string {
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
