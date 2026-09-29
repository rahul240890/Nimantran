/*
 * Link-preview copies of each painted theme's cover (the picture WhatsApp shows under an
 * invite link). The preview image is drawn by next/og, which reads PNG and JPEG but not
 * WebP, so each cover gets a small JPEG beside it: public/suites/<theme>/preview.jpg.
 * Run after adding or repainting a theme: node scripts/suite-previews.mjs
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = join(process.cwd(), "public", "suites");
for (const theme of readdirSync(root)) {
  const cover = join(root, theme, "cover.webp");
  if (!existsSync(cover)) continue;
  const out = join(root, theme, "preview.jpg");
  await sharp(cover)
    .resize({ width: 480, height: 854, fit: "cover" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);
  console.log(out);
}
