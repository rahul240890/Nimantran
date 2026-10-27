import type { SuiteId } from "./catalog";

/*
 * How the guest page below a painted theme's pages is laid out (themed-details.tsx). Every
 * celebration is told once, on the day's timeline, never a screen each (owner, 2026-10-26);
 * the welcome, the date, the photos, the family, the blessings and the reply keep their
 * sections (owner, 2026-10-27). Each part has a few layouts and each theme gets its own mix,
 * picked from its id, on a ground of the theme's own colours, so two themes side by side
 * rarely look alike.
 */

export const SECTION_LAYOUTS = {
  /** Save the date: drawn in a floor pattern, a calendar page, or a ticket. */
  date: ["medallion", "calendar", "ticket"],
  /**
   * Every celebration on one timeline: a thread with numbered beads, sides that alternate
   * along a centre line, cloth cards joined by a dotted line, or a diary with the day large.
   */
  timeline: ["thread", "alternate", "cards", "diary"],
  /** The photos: a film to scroll, polaroids on a table, or a mosaic. */
  photos: ["film", "polaroids", "mosaic"],
  /** The family: cards, one scroll with ornaments between, or ribbons. */
  family: ["cards", "scroll", "ribbons"],
  /** The ground, in the theme's colours: plain cloth, cloth blending into its sky, or deep. */
  ground: ["cloth", "blend", "deep"],
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
    timeline: pick("timeline"),
    photos: pick("photos"),
    family: pick("family"),
    ground: pick("ground"),
  };
}
