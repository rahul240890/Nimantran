import { beatSeconds, fitStory, type BeatLayout, type StoryBeat } from "@/lib/engine/story";
import type { CardLanguage } from "@/lib/templates/card-languages";

/*
 * The host's own changes to each page (Step 12s part 3): its words line by line, where they
 * sit on the painting, a box or none, or the page left out. A page nobody changed keeps
 * the words the invite writes itself from the names, family and functions. Kept free of
 * the validator (the schema is in ./draft-checks.ts) so the guest's page stays light.
 */

/** The kinds of line a host can pick, each drawn in the theme's own font and ink. */
export const EDIT_STYLES = ["label", "script", "display", "body", "small"] as const;
export type EditStyle = (typeof EDIT_STYLES)[number];
export const PLACES = ["top", "middle", "bottom"] as const;
export const ALIGNS = ["center", "start"] as const;
export const BOXES = ["theme", "on", "off"] as const;

export const MAX_LINES = 12;
export const LINE_MAX = 160;
export const PAGE_ID_MAX = 40;

export type PageLine = { text: string; style: EditStyle };
export type PageLayout = {
  hidden: boolean;
  place: (typeof PLACES)[number];
  align: (typeof ALIGNS)[number];
  box: (typeof BOXES)[number];
};
export type DraftPages = {
  /** Per page id ("cover", "fn-sangeet"): the same in every card language. */
  layout: Record<string, PageLayout>;
  /** Per card language, per page id: the host's lines, replacing the written ones. */
  words: Partial<Record<CardLanguage, Record<string, PageLine[]>>>;
};

export const noPages: DraftPages = { layout: {}, words: {} };
export const defaultLayout: PageLayout = {
  hidden: false,
  place: "middle",
  align: "center",
  box: "theme",
};

/** The cover carries the names and the last page the reply, so neither can be left out. */
export function canHide(pageId: string): boolean {
  return pageId !== "cover" && pageId !== "reply";
}

/** A line the invite wrote, as the host can edit it: the joiner and symbol become plain kinds. */
export function editableLines(beat: StoryBeat): PageLine[] {
  return beat.lines.map((line) => ({
    text: line.text,
    style: line.style === "joiner" ? "script" : line.style === "symbol" ? "label" : line.style,
  }));
}

/** Whether the host has written this page's words themselves, in this language. */
export function hasOwnWords(pages: DraftPages, language: CardLanguage, pageId: string): boolean {
  return Boolean(pages.words[language]?.[pageId]);
}

/**
 * The invite's pages with the host's changes: their own lines where they wrote them, their
 * placement, and the pages they left out gone. Timings follow the new words.
 */
export function applyPages(
  beats: readonly StoryBeat[],
  pages: DraftPages,
  language: CardLanguage,
): StoryBeat[] {
  const own = pages.words[language] ?? {};
  const changed = beats
    .filter((beat) => !(canHide(beat.id) && pages.layout[beat.id]?.hidden))
    .map((beat) => {
      const lines = own[beat.id];
      const layout = pages.layout[beat.id];
      let next = beat;
      if (lines) {
        const shown = lines
          .map((line) => ({ text: line.text.trim(), style: line.style }))
          .filter((line) => line.text);
        const seconds = beatSeconds(shown, beat.symbol);
        next = { ...next, lines: shown, seconds: Math.max(seconds, beat.photos ? 6 : beat.id === "blessing" ? 5 : 0) };
      }
      if (layout) next = { ...next, layout: beatLayout(layout) };
      return next;
    });
  return fitStory(changed);
}

function beatLayout(layout: PageLayout): BeatLayout {
  return {
    place: layout.place,
    align: layout.align,
    box: layout.box === "theme" ? null : layout.box === "on",
  };
}
