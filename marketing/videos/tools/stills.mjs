// Renders every still (feed posts, Stories, carousel, YouTube, Google) to out/images/.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

import { browserExecutable } from "./browser.mjs";
const LANGS = ["en", "hi"];
const jobs = [];
const add = (folder, concepts, width, height, langs = LANGS) => {
  for (const concept of concepts)
    for (const lang of langs)
      jobs.push({ folder, name: `${concept}-${lang}`, props: { concept, lang, width, height } });
};
add(
  "instagram-feed-1080x1350",
  ["mother", "grandmother", "friends", "gate", "price", "mehendi", "rsvp"],
  1080,
  1350,
);
add("instagram-square-1080x1080", ["mother", "gate", "price"], 1080, 1080);
add("instagram-story-1080x1920", ["mother", "bride", "gate", "mehendi"], 1080, 1920);
add("instagram-carousel-1080x1350", ["c1", "c2", "c3", "c4", "c5"], 1080, 1350);
add("youtube-thumbnail-1280x720", ["yt-explainer", "yt-gate"], 1280, 720);
add("youtube-banner-2560x1440", ["banner"], 2560, 1440, ["en"]);
add("google-landscape-1200x628", ["mother", "friends", "gate"], 1200, 628);
add("google-square-1200x1200", ["mother", "gate", "price"], 1200, 1200);
add("google-portrait-960x1200", ["mother", "friends", "mehendi"], 960, 1200);
add("google-logo", ["logo"], 1200, 1200, ["en"]);
add("google-logo", ["logo-wide"], 1200, 300, ["en"]);

const only = process.argv[2];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const job of jobs) {
  if (only && !job.folder.includes(only) && !job.name.includes(only)) continue;
  const composition = await selectComposition({
    serveUrl,
    id: "poster",
    inputProps: job.props,
    browserExecutable,
  });
  const dir = path.join("out/images", job.folder);
  mkdirSync(dir, { recursive: true });
  const output = path.join(dir, `${job.name}.${job.folder === "google-logo" ? "png" : "jpg"}`);
  await renderStill({
    composition,
    serveUrl,
    output,
    inputProps: job.props,
    ...(output.endsWith("png") ? { imageFormat: "png" } : { imageFormat: "jpeg", jpegQuality: 92 }),
    browserExecutable,
  });
  console.log(output);
}
