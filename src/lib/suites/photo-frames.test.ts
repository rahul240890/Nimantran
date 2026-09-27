import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SUITE_IDS } from "./catalog";
import { PHOTO_PAGE_SUITES, photoPage } from "./photo-frames";

describe("couple photo paintings", () => {
  it("exist for every theme that lists them, with frames inside the painting", () => {
    expect(PHOTO_PAGE_SUITES.length).toBeGreaterThanOrEqual(7);
    for (const suite of PHOTO_PAGE_SUITES) {
      for (const count of [1, 2]) {
        const page = photoPage(suite, count)!;
        expect(existsSync(join(process.cwd(), "public", page.image)), page.image).toBe(true);
        expect(page.frames).toHaveLength(count);
        for (const [x, y, width, height] of page.frames) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x + width).toBeLessThanOrEqual(100);
          expect(y + height).toBeLessThanOrEqual(100);
        }
        // The names sit below every frame, never over a photo
        const lowest = Math.max(...page.frames.map(([, y, , height]) => y + height));
        expect(page.area.top).toBeGreaterThan(lowest);
        expect(100 - page.area.bottom).toBeGreaterThan(page.area.top + 10);
      }
    }
  });

  it("has no page for themes without the paintings, or without photos", () => {
    expect(photoPage("classic", 1)).toBeNull();
    const painted = SUITE_IDS.find((id) => PHOTO_PAGE_SUITES.includes(id))!;
    expect(photoPage(painted, 0)).toBeNull();
  });
});
