/*
 * Brings one template's pictures in from the owner's image tool (docs/TEMPLATE_PROMPTS_*.md)
 * and measures them for the catalog. Run it on a folder holding one template's pictures,
 * named as in the prompts (cover.png, family.png ... couple.png, couple-two.png, centre.png,
 * doors.png, tie.png, pieces.png), with or without the template's folder in front:
 *
 *   node scripts/import-template.mjs <folder> <template> --gate <gate> --key magenta|green
 *     [--tie-size <scale>] [--tie-at <% down>]
 *
 * It writes, all as WebP at the size the site uses (768 x 1365, 9:16):
 * - public/suites/<template>/: the nine pages and the centre; the two photo pages with their
 *   green cut out with a soft edge, so the photos show through
 * - public/openings/tied/<gate>/: door-left and door-right, split at the doors' seam; the
 *   tie with its key colour cut away, at its size and place on the screen (--tie-size, a
 *   scale, and --tie-at, its middle in % down), a ribbon or cord drawn on to both edges
 *   when the painting has it running off them; piece-0 to piece-5 cut from the pieces sheet
 * and prints what the catalog needs: the photo frames and where the names go under them,
 * the calm part of each page for its words, the centre's empty field, how light or dark
 * each calm part is, and the doors' seam and the tie's place. Check every number by eye
 * on the page before it ships: these are a first measure, not the last word.
 */

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const W = 768;
const H = 1365;
const PAGES = [
  "cover",
  "family",
  "haldi",
  "mehendi",
  "sangeet",
  "baraat",
  "wedding",
  "reception",
  "reply",
];
// Where each page keeps its calm part, as the prompts ask (docs/TEMPLATE_PROMPTS_41_TO_55.md)
const CALM = {
  cover: "band",
  family: "top",
  haldi: "band",
  mehendi: "band",
  sangeet: "top",
  baraat: "band",
  wedding: "low",
  reception: "low",
  reply: "top",
};
const KEYS = { magenta: [255, 0, 255], green: [0, 255, 0] };

const args = process.argv.slice(2);
const [source, template] = args;
const flag = (name) => {
  const at = args.indexOf(`--${name}`);
  return at < 0 ? undefined : args[at + 1];
};
const gate = flag("gate");
const keyName = flag("key") ?? "magenta";
const tieSize = Number(flag("tie-size") ?? 1);
const tieAt = flag("tie-at") === undefined ? null : Number(flag("tie-at"));
const write = !args.includes("--dry");
if (!source || !template || !existsSync(source)) {
  console.error(
    "Usage: node scripts/import-template.mjs <folder> <template> --gate <gate> --key magenta|green [--dry]",
  );
  process.exit(1);
}

/** Every picture under the folder, by its role: the file's name without folder or type. */
function pictures(dir) {
  const found = new Map();
  const walk = (at) => {
    for (const name of readdirSync(at)) {
      const path = join(at, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(png|webp|jpe?g)$/i.test(name))
        found.set(basename(name, extname(name)).toLowerCase(), path);
    }
  };
  walk(dir);
  return found;
}

