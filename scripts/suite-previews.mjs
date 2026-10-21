/*
 * Link-preview copies of each painted theme's cover (the picture WhatsApp shows under an
 * invite link). The preview image is drawn by next/og, which reads PNG and JPEG but not
 * WebP, so each cover gets a small JPEG beside it: public/suites/<theme>/preview.jpg.
 * Emails can't count on WebP either, so each occasion tile gets a wide JPEG for the offers
 * in emails: public/occasions/<tile>-email.jpg.
 * Run after adding or repainting a theme or a tile: node scripts/suite-previews.mjs
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = join(process.cwd(), "public", "suites");
for (const theme of readdirSync(root)) {
  const cover = join(root, theme, "cover.webp");
  if (!existsSync(cover)) continue;
  const out = join(root, theme, "preview.jpg");
  // A Scene theme's cover has its photo frame cut out; the preview fills it with ivory
  await sharp(cover)
    .flatten({ background: "#f6ecd8" })
    .resize({ width: 480, height: 854, fit: "cover" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);
  console.log(out);
}

const tiles = join(process.cwd(), "public", "occasions");
for (const file of readdirSync(tiles).filter((name) => name.endsWith(".webp"))) {
  const out = join(tiles, file.replace(/\.webp$/, "-email.jpg"));
  await sharp(join(tiles, file))
    .resize({ width: 1040, height: 400, fit: "cover" })
    .jpeg({ quality: 74, mozjpeg: true })
    .toFile(out);
  console.log(out);
}
