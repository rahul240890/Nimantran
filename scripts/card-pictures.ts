/*
 * The pictures the design cards show, cut ahead so a card never waits on the image resizer
 * (owner, 2026-10-24: on the occasion pages most cards' paintings never came in; the free
 * plan's resizer stops making new sizes once its month's allowance is spent).
 *
 * Each card's painting gets a small thumbnail of just what the card shows, its top three
 * quarters: public/cards/<theme>/<painting>.webp. And every card's painting gets a tile in
 * one small blurred sheet, public/cards/sheet-<hash>.webp, which a page fetches once so
 * each card has its painting, blurred, the moment it is drawn. Which tile is whose is in
 * src/lib/gallery/card-sheet.json (read by src/lib/gallery/card-pictures.ts).
 *
 * Run after adding or repainting a theme: npx tsx scripts/card-pictures.ts
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp, { type OverlayOptions } from "sharp";
import { allDesigns } from "../src/lib/gallery/catalog";
import { designPicture } from "../src/lib/gallery/pictures";

/** A thumbnail's width: sharp on a phone's two columns and a laptop's five. */
const THUMB_WIDTH = 480;
const THUMB_QUALITY = 62;
/** A tile in the sheet, three by four as a card is, and the copied edge round it. */
const TILE = [15, 20] as const;
const GUTTER = 1;
const COLUMNS = 32;
/** The card stock a Scene's cut-out frames show in the sheet. */
const IVORY = "#f6ecd8";

const root = process.cwd();
const cards = join(root, "public", "cards");

const pictures = [...new Set(allDesigns().flatMap((design) => designPicture(design) ?? []))].sort();
const keys = pictures.map((src) => {
  const match = /^\/suites\/([^/]+)\/([^/]+)\.webp$/.exec(src);
  if (!match) throw new Error(`A card picture outside the themes: ${src}`);
  return `${match[1]}/${match[2]}`;
});

/** A painting's top three quarters, as a card shows it. */
async function cardPart(src: string) {
  const file = join(root, "public", src);
  const { width = 0, height = 0 } = await sharp(file).metadata();
  return sharp(file).extract({
    left: 0,
    top: 0,
    width,
    height: Math.min(height, Math.round((width * 4) / 3)),
  });
}

async function main() {
  const cell = [TILE[0] + GUTTER * 2, TILE[1] + GUTTER * 2] as const;
  const rows = Math.ceil(keys.length / COLUMNS);
  const sheetSize = [COLUMNS * cell[0], rows * cell[1]] as const;
  const tiles: OverlayOptions[] = [];
  const written = new Set<string>();

  for (const [i, src] of pictures.entries()) {
    const key = keys[i]!;
    const out = join(cards, `${key}.webp`);
    mkdirSync(dirname(out), { recursive: true });
    const part = await cardPart(src);
    await part
      .clone()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY, effort: 6, smartSubsample: true })
      .toFile(out);
    written.add(out);
    // The edge copied round each tile keeps its neighbours out when the sheet is drawn large
    const tile = await part
      .clone()
      .flatten({ background: IVORY })
      .resize({ width: TILE[0], height: TILE[1], fit: "fill" })
      .extend({ top: GUTTER, bottom: GUTTER, left: GUTTER, right: GUTTER, extendWith: "copy" })
      .png()
      .toBuffer();
    tiles.push({
      input: tile,
      left: (i % COLUMNS) * cell[0],
      top: Math.floor(i / COLUMNS) * cell[1],
    });
  }

  const sheet = await sharp({
    create: {
      width: sheetSize[0],
      height: sheetSize[1],
      channels: 3,
      background: IVORY,
    },
  })
    .composite(tiles)
    .webp({ quality: 60, effort: 6 })
    .toBuffer();
  const hash = createHash("sha1").update(sheet).digest("hex").slice(0, 10);
  const sheetName = `sheet-${hash}.webp`;
  writeFileSync(join(cards, sheetName), sheet);

  // Pictures no card shows any more, and older sheets, go
  for (const entry of readdirSync(cards, { withFileTypes: true })) {
    const path = join(cards, entry.name);
    if (entry.isFile()) {
      if (entry.name !== sheetName) rmSync(path);
      continue;
    }
    for (const file of readdirSync(path)) {
      if (!written.has(join(path, file))) rmSync(join(path, file));
    }
    if (!readdirSync(path).length) rmSync(path, { recursive: true });
  }

  const json = join(root, "src", "lib", "gallery", "card-sheet.json");
  writeFileSync(
    json,
    JSON.stringify({
      sheet: `/cards/${sheetName}`,
      columns: COLUMNS,
      rows,
      tile: TILE,
      gutter: GUTTER,
      pictures: keys,
    }),
  );
  execFileSync("npx", ["prettier", "--write", json], { stdio: "ignore" });
  console.log(`${keys.length} card pictures; sheet ${sheetSize.join("x")} (${sheet.length} bytes)`);
  if (!existsSync(json)) throw new Error("No sheet index written");
}

void main();