/** The picture at the site's size, cropped to 9:16 from the middle, as raw RGBA. */
async function raw(path) {
  const { data, info } = await sharp(path)
    .resize({ width: W, height: H, fit: "cover", position: "centre" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

const webp = (img, quality = 82) =>
  sharp(img.data, { raw: { width: img.width, height: img.height, channels: 4 } }).webp({
    quality,
    alphaQuality: 90,
    effort: 6,
  });

/**
 * Cuts a key colour out: fully clear where it is the key, solid where it is clearly art, a
 * short ramp between for a clean edge, and the key's tint taken out of that edge. `soft`
 * blurs the edge a little more, for the photo greens the photos melt into.
 */
async function cutKey(img, key, soft = false) {
  const [kr, kg, kb] = key;
  const out = Buffer.from(img.data);
  const near = soft ? 0.18 : 0.2;
  const far = soft ? 0.5 : 0.38;
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i] / 255;
    const g = out[i + 1] / 255;
    const b = out[i + 2] / 255;
    // How far from the key, by the key's own channels: green is "much more green than red
    // and blue", magenta "much more red and blue than green"
    const spill = kg ? g - Math.max(r, b) : Math.min(r, b) - g;
    const dist = Math.hypot(r - kr / 255, g - kg / 255, b - kb / 255) / Math.sqrt(3);
    const keyness = Math.max(0, Math.min(1, spill * 1.6)) * (1 - Math.min(1, dist / 0.6));
    let alpha = 1 - Math.max(0, Math.min(1, (keyness - near) / (far - near)));
    if (keyness >= far) alpha = 0;
    out[i + 3] = Math.round(alpha * 255);
    // Take the key's tint out of the edge
    if (alpha < 1 && alpha > 0) {
      if (kg) out[i + 1] = Math.min(out[i + 1], Math.max(out[i], out[i + 2]));
      else {
        out[i] = Math.min(out[i], out[i + 1] + 20);
        out[i + 2] = Math.min(out[i + 2], out[i + 1] + 20);
      }
    }
  }
  let cut = { data: out, width: img.width, height: img.height };
  if (soft) {
    // Feather the photo's edge: blur the alpha only
    const alpha = await sharp(out, { raw: { width: img.width, height: img.height, channels: 4 } })
      .extractChannel(3)
      .blur(3)
      .raw()
      .toBuffer();
    for (let p = 0, i = 3; p < alpha.length; p++, i += 4) out[i] = Math.min(out[i], alpha[p]);
    cut = { data: out, width: img.width, height: img.height };
  }
  return cut;
}

/** The boxes of clear areas (the cut photo greens), largest first, as % of the picture. */
function holes(img, count) {
  const { data, width, height } = img;
  const seen = new Uint8Array(width * height);
  const boxes = [];
  for (let start = 0; start < width * height; start++) {
    if (seen[start] || data[start * 4 + 3] > 40) continue;
    let [x0, y0, x1, y1, size] = [width, height, 0, 0, 0];
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % width;
      const y = (p - x) / width;
      size++;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
      for (const q of [p - 1, p + 1, p - width, p + width]) {
        if (q < 0 || q >= width * height || seen[q]) continue;
        if (Math.abs((q % width) - x) > 1) continue;
        if (data[q * 4 + 3] > 40) continue;
        seen[q] = 1;
        stack.push(q);
      }
    }
    if (size > width * height * 0.01) boxes.push({ x0, y0, x1, y1, size });
  }
  boxes.sort((a, b) => b.size - a.size);
  const pct = (v, of) => Math.round((v / of) * 1000) / 10;
  return boxes
    .slice(0, count)
    .sort((a, b) => a.x0 - b.x0)
    .map((b) => [
      pct(b.x0, width),
      pct(b.y0, height),
      pct(b.x1 - b.x0 + 1, width),
      pct(b.y1 - b.y0 + 1, height),
    ]);
}

