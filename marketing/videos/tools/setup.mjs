// Fills public/ from the site: the painted designs, gates, logo and fonts the videos use,
// then records each raga. Run once after npm install, and again when a video adds a design.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = fileURLToPath(new URL("../../../", import.meta.url));
const from = (...parts) => path.join(SITE, ...parts);

/** Designs every page of which a video shows, and designs only seen by their cover. */
const STORIES = ["rajwada-bagh", "kutch-toran", "tanjore"];
const COVERS = ["rajbari", "peshwai-wada", "phulkari-haveli", "kayal", "pichwai", "noor-bagh"];
const GATES = ["rajwada-pol", "haveli-kiwad", "gopuram-kadhavu"];
const RAGAS = ["yaman", "bihag", "pilu", "hamsadhwani"];
const FONTS = [
  "@fontsource/rozha-one/files/rozha-one-latin-400-normal.woff2",
  "@fontsource/rozha-one/files/rozha-one-devanagari-400-normal.woff2",
  "@fontsource-variable/karla/files/karla-latin-wght-normal.woff2",
  "@fontsource/tenor-sans/files/tenor-sans-latin-400-normal.woff2",
  "@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2",
  "@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2",
  "@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff2",
  "@fontsource/marcellus/files/marcellus-latin-400-normal.woff2",
  "@fontsource-variable/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-wght-normal.woff2",
  "@fontsource/tiro-devanagari-hindi/files/tiro-devanagari-hindi-devanagari-400-normal.woff2",
  "@fontsource/rasa/files/rasa-gujarati-600-normal.woff2",
  "@fontsource/tiro-bangla/files/tiro-bangla-bengali-400-normal.woff2",
  "@fontsource/tiro-tamil/files/tiro-tamil-tamil-400-normal.woff2",
];

if (!existsSync(from("node_modules")))
  throw new Error("Run npm install in the site's folder first");

for (const id of STORIES)
  cpSync(from("public/suites", id), `public/suites/${id}`, { recursive: true });
for (const id of COVERS) {
  mkdirSync(`public/suites/${id}`, { recursive: true });
  cpSync(from("public/suites", id, "cover.webp"), `public/suites/${id}/cover.webp`);
}
for (const id of GATES)
  cpSync(from("public/openings/gates", id), `public/gates/${id}`, { recursive: true });
cpSync(from("public/brand"), "public/brand", { recursive: true });
mkdirSync("public/fonts", { recursive: true });
for (const file of FONTS) cpSync(from("node_modules", file), `public/fonts/${path.basename(file)}`);

const recorded = existsSync("public/music") ? readdirSync("public/music") : [];
for (const raga of RAGAS) {
  if (recorded.includes(`${raga}.wav`)) continue;
  execFileSync("node", ["tools/music.mjs", raga], { stdio: "inherit" });
}
console.log("public/ is ready");
