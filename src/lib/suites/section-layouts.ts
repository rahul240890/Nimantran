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
  /**
   * The photos at dusk, always one view down the page (owner, 2026-11-11: never a strip to
   * scroll sideways): polaroids on a table, a mosaic, a cascade of framed photos swaying in
   * from alternate sides, or two staggered rows of arches that bloom open one by one.
   */
  photos: ["polaroids", "mosaic", "cascade", "arches"],
  /** The family: cards, one scroll with ornaments between, or ribbons. */
  family: ["cards", "scroll", "ribbons"],
  /**
   * The countdown at the end of the page: arched frames on a toran, lamps in their niches,
   * hanging lanterns, flowers in bloom, flip tiles, or rings that fill (owner, 2026-11-04).
   */
  countdown: ["toran", "diyas", "lanterns", "bloom", "tiles", "rings"],
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
    countdown: pick("countdown"),
  };
}