/** How busy each row and column is: the mean of the brightness edges, on a small copy. */
async function detail(path) {
  const w = 96;
  const h = 171;
  const { data } = await sharp(path)
    .resize({ width: w, height: h, fit: "cover" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const at = (x, y) => data[y * w + x];
  const edge = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const gx = at(x + 1, y) - at(x - 1, y);
      const gy = at(x, y + 1) - at(x, y - 1);
      edge[y * w + x] = Math.hypot(gx, gy);
    }
  return { w, h, edge, grey: data };
}

/** The calm rows: those well under the picture's busier rows, smoothed over a few rows. */
function calmRows(d, x0 = 0.15, x1 = 0.85) {
  const rows = [];
  for (let y = 0; y < d.h; y++) {
    let sum = 0;
    let n = 0;
    for (let x = Math.round(d.w * x0); x < Math.round(d.w * x1); x++, n++)
      sum += d.edge[y * d.w + x];
    rows.push(sum / n);
  }
  const smooth = rows.map((_, y) => {
    const near = rows.slice(Math.max(0, y - 2), y + 3);
    return near.reduce((a, b) => a + b, 0) / near.length;
  });
  const sorted = [...smooth].sort((a, b) => a - b);
  const busy = sorted[Math.floor(sorted.length * 0.85)];
  const quiet = sorted[Math.floor(sorted.length * 0.1)];
  const limit = quiet + (busy - quiet) * 0.3;
  return smooth.map((v) => v <= limit);
}

/** The longest run of calm rows, as [first, last] row, preferring the one nearest `aim`. */
function longestRun(calm, aim, from = 0, to = calm.length - 1) {
  let best = null;
  for (let y = from; y <= to; y++) {
    if (!calm[y]) continue;
    let end = y;
    while (end + 1 <= to && calm[end + 1]) end++;
    const length = end - y + 1;
    const score = length - Math.abs((y + end) / 2 - aim) * 0.15;
    if (!best || score > best.score) best = { y, end, score };
    y = end;
  }
  return best ? [best.y, best.end] : [Math.round(calm.length * 0.3), Math.round(calm.length * 0.7)];
}

/** The calm columns inside rows [y0, y1], as left and right insets in %. */
function sideInsets(d, y0, y1) {
  const cols = [];
  for (let x = 0; x < d.w; x++) {
    let sum = 0;
    for (let y = y0; y <= y1; y++) sum += d.edge[y * d.w + x];
    cols.push(sum / (y1 - y0 + 1));
  }
  const sorted = [...cols].sort((a, b) => a - b);
  const limit =
    sorted[Math.floor(sorted.length * 0.1)] +
    (sorted[Math.floor(sorted.length * 0.85)] - sorted[Math.floor(sorted.length * 0.1)]) * 0.35;
  let left = Math.floor(d.w / 2);
  while (left > 0 && cols[left - 1] <= limit) left--;
  let right = Math.floor(d.w / 2);
  while (right < d.w - 1 && cols[right + 1] <= limit) right++;
  const pct = (v) => Math.round((v / d.w) * 100);
  return [Math.max(6, pct(left) + 2), Math.max(6, 100 - pct(right + 1) + 2)];
}

/** The mean brightness (0 to 1) of an area given as insets [top, bottom, left, right]. */
function brightness(d, [top, bottom, left, right]) {
  let sum = 0;
  let n = 0;
  for (let y = Math.round((top / 100) * d.h); y < Math.round((1 - bottom / 100) * d.h); y++)
    for (let x = Math.round((left / 100) * d.w); x < Math.round((1 - right / 100) * d.w); x++, n++)
      sum += d.grey[y * d.w + x];
  return n ? Math.round((sum / n / 255) * 100) / 100 : 0;
}

/** A page's calm part for its words, as insets [top, bottom, left, right] in %. */
function calmArea(d, kind) {
  const calm = calmRows(d);
  const h = d.h;
  const pct = (v) => Math.round((v / h) * 100);
  let y0;
  let y1;
  if (kind === "top") {
    // From under the god or symbol's room down to the first busy rows
    [y0, y1] = longestRun(calm, h * 0.3, Math.round(h * 0.1), Math.round(h * 0.75));
    y0 = Math.max(y0, Math.round(h * 0.12));
  } else if (kind === "low") {
    [y0, y1] = longestRun(calm, h * 0.72, Math.round(h * 0.35), h - 1);
    y1 = Math.min(y1, Math.round(h * 0.94));
  } else [y0, y1] = longestRun(calm, h * 0.5, Math.round(h * 0.12), Math.round(h * 0.9));
  const [left, right] = sideInsets(d, y0, y1);
  return [Math.max(6, pct(y0) + 1), Math.max(6, 100 - pct(y1 + 1) + 1), left, right];
}

/**
 * The doors' seam, at full size: the column near the middle that is darkest against its
 * neighbours all the way down, as a thin line between two doors is.
 */
function seam(img) {
  const { data, width, height } = img;
  const lum = (x, y) => {
    const i = (y * width + x) * 4;
    return data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
  };
  let best = { x: width / 2, score: -Infinity };
  for (let x = Math.round(width * 0.44); x <= Math.round(width * 0.56); x++) {
    let sum = 0;
    for (let y = 0; y < height; y += 2) sum += (lum(x - 3, y) + lum(x + 3, y)) / 2 - lum(x, y);
    if (sum > best.score) best = { x, score: sum };
  }
  return Math.round(((best.x + 0.5) / width) * 1000) / 10;
}

/** The box round everything that isn't clear, as % of the picture. */
function solidBox(img) {
  const { data, width, height } = img;
  let [x0, y0, x1, y1] = [width, height, -1, -1];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (data[(y * width + x) * 4 + 3] > 128) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
  if (x1 < 0) return null;
  const pct = (v, of) => Math.round((v / of) * 1000) / 10;
  return [pct(x0, width), pct(y0, height), pct(x1 - x0 + 1, width), pct(y1 - y0 + 1, height)];
}

/**
 * The tie at its size, its middle moved to `at` % down the screen. A ribbon, cord or chain
 * that ran off the painting's edges is drawn on to the new edges, mirrored from its own
 * last stretch, so it still reaches right across the doors once the tie is smaller.
 */
async function placeTie(img, size, at) {
  const { data, width, height } = img;
  const box = solidBox(img);
  const middle = ((box[1] + box[3] / 2) / 100) * height;
  const touches = (y, x0, x1) => {
    for (let x = x0; x < x1; x++) if (data[(y * width + x) * 4 + 3] > 128) return true;
    return false;
  };
  const sw = Math.round(width * size);
  const sh = Math.round(height * size);
  const scaled = await sharp(data, { raw: { width, height, channels: 4 } })
    .resize({ width: sw, height: sh, fit: "fill" })
    .raw()
    .toBuffer();
  const left = Math.round(width / 2 - sw / 2);
  const top = Math.round((at / 100) * height - middle * size);
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const sy = y - top;
    if (sy < 0 || sy >= sh) continue;
    for (let x = 0; x < width; x++) {
      const sx = x - left;
      if (sx < 0 || sx >= sw) continue;
      scaled.copy(out, (y * width + x) * 4, (sy * sw + sx) * 4, (sy * sw + sx) * 4 + 4);
    }
  }
  if (left > 0) {
    const stretch = Math.round(width * 0.08);
    for (let y = 0; y < height; y++) {
      const from = Math.min(height - 1, Math.max(0, Math.round((y - top) / size)));
      if (y - top < 0 || y - top >= sh) continue;
      for (const side of ["left", "right"]) {
        const edge = side === "left" ? touches(from, 0, 4) : touches(from, width - 4, width);
        if (!edge) continue;
        // The band's end on the new tie, then mirrored outward to the screen's edge
        const end = side === "left" ? left : left + sw - 1;
        const step = side === "left" ? 1 : -1;
        for (let d = 1; ; d++) {
          const x = end - step * d;
          if (x < 0 || x >= width) break;
          const p = (d - 1) % (2 * stretch);
          const offset = p < stretch ? p : 2 * stretch - 1 - p;
          const sx = end + step * offset;
          out.copy(out, (y * width + x) * 4, (y * width + sx) * 4, (y * width + sx) * 4 + 4);
        }
      }
    }
  }
  return { data: out, width, height };
}

