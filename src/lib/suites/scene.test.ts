import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SCENE_THEME_IDS, isSceneTheme } from "./catalog";
import { ENTRANCES, SCENE_SUITES, entranceFor, hasScene, scenePage } from "./scene";

const bottom = ([, y, , height]: readonly number[]) => y! + height!;

describe("One Scene", () => {
  it("places the names, line and slot below the frames and inside the painting", () => {
    expect(SCENE_SUITES).toEqual(expect.arrayContaining(["rajwada-bagh", "kayal"]));
    for (const suite of SCENE_SUITES) {
      for (const photos of [0, 1, 2]) {
        const page = scenePage(suite, photos)!;
        // A Scene theme is painted with one frame
        expect(page.frames.length).toBe(photos === 2 && !isSceneTheme(suite) ? 2 : 1);
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

  it("gives every Scene theme its painting, its card and words that sit on the card", () => {
    expect(SCENE_SUITES).toEqual(expect.arrayContaining([...SCENE_THEME_IDS]));
    for (const suite of SCENE_THEME_IDS) {
      const page = scenePage(suite, 2)!;
      expect(page.style).toBe("painted");
      for (const src of [page.image, page.card!.image]) {
        expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
      }
      const [x, y, width, height] = page.card!.text;
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x + width).toBeLessThanOrEqual(100);
      expect(y + height).toBeLessThanOrEqual(100);
      // Room enough on the card for a celebration's name, day and place
      expect((width * page.slot[2]) / 100, suite).toBeGreaterThanOrEqual(45);
      expect((height * page.slot[3]) / 100, suite).toBeGreaterThanOrEqual(12);
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
