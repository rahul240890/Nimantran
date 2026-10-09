import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ILLUSTRATED_IDS, PHOTO_CARD_IDS, SCENE_THEME_IDS, isSceneTheme } from "./catalog";
import type { FrameBox } from "./photo-frames";
import {
  ENTRANCES,
  SCENE_SUITES,
  entranceFor,
  hasScene,
  isIllustrated,
  isPhotoCard,
  sceneFrames,
  scenePage,
} from "./scene";

const bottom = ([, y, , height]: readonly number[]) => y! + height!;

describe("One Scene", () => {
  it("places the names, line and slot below the frames and inside the painting", () => {
    expect(SCENE_SUITES).toEqual(expect.arrayContaining(["rajwada-bagh", "kayal"]));
    for (const suite of SCENE_SUITES) {
      for (const photos of [0, 1, 2]) {
        const page = scenePage(suite, photos)!;
        // A Scene theme is painted with one frame, or one each for the bride and the groom
        expect(page.frames.length).toBe(
          isSceneTheme(suite) ? sceneFrames(suite) : photos === 2 ? 2 : 1,
        );
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
    for (const suite of SCENE_THEME_IDS.filter((id) => !isIllustrated(id) && !isPhotoCard(id))) {
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

  it("prints an illustrated card's words in its empty space, with no photos", () => {
    expect(ILLUSTRATED_IDS.length).toBe(73);
    for (const suite of ILLUSTRATED_IDS) {
      const page = scenePage(suite, 2)!;
      expect(page.style).toBe("bare");
      expect(page.card).toBeNull();
      expect(page.frames).toEqual([]);
      expect(sceneFrames(suite)).toBe(0);
      expect(existsSync(join(process.cwd(), "public", page.image)), suite).toBe(true);
      // The names, the line and the slot stay on the painting, one under the other
      for (const [x, y, width, height] of [page.names, page.line, page.slot].filter(
        (box): box is FrameBox => box !== null,
      )) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(x + width, suite).toBeLessThanOrEqual(100);
        expect(y + height, suite).toBeLessThanOrEqual(100);
      }
      expect(page.slot[1]).toBeGreaterThanOrEqual(bottom(page.line ?? page.names) - 0.01);
      // Room enough for a celebration's name, day and place
      expect(page.slot[2], suite).toBeGreaterThanOrEqual(45);
      expect(page.slot[3], suite).toBeGreaterThanOrEqual(10);
      // Its parts cover the whole painting between them, without overlapping
      const area = page.pieces.reduce((sum, { box: [, , w, h] }) => sum + w * h, 0);
      expect(area, suite).toBeCloseTo(100 * 100, 3);
      expect(new Set(page.pieces.map((piece) => piece.from)).size, suite).toBeGreaterThan(2);
    }
  });

  it("prints a two-photo card's words in its empty space, under the two frames", () => {
    expect(PHOTO_CARD_IDS.length).toBe(30);
    for (const suite of PHOTO_CARD_IDS) {
      const page = scenePage(suite, 2)!;
      expect(page.style).toBe("bare");
      expect(page.card).toBeNull();
      expect(sceneFrames(suite)).toBe(2);
      expect(page.frames.length).toBe(2);
      for (const file of ["scene.webp", "cover.webp", "preview.jpg"]) {
        expect(existsSync(join(process.cwd(), "public", "suites", suite, file)), suite).toBe(true);
      }
      // Room enough for a celebration's name, day and place
      expect(page.slot[2], suite).toBeGreaterThanOrEqual(45);
      expect(page.slot[3], suite).toBeGreaterThanOrEqual(10);
      // Its parts cover the whole painting between them, without overlapping
      const area = page.pieces.reduce((sum, { box: [, , w, h] }) => sum + w * h, 0);
      expect(area, suite).toBeCloseTo(100 * 100, 3);
    }
  });

  it("puts the bride's frame on the left and the groom's on the right, apart", () => {
    const pairs = SCENE_THEME_IDS.filter((suite) => sceneFrames(suite) === 2);
    expect(pairs).toEqual(
      expect.arrayContaining(["kadamb-krishna", "gulmohar", "wisteria-tunnel", "rakhi-dor"]),
    );
    for (const suite of pairs) {
      const [bride, groom] = scenePage(suite, 1)!.frames;
      expect(bride![0] + bride![2], suite).toBeLessThan(groom![0]);
    }
    expect(sceneFrames("udaipur-lake")).toBe(1);
    expect(sceneFrames("kayal")).toBe(1);
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
