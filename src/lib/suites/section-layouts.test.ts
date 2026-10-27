import { describe, expect, it } from "vitest";
import { SUITE_IDS } from "./catalog";
import { SECTION_LAYOUTS, sectionLayouts, type SectionPart } from "./section-layouts";

describe("each theme's guest page layout", () => {
  it("is the same every time for a theme", () => {
    expect(sectionLayouts("rajwada-bagh")).toEqual(sectionLayouts("rajwada-bagh"));
  });

  it("uses every layout of every part, spread across the themes", () => {
    for (const part of Object.keys(SECTION_LAYOUTS) as SectionPart[]) {
      const counts = new Map<string, number>();
      for (const suite of SUITE_IDS) {
        const layout = sectionLayouts(suite)[part];
        counts.set(layout, (counts.get(layout) ?? 0) + 1);
      }
      for (const layout of SECTION_LAYOUTS[part]) {
        // No layout is left out, and none takes more than half the themes
        expect(counts.get(layout) ?? 0, `${part}: ${layout}`).toBeGreaterThan(SUITE_IDS.length / 8);
        expect(counts.get(layout) ?? 0, `${part}: ${layout}`).toBeLessThan(SUITE_IDS.length / 2);
      }
    }
  });

  it("gives most themes a page of their own", () => {
    const pages = new Set(SUITE_IDS.map((suite) => JSON.stringify(sectionLayouts(suite))));
    // 324 mixes for over 370 themes: most of the mixes are in use, not a handful of pages
    // shared by everyone
    expect(pages.size).toBeGreaterThan(Math.min(SUITE_IDS.length / 2, (324 * 3) / 4));
  });
});
