// Takes the still frames the posters show from the recordings in public/footage/.
// Usage: node tools/shots.mjs  (after tools/record.mjs has recorded all four scenarios)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const SHOTS = {
  gate: ["open", 0.8],
  cover: ["open", 9.6],
  names: ["open", 13.5],
  haldi: ["open", 33],
  mehendi: ["open", 41],
  sangeet: ["open", 47],
  "rsvp-coming": ["rsvp", 7],
  flowers: ["joys", 2.2],
  diyas: ["joys", 12.5],
  designs: ["designs", 6],
};
mkdirSync("public/shots", { recursive: true });
for (const [name, [file, at]] of Object.entries(SHOTS)) {
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-ss",
    String(at),
    "-i",
    `public/footage/${file}.mp4`,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    `public/shots/${name}.jpg`,
  ]);
}
console.log("public/shots is ready");