const found = pictures(source);
const need = (role) => {
  const path = found.get(role);
  if (!path) console.warn(`missing: ${role}`);
  return path;
};
const suiteDir = join("public", "suites", template);
const gateDir = gate ? join("public", "openings", "tied", gate) : null;
if (write) {
  mkdirSync(suiteDir, { recursive: true });
  if (gateDir) mkdirSync(gateDir, { recursive: true });
}
const report = { template, gate, areas: {}, tones: {}, warnings: [] };

for (const page of [...PAGES, "centre"]) {
  const path = need(page);
  if (!path) continue;
  const img = await raw(path);
  if (write) await webp(img).toFile(join(suiteDir, `${page}.webp`));
  const d = await detail(path);
  if (page === "centre") {
    const area = calmArea(d, "band");
    report.centre = { field: area, brightness: brightness(d, area) };
  } else {
    const area = calmArea(d, CALM[page]);
    report.areas[page] = area;
    report.tones[page] = brightness(d, area);
  }
}

for (const [role, count] of [
  ["couple", 1],
  ["couple-two", 2],
]) {
  const path = need(role);
  if (!path) continue;
  const cut = await cutKey(await raw(path), KEYS.green, true);
  if (write) await webp(cut, 84).toFile(join(suiteDir, `${role}.webp`));
  const boxes = holes(cut, count);
  if (boxes.length !== count)
    report.warnings.push(`${role}: found ${boxes.length} photo greens, wanted ${count}`);
  report[role === "couple" ? "one" : "two"] = boxes;
  const lowest = Math.max(...boxes.map((b) => b[1] + b[3]));
  report[`${role}Words`] = [Math.round(lowest + 4), 10];
}

