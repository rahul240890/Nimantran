/*
 * The pictures the editor's gate picker shows (owner, 2026-10-24: the picker drew every one
 * of its 200-odd gates live, each loading its full-size paintings, so it was slow to open and
 * heavy to scroll). Each painted gate is photographed closed, as the review page
 * /engine/gates draws it, into a small picture, public/openings/posters/<gate>.webp, and a
 * tile in one small blurred sheet, public/openings/posters/sheet-<hash>.webp, that the
 * picker fetches once so every tile has its gate the moment it is drawn. Which tile is whose
 * is in src/lib/opening/gate-posters.json (read by src/lib/opening/posters.ts).
 *
 * Run after adding or repainting a gate, with the site running (npm run build, then
 * npm run start): BASE=http://localhost:3000 npx tsx scripts/gate-posters.ts
 */
import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp, { type OverlayOptions } from "sharp";
import { POSTER_GATES } from "../src/lib/opening/poster-gates";

const BASE = process.env.BASE ?? "http://localhost:3000";
/** A picture's width: sharp in the picker's tiles on a phone and in the wide dialog. */
const POSTER_WIDTH = 240;
const POSTER_QUALITY = 64;
/** A tile in the sheet, nine by sixteen as a phone's screen is, and the edge copied round it. */
const TILE = [9, 16] as const;
const GUTTER = 1;
const COLUMNS = 32;

const root = process.cwd();
const out = join(root, "public", "openings", "posters");

async function main() {
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
  });
  // Still, so every gate is photographed shut and at rest
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto(`${BASE}/engine/gates`, { waitUntil: "networkidle" });

  const cell = [TILE[0] + GUTTER * 2, TILE[1] + GUTTER * 2] as const;
  const rows = Math.ceil(POSTER_GATES.length / COLUMNS);
  const sheetSize = [COLUMNS * cell[0], rows * cell[1]] as const;
  const tiles: OverlayOptions[] = [];
  const written = new Set<string>();

  for (const [i, gate] of POSTER_GATES.entries()) {
    const tile = page.locator(`[data-gate="${gate}"]`);
    await tile.scrollIntoViewIfNeeded();
    // Every painting in the gate loaded and decoded, so none is photographed half drawn
    await tile.evaluate(async (node) => {
      const images = [...node.querySelectorAll("img")];
      await Promise.all(
        images.map((image) =>
          image.complete
            ? null
            : new Promise((done) => {
                image.addEventListener("load", done, { once: true });
                image.addEventListener("error", done, { once: true });
              }),
        ),
      );
      await Promise.all(images.map((image) => image.decode().catch(() => null)));
    });
    await page.waitForTimeout(80);
    const shot = await tile.screenshot();
    const file = join(out, `${gate}.webp`);
    await sharp(shot)
      .resize({ width: POSTER_WIDTH, withoutEnlargement: true })
      .webp({ quality: POSTER_QUALITY, effort: 6, smartSubsample: true })
      .toFile(file);
    written.add(`${gate}.webp`);
    // The edge copied round each tile keeps its neighbours out when the sheet is drawn large
    const small = await sharp(shot)
      .resize({ width: TILE[0], height: TILE[1], fit: "fill" })
      .extend({ top: GUTTER, bottom: GUTTER, left: GUTTER, right: GUTTER, extendWith: "copy" })
      .png()
      .toBuffer();
    tiles.push({
      input: small,
      left: (i % COLUMNS) * cell[0],
      top: Math.floor(i / COLUMNS) * cell[1],
    });
  }
  await browser.close();

  const sheet = await sharp({
    create: { width: sheetSize[0], height: sheetSize[1], channels: 3, background: "#1c1530" },
  })
    .composite(tiles)
    .webp({ quality: 60, effort: 6 })
    .toBuffer();
  const sheetName = `sheet-${createHash("sha1").update(sheet).digest("hex").slice(0, 10)}.webp`;
  writeFileSync(join(out, sheetName), sheet);
  written.add(sheetName);

  // Gates no longer painted, and older sheets, go
  for (const name of readdirSync(out)) if (!written.has(name)) rmSync(join(out, name));

  const json = join(root, "src", "lib", "opening", "gate-posters.json");
  writeFileSync(
    json,
    JSON.stringify({
      sheet: `/openings/posters/${sheetName}`,
      columns: COLUMNS,
      rows,
      tile: TILE,
      gutter: GUTTER,
      gates: POSTER_GATES,
    }),
  );
  execFileSync("npx", ["prettier", "--write", json], { stdio: "ignore" });
  console.log(
    `${POSTER_GATES.length} gate pictures; sheet ${sheetSize.join("x")} (${sheet.length} bytes)`,
  );
}

void main();
