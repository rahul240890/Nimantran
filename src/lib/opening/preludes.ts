import { romanize } from "@/lib/names/romanize";
import type { Faith } from "@/lib/traditions/faith";

/*
 * The prelude (owner, 2026-11-04): a few seconds of motion the moment a guest opens the
 * link, before the closed gate. Ten of them, picked at random for every guest and every
 * visit, so no two guests and no two visits need see the same one. They play while the
 * gate's paintings load, so on most phones they cost the guest no time at all.
 */
export const PRELUDES = [
  "rangoli",
  "thread",
  "letter",
  "kolam",
  "gold",
  "mist",
  "mehendi",
  "peacock",
  "diyas",
  "fireworks",
] as const;
export type Prelude = (typeof PRELUDES)[number];

export function isPrelude(value: unknown): value is Prelude {
  return typeof value === "string" && (PRELUDES as readonly string[]).includes(value);
}

/** The kalava is a Hindu sacred thread: a Muslim, Christian or Sikh card never ties it. */
const FAITH_SKIPS: Partial<Record<Faith, readonly Prelude[]>> = {
  muslim: ["thread"],
  christian: ["thread"],
  sikh: ["thread"],
};

/** The preludes this device has shown, oldest first, across every Shubh invitation. */
const SEEN_KEY = "shubhdwar-prelude-seen";

function readSeen(): Prelude[] {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter(isPrelude) : [];
  } catch {
    return [];
  }
}

function writeSeen(seen: readonly Prelude[]) {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // Private windows and blocked storage simply pick at random
  }
}

/**
 * Picks the next prelude: one this device has not shown yet, at random. Once it has seen
 * them all a fresh round starts, never with the one it saw last.
 */
export function pickPrelude(faith: Faith, random = Math.random): Prelude {
  const skip = FAITH_SKIPS[faith] ?? [];
  const allowed = PRELUDES.filter((id) => !skip.includes(id));
  const seen = readSeen();
  let pool = allowed.filter((id) => !seen.includes(id));
  let history = seen;
  if (pool.length === 0) {
    const last = seen[seen.length - 1];
    pool = allowed.filter((id) => id !== last);
    history = last ? [last] : [];
  }
  const chosen = pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]!;
  writeSeen([...history.filter((id) => id !== chosen), chosen]);
  return chosen;
}

/**
 * A name's first letter in English letters, in every card language (owner, 2026-11-04: an
 * initial in Hindi or Tamil script does not fit a monogram; "राहुल" is R, "Nita" is N).
 * Takes the first of the name's spellings written in English letters, else spells the
 * first one in English letters.
 */
export function englishInitial(...spellings: (string | undefined)[]): string {
  const names = spellings.map((name) => name?.trim() ?? "").filter(Boolean);
  const latin = names.find((name) => /[A-Za-z]/.test(name));
  const spelt = latin ?? romanize(names[0] ?? "");
  return spelt.match(/[A-Za-z]/)?.[0]?.toUpperCase() ?? "";
}
