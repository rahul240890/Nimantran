#!/usr/bin/env node
/*
 * Makes the public sample videos (src/lib/videos/catalog.ts) from a running dev server:
 * opens /engine/video/make for each, lets the browser make the whole video, then re-encodes
 * it with ffmpeg as H.264 and AAC at 720 × 1280 (what every phone and Google play) with a
 * JPEG poster, into public/videos/<id>.mp4 and <id>.jpg.
 *
 *   npx next dev -p 3100 &   then   node scripts/sample-videos.mjs http://localhost:3100 [id …]
 *
 * Needs ffmpeg on the PATH. Existing files are kept unless their id is named.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const [base, ...only] = process.argv.slice(2);
if (!base) {
  console.error("Usage: node scripts/sample-videos.mjs <dev server url> [id …]");
  process.exit(1);
}
const catalog = readFileSync("src/lib/videos/catalog.ts", "utf8");
const videos = [
  ...catalog.matchAll(
    /id: "([a-z0-9-]+)",\s*design: "([a-z0-9-]+)",\s*lang: "([a-z]+)",\s*occasion: "([a-z-]+)"/g,
  ),
].map(([, id, design, lang, occasion]) => ({ id, design, lang, occasion }));
const out = "public/videos";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const video of videos) {
  const mp4 = join(out, `${video.id}.mp4`);
  if (only.length ? !only.includes(video.id) : existsSync(mp4)) continue;
  const started = Date.now();
  const page = await browser.newPage({ acceptDownloads: true });
  const query = new URLSearchParams({
    design: video.design,
    lang: video.lang,
    occasion: video.occasion,
  });
  await page.goto(`${base}/engine/video/make?${query}`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  await page.locator("[data-make]").click();
  const link = page.locator("a[data-video]");
  await link.waitFor({ timeout: 1_800_000 });
  const poster = Number(await link.getAttribute("data-poster"));
  const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
  const raw = join(tmpdir(), `${video.id}.webm`);
  await download.saveAs(raw);
  await page.close();
  const scale = ["-vf", "scale=720:1280:flags=lanczos"];
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    raw,
    ...scale,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "33",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "high",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    mp4,
  ]);
  // The poster is the moment the video's own poster shows, a little after the start
  // Check each one: for the first 16 a later frame showing the names was chosen by hand.
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-ss",
    String(Math.max(poster || 0.5, 0.5)),
    "-i",
    raw,
    "-frames:v",
    "1",
    ...scale,
    "-q:v",
    "4",
    join(out, `${video.id}.jpg`),
  ]);
  unlinkSync(raw);
  const seconds = Number(
    execFileSync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      mp4,
    ])
      .toString()
      .trim(),
  );
  console.log(
    `${video.id}: ${seconds.toFixed(1)} s, ${(statSync(mp4).size / 1e6).toFixed(1)} MB, made in ${Math.round((Date.now() - started) / 1000)} s`,
  );
}
await browser.close();
