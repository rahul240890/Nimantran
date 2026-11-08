/*
 * The occasion's words inside a gate as its doors open ("Shubh Vivah", "Save the date"),
 * drawn for the video as the guest's link shows them (components/guest/opening/gate-words.tsx,
 * app/gate-words.css): a soft shade, the words coming in one of seven ways between two gilt
 * rules, and flowers (or confetti, or a few quiet petals) falling and bursting round them.
 * Times here are the CSS's own seconds, from when the words begin; the caller turns video
 * seconds into them at the opening's pace. Browser only.
 */

import type { GateScatter, GateWordLook } from "@/lib/opening/gate-words";
import { bezier, clamp01, easeOut, linear, transition } from "./ease";
import type { OpeningPalette } from "./look";
import { PAGE_H, PAGE_W, mix, withAlpha, wrap } from "./draw";

/** What the words inside a gate are drawn from. */
export type GateWordsFilm = {
  words: string;
  look: GateWordLook;
  scatter: GateScatter;
  /** When the doors have opened enough for them, in seconds of the opening's CSS. */
  at: number;
  /** Over a light picture (a tied gate's pale centre): ink on a soft paper glow. */
  ink: boolean;
};

type Ctx = CanvasRenderingContext2D;

const CQW = PAGE_W / 100;
const CQH = PAGE_H / 100;
const REM = 16;
/** Where the words sit, as .gw-centre places them. */
const CX = PAGE_W / 2;
const CY = PAGE_H * 0.44;

/** How each look scatters its pieces, as gate-words.tsx does. */
const PIECES: Record<GateWordLook, { fall: number; burst: number }> = {
  "petal-rain": { fall: 20, burst: 0 },
  toran: { fall: 10, burst: 0 },
  "phool-burst": { fall: 6, burst: 14 },
  rangoli: { fall: 12, burst: 0 },
  "gold-script": { fall: 14, burst: 0 },
  lotus: { fall: 10, burst: 6 },
  jharna: { fall: 22, burst: 0 },
};

type Piece = "bloom" | "marigold" | "petal" | "confetti" | "dot";

const spread = (i: number, step: number) => (i * step) % 1;

function pieceOf(i: number, scatter: GateScatter): Piece {
  if (scatter === "quiet") return "petal";
  if (scatter === "confetti") return i % 3 === 2 ? "dot" : "confetti";
  return (["marigold", "petal", "bloom", "petal"] as const)[i % 4]!;
}

function colourOf(i: number, scatter: GateScatter, c: OpeningPalette): string {
  const set =
    scatter === "confetti"
      ? [c.kitePink, c.kiteBlue, c.kiteYellow, c.kiteGreen, c.giltBright, c.blush]
      : scatter === "quiet"
        ? [c.jasmine, c.ivory]
        : [c.marigold, c.rose, c.blush, c.jasmine, c.marigoldStrong, c.petalFall];
  return set[(i * 5) % set.length]!;
}

const riseEase = bezier(0.2, 0.8, 0.3, 1);
const ruleEase = bezier(0.3, 0.7, 0.3, 1);
const unfurlEase = bezier(0.3, 1.3, 0.5, 1);
const popEase = bezier(0.3, 1.5, 0.5, 1);
const settleEase = bezier(0.2, 0.7, 0.3, 1);
const writeEase = bezier(0.5, 0, 0.3, 1);
const dropIn = bezier(0.5, 0, 0.9, 0.6);
const dropUp = bezier(0.2, 0.6, 0.4, 1);
const dropDown = bezier(0.5, 0, 0.8, 0.6);
const strandEase = bezier(0.3, 1.4, 0.5, 1);
const burstOut = bezier(0.1, 0.7, 0.3, 1);
const burstFall = bezier(0.5, 0, 0.9, 0.5);
const swingEase = bezier(0.42, 0, 0.58, 1);

/**
 * The words inside the gate, `css` seconds into the opening's CSS (0 as the doors begin),
 * at `alpha` (they fade as the welcome comes). `font` gives the theme's lettering for names.
 */
