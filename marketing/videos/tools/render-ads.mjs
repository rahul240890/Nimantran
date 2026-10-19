// Renders every ad composition (ids starting "ad-", or those given) to out/ads/, bundling
// once, then brings the sound to -14 LUFS, the loudness Instagram and YouTube play at.
// Usage: node tools/render-ads.mjs [id ...]
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync, renameSync, existsSync } from "node:fs";
import path from "node:path";

import { browserExecutable } from "./browser.mjs";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const all = await getCompositions(serveUrl, { browserExecutable });
const wanted = process.argv.slice(2);
const list = all.filter((c) => (wanted.length ? wanted.includes(c.id) : c.id.startsWith("ad-")));
mkdirSync("out/ads", { recursive: true });
for (const composition of list) {
  const final = `out/ads/${composition.id}.mp4`;
  if (!wanted.length && existsSync(final)) continue;
  const raw = `out/ads/${composition.id}.raw.mp4`;
  const started = Date.now();
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 19,
    audioBitrate: "192k",
    outputLocation: raw,
    browserExecutable,
    concurrency: 4,
    imageFormat: "jpeg",
    jpegQuality: 92,
  });
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    raw,
    "-c:v",
    "copy",
    "-af",
    "loudnorm=I=-14:TP=-1.5:LRA=11",
    "-ar",
    "48000",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    final,
  ]);
  execFileSync("rm", [raw]);
  console.log(`${composition.id} ${((Date.now() - started) / 1000).toFixed(0)}s`);
}
console.log("all done");