if (gateDir) {
  const key = KEYS[keyName];
  const doorsPath = need("doors");
  if (doorsPath) {
    const img = await raw(doorsPath);
    const at = seam(img);
    report.seam = at;
    if (Math.abs(at - 50) > 1.5)
      report.warnings.push(`doors: the seam is at ${at}%, not the middle; check the cut`);
    const split = Math.round((at / 100) * W);
    if (write) {
      const whole = sharp(img.data, { raw: { width: W, height: H, channels: 4 } });
      await whole
        .clone()
        .extract({ left: 0, top: 0, width: split, height: H })
        .resize({ width: W / 2, height: H, fit: "fill" })
        .webp({ quality: 82, effort: 6 })
        .toFile(join(gateDir, "door-left.webp"));
      await whole
        .clone()
        .extract({ left: split, top: 0, width: W - split, height: H })
        .resize({ width: W / 2, height: H, fit: "fill" })
        .webp({ quality: 82, effort: 6 })
        .toFile(join(gateDir, "door-right.webp"));
    }
  }
  const tiePath = need("tie");
  if (tiePath) {
    let cut = await cutKey(await raw(tiePath), key);
    if (tieAt !== null) cut = await placeTie(cut, tieSize, tieAt);
    report.tie = solidBox(cut);
    if (write) await webp(cut, 86).toFile(join(gateDir, "tie.webp"));
  }
  const piecesPath = need("pieces");
  if (piecesPath) {
    const sheet = await cutKey(await raw(piecesPath), key);
    const cellW = W / 2;
    const cellH = H / 3;
    const sizes = [];
    for (let i = 0; i < 6; i++) {
      const cx = (i % 2) * cellW;
      const cy = Math.floor(i / 2) * cellH;
      let [x0, y0, x1, y1] = [cellW, cellH, -1, -1];
      for (let y = 0; y < cellH; y++)
        for (let x = 0; x < cellW; x++) {
          const a = sheet.data[((Math.round(cy) + y) * W + Math.round(cx) + x) * 4 + 3];
          if (a > 128) {
            x0 = Math.min(x0, x);
            y0 = Math.min(y0, y);
            x1 = Math.max(x1, x);
            y1 = Math.max(y1, y);
          }
        }
      if (x1 < 0) {
        report.warnings.push(`pieces: cell ${i} is empty`);
        continue;
      }
      const pad = 4;
      const left = Math.max(0, Math.round(cx) + x0 - pad);
      const top = Math.max(0, Math.round(cy) + y0 - pad);
      const width = Math.min(W - left, x1 - x0 + 1 + pad * 2);
      const height = Math.min(H - top, y1 - y0 + 1 + pad * 2);
      sizes.push([width, height]);
      if (write)
        await sharp(sheet.data, { raw: { width: W, height: H, channels: 4 } })
          .extract({ left, top, width, height })
          .resize({ width: 220, height: 220, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 86, alphaQuality: 90, effort: 6 })
          .toFile(join(gateDir, `piece-${i}.webp`));
    }
    report.pieces = sizes;
  }
}

console.log(JSON.stringify(report, null, 2));
