import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allDesigns, suiteImage } from "./catalog";
import { cardPictureFiles } from "./card-pictures";
import SHEET from "./card-sheet.json";
import { designPicture } from "./pictures";

const PUBLIC = join(process.cwd(), "public");

describe("the cards' own pictures", () => {
  // npx tsx scripts/card-pictures.ts makes them; a theme painted without running it fails here
  it("give every design's card a thumbnail and a blurred tile", () => {
    for (const design of allDesigns()) {
      const picture = designPicture(design);
      if (!picture) continue;
      const files = cardPictureFiles(picture);
      expect(files, design.id).not.toBeNull();
      expect(existsSync(join(PUBLIC, files!.thumb)), files!.thumb).toBe(true);
    }
  });

  it("give every painted design's cover a thumbnail, for the editor's More designs", () => {
    for (const design of allDesigns()) {
      const cover = design.id.startsWith("card-") ? null : suiteImage(design.suite);
      if (!cover) continue;
      const files = cardPictureFiles(cover);
      expect(files, design.id).not.toBeNull();
      expect(existsSync(join(PUBLIC, files!.thumb)), files!.thumb).toBe(true);
    }
  });

  it("keep no thumbnail no card shows, and only the sheet in use", () => {
    const shown = new Set([...SHEET.pictures, ...SHEET.covers].map((key) => `${key}.webp`));
    const root = join(PUBLIC, "cards");
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (entry.isFile()) {
        expect(`/cards/${entry.name}`).toBe(SHEET.sheet);
        continue;
      }
      for (const file of readdirSync(join(root, entry.name))) {
        expect(shown.has(`${entry.name}/${file}`), `${entry.name}/${file}`).toBe(true);
      }
    }
    expect(existsSync(join(PUBLIC, SHEET.sheet))).toBe(true);
  });

  it("draw the sheet so one tile fills the card, from its first corner to its last", () => {
    const first = cardPictureFiles(`/suites/${SHEET.pictures[0]}.webp`)!;
    expect(first.thumb).toBe(`/cards/${SHEET.pictures[0]}.webp`);
    expect(first.blur!.backgroundImage).toBe(`url(${SHEET.sheet})`);
    // 32 tiles of 15 by 20 across, each with a 1px edge round it
    const [width, height] = SHEET.tile;
    const sheetWidth = SHEET.columns * (width! + 2 * SHEET.gutter);
    const sheetHeight = SHEET.rows * (height! + 2 * SHEET.gutter);
    expect(first.blur!.backgroundSize).toBe(
      `${+((sheetWidth / width!) * 100).toFixed(4)}% ${+((sheetHeight / height!) * 100).toFixed(4)}%`,
    );
    expect(first.blur!.backgroundPosition).toBe(
      `${+((SHEET.gutter / (sheetWidth - width!)) * 100).toFixed(4)}% ${+((SHEET.gutter / (sheetHeight - height!)) * 100).toFixed(4)}%`,
    );
    // A tile in the last column sits at its edge less the gutter
    const lastInRow = cardPictureFiles(`/suites/${SHEET.pictures[SHEET.columns - 1]}.webp`)!;
    const left = (SHEET.columns - 1) * (width! + 2 * SHEET.gutter) + SHEET.gutter;
    expect(lastInRow.blur!.backgroundPosition).toMatch(
      new RegExp(`^${+((left / (sheetWidth - width!)) * 100).toFixed(4)}% `),
    );
  });

  it("give a cover a thumbnail but no tile, so the shared sheet stays small", () => {
    const cover = cardPictureFiles(`/suites/${SHEET.covers[0]}.webp`)!;
    expect(cover.thumb).toBe(`/cards/${SHEET.covers[0]}.webp`);
    expect(cover.blur).toBeNull();
  });

  it("leave a painting no card shows to load as it is", () => {
    expect(cardPictureFiles("/suites/kayal/haldi.webp")).toBeNull();
    expect(cardPictureFiles("/occasions/wedding.webp")).toBeNull();
  });
});
