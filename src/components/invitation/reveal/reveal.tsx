import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { BY_LETTER, type NameReveal, type PhotoReveal } from "@/lib/suites/reveal";
import "@/app/reveals.css";

/*
 * The theme's own way of bringing in the couple's photos and names (lib/suites/reveal.ts),
 * moved by reveals.css. Rendered the same on the server and in the browser, so a page
 * that arrives already drawn still plays its reveal; reduced motion stops it in CSS.
 */

/** How far apart the two photos arrive: the bride's first, then the groom's. */
const PHOTO_GAP_MS = 380;
/** The name's letters come in this far apart, closer together for a long name. */
const LETTER_MS = 60;
const LETTERS_MS = 900;
/** The pause before the next part of the names (the joiner, the second name). */
const PART_MS = 140;

// Letters split cleanly only in scripts that don't join them; the others come in a word at a time
export const SPLITS_BY_LETTER = /^[\p{Script=Latin}\p{Script=Common}\p{M}\s]*$/u;
export const letters =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? (word: string) =>
        [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(word)].map(
          (part) => part.segment,
        )
    : (word: string) => Array.from(word);

/**
 * The class and timing for photo `index` of `count`, arriving `start` ms after it is
 * drawn. A pair comes in from its own sides (the bride's left, the groom's right).
 */
export function photoReveal(
  kind: PhotoReveal,
  index: number,
  count: number,
  start = 0,
): { className: string; style: CSSProperties } {
  const side = count > 1 ? (index === 0 ? -1 : 1) : 0;
  return {
    className: cn("reveal-photo", `reveal-photo-${kind}`),
    style: {
      "--reveal-delay": `${start + index * PHOTO_GAP_MS}ms`,
      // Which way it leans, turns or sweeps: away from the middle, or one way when alone
      "--reveal-dir": side || 1,
      "--reveal-x": side > 0 ? "100%" : "0%",
      "--reveal-reach": side > 0 ? "-200%" : "200%",
    } as CSSProperties,
  };
}

/** How many pieces `text` moves in: letters, or words in a script whose letters join. */
function units(kind: NameReveal, text: string): number {
  if (!BY_LETTER.has(kind)) return 1;
  const words = text.split(/\s+/).filter(Boolean);
  if (!SPLITS_BY_LETTER.test(text)) return words.length;
  return words.reduce((sum, word) => sum + letters(word).length, 0);
}

/** The gap between letters for names this long, so a long name takes no longer than a short one. */
function stepFor(kind: NameReveal, parts: readonly string[]): number {
  const total = parts.reduce((sum, part) => sum + units(kind, part), 0);
  return total > 0 ? Math.min(LETTER_MS, LETTERS_MS / total) : LETTER_MS;
}

/**
 * When each part of the names starts, from `start`: the first name, then the joiner, then
 * the second, each after the one before has had its letters.
 */
export function nameTimings(kind: NameReveal, parts: readonly string[], start: number) {
  const step = stepFor(kind, parts);
  let at = start;
  return parts.map((part) => {
    const begins = at;
    at += units(kind, part) * step + PART_MS;
    return { at: begins, step };
  });
}

/**
 * One name (or the joiner) arriving in the theme's way. Letter-by-letter styles split it
 * into letters, kept inside their words so lines break where they would for plain text;
 * a script whose letters join moves a word at a time. Screen readers hear the plain name.
 * `part` says which of the three it is, for the styles that move them apart.
 */
export function RevealName({
  kind,
  text,
  at,
  step,
  part,
}: {
  kind: NameReveal;
  text: string;
  at: number;
  step: number;
  part: "first" | "joiner" | "second";
}) {
  const whole = !BY_LETTER.has(kind);
  if (whole) {
    return (
      <span
        className={cn("reveal-name", `reveal-name-${kind}`)}
        data-part={part}
        style={{ "--reveal-delay": `${at}ms` } as CSSProperties}
      >
        {text}
      </span>
    );
  }
  const byLetter = SPLITS_BY_LETTER.test(text);
  let unit = 0;
  const piece = (content: string, key: number) => (
    <span
      key={key}
      className="reveal-letter"
      style={{ "--reveal-delay": `${at + unit++ * step}ms` } as CSSProperties}
    >
      {content}
    </span>
  );
  return (
    <span className={cn("reveal-name", `reveal-name-${kind}`)} data-part={part}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(/(\s+)/).map((word, i) => {
          if (!word) return null;
          if (/^\s+$/.test(word)) return word;
          if (!byLetter) return piece(word, i);
          return (
            <span key={i} className="reveal-word">
              {letters(word).map((letter, j) => piece(letter, j))}
            </span>
          );
        })}
      </span>
    </span>
  );
}
