import { describe, expect, it } from "vitest";
import { ENTRANCES, SCENE_SUITES, entranceFor, hasScene, scenePage } from "./scene";

const bottom = ([, y, , height]: readonly number[]) => y! + height!;

describe("One Scene", () => {
  it("places the names, line and slot below the frames and inside the painting", () => {
    expect(SCENE_SUITES).toEqual(expect.arrayContaining(["rajwada-bagh", "kayal"]));
    for (const suite of SCENE_SUITES) {
      for (const photos of [0, 1, 2]) {
        const page = scenePage(suite, photos)!;
        expect(page.frames.length).toBe(photos === 2 ? 2 : 1);
        const framesEnd = Math.max(...page.frames.map((frame) => bottom(frame)));
        const boxes = [page.names, page.line, page.slot].filter((box) => box !== null);
        for (const [x, y, width, height] of boxes) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x + width).toBeLessThanOrEqual(100);
          expect(y + height).toBeLessThanOrEqual(100);
        }
        // The words start under the photos, and the slot under the words
        expect(page.names[1]).toBeGreaterThanOrEqual(framesEnd - 1);
        expect(page.slot[1]).toBeGreaterThanOrEqual(bottom(page.line ?? page.names));
      }
    }
  });

  it("is only offered on themes that have it", () => {
    expect(hasScene("kayal")).toBe(true);
    expect(hasScene("classic")).toBe(false);
    expect(scenePage("classic", 2)).toBeNull();
  });

  it("brings each function in from a different side than the one before", () => {
    for (let i = 1; i < 12; i++) expect(entranceFor(i)).not.toBe(entranceFor(i - 1));
    expect(new Set(ENTRANCES.map((_, i) => entranceFor(i))).size).toBe(ENTRANCES.length);
  });
});
