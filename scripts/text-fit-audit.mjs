/*
 * Checks that the words on every theme stay inside their boxes. Run it against a dev
 * server (npm run dev), for one card language and one phone width at a time:
 *
 *   node scripts/text-fit-audit.mjs scenes gu 390
 *   node scripts/text-fit-audit.mjs stories ta 320
 *   MINI=1 node scripts/text-fit-audit.mjs scenes hi 170   # the editor's small preview
 *
 * Scenes: every Scene theme with every function in its slot, from /engine/scenes; the
 * names and line must stay in their boxes and clear of the slot, and the slot's words
 * inside the card's writing area. Stories: every page of every Story theme, from
 * /engine/pages; no page may overflow its words' area. ONLY=<theme,theme> narrows it,
 * BASE= points at another server and CHROMIUM= at a browser to use. Exits 1 on a problem.
 */

import { chromium } from "playwright";

const [kind = "scenes", lang = "en", width = "390"] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:3000";
const mini = process.env.MINI ? "&mini=1" : "";
const only = process.env.ONLY ?? "";

const STORY_THEMES = (
  "rajwada-bagh,shahi-savari,kayal,noor-bagh,phulkari-haveli,rajbari,peshwai-wada,kutch-toran," +
  "gubbara,saath,rooftop,ivory-arch,gulaab,deco-noir,taara,kaagaz,mitti,neel,pichwai,tanjore," +
  "kashi,sagar,mysuru,kalamkari,pattachitra,chinar,chai-bagan,sufi-raat,chapel,sakura,vigna," +
  "himani,van,riad,palna,deepotsav,jungle-party,classic"
).split(",");

const browser = await chromium.launch(
  process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {},
);
// Still mode, so nothing moves while it is measured
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const problems = [];

async function settle() {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
}

if (kind === "scenes") {
  const url = `${base}/engine/scenes?lang=${lang}&w=${width}${only ? `&only=${only}` : ""}${mini}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 240_000 });
  await settle();
  for (const cell of await page.$$("[data-scene-cell]")) {
    const suite = await cell.getAttribute("data-scene-cell");
    // One dot under the scene for each card in its slot
    const count = await cell.evaluate(
      (c) => c.querySelectorAll("span.h-1\\.5.rounded-full").length,
    );
    for (let i = 0; i < Math.max(count, 1); i++) {
      const found = await cell.evaluate((c) => {
        const out = [];
        const inside = (a, b) =>
          a.left >= b.left - 1.5 &&
          a.right <= b.right + 1.5 &&
          a.top >= b.top - 1.5 &&
          a.bottom <= b.bottom + 1.5;
        const innerOf = (el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            left: r.left + parseFloat(cs.paddingLeft),
            right: r.right - parseFloat(cs.paddingRight),
            top: r.top + parseFloat(cs.paddingTop),
            bottom: r.bottom - parseFloat(cs.paddingBottom),
          };
        };
        const slot = [...c.querySelectorAll(".scene-slot")].find(
          (s) => !s.getAttribute("aria-hidden"),
        );
        const slotRect = slot?.getBoundingClientRect();
        for (const print of c.querySelectorAll(".scene-print")) {
          // A bare slot's first child is display: contents, with no box of its own
          const words = (
            print.querySelector(".scene-card-words") ?? print.firstElementChild
          )?.getBoundingClientRect();
          if (!words) continue;
          const name = print.id ? "names" : "line";
          if (!inside(words, innerOf(print))) out.push(`${name} runs out of its box`);
          if (
            slotRect &&
            !print.classList.contains("scene-slot") &&
            Math.min(words.bottom, slotRect.bottom) - Math.max(words.top, slotRect.top) > 1 &&
            Math.min(words.right, slotRect.right) - Math.max(words.left, slotRect.left) > 1
          )
            out.push(`${name} overlaps the slot`);
        }
        if (slot) {
          const painted = slot.dataset.slot === "painted";
          const area = innerOf(painted ? slot.querySelector(":scope > div") : slot);
          for (const p of slot.querySelectorAll("p")) {
            if ([...p.getClientRects()].some((r) => r.height > 0 && !inside(r, area))) {
              out.push(`"${p.textContent.slice(0, 30)}" runs out of the card`);
              break;
            }
          }
        }
        return out;
      });
      for (const f of found) problems.push(`${suite} [${i}] ${f}`);
      const next = await cell.$('[aria-label="Next celebration"]');
      if (!next) break;
      await next.click();
      await page.waitForTimeout(150);
    }
  }
} else {
  for (const suite of only ? only.split(",") : STORY_THEMES) {
    await page.goto(`${base}/engine/pages?suite=${suite}&lang=${lang}&w=${width}${mini}`, {
      waitUntil: "networkidle",
      timeout: 240_000,
    });
    await settle();
    const found = await page.evaluate(() => {
      const out = [];
      for (const p of document.querySelectorAll("[data-page]")) {
        const first = p.querySelector(".story-line");
        if (!first) continue;
        const inner = first.closest(".story-fit");
        const area = inner.parentElement.getBoundingClientRect();
        if (inner.dataset.overflow === "true") out.push(`${p.dataset.page}: too many words`);
        for (const line of p.querySelectorAll(".story-line")) {
          const over = [...line.getClientRects()].some(
            (r) =>
              r.height > 0 &&
              Math.max(
                area.top - r.top,
                r.bottom - area.bottom,
                area.left - r.left,
                r.right - area.right,
              ) > 1.5,
          );
          if (over) {
            out.push(`${p.dataset.page}: "${line.textContent.slice(0, 30)}" runs out of its area`);
            break;
          }
        }
      }
      return out;
    });
    for (const f of found) problems.push(`${suite} ${f}`);
  }
}

await browser.close();
console.log(problems.join("\n"));
console.log(
  `${kind}, ${lang}, ${width}px${mini ? " (editor preview)" : ""}: ${problems.length} problems`,
);
process.exit(problems.length ? 1 : 0);
