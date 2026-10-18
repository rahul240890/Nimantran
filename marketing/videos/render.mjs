// Renders every video in the series to out/, one after another.
// Usage: node render.mjs [composition-id ...]  (no ids: all of them)
import { execFileSync } from "node:child_process";

const all = [
  "meet-shubh-en",
  "meet-shubh-hi",
  ...["rajwada-bagh", "kutch-toran", "tanjore"].flatMap((d) => [`dotd-${d}-en`, `dotd-${d}-hi`]),
];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;
for (const id of ids) {
  console.log(`rendering ${id}`);
  execFileSync(
    "npx",
    [
      "remotion",
      "render",
      "src/index.ts",
      id,
      `out/${id}.mp4`,
      "--codec=h264",
      "--crf=19",
      "--audio-bitrate=192k",
      "--log=error",
    ],
    { stdio: "inherit" },
  );
}
