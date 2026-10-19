// Renders a strip of evenly spaced stills for each composition, to check layouts quickly.
// Usage: node tools/preview.mjs <out-dir> <frames-per-strip> <id> [id ...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [outDir, count, ...ids] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
import { browserExecutable } from "./browser.mjs";
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const n = Number(count);
  const files = [];
  for (let i = 0; i < n; i++) {
    const frame = Math.min(
      composition.durationInFrames - 1,
      Math.round(((i + 0.5) / n) * composition.durationInFrames),
    );
    const output = path.join(outDir, `${id}-${i}.jpg`);
    await renderStill({
      composition,
      serveUrl,
      output,
      frame,
      imageFormat: "jpeg",
      jpegQuality: 80,
      scale: 0.3,
      browserExecutable,
    });
    files.push(output);
  }
  const strip = path.join(outDir, `${id}.jpg`);
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    ...files.flatMap((f) => ["-i", f]),
    "-filter_complex",
    `${files.map((_, i) => `[${i}]`).join("")}hstack=${files.length}`,
    strip,
  ]);
  console.log(strip);
}
