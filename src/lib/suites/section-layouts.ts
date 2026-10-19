import type { SuiteId } from "./catalog";

/*
 * How each part of the guest page below a painted theme is laid out (themed-details.tsx).
 * Every part has a few layouts and each theme gets its own mix, picked from its id, so two
 * themes side by side in the gallery rarely give their guests the same page: one shows the
 * date in a floor pattern and its celebrations on a timeline, the next a calendar page and
 * a deck of cards. The theme's colours, flowers and lamps stay its own either way.
 */

export const SECTION_LAYOUTS = {
  /** Save the date: drawn in a floor pattern, a calendar page, or a ticket. */
  date: ["medallion", "calendar", "ticket"],
  /** The day's plan above the celebrations: cards, a timeline, or tiles. */
  plan: ["cards", "timeline", "tiles"],
  /**
   * Each celebration's hour: painting beside the card, the card over the painting, sides
   * that alternate, or every celebration strung on one thread through the day.
   */
  hours: ["split", "overlay", "zigzag", "timeline"],
  /** The photos at dusk: a film to scroll, polaroids on a table, or a mosaic. */
  photos: ["film", "polaroids", "mosaic"],
  /** The family: cards, one scroll with ornaments between, or ribbons. */
  family: ["cards", "scroll", "ribbons"],
} as const;

export type SectionPart = keyof typeof SECTION_LAYOUTS;
export type SectionLayouts = { [P in SectionPart]: (typeof SECTION_LAYOUTS)[P][number] };

/** A small, stable hash: the same theme always gets the same page, on server and client. */
export function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** The layout of each part of this theme's guest page. */
export function sectionLayouts(suite: SuiteId): SectionLayouts {
  const pick = <P extends SectionPart>(part: P): SectionLayouts[P] => {
    const options = SECTION_LAYOUTS[part];
    return options[hash(`${suite}:${part}`) % options.length] as SectionLayouts[P];
  };
  return {
    date: pick("date"),
    plan: pick("plan"),
    hours: pick("hours"),
    photos: pick("photos"),
    family: pick("family"),
  };
}
