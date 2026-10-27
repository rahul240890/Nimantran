/*
 * The family's pages in One Scene (owner, 2026-10-27: a scene showed the couple and the
 * functions but none of the family). The story's family pages (the blessings, each side's
 * parents, a line in memory, the hosts, the day) come into the slot before the functions,
 * as the pages turn before them. The slot is much smaller than a page, so the pages are
 * dealt into as many slot cards as they need, a block at a time: a side's parents are
 * never split between two cards.
 */

import type { StoryBeat, StoryLine } from "@/lib/engine/story";
import type { ScenePage } from "./scene";

/** A body line longer than this (two people's names) takes two lines in the slot. */
const LONG_LINE = 30;

/** Lines a slot card holds at the least and the most, whatever its painting gives it. */
const CARD_LINES_MIN = 4;
const CARD_LINES_MAX = 8;

/** How many of the family's lines one slot card holds, from the share of the painting it has. */
export function slotLines(page: Pick<ScenePage, "slot" | "card">): number {
  // A painted card's words keep to its writing area
  const height = page.card ? (page.slot[3] * page.card.text[3]) / 100 : page.slot[3];
  return Math.min(CARD_LINES_MAX, Math.max(CARD_LINES_MIN, Math.round(height / 4)));
}

const weight = (line: StoryLine) => (line.style === "body" && line.text.length > LONG_LINE ? 2 : 1);

/**
 * The story's family pages as slot cards, each holding at most `capacity` lines' worth. Every
 * family block opens with its title (a label line), so a card breaks only before one. The
 * invitation's own line is left out: the scene prints it under the names or opens with it.
 */
export function sceneFamilyCards(
  beats: readonly StoryBeat[],
  capacity: number,
  line = "",
): StoryLine[][] {
  const own = line.trim();
  const lines = beats
    .filter((beat) => beat.scene === "family")
    .flatMap((beat) => beat.lines)
    .filter((each) => each.text.trim() && each.text.trim() !== own);
  // Blocks: a run of lines from one title to the next
  const blocks: StoryLine[][] = [];
  for (const each of lines) {
    const last = blocks[blocks.length - 1];
    if (!last || each.style === "label") blocks.push([each]);
    else last.push(each);
  }
  const cards: StoryLine[][] = [];
  let held = 0;
  for (const block of blocks) {
    const size = block.reduce((sum, each) => sum + weight(each), 0);
    const last = cards[cards.length - 1];
    if (last && held + size <= capacity) {
      last.push(...block);
      held += size;
    } else {
      cards.push([...block]);
      held = size;
    }
  }
  return cards;
}