export function drawGateWords(
  ctx: Ctx,
  gate: GateWordsFilm,
  colours: OpeningPalette,
  font: (size: number) => string,
  css: number,
  alpha: number,
) {
  const local = css - gate.at;
  if (local <= 0 || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  drawVeil(ctx, gate, colours, local);
  if (gate.look === "toran") drawToran(ctx, colours, local);
  if (gate.look === "rangoli") drawRangoli(ctx, colours, local);
  drawCentre(ctx, gate, colours, font, local);
  drawFalls(ctx, gate, colours, local);
  drawBursts(ctx, gate, colours, local);
  ctx.restore();
}

/** The soft shade behind the words, so they read on any painting. */
function drawVeil(ctx: Ctx, gate: GateWordsFilm, c: OpeningPalette, local: number) {
  const fade = transition(local, 0.6, 0, easeOut);
  if (fade <= 0) return;
  const shade = gate.ink ? c.plate : mix(c.jewel, "rgb(0, 0, 0)", 0.35);
  const [inner, middle] = gate.ink ? [0.7, 0.3] : [0.46, 0.18];
  ctx.save();
  ctx.globalAlpha *= fade;
  ctx.translate(CX, CY);
  ctx.scale(PAGE_W * (gate.ink ? 0.6 : 0.56), PAGE_H * (gate.ink ? 0.17 : 0.15));
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  glow.addColorStop(0, withAlpha(shade, inner));
  glow.addColorStop(0.55, withAlpha(shade, middle));
  glow.addColorStop(0.75, withAlpha(shade, 0));
  glow.addColorStop(1, withAlpha(shade, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

/** The words between their rules, with the lotus under them for that look. */
function drawCentre(
  ctx: Ctx,
  gate: GateWordsFilm,
  c: OpeningPalette,
  font: (size: number) => string,
  local: number,
) {
  const long = gate.words.length > 15;
  const size = long
    ? Math.min(Math.max(1.75 * REM, 9.5 * CQW), 3.4 * REM)
    : Math.min(Math.max(2.2 * REM, 13 * CQW), 4.6 * REM);
  const lineHeight = size * 1.12;
  ctx.save();
  ctx.font = font(size);
  const lines = wrap(ctx, gate.words, 88 * CQW);
  const gap = 1.4 * CQH;
  const lotusW = Math.min(44 * CQW, 13 * REM);
  const lotusH = gate.look === "lotus" ? (lotusW * 46) / 100 + 0.4 * CQH : 0;
  const textH = lines.length * lineHeight;
  const height = 1 + gap + textH + gap + 1 + (lotusH ? gap + lotusH : 0);
  let y = CY - height / 2;
  const gilt = gate.ink ? c.giltDark : c.giltBright;
  drawRule(ctx, y, gilt, transition(local, 0.7, 0.45, ruleEase));
  y += 1 + gap;
  const colour = gate.ink
    ? c.sealInk
    : gate.look === "gold-script"
      ? mix(c.giltBright, c.ivory, 0.55)
      : c.ivory;
  ctx.fillStyle = colour;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.shadowColor = gate.ink ? withAlpha(c.plate, 0.8) : withAlpha(c.night, 0.6);
  ctx.shadowBlur = size * 0.4;
  ctx.shadowOffsetY = gate.ink ? 0 : size * 0.04;
  drawPhrase(ctx, gate, lines, y, lineHeight, size, local);
  ctx.shadowColor = "transparent";
  y += textH + gap;
  drawRule(ctx, y, gilt, transition(local, 0.7, 0.65, ruleEase));
  y += 1;
  if (lotusH) drawLotus(ctx, c, y + gap + 0.4 * CQH, lotusW, local);
  ctx.restore();
}

/** The phrase, line by line, coming in as its look does. */
function drawPhrase(
  ctx: Ctx,
  gate: GateWordsFilm,
  lines: string[],
  top: number,
  lineHeight: number,
  size: number,
  local: number,
) {
  const height = lines.length * lineHeight;
  const whole = (draw: () => void) => {
    ctx.save();
    draw();
    lines.forEach((line, i) => {
      const width = ctx.measureText(line).width;
      ctx.fillText(line, CX - width / 2, top + lineHeight * (i + 0.5));
    });
    ctx.restore();
  };
  switch (gate.look) {
    case "toran": {
      // Unfurls down from its top edge
      const p = clamp01((local - 0.35) / 0.8);
      const scale = unfurlEase(p);
      whole(() => {
        ctx.globalAlpha *= clamp01(p / 0.4);
        ctx.translate(0, top);
        ctx.scale(1, Math.max(0.001, scale));
        ctx.translate(0, -top);
      });
      return;
    }
    case "phool-burst": {
      const p = clamp01((local - 0.15) / 0.7);
      const scale = 0.3 + 0.7 * popEase(p);
      whole(() => {
        ctx.globalAlpha *= clamp01(p / 0.5);
        scaleAt(ctx, scale, CX, top + height / 2);
      });
      return;
    }
    case "rangoli": {
      const p = settleEase(clamp01((local - 0.3) / 1));
      whole(() => {
        ctx.globalAlpha *= p;
        scaleAt(ctx, 1.3 - 0.3 * p, CX, top + height / 2);
      });
      return;
    }
    case "gold-script": {
      // Written in from the left
      const p = writeEase(clamp01((local - 0.15) / 0.9));
      if (p <= 0) return;
      whole(() => {
        const width = 88 * CQW;
        ctx.beginPath();
        ctx.rect(CX - width / 2, top - height * 0.2, width * p, height * 1.4);
        ctx.clip();
      });
      return;
    }
    default:
      drawWords(ctx, gate.look, lines, top, lineHeight, size, local);
  }
}

/** Word by word: rising, rising and growing (lotus), or dropping in and bouncing (jharna). */
function drawWords(
  ctx: Ctx,
  look: GateWordLook,
  lines: string[],
  top: number,
  lineHeight: number,
  size: number,
  local: number,
) {
  const space = ctx.measureText(" ").width;
  let index = 0;
  lines.forEach((line, row) => {
    const words = line.split(" ");
    const widths = words.map((word) => ctx.measureText(word).width);
    const total = widths.reduce((sum, w) => sum + w, 0) + space * (words.length - 1);
    let x = CX - total / 2;
    const y = top + lineHeight * (row + 0.5);
    words.forEach((word, i) => {
      const w = widths[i]!;
      const { alpha, dy, scale } = wordMove(look, index, local, size);
      if (alpha > 0) {
        ctx.save();
        ctx.globalAlpha *= alpha;
        ctx.translate(0, dy);
        scaleAt(ctx, scale, x + w / 2, y);
        ctx.fillText(word, x, y);
        ctx.restore();
      }
      x += w + space;
      index += 1;
    });
  });
}

function wordMove(look: GateWordLook, i: number, local: number, size: number) {
  if (look === "lotus") {
    const p = riseEase(clamp01((local - 0.45 - i * 0.2) / 0.8));
    return { alpha: p, dy: 0.6 * size * (1 - p), scale: 0.7 + 0.3 * p };
  }
  if (look === "jharna") {
    const p = clamp01((local - 0.15 - i * 0.15) / 0.8);
    const alpha = p >= 0.2 ? 1 : dropIn(p / 0.2);
    const dy =
      p < 0.6
        ? -28 * CQH * (1 - dropIn(p / 0.6))
        : p < 0.78
          ? -0.28 * size * dropUp((p - 0.6) / 0.18)
          : -0.28 * size * (1 - dropDown((p - 0.78) / 0.22));
    return { alpha: p > 0 ? alpha : 0, dy, scale: 1 };
  }
  const p = riseEase(clamp01((local - 0.2 - i * 0.16) / 0.8));
  return { alpha: p, dy: 0.45 * size * (1 - p), scale: 1 };
}

/** A thin gilt line with a small diamond, drawn out from its middle. */
function drawRule(ctx: Ctx, y: number, gilt: string, p: number) {
  if (p <= 0) return;
  const half = 18 * CQW;
  ctx.save();
  ctx.globalAlpha *= p;
  ctx.translate(CX, y);
  ctx.scale(p, 1);
  const line = ctx.createLinearGradient(-half, 0, half, 0);
  line.addColorStop(0, withAlpha(gilt, 0));
  line.addColorStop(0.5, gilt);
  line.addColorStop(1, withAlpha(gilt, 0));
  ctx.fillStyle = line;
  ctx.fillRect(-half, 0, half * 2, 1);
  const d = 1.6 * CQW;
  ctx.translate(0, 0.5);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = gilt;
  ctx.fillRect(-d / 2, -d / 2, d, d);
  ctx.restore();
}

/** Marigold strings dropping from the top, as on a toran over a doorway, swaying a little. */
function drawToran(ctx: Ctx, c: OpeningPalette, local: number) {
  for (let i = 0; i < 9; i++) {
    const jasmine = i % 2 === 1;
    const delay = Math.abs(4 - i) * 0.07;
    const grow = strandEase(clamp01((local - delay) / 0.9));
    if (grow <= 0) continue;
    const swingT = local - delay - 0.9;
    const swing = swingT > 0 ? -2.5 + 5 * swingEase(pingPong(swingT / 1.6)) : -2.5;
    const width = (jasmine ? 2.6 : 3.6) * CQW;
    const height = (16 + ((i * 7) % 4) * 5 + (i === 4 ? 6 : 0)) * CQH;
    const x = (4 + i * 11.5) * CQW + 1.8 * CQW;
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate((swing * Math.PI) / 180);
    ctx.scale(1, Math.max(0.001, grow));
    const step = width;
    for (let y = step / 2; y < height; y += step) {
      ctx.beginPath();
      ctx.arc(0, y, width * (jasmine ? 0.4 : 0.56), 0, Math.PI * 2);
      ctx.fillStyle = jasmine ? c.jasmine : c.marigoldStrong;
      ctx.fill();
      if (!jasmine) {
        ctx.beginPath();
        ctx.arc(0, y, width * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = c.marigold;
        ctx.fill();
      }
    }
    // The rose bud at its end
    const bud = 3 * CQW;
    ctx.translate(0, height + bud * 0.3);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.roundRect(-bud / 2, -bud / 2, bud, bud, [bud / 2, 0, bud / 2, bud / 2]);
    ctx.fillStyle = c.rose;
    ctx.fill();
    ctx.restore();
  }
}

// Made on first use: Path2D is only in the browser, and this module loads on the server too
let rangoliPetal: Path2D | null = null;

/** A rangoli ring drawing itself round the words, then turning slowly. */
function drawRangoli(ctx: Ctx, c: OpeningPalette, local: number) {
  const ring = settleEase(clamp01(local / 1.2));
  if (ring <= 0) return;
  const size = Math.min(92 * CQW, 62 * CQH);
  ctx.save();
  ctx.globalAlpha *= ring;
  ctx.translate(CX, CY);
  ctx.scale(size / 100, size / 100);
  ctx.scale(0.6 + 0.4 * ring, 0.6 + 0.4 * ring);
  ctx.rotate((local / 40) * Math.PI * 2);
  ctx.strokeStyle = c.giltBright;
  const circle = (r: number, p: number) => {
    if (p <= 0) return;
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
    ctx.stroke();
  };
  ctx.save();
  ctx.globalAlpha *= 0.85;
  ctx.lineWidth = 0.5;
  circle(46, easeOut(clamp01((local - 0.1) / 1.4)));
  circle(33, easeOut(clamp01((local - 0.4) / 1.4)));
  // The dotted ring between them
  const dots = easeOut(clamp01((local - 0.5) / 0.9));
  if (dots > 0) {
    ctx.globalAlpha *= dots;
    ctx.lineWidth = 0.9;
    ctx.lineCap = "round";
    ctx.setLineDash([0.01 * 2 * Math.PI * 40, 0.02 * 2 * Math.PI * 40]);
    circle(40, 1);
    ctx.setLineDash([]);
  }
  ctx.restore();
  const petals = easeOut(clamp01((local - 0.7) / 0.9));
  if (petals > 0) {
    ctx.globalAlpha *= 0.85 * petals;
    for (let i = 0; i < 16; i++) {
      ctx.save();
      ctx.rotate((i * 22.5 * Math.PI) / 180);
      ctx.fillStyle = i % 2 ? c.rose : c.marigold;
      ctx.fill((rangoliPetal ??= new Path2D("M0 -48 C 3 -44 3 -41 0 -38 C -3 -41 -3 -44 0 -48 Z")));
      ctx.restore();
    }
  }
  ctx.restore();
}

let lotusPetal: Path2D | null = null;

/** A lotus opening under the words, petal by petal; `top` is its box's top. */
function drawLotus(ctx: Ctx, c: OpeningPalette, top: number, width: number, local: number) {
  const k = width / 100;
  ctx.save();
  // The viewBox is -50 -42 100 46: its origin sits 42 units below the top
  ctx.translate(CX, top + 42 * k);
  ctx.scale(k, k);
  const base = easeOut(clamp01(local / 0.6));
  if (base > 0) {
    ctx.save();
    ctx.globalAlpha *= base;
    ctx.fillStyle = c.leaf;
    ctx.beginPath();
    ctx.ellipse(0, 1, 30, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  [-64, -40, -18, 0, 18, 40, 64].forEach((angle, i) => {
    const p = clamp01((local - Math.abs(3 - i) * 0.09) / 0.9);
    if (p <= 0) return;
    const grow = 0.15 + 0.85 * unfurlEase(p);
    ctx.save();
    ctx.globalAlpha *= easeOut(p);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.scale(grow, grow);
    ctx.fillStyle = Math.abs(angle) > 30 ? c.rose : c.blush;
    lotusPetal ??= new Path2D("M0 0 C 9 -12 8 -28 0 -38 C -8 -28 -9 -12 0 0 Z");
    ctx.fill(lotusPetal);
    ctx.strokeStyle = c.rose;
    ctx.lineWidth = 0.6;
    ctx.stroke(lotusPetal);
    ctx.restore();
  });
  ctx.restore();
}

/** Pieces falling from above the top, swaying, past the bottom. */
function drawFalls(ctx: Ctx, gate: GateWordsFilm, c: OpeningPalette, local: number) {
  const quiet = gate.scatter === "quiet";
  const count = quiet ? 8 : PIECES[gate.look].fall;
  for (let i = 0; i < count; i++) {
    const delay = spread(i, 0.382) * (gate.look === "jharna" ? 1.1 : 1.5);
    const duration = 1.7 + spread(i, 0.27) * 0.9 + (quiet ? 0.9 : 0);
    const t = local - delay;
    if (t <= 0) continue;
    const p = linear(clamp01(t / duration));
    if (p >= 1) continue;
    const kind = pieceOf(i, gate.scatter);
    const size =
      ((kind === "petal" ? 3.6 : kind === "dot" ? 2 : kind === "confetti" ? 3.4 : 5.4) +
        spread(i, 0.41) * 2.4) *
      CQW;
    const drift = (spread(i, 0.73) - 0.5) * 24 * CQW;
    const sway = (3 + (i % 3) * 2) * CQW;
    const x = (spread(i, 0.618) * 96 + 2) * CQW + drift * p;
    const y = -0.08 * PAGE_H + 118 * CQH * p;
    ctx.save();
    if (quiet) ctx.globalAlpha *= 0.85;
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((300 * p * Math.PI) / 180);
    if (kind === "confetti") {
      // Flips over as it falls
      ctx.scale(1, Math.cos((t / 0.7) * Math.PI * 2));
    } else {
      const s = swingEase(pingPong(t / 0.9));
      ctx.translate(-sway + 2 * sway * s, 0);
      ctx.rotate(((-50 + 120 * s) * Math.PI) / 360);
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(((-50 + 120 * s) * Math.PI) / 180)));
    }
    drawPiece(ctx, kind, size, colourOf(i, gate.scatter, c), c);
    ctx.restore();
  }
}

/** Pieces bursting out of the words, up, then falling. */
function drawBursts(ctx: Ctx, gate: GateWordsFilm, c: OpeningPalette, local: number) {
  const count = gate.scatter === "quiet" ? 0 : PIECES[gate.look].burst;
  for (let i = 0; i < count; i++) {
    const t = local - ((i % 4) * 0.06 + 0.25);
    if (t <= 0) continue;
    const p = clamp01(t / 2);
    if (p >= 1) continue;
    const angle = (i / count) * Math.PI * 2 + 0.3;
    const dx = Math.round(Math.cos(angle) * (26 + (i % 3) * 8)) * CQW;
    const dy = Math.round(Math.sin(angle) * (16 + (i % 2) * 8) - 14) * CQH;
    const spin = (i % 2 ? 1 : -1) * (220 + i * 30);
    const size = (5 + (i % 3) * 1.2) * CQW;
    let x: number;
    let y: number;
    let scale: number;
    let turn: number;
    if (p < 0.32) {
      const q = burstOut(p / 0.32);
      x = dx * q;
      y = dy * q;
      scale = 0.2 + 0.8 * q;
      turn = spin * 0.3 * q;
    } else {
      const q = burstFall((p - 0.32) / 0.68);
      x = dx + dx * 0.5 * q;
      y = dy + (70 * CQH - dy) * q;
      scale = 1 - 0.1 * q;
      turn = spin * 0.3 + spin * 0.7 * q;
    }
    ctx.save();
    ctx.globalAlpha *= p < 0.08 ? p / 0.08 : 1;
    ctx.translate(CX + x, CY + y);
    ctx.rotate((turn * Math.PI) / 180);
    ctx.scale(scale, scale);
    drawPiece(ctx, pieceOf(i + 1, gate.scatter), size, colourOf(i + 2, gate.scatter, c), c);
    ctx.restore();
  }
}

/** One piece, centred on the origin, `size` across. */
function drawPiece(ctx: Ctx, kind: Piece, size: number, colour: string, c: OpeningPalette) {
  ctx.fillStyle = colour;
  if (kind === "dot") {
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (kind === "confetti") {
    ctx.fillRect(-size * 0.225, -size / 2, size * 0.45, size);
    return;
  }
  if (kind === "petal") {
    // A rounded leaf, pointed at two corners, as the petal's 60% 10% corners draw it
    const w = size * 0.4;
    const h = size / 2;
    ctx.beginPath();
    ctx.moveTo(-w, -h);
    ctx.quadraticCurveTo(w * 1.2, -h * 1.2, w, h);
    ctx.quadraticCurveTo(-w * 1.2, h * 1.2, -w, -h);
    ctx.fill();
    return;
  }
  const k = size / 20;
  ctx.save();
  ctx.scale(k, k);
  const petals = (n: number, offset: number, cy: number, rx: number, ry: number) => {
    for (let i = 0; i < n; i++) {
      ctx.save();
      ctx.rotate(((i * (360 / n) + offset) * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
  if (kind === "bloom") {
    petals(5, 0, -4.6, 3.5, 5);
    ctx.fillStyle = c.marigoldStrong;
    ctx.beginPath();
    ctx.arc(0, 0, 2.3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = c.marigoldStrong;
    petals(14, 0, -5.4, 2, 4);
    ctx.fillStyle = colour;
    petals(10, 18, -3, 1.8, 3.2);
  }
  ctx.restore();
}

function scaleAt(ctx: Ctx, scale: number, x: number, y: number) {
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-x, -y);
}

/** 0 to 1 and back, once a unit, as an alternate animation plays. */
function pingPong(t: number): number {
  const f = t % 2;
  return f <= 1 ? f : 2 - f;
}
