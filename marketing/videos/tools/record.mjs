// Records the real site on a phone-sized screen at full HD (1080 × 1920) with Chrome's
// screencast, then joins the frames into a constant 30 fps MP4 in public/footage/.
// Run the site first (npm run build && npm start in the site's folder), then:
// node tools/record.mjs <open|rsvp|joys|designs>   (SITE_URL defaults to http://localhost:3000)
import { chromium } from "../../../node_modules/playwright/index.mjs";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const [scenario] = process.argv.slice(2);
const out = `public/footage/${scenario}.mp4`;
mkdirSync("public/footage", { recursive: true });
const BASE = process.env.SITE_URL ?? "http://localhost:3000";
const frames = path.join(os.tmpdir(), `shubh-frames-${scenario}`);
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const context = await browser.newContext({
  viewport: { width: 390, height: 693 },
  deviceScaleFactor: 1080 / 390,
  isMobile: true,
  hasTouch: true,
  colorScheme: "light",
});
const page = await context.newPage();
const hide = async () =>
  page.addStyleTag({ content: "[data-sample-bar]{display:none!important}" }).catch(() => {});
const wait = (ms) => page.waitForTimeout(ms);
/** Scrolls by `px` smoothly over `ms`, like a thumb. */
async function glide(px, ms = 900) {
  const steps = Math.round(ms / 16);
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps,
      t1 = (i + 1) / steps;
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    await page.mouse.wheel(0, px * (ease(t1) - ease(t0)));
    await wait(16);
  }
}

/** Leaves the page-by-page story for the full card. */
async function toCard() {
  await page
    .getByRole("button", { name: /continue/i })
    .first()
    .click()
    .catch(() => {});
  await wait(1200);
  await page
    .getByRole("button", { name: "Skip to the card" })
    .click()
    .catch(() => {});
  await wait(2500);
}

const shots = [];
const client = await context.newCDPSession(page);
client.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  const file = path.join(frames, `${String(shots.length).padStart(5, "0")}.jpg`);
  writeFileSync(file, Buffer.from(data, "base64"));
  shots.push({ file, t: metadata.timestamp });
  await client.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
});
const record = () =>
  client.send("Page.startScreencast", {
    format: "jpeg",
    quality: 92,
    maxWidth: 1080,
    maxHeight: 1920,
  });

const SCENARIOS = {
  // A guest opens the invitation: the gate, the doors, the cover and the functions
  async open() {
    await page.goto(`${BASE}/sample/rajwada-bagh`, { waitUntil: "domcontentloaded" });
    await hide();
    await wait(1200);
    await record();
    await wait(1800);
    await page.getByRole("button", { name: "Open the invitation" }).click();
    await wait(5200);
    for (let i = 0; i < 7; i++) {
      await glide(693, 1000);
      await wait(1500);
    }
  },
  // A guest replies: Coming to each function, then Send reply
  async rsvp() {
    await page.goto(`${BASE}/sample/rajwada-bagh`, { waitUntil: "domcontentloaded" });
    await wait(3000);
    await hide();
    await page.getByRole("button", { name: "Open the invitation" }).click();
    await wait(5500);
    await toCard();
    await page.evaluate(() => {
      const el = document.getElementById("guest-rsvp") ?? document.getElementById("rsvp");
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
    });
    await wait(1800);
    await record();
    await wait(1000);
    const name = page.getByRole("textbox", { name: /your name/i });
    await name.tap();
    await wait(300);
    await name.pressSequentially("Mehta family", { delay: 110 });
    await wait(500);
    await page.getByRole("button", { name: "Coming to everything" }).tap();
    await wait(1400);
    await glide(420, 900);
    await wait(500);
    await glide(420, 900);
    await wait(500);
    const send = page.getByRole("button", { name: "Send reply" });
    await send.scrollIntoViewIfNeeded();
    await wait(700);
    await send.tap();
    await wait(4000);
  },
  // The little joys: shower flowers, light the diyas
  async joys() {
    await page.goto(`${BASE}/sample/rajwada-bagh`, { waitUntil: "domcontentloaded" });
    await wait(3000);
    await hide();
    await page.getByRole("button", { name: "Open the invitation" }).click();
    await wait(5500);
    await toCard();
    const flowers = page.getByRole("button", { name: "Shower flowers on the couple" });
    await flowers.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -120));
    await wait(1500);
    await record();
    await wait(900);
    await flowers.tap();
    await wait(3800);
    const diyas = page.getByRole("button", { name: "Light the diyas" });
    await diyas.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -200));
    await wait(1200);
    await diyas.tap();
    await wait(4500);
  },
  // Browsing designs
  async designs() {
    await page.goto(`${BASE}/designs`, { waitUntil: "domcontentloaded" });
    await wait(4000);
    await record();
    await wait(1200);
    for (let i = 0; i < 6; i++) {
      await glide(520, 1100);
      await wait(700);
    }
  },
};

await SCENARIOS[scenario]();
await wait(600);
await client.send("Page.stopScreencast");
await browser.close();

// Each frame lasts until the next one; the last one holds for half a second
const lines = [];
shots.forEach((shot, i) => {
  const next = shots[i + 1]?.t ?? shot.t + 0.5;
  lines.push(`file '${shot.file}'`, `duration ${(next - shot.t).toFixed(4)}`);
});
lines.push(`file '${shots.at(-1).file}'`);
writeFileSync(path.join(frames, "list.txt"), lines.join("\n"));
execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  path.join(frames, "list.txt"),
  "-vf",
  "fps=30,scale=1080:1920:flags=lanczos,format=yuv420p",
  "-c:v",
  "libx264",
  "-crf",
  "18",
  out,
]);
console.log(scenario, shots.length, "frames →", out);
