// Records the site's own raga music (src/lib/engine/music-render.ts) to public/music/<raga>.wav,
// so the videos sound like the invitations. Usage: node tools/music.mjs <raga> [seconds]
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE = fileURLToPath(new URL("../../../", import.meta.url));
const site = (module) => pathToFileURL(path.join(SITE, "node_modules", module)).href;
const { build } = await import(site("esbuild/lib/main.js"));
const { chromium } = await import(site("playwright/index.mjs"));

const [raga, seconds = "40"] = process.argv.slice(2);
if (!raga) throw new Error("usage: music.mjs <raga> [seconds]");

const bundle = await build({
  stdin: {
    contents: `import { renderRaga } from "@/lib/engine/music-render"; window.renderRaga = renderRaga;`,
    resolveDir: SITE,
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "iife",
  alias: { "@": path.join(SITE, "src") },
});

// The machine's own Chromium when there is one (cloud sessions), else Playwright's
const executablePath = process.env.CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage();
await page.setContent("<!doctype html><title>music</title>");
await page.addScriptTag({ content: bundle.outputFiles[0].text });
const base64 = await page.evaluate(
  async ({ raga, seconds }) => {
    const buffer = await window.renderRaga({ raga }, seconds);
    // 16-bit stereo PCM WAV
    const channels = [buffer.getChannelData(0), buffer.getChannelData(1)];
    const frames = buffer.length;
    const out = new DataView(new ArrayBuffer(44 + frames * 4));
    const text = (at, s) => [...s].forEach((c, i) => out.setUint8(at + i, c.charCodeAt(0)));
    text(0, "RIFF");
    out.setUint32(4, 36 + frames * 4, true);
    text(8, "WAVEfmt ");
    out.setUint32(16, 16, true);
    out.setUint16(20, 1, true);
    out.setUint16(22, 2, true);
    out.setUint32(24, buffer.sampleRate, true);
    out.setUint32(28, buffer.sampleRate * 4, true);
    out.setUint16(32, 4, true);
    out.setUint16(34, 16, true);
    text(36, "data");
    out.setUint32(40, frames * 4, true);
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < 2; c++) {
        const v = Math.max(-1, Math.min(1, channels[c][i]));
        out.setInt16(44 + i * 4 + c * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      }
    }
    const bytes = new Uint8Array(out.buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  },
  { raga, seconds: Number(seconds) },
);
await browser.close();

mkdirSync("public/music", { recursive: true });
const raw = `public/music/${raga}.raw.wav`;
const file = `public/music/${raga}.wav`;
writeFileSync(raw, Buffer.from(base64, "base64"));
// As loud as social apps expect (about -16 LUFS), with Remotion's own ffmpeg
execFileSync(
  "npx",
  [
    "remotion",
    "ffmpeg",
    "-v",
    "error",
    "-y",
    "-i",
    raw,
    "-af",
    "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-ar",
    "48000",
    file,
  ],
  { stdio: "inherit" },
);
rmSync(raw);
console.log(file);
