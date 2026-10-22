/*
 * A tiny blurred copy of every painting, shown the moment a page comes in while the painting
 * itself is still on its way (owner, 2026-10-22: on a slow connection the pages came in as
 * words on a bare page). Each theme gets public/suites/<theme>/blur.json, its paintings by
 * file name, each a 16px-wide WebP of a few hundred bytes as a data URL (src/lib/paintings.ts).
 * Only the pages' paintings: the moving designs' layers and the openings' pieces need none.
 * Run after adding or repainting a theme: node scripts/painting-blurs.mjs
 */
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

/** The pages' paintings (PAGE_ARTS in src/lib/suites/catalog.ts), photo pages and Scenes. */
const PAGES = [
  "blessing",
  "cover",
  "family",
  "haldi",
  "mehendi",
  "sangeet",
  "baraat",
  "wedding",
  "reception",
  "reply",
  "couple",
  "couple-two",
  "photo",
  "scene",
];

const root = join(process.cwd(), "public", "suites");
for (const theme of readdirSync(root, { withFileTypes: true })) {
  if (!theme.isDirectory()) continue;
  const dir = join(root, theme.name);
  const paintings = readdirSync(dir)
    .filter((file) => PAGES.includes(file.replace(/\.webp$/, "")) && file.endsWith(".webp"))
    .sort();
  if (!paintings.length) continue;
  const blurs = {};
  for (const file of paintings) {
    const tiny = await sharp(join(dir, file))
      .resize({ width: 16 })
      .webp({ quality: 50 })
      .toBuffer();
    blurs[file.replace(/\.webp$/, "")] = `data:image/webp;base64,${tiny.toString("base64")}`;
  }
  writeFileSync(join(dir, "blur.json"), `${JSON.stringify(blurs, null, 1)}\n`);
  console.log(theme.name, paintings.length);
}
