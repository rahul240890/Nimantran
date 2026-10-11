/*
 * The video's first seconds (prelude-timeline.ts): the guest's opening, closed, with the
 * god or symbol and the names on their plate; the opening's own move (the painted gate's
 * doors, a fresh opening's fan or clouds, a themed painting going its own way, drawn doors
 * or curtains); then the welcome with the names, the line and the day, in the opening's
 * own feeling (petals, a lotus, lamps, the moon, confetti or a letter). Drawn from the same
 * paintings and colours as the guest's first screen (opening-*.tsx, globals.css), laid
 * out on the same 390px-wide page as the rest of the video. No countdown. Browser only.
 */

import { SYMBOLS } from "@/components/invitation/art/symbols";
import type { PageType } from "@/lib/editor/type";
import { seededRandom } from "@/lib/engine/particles";
import {
  GOD_PAINTINGS,
  PAINTED_GATES,
  THEMED_OPENINGS,
  isFreshOpening,
  isPaintedGate,
  isThemedOpening,
  type FreshOpening,
  type OpeningGod,
  type OpeningStyle,
  type PaintedGate,
  type ThemedMove,
  type ThemedOpening,
  type WelcomeKind,
} from "@/lib/opening/catalog";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import { keepDate, lettering, type TypeRole } from "@/lib/suites/lettering";
import type { CardCopy } from "@/lib/templates/content";
import { PAGE_H, PAGE_W, SCALE, fillWith, roundRect, withAlpha, wrap, type Fonts } from "./draw";
import { bezier, clamp01, ease, easeInOut, easeOut, lerp, transition } from "./ease";
import type { OpeningPalette } from "./look";
import type { PreludeTimeline } from "./prelude-timeline";
import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./timeline";

/** What the prelude is drawn from. */
export type PreludeFilm = {
  style: OpeningStyle;
  god: OpeningGod | null;
  kind: WelcomeKind;
  suite: SuiteId;
  copy: CardCopy;
  lang: string;
  type: PageType;
  fonts: Fonts;
  colours: OpeningPalette;
  images: ReadonlyMap<string, CanvasImageSource>;
  timeline: PreludeTimeline;
};

const CQW = PAGE_W / 100;
const CQH = PAGE_H / 100;
const REM = 16;
type Ctx = CanvasRenderingContext2D;
type Box = { x: number; y: number; w: number; h: number };
const FULL: Box = { x: 0, y: 0, w: PAGE_W, h: PAGE_H };

/* ---------------------------------------------------------------- the fresh openings */

/**
 * How each fresh opening's layers go, back to front over its place beyond (opening-fresh.tsx
 * has the live moves; these follow them closely enough for a few seconds of video). fold:
 * folds shut to the middle; louvre: turns in strips; pop: stands up from flat; lift and
 * sink: rise or fall away; spin: turns away into the guest; zoom: the guest flies through
 * it; split: halves part to the sides; soft: halves drift apart; train: rolls off; tiles:
 * Athangudi tiles flip from the middle; edge: the edge pieces swell past the frame.
 */
type FreshMove =
  | "fold"
  | "louvre"
  | "pop"
  | "lift"
  | "sink"
  | "spin"
  | "zoom"
  | "split"
  | "soft"
  | "train"
  | "tiles"
  | "edge";
type FreshLayer = { name: string; move: FreshMove; delay?: number; appear?: boolean };

const FRONT_SPLIT: FreshLayer = { name: "front", move: "split" };
const FRONT_EDGE: FreshLayer = { name: "front", move: "edge" };

export const FRESH_LAYERS: Record<FreshOpening, readonly FreshLayer[]> = {
  pankhi: [{ name: "fan", move: "fold" }, FRONT_EDGE],
  "sheesh-mahal": [{ name: "mirror-wall", move: "louvre" }, FRONT_SPLIT],
  "popup-mahal": [
    { name: "far-layer", move: "pop" },
    { name: "near-layer", move: "pop", delay: 0.3 },
  ],
  odhni: [
    { name: "veil", move: "lift" },
    { name: "front", move: "lift" },
  ],
  "kavad-peti": [
    { name: "inner-panels", move: "split", delay: 0.6 },
    { name: "outer-panels", move: "split" },
    FRONT_EDGE,
  ],
  "chhatri-utsav": [{ name: "parasol", move: "spin" }, FRONT_EDGE],
  "jal-darpan": [{ name: "lake", move: "sink" }, FRONT_SPLIT],
  "pushp-varsha": [{ name: "petal-wall", move: "sink" }, FRONT_SPLIT],
  "moti-seep": [
    { name: "shell-base", move: "sink", delay: 0.3 },
    { name: "shell-top", move: "lift" },
  ],
  "badal-raag": [
    { name: "back-clouds", move: "soft", delay: 0.3 },
    { name: "front-clouds", move: "split" },
  ],
  "jugnu-van": [{ name: "forest", move: "soft", delay: 0.2 }, FRONT_SPLIT],
  "uday-surya": [
    { name: "far-hills", move: "sink", delay: 0.4 },
    { name: "near-hills", move: "sink" },
  ],
  taaramandal: [
    { name: "sky", move: "zoom", delay: 0.2 },
    { name: "front", move: "sink" },
  ],
  "thar-ki-ret": [{ name: "dunes", move: "sink", delay: 0.2 }, FRONT_EDGE],
  "sheher-ki-raat": [
    { name: "city-dark", move: "zoom", delay: 0.9 },
    { name: "city-lit", move: "zoom", delay: 0.9, appear: true },
  ],
  "choodi-chakra": [{ name: "bangle-rings", move: "spin" }, FRONT_EDGE],
  "sanjhi-roshni": [{ name: "stencil", move: "lift", delay: 0.2 }, FRONT_EDGE],
  "chhaya-parda": [{ name: "screen", move: "lift", delay: 0.2 }, FRONT_EDGE],
  "athangudi-tiles": [{ name: "tile", move: "tiles" }, FRONT_SPLIT],
  "gulaal-bindu": [{ name: "paper", move: "zoom" }, FRONT_EDGE],
  bioscope: [{ name: "bioscope", move: "zoom" }, FRONT_EDGE],
  "kaanch-ka-gola": [{ name: "globe", move: "zoom" }, FRONT_EDGE],
  phirki: [{ name: "paper", move: "spin" }, FRONT_EDGE],
  bulbule: [{ name: "garden", move: "zoom" }, FRONT_SPLIT],
  "chhuk-chhuk": [
    { name: "hills", move: "sink", delay: 0.6 },
    { name: "train", move: "train" },
  ],
};

/** Athangudi's floor: five columns of nine tiles, each one of five paintings. */
const TILE_COLS = 5;
const TILE_ROWS = 9;

function freshBeyond(id: FreshOpening): string {
  return `/openings/fresh/${id}/${id === "popup-mahal" ? "sky" : "beyond"}.webp`;
}

function freshLayerUrls(id: FreshOpening): string[] {
  return FRESH_LAYERS[id].flatMap((layer) =>
    layer.move === "tiles"
      ? Array.from({ length: 5 }, (_, i) => `/openings/fresh/${id}/tile-${i}.webp`)
      : [`/openings/fresh/${id}/${layer.name}.webp`],
  );
}

/* ---------------------------------------------------------------------- the paintings */

/** Every painting the prelude draws, so they load before the first frame. */
export function preludeImages(style: OpeningStyle, suite: SuiteId, god: OpeningGod | null) {
  const urls: string[] = [];
  if (isPaintedGate(style)) {
    const base = `/openings/gates/${style}`;
    urls.push(
      ...["beyond", "door-left", "door-right", "arch", "hole"].map((n) => `${base}/${n}.webp`),
    );
  } else if (isFreshOpening(style)) {
    urls.push(freshBeyond(style), ...freshLayerUrls(style));
  } else if (isThemedOpening(style)) {
    urls.push(`/suites/${style}/scene.webp`, `/openings/themed/${style}.webp`);
  }
  const cover = SUITES[suite].images.cover;
  if (cover) urls.push(cover);
  const painting = god ? GOD_PAINTINGS[god] : undefined;
  if (painting) urls.push(painting.src);
  return urls;
}

/* ------------------------------------------------------------------------ the frame */

/** Draws the prelude `seconds` in. */
export function drawPrelude(ctx: Ctx, film: PreludeFilm, seconds: number) {
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.globalAlpha = 1;
  const { open, welcome } = film.timeline;
  const opened = Math.max(0, seconds - open);
  ctx.fillStyle = film.colours.deep;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  drawOpening(ctx, film, seconds, opened);

  // The god and the names wait on the closed opening, and fade as it opens
  const words = clamp01((seconds - 0.2) / 0.8) * (1 - clamp01(opened / 0.35));
  if (words > 0) {
    ctx.save();
    ctx.globalAlpha = words;
    const top = drawCrest(ctx, film, seconds);
    drawPlate(ctx, film, top, seconds);
    ctx.restore();
  }

  if (seconds >= welcome) drawWelcome(ctx, film, seconds - welcome);
}

function drawOpening(ctx: Ctx, film: PreludeFilm, seconds: number, opened: number) {
  const { style } = film;
  if (isPaintedGate(style)) drawGate(ctx, film, style, seconds, opened);
  else if (isFreshOpening(style)) drawFresh(ctx, film, style, seconds, opened);
  else if (isThemedOpening(style)) drawThemed(ctx, film, style, seconds, opened);
  else drawDrawn(ctx, film, seconds, opened);
}

/* -------------------------------------------------------------------- painted gates */

const doorEase = bezier(0.6, 0, 0.25, 1);
const canvasEase = bezier(0.45, 0, 0.2, 1);
const archEase = bezier(0.55, 0, 0.3, 1);

function drawGate(ctx: Ctx, film: PreludeFilm, gate: PaintedGate, seconds: number, t: number) {
  const { move, hole } = PAINTED_GATES[gate];
  const base = `/openings/gates/${gate}`;
  const image = (name: string) => film.images.get(`${base}/${name}.webp`);
  const beyond = image("beyond");
  ctx.save();
  // The whole gate leans in while it waits, then the guest steps closer as it opens
  scaleAbout(
    ctx,
    1 + 0.015 * breathe(seconds) + 0.1 * transition(t, 2.6, 0, canvasEase),
    0.5,
    0.58,
  );

  // Round the arch the place beyond waits in the dark, then lights up
  if (beyond) fillWith(ctx, beyond, 0, 0, PAGE_W, PAGE_H);
  const dark = 1 - transition(t, 1.4, 0.7);
  if (dark > 0) {
    ctx.fillStyle = `rgb(0 0 0 / ${0.6 * dark})`;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  }

  // Inside the hole: the place lit, and the doors
  const box: Box = {
    x: (hole.left / 100) * PAGE_W,
    y: (hole.top / 100) * PAGE_H,
    w: (hole.width / 100) * PAGE_W,
    h: (hole.height / 100) * PAGE_H,
  };
  const mask = image("hole");
  const layer = offscreen(ctx);
  layer.clearRect(0, 0, PAGE_W, PAGE_H);
  if (beyond) fillWith(layer, beyond, 0, 0, PAGE_W, PAGE_H);
  layer.fillStyle = withAlpha(film.colours.light, 0.08);
  layer.fillRect(0, 0, PAGE_W, PAGE_H);
  const door = transition(t, 1.5, 0.25, doorEase);
  for (const side of ["left", "right"] as const) {
    const art = image(`door-${side}`);
    if (!art) continue;
    const half: Box = { ...box, w: box.w / 2, x: side === "left" ? box.x : box.x + box.w / 2 };
    drawDoor(layer, art, null, half, side, move, door, film.colours);
  }
  // A line of warm light through the seam, breathing, that flares as the latch lifts
  const seam = (0.55 + 0.35 * Math.sin(seconds * 2.4)) * (1 - transition(t, 0.6, 0.2));
  if (seam > 0) drawSeam(layer, box.x + box.w / 2, box.y, box.h, film.colours, seam);
  if (mask) {
    layer.globalCompositeOperation = "destination-in";
    layer.drawImage(mask, 0, 0, PAGE_W, PAGE_H);
    layer.globalCompositeOperation = "source-over";
  }
  blit(ctx, layer);

  // The arch grows past the edges as the guest walks through it
  const arch = image("arch");
  const archOut = 1 - transition(t, 0.9, 1.5);
  if (arch && archOut > 0) {
    ctx.save();
    ctx.globalAlpha *= archOut;
    scaleAbout(ctx, 1 + 0.9 * transition(t, 1.7, 0.8, archEase), 0.5, 0.6);
    fillWith(ctx, arch, 0, 0, PAGE_W, PAGE_H);
    ctx.restore();
  }
  ctx.restore();
  drawMotes(ctx, film.colours.light, seconds, 1 - transition(t, 1, 1.4));
}

/**
 * One door (or one half of a painting) in its box, `p` of the way open: swung in on its
 * hinge with perspective, slid aside, gathered like a curtain or lifted like a tent flap.
 */
function drawDoor(
  ctx: Ctx,
  art: CanvasImageSource,
  source: Box | null,
  box: Box,
  side: "left" | "right",
  move: "swing" | "slide" | "gather" | "lift",
  p: number,
  colours: OpeningPalette,
) {
  const sign = side === "left" ? -1 : 1;
  if (move === "swing") {
    drawSwing(ctx, art, source, box, side, p * 96, colours);
    return;
  }
  ctx.save();
  const hingeX = side === "left" ? box.x : box.x + box.w;
  if (move === "slide") {
    ctx.translate(sign * 1.04 * box.w * p, 0);
    rotateAbout(ctx, sign * 2 * p, box.x + box.w / 2, box.y + box.h / 2);
  } else if (move === "gather") {
    ctx.translate(hingeX, box.y + box.h / 2);
    ctx.transform(1, sign * Math.tan((1.5 * p * Math.PI) / 180), 0, 1, 0, 0);
    ctx.scale(1 - 0.84 * p, 1);
    ctx.translate(-hingeX, -(box.y + box.h / 2));
  } else {
    rotateAbout(ctx, -sign * 72 * p, hingeX, box.y);
    ctx.translate(0, box.y);
    ctx.scale(1, 1 - 0.15 * p);
    ctx.translate(0, -box.y);
  }
  drawArt(ctx, art, source, box, side === "left" ? 1 : 0);
  if (p > 0) {
    shade(ctx, box, side, 0.45 * p);
  }
  ctx.restore();
}

/** A door swung `angle` degrees in about its outer edge, drawn in strips for perspective. */
function drawSwing(
  ctx: Ctx,
  art: CanvasImageSource,
  source: Box | null,
  box: Box,
  side: "left" | "right",
  angle: number,
  colours: OpeningPalette,
) {
  if (angle >= 90) return;
  const theta = (angle * Math.PI) / 180;
  const strips = angle < 0.5 ? 1 : 24;
  const depth = 1.4 * PAGE_W;
  const hinge = side === "left" ? box.x : box.x + box.w;
  const sign = side === "left" ? 1 : -1;
  const midY = box.y + box.h / 2;
  const src = source ?? artBox(art, box, side === "left" ? 1 : 0);
  for (let i = 0; i < strips; i++) {
    // Strips run from the hinge to the door's free edge
    const u0 = i / strips;
    const u1 = (i + 1) / strips;
    const place = (u: number) => {
      const z = u * box.w * Math.sin(theta);
      const k = depth / (depth + z);
      return { x: hinge + sign * u * box.w * Math.cos(theta) * k, k };
    };
    const a = place(u0);
    const b = place(u1);
    const k = (a.k + b.k) / 2;
    const h = box.h * k;
    const x = Math.min(a.x, b.x);
    const w = Math.abs(b.x - a.x) + 0.35;
    // Source strip: from the hinge side of the painting
    const s0 = side === "left" ? u0 : 1 - u1;
    ctx.drawImage(art, src.x + s0 * src.w, src.y, src.w / strips, src.h, x, midY - h / 2, w, h);
    if (angle > 0.5) {
      ctx.fillStyle = `rgb(0 0 0 / ${0.5 * Math.sin(theta) * (0.3 + 0.7 * u0)})`;
      ctx.fillRect(x, midY - h / 2, w, h);
    }
  }
  if (angle > 0.5) {
    // The door's edge catches the light
    const edge = place(1);
    ctx.fillStyle = withAlpha(colours.giltBright, 0.35 * Math.sin(theta));
    ctx.fillRect(edge.x - 0.5, midY - (box.h * edge.k) / 2, 1, box.h * edge.k);
  }

  function place(u: number) {
    const z = u * box.w * Math.sin(theta);
    const k = depth / (depth + z);
    return { x: hinge + sign * u * box.w * Math.cos(theta) * k, k };
  }
}

/** The part of a painting that fills a box like object-fit: cover, kept to one side. */
function artBox(art: CanvasImageSource, box: Box, focusX: number): Box {
  const { width, height } = sizeOf(art);
  const scale = Math.max(box.w / width, box.h / height);
  const w = box.w / scale;
  const h = box.h / scale;
  return { x: (width - w) * focusX, y: (height - h) / 2, w, h };
}

function drawArt(ctx: Ctx, art: CanvasImageSource, source: Box | null, box: Box, focusX: number) {
  const src = source ?? artBox(art, box, focusX);
  ctx.drawImage(art, src.x, src.y, src.w, src.h, box.x, box.y, box.w, box.h);
}

function shade(ctx: Ctx, box: Box, side: "left" | "right", alpha: number) {
  const g = ctx.createLinearGradient(box.x, 0, box.x + box.w, 0);
  const dark = `rgb(0 0 0 / ${alpha})`;
  g.addColorStop(side === "left" ? 0.4 : 0, side === "left" ? "rgb(0 0 0 / 0)" : dark);
  g.addColorStop(side === "left" ? 1 : 0.6, side === "left" ? dark : "rgb(0 0 0 / 0)");
  ctx.fillStyle = g;
  ctx.fillRect(box.x, box.y, box.w, box.h);
}

function drawSeam(
  ctx: Ctx,
  x: number,
  y: number,
  h: number,
  colours: OpeningPalette,
  alpha: number,
) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, withAlpha(colours.light, 0));
  g.addColorStop(0.35, withAlpha(colours.giltBright, alpha));
  g.addColorStop(0.65, withAlpha(colours.light, alpha));
  g.addColorStop(1, withAlpha(colours.light, 0));
  ctx.save();
  ctx.fillStyle = g;
  ctx.shadowColor = withAlpha(colours.light, alpha);
  ctx.shadowBlur = 12;
  ctx.fillRect(x - 1, y, 2, h);
  ctx.restore();
}

/* ------------------------------------------------------------------- fresh openings */

function drawFresh(ctx: Ctx, film: PreludeFilm, id: FreshOpening, seconds: number, t: number) {
  const beyond = film.images.get(freshBeyond(id));
  ctx.save();
  // The place beyond waits a little closer and dimmer, then settles as it opens
  scaleAbout(ctx, 1.08 - 0.08 * transition(t, 2.6, 0.2, canvasEase), 0.5, 0.5);
  if (beyond) fillWith(ctx, beyond, 0, 0, PAGE_W, PAGE_H);
  const dim = 1 - transition(t, 1.4, 0.5);
  if (dim > 0) {
    ctx.fillStyle = `rgb(0 0 0 / ${0.22 * dim})`;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  }
  ctx.restore();

  for (const layer of FRESH_LAYERS[id]) {
    const local = t - (layer.delay ?? 0);
    if (layer.move === "tiles") {
      drawTiles(ctx, film, id, t);
      continue;
    }
    const art = film.images.get(`/openings/fresh/${id}/${layer.name}.webp`);
    if (!art) continue;
    ctx.save();
    if (layer.appear) ctx.globalAlpha *= transition(t, 0.8, 0);
    drawFreshLayer(ctx, art, layer.move, local, seconds);
    ctx.restore();
  }
  drawMotes(ctx, film.colours.light, seconds, 0.8 * (1 - transition(t, 1, 1.2)));
}

const awayEase = bezier(0.55, 0, 0.35, 1);

function drawFreshLayer(
  ctx: Ctx,
  art: CanvasImageSource,
  move: FreshMove,
  t: number,
  seconds: number,
) {
  const p = transition(t, 1.8, 0, awayEase);
  const idle = breathe(seconds);
  switch (move) {
    case "fold": {
      // The fan folds shut into its handle at the bottom middle, then drops away
      if (p >= 1) return;
      ctx.globalAlpha *= 1 - transition(t, 0.5, 1.3);
      ctx.translate(PAGE_W / 2, PAGE_H * 0.92);
      ctx.scale(1 - 0.92 * p, 1 - 0.3 * p);
      ctx.translate(-PAGE_W / 2, -PAGE_H * 0.92);
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    }
    case "louvre": {
      const strips = 8;
      const w = PAGE_W / strips;
      for (let i = 0; i < strips; i++) {
        const q = transition(t, 1.1, i * 0.08, awayEase);
        const k = Math.cos((q * Math.PI) / 2);
        if (k < 0.02) continue;
        const { width, height } = sizeOf(art);
        const sx = (i / strips) * width;
        ctx.drawImage(
          art,
          sx,
          0,
          width / strips,
          height,
          i * w + (w * (1 - k)) / 2,
          0,
          w * k,
          PAGE_H,
        );
        ctx.fillStyle = `rgb(0 0 0 / ${0.4 * (1 - k)})`;
        ctx.fillRect(i * w + (w * (1 - k)) / 2, 0, w * k, PAGE_H);
      }
      return;
    }
    case "pop": {
      // A pop-up stands up from the page as the card opens
      const q = transition(t, 1.4, 0.2, bezier(0.3, 1.3, 0.5, 1));
      if (q <= 0) return;
      ctx.globalAlpha *= clamp01(q * 3);
      ctx.translate(0, PAGE_H);
      ctx.scale(1, q);
      ctx.translate(0, -PAGE_H);
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    }
    case "lift":
      ctx.translate(0, -1.1 * PAGE_H * p + idle * 3);
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    case "sink":
      ctx.translate(0, 1.04 * PAGE_H * p);
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    case "spin": {
      ctx.globalAlpha *= 1 - transition(t, 0.8, 1);
      const turn = seconds * 6 + 220 * transition(t, 1.8, 0, easeInOut);
      rotateAbout(ctx, turn, PAGE_W / 2, PAGE_H / 2);
      scaleAbout(ctx, 1 + 1.6 * transition(t, 1.8, 0, awayEase), 0.5, 0.5);
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    }
    case "zoom":
      ctx.globalAlpha *= 1 - transition(t, 0.9, 1.1);
      scaleAbout(
        ctx,
        1 + 0.012 * idle + 2.4 * transition(t, 2.2, 0, bezier(0.5, 0, 0.3, 1)),
        0.5,
        0.46,
      );
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    case "split":
    case "soft": {
      const reach = move === "split" ? 0.62 : 0.75;
      const q = move === "soft" ? transition(t, 2.2, 0, easeInOut) : p;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.beginPath();
        // The soft halves overlap at the middle, so no seam shows before they part
        const cut = move === "soft" ? 0.58 : 0.5;
        if (side < 0) ctx.rect(0, 0, PAGE_W * cut, PAGE_H);
        else ctx.rect(PAGE_W * (1 - cut), 0, PAGE_W * cut, PAGE_H);
        ctx.clip();
        ctx.translate(side * reach * PAGE_W * q + side * idle * 1.5, 0);
        if (move === "soft") ctx.globalAlpha *= 1 - 0.6 * q;
        fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
        ctx.restore();
      }
      return;
    }
    case "train":
      ctx.translate(-1.3 * PAGE_W * transition(t, 2, 0, bezier(0.5, 0, 0.8, 0.6)), 0);
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    case "edge":
      ctx.globalAlpha *= 1 - transition(t, 1, 0.5);
      scaleAbout(ctx, 1 + 0.01 * idle + 0.35 * transition(t, 1.6, 0, awayEase), 0.5, 0.5);
      fillWith(ctx, art, 0, 0, PAGE_W, PAGE_H);
      return;
    case "tiles":
      return;
  }
}

function drawTiles(ctx: Ctx, film: PreludeFilm, id: FreshOpening, t: number) {
  const w = PAGE_W / TILE_COLS;
  const h = (PAGE_H * 11.25) / 100;
  for (let r = 0; r < TILE_ROWS; r++) {
    for (let c = 0; c < TILE_COLS; c++) {
      const art = film.images.get(`/openings/fresh/${id}/tile-${(Math.abs(c - 2) + r) % 5}.webp`);
      if (!art) continue;
      const d = Math.hypot(c - 2, (r - 4) * 0.9);
      const q = transition(t, 0.7, 0.1 + d * 0.12, awayEase);
      const k = Math.cos((q * Math.PI) / 2);
      if (k < 0.02) continue;
      const x = c * w + w * 0.03;
      const y = r * h + h * 0.03;
      const tw = w * 0.94;
      const th = h * 0.94;
      ctx.drawImage(art, x, y + (th * (1 - k)) / 2, tw, th * k);
      ctx.fillStyle = `rgb(0 0 0 / ${0.35 * (1 - k)})`;
      ctx.fillRect(x, y + (th * (1 - k)) / 2, tw, th * k);
    }
  }
}

/* ------------------------------------------------------------------ themed openings */

type Part = { x: number; y: number; w: number; h: number; i: number; col: number; row: number };

function grid(cols: number, rows: number): Part[] {
  return Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return { x: col / cols, y: row / rows, w: 1 / cols, h: 1 / rows, i, col, row };
  });
}

const WHOLE: Part[] = [{ x: 0, y: 0, w: 1, h: 1, i: 0, col: 0, row: 0 }];

/** How each move cuts the painting (opening-themed.tsx). */
function themedParts(move: ThemedMove): Part[] {
  switch (move) {
    case "threads":
      return grid(16, 1);
    case "deal":
      return grid(1, 9);
    case "rows":
      return grid(1, 6);
    case "puzzle":
      return grid(3, 5);
    case "tumble":
      return grid(6, 10);
    case "fold":
      return grid(2, 1);
    default:
      return WHOLE;
  }
}

const jitter = (i: number) => ((i * 37) % 11) / 10 - 0.5;
const partEase = bezier(0.55, 0, 0.35, 1);

function drawThemed(ctx: Ctx, film: PreludeFilm, id: ThemedOpening, seconds: number, t: number) {
  const move = THEMED_OPENINGS[id];
  const beyond = film.images.get(`/suites/${id}/scene.webp`);
  const cover = film.images.get(`/openings/themed/${id}.webp`);
  ctx.save();
  scaleAbout(ctx, 1.06 - 0.06 * transition(t, 2.6, 0.3, bezier(0.3, 0, 0.2, 1)), 0.5, 0.5);
  if (beyond) fillWith(ctx, beyond, 0, 0, PAGE_W, PAGE_H);
  const dim = 1 - transition(t, 1.4, 0.5);
  if (dim > 0) {
    ctx.fillStyle = `rgb(0 0 0 / ${0.15 * dim})`;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  }
  ctx.restore();
  if (!cover) return;
  // Whatever is left of the painting goes at the end
  const left = 1 - transition(t, 0.4, 2.3);
  if (left <= 0) return;

  const layer = offscreen(ctx);
  layer.clearRect(0, 0, PAGE_W, PAGE_H);
  layer.save();
  scaleAbout(layer, 1 + 0.012 * breathe(seconds), 0.5, 0.5);
  const parts = themedParts(move);
  const cols = Math.max(...parts.map((part) => part.col)) + 1;
  const rows = Math.max(...parts.map((part) => part.row)) + 1;
  const { width, height } = sizeOf(cover);
  for (const part of parts) {
    layer.save();
    const box: Box = {
      x: part.x * PAGE_W,
      y: part.y * PAGE_H,
      w: part.w * PAGE_W,
      h: part.h * PAGE_H,
    };
    const mid = Math.abs(part.col - (cols - 1) / 2);
    const up = rows - 1 - part.row;
    const side = part.row % 2 || part.col % 2 ? 1 : -1;
    const j = jitter(part.i);
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    let visible = true;
    let roll: (() => void) | null = null;
    switch (move) {
      case "zoom": {
        const q = transition(t, 2.2, 0.15, bezier(0.5, 0, 0.3, 1));
        layer.globalAlpha *= 1 - transition(t, 0.9, 1.3);
        scaleAbout(layer, 1 + 2.4 * q, 0.5, 0.44);
        break;
      }
      case "sink":
        layer.translate(0, 1.04 * PAGE_H * transition(t, 1.9, 0.3, bezier(0.6, 0, 0.4, 1)));
        break;
      case "threads": {
        const q = transition(t, 1.1, mid * 0.12 + 0.1, bezier(0.55, 0, 0.75, 0.4));
        layer.translate(0, 1.12 * PAGE_H * q);
        rotateAbout(layer, j * 6 * q, cx, cy);
        break;
      }
      case "deal": {
        const q = transition(t, 0.9, part.row * 0.15, bezier(0.55, 0, 0.6, 0.6));
        layer.translate(side * 1.12 * PAGE_W * q, 0);
        rotateAbout(layer, side * 5 * q, cx, cy);
        break;
      }
      case "rows": {
        const local = (t - up * 0.19) / 1.3;
        const q = bezier(0.5, 0, 0.7, 0.5)(clamp01(local));
        const swing = q < 0.4 ? (q / 0.4) * 14 : lerp(14, 22, (q - 0.4) / 0.6);
        const drop = q < 0.4 ? 0 : ((q - 0.4) / 0.6) * 1.15 * PAGE_H;
        layer.translate(0, drop);
        rotateAbout(layer, side * swing, part.row % 2 ? PAGE_W : 0, box.y);
        break;
      }
      case "roll": {
        const q = transition(t, 1.7, 0.2, partEase);
        const bottom = box.h * (1 - q);
        layer.beginPath();
        layer.rect(0, 0, PAGE_W, bottom);
        layer.clip();
        roll = () => drawRoll(layer, bottom, q, film.colours, transition(t, 0.4, 1.9));
        break;
      }
      case "drop": {
        const local = clamp01((t - 0.15) / 1.7);
        const q = bezier(0.5, 0, 0.6, 1)(local);
        const sy = q < 0.25 ? lerp(1, 1.05, q / 0.25) : lerp(1.05, 0, (q - 0.25) / 0.75);
        layer.translate(PAGE_W / 2, PAGE_H);
        layer.scale(q < 0.25 ? lerp(1, 1.05, q / 0.25) : lerp(1.05, 1.02, (q - 0.25) / 0.75), sy);
        layer.translate(-PAGE_W / 2, -PAGE_H);
        visible = sy > 0.01;
        break;
      }
      case "wheel": {
        const q = transition(t, 2, 0.15, bezier(0.45, 0, 0.6, 1));
        // The beach round the wheel goes with the light
        layer.save();
        layer.globalAlpha *= 1 - transition(t, 1.2, 0.6);
        layer.drawImage(cover, 0, 0, width, height, 0, 0, PAGE_W, PAGE_H);
        layer.restore();
        layer.translate(1.25 * PAGE_W * q, 0);
        rotateAbout(layer, 300 * q, PAGE_W * 0.5, PAGE_H * 0.485);
        layer.beginPath();
        layer.ellipse(
          PAGE_W * 0.5,
          PAGE_H * 0.485,
          PAGE_W * 0.49,
          PAGE_H * 0.276,
          0,
          0,
          Math.PI * 2,
        );
        layer.clip();
        break;
      }
      case "fold": {
        if (part.col === 1) {
          // The right half folds over onto the left
          const q = transition(t, 0.9, 0.1, bezier(0.5, 0, 0.4, 1));
          const k = Math.cos(q * Math.PI);
          if (q > 0.5 || t > 0.95) visible = false;
          layer.translate(PAGE_W / 2, 0);
          layer.scale(Math.max(0.001, k), 1);
          layer.translate(-PAGE_W / 2, 0);
        } else {
          const local = clamp01((t - 0.95) / 1.3);
          const q = bezier(0.5, 0, 0.6, 1)(local);
          layer.globalAlpha *= 1 - clamp01((q - 0.4) / 0.6);
          layer.translate(0.1 * PAGE_W * q, -0.6 * PAGE_H * q);
          rotateAbout(layer, -25 * q, cx, cy);
          const sx = q < 0.4 ? 1 : lerp(1, 0.12, (q - 0.4) / 0.6);
          const sy = q < 0.4 ? lerp(1, 0.5, q / 0.4) : lerp(0.5, 0.06, (q - 0.4) / 0.6);
          layer.translate(PAGE_W / 2, PAGE_H / 2);
          layer.scale(sx, sy);
          layer.translate(-PAGE_W / 2, -PAGE_H / 2);
        }
        break;
      }
      case "flip": {
        // Five pages flip up in turn, faster and faster
        for (let page = 4; page >= 0; page--) {
          const q = transition(t, 0.65, (4 - page) * 0.26, bezier(0.5, 0, 0.6, 1));
          const k = Math.cos((q * 110 * Math.PI) / 180);
          if (k <= 0.01) continue;
          layer.save();
          layer.scale(1, k);
          layer.drawImage(cover, 0, 0, width, height, 0, 0, PAGE_W, PAGE_H);
          layer.fillStyle = `rgb(0 0 0 / ${0.25 * (1 - k)})`;
          layer.fillRect(0, 0, PAGE_W, PAGE_H);
          layer.restore();
        }
        visible = false;
        break;
      }
      case "puzzle": {
        const q = transition(t, 1.1, part.i * 0.07, bezier(0.5, 0, 0.6, 1));
        layer.globalAlpha *= 1 - transition(t, 0.6, part.i * 0.07 + 0.5);
        layer.translate(j * 1.2 * box.w * q, (j * -0.4 - 0.7) * box.h * q);
        rotateAbout(layer, j * 40 * q, cx, cy);
        scaleAbout(layer, 1 - 0.4 * q, cx / PAGE_W, cy / PAGE_H);
        break;
      }
      case "tumble": {
        const q = transition(t, 1.1, up * 0.11 + (j + 0.5) * 0.12, bezier(0.6, 0, 0.8, 0.5));
        layer.translate(j * 0.3 * box.w * q, 1.15 * PAGE_H * q);
        rotateAbout(layer, j * 140 * q, cx, cy);
        break;
      }
      case "slide": {
        const local = clamp01((t - 0.15) / 1.7);
        const q = bezier(0.5, 0, 0.6, 1)(local);
        const tip = q < 0.35 ? q / 0.35 : 1;
        const fall = q < 0.35 ? 0 : (q - 0.35) / 0.65;
        // Tipping back reads as the board shortening towards its top edge
        layer.translate(PAGE_W / 2, 0);
        layer.scale(lerp(1, 0.92, tip), lerp(1, 0.86, tip));
        layer.translate(-PAGE_W / 2, 1.2 * PAGE_H * fall);
        break;
      }
      case "gather": {
        const q = transition(t, 1.8, 0.15, bezier(0.55, 0, 0.4, 1));
        layer.translate(PAGE_W / 2, 0);
        layer.scale(1 - 0.75 * q, 1 - q);
        layer.translate(-PAGE_W / 2, 0);
        visible = q < 0.99;
        break;
      }
      default: {
        // Wiped off: a wave from the bottom, rubs, frost, colour sweeping in, spots of light
        layer.drawImage(cover, 0, 0, width, height, 0, 0, PAGE_W, PAGE_H);
        wipe(layer, move, t);
        visible = false;
      }
    }
    if (visible) {
      if (parts.length > 1 && move !== "wheel") {
        layer.beginPath();
        layer.rect(box.x - 0.2, box.y - 0.2, box.w + 0.4, box.h + 0.4);
        layer.clip();
      }
      layer.drawImage(cover, 0, 0, width, height, 0, 0, PAGE_W, PAGE_H);
    }
    roll?.();
    layer.restore();
  }
  layer.restore();
  ctx.save();
  ctx.globalAlpha *= left;
  blit(ctx, layer);
  ctx.restore();
}

/** The blind's roll, riding the edge as it rolls up. */
function drawRoll(ctx: Ctx, bottom: number, q: number, colours: OpeningPalette, gone: number) {
  if (gone >= 1) return;
  const h = PAGE_H * lerp(0.045, 0.07, q);
  ctx.save();
  ctx.resetTransform();
  ctx.scale(SCALE, SCALE);
  ctx.globalAlpha = 1 - gone;
  const g = ctx.createLinearGradient(0, bottom - h, 0, bottom);
  g.addColorStop(0, colours.giltDark);
  g.addColorStop(0.35, colours.gilt);
  g.addColorStop(0.55, colours.giltBright);
  g.addColorStop(1, colours.giltDark);
  ctx.fillStyle = g;
  roundRect(ctx, 0, Math.max(0, bottom - h), PAGE_W, h, h / 2);
  ctx.fill();
  ctx.restore();
}

/** The wiped moves: the painting cleared away bit by bit to show the place beyond. */
function wipe(ctx: Ctx, move: ThemedMove, t: number) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  const random = seededRandom(31);
  if (move === "wave") {
    const q = transition(t, 1.8, 0.15, bezier(0.5, 0, 0.4, 1));
    const top = PAGE_H * (1.1 - 1.3 * q);
    ctx.beginPath();
    ctx.moveTo(0, PAGE_H);
    for (let x = 0; x <= PAGE_W; x += 10) {
      ctx.lineTo(x, top + Math.sin(x / 40 + t * 6) * 14);
    }
    ctx.lineTo(PAGE_W, PAGE_H);
    ctx.closePath();
    ctx.fill();
  } else if (move === "colour") {
    const q = transition(t, 1.8, 0.15, easeInOut);
    const g = ctx.createLinearGradient(0, PAGE_H, PAGE_W, 0);
    g.addColorStop(Math.max(0, q * 1.2 - 0.2), "black");
    g.addColorStop(Math.min(1, q * 1.2), "rgb(0 0 0 / 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  } else if (move === "frost") {
    // Wiped clear in the middle, then the rest melts
    const q = transition(t, 1, 0.2, easeOut);
    const g = ctx.createRadialGradient(
      PAGE_W / 2,
      PAGE_H * 0.45,
      0,
      PAGE_W / 2,
      PAGE_H * 0.45,
      PAGE_H * 0.4 * q + 1,
    );
    g.addColorStop(0, "black");
    g.addColorStop(1, "rgb(0 0 0 / 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
    ctx.fillStyle = `rgb(0 0 0 / ${transition(t, 1, 1.1)})`;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  } else {
    // Rubs (scratch) or spots of light (spots), each opening its own round
    const count = move === "spots" ? 26 : 18;
    for (let i = 0; i < count; i++) {
      const x = random() * PAGE_W;
      const y = random() * PAGE_H;
      const at = 0.1 + random() * 1.3;
      const q = transition(t, 0.8, at, easeOut);
      if (q <= 0) continue;
      const r = (move === "spots" ? 110 : 95) * q;
      if (move === "scratch") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(random() * Math.PI);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.4, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0.6, "black");
        g.addColorStop(1, "rgb(0 0 0 / 0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }
  }
  ctx.restore();
}

/* -------------------------------------------------------------------- drawn openings */

const doorCache = new Map<string, HTMLCanvasElement>();

/**
 * The openings drawn in code (palace, temple, curtain, envelope, lotus and the rest), and
 * the theme's own doors: the cover painting split in two. Drawn ones become a pair of carved
 * doors or curtains in the theme's jewel and gilt, over the theme's painting or its light.
 */
function drawDrawn(ctx: Ctx, film: PreludeFilm, seconds: number, t: number) {
  const { style, colours } = film;
  const cover = SUITES[film.suite].images.cover;
  const painting = cover ? film.images.get(cover) : undefined;
  ctx.save();
  scaleAbout(ctx, 1.05 - 0.05 * transition(t, 1.8, 0.2, canvasEase), 0.5, 0.5);
  if (painting) fillWith(ctx, painting, 0, 0, PAGE_W, PAGE_H);
  else {
    const g = ctx.createRadialGradient(
      PAGE_W / 2,
      PAGE_H * 0.45,
      10,
      PAGE_W / 2,
      PAGE_H * 0.5,
      PAGE_H * 0.7,
    );
    g.addColorStop(0, colours.light);
    g.addColorStop(0.45, colours.plate);
    g.addColorStop(1, colours.jewel);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  }
  ctx.restore();

  const p = transition(t, 1.3, 0.15, doorEase);
  const curtain = style === "curtain";
  for (const side of ["left", "right"] as const) {
    const box: Box = { x: side === "left" ? 0 : PAGE_W / 2, y: 0, w: PAGE_W / 2, h: PAGE_H };
    if (style === "doors" && painting) {
      // The cover painting itself, cut down the middle, swings open
      const src = artBox(painting, FULL, 0.5);
      const half: Box = { ...src, w: src.w / 2, x: side === "left" ? src.x : src.x + src.w / 2 };
      drawDoor(ctx, painting, half, box, side, "swing", p, colours);
      continue;
    }
    const art = doorArt(film, curtain);
    const source: Box =
      side === "left"
        ? { x: 0, y: 0, w: art.width / 2, h: art.height }
        : { x: art.width / 2, y: 0, w: art.width / 2, h: art.height };
    drawDoor(ctx, art, source, box, side, curtain ? "gather" : "swing", p, colours);
  }
  // A seam of light between them while they wait
  const seam = (0.5 + 0.3 * Math.sin(seconds * 2.4)) * (1 - transition(t, 0.5, 0.1));
  if (seam > 0 && !curtain) drawSeam(ctx, PAGE_W / 2, PAGE_H * 0.04, PAGE_H * 0.92, colours, seam);
  drawMotes(ctx, colours.light, seconds, 1 - transition(t, 1, 1));
}

/** A pair of carved doors (or curtains) in the theme's colours, drawn once and kept. */
function doorArt(film: PreludeFilm, curtain: boolean): HTMLCanvasElement {
  const { colours } = film;
  const key = `${curtain}:${Object.values(colours).join()}`;
  const known = doorCache.get(key);
  if (known) return known;
  const canvas = document.createElement("canvas");
  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(SCALE, SCALE);
  if (curtain) {
    // Velvet in folds, a gilt fringe at the hem
    for (let i = 0; i < 18; i++) {
      const x = (i / 18) * PAGE_W;
      const w = PAGE_W / 18;
      const g = ctx.createLinearGradient(x, 0, x + w, 0);
      g.addColorStop(0, colours.woodDark);
      g.addColorStop(0.5, colours.jewel);
      g.addColorStop(1, colours.woodDark);
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, w + 0.5, PAGE_H);
    }
    ctx.fillStyle = colours.gilt;
    ctx.fillRect(0, PAGE_H - 26, PAGE_W, 6);
    for (let x = 4; x < PAGE_W; x += 8) {
      ctx.fillRect(x, PAGE_H - 20, 3, 14);
    }
  } else {
    for (const left of [0, PAGE_W / 2]) {
      const w = PAGE_W / 2;
      const g = ctx.createLinearGradient(left, 0, left + w, 0);
      g.addColorStop(0, colours.woodDark);
      g.addColorStop(0.5, colours.wood);
      g.addColorStop(1, colours.woodDark);
      ctx.fillStyle = g;
      ctx.fillRect(left, 0, w, PAGE_H);
      ctx.strokeStyle = colours.gilt;
      ctx.lineWidth = 3;
      ctx.strokeRect(left + 10, 10, w - 20, PAGE_H - 20);
      ctx.lineWidth = 1.2;
      // An arched panel above, a square one below
      const inset = left + 24;
      const pw = w - 48;
      ctx.beginPath();
      ctx.moveTo(inset, PAGE_H * 0.5);
      ctx.lineTo(inset, PAGE_H * 0.12 + pw / 2);
      ctx.arc(inset + pw / 2, PAGE_H * 0.12 + pw / 2, pw / 2, Math.PI, 0);
      ctx.lineTo(inset + pw, PAGE_H * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeRect(inset, PAGE_H * 0.56, pw, PAGE_H * 0.34);
      // Brass studs in rows
      ctx.fillStyle = colours.giltBright;
      for (let y = 40; y < PAGE_H - 30; y += 46) {
        for (const x of [left + 17, left + w - 17]) {
          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // A ring handle by the seam
      ctx.strokeStyle = colours.giltBright;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(left === 0 ? w - 26 : left + 26, PAGE_H * 0.53, 9, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  doorCache.set(key, canvas);
  return canvas;
}

/* ------------------------------------------------------------- the god and the names */

/** The god or symbol top-centre, as the opening's crest; returns where the words may start. */
function drawCrest(ctx: Ctx, film: PreludeFilm, seconds: number): number {
  const { god, colours } = film;
  const top = PAGE_H * 0.1;
  if (!god) return PAGE_H * 0.2;
  const bottom = PAGE_H * 0.27;
  const painting = GOD_PAINTINGS[god];
  const art = painting ? film.images.get(painting.src) : undefined;
  const h = bottom - top;
  const glow = 0.75 + 0.25 * Math.sin(seconds * 1.6);
  const cx = PAGE_W / 2;
  const halo = ctx.createRadialGradient(cx, top + h / 2, 0, cx, top + h / 2, h * 0.9);
  halo.addColorStop(0, withAlpha(colours.light, 0.65 * glow));
  halo.addColorStop(1, withAlpha(colours.light, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(cx - h, top - h * 0.4, h * 2, h * 1.8);
  if (art && painting) {
    const w = Math.min(h * painting.aspect, PAGE_W * 0.6);
    const ah = w / painting.aspect;
    ctx.drawImage(art, cx - w / 2, bottom - ah, w, ah);
  } else {
    // A gilt medallion with the symbol
    const r = h * 0.42;
    const cy = top + h / 2;
    ctx.fillStyle = colours.plate;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colours.gilt;
    ctx.lineWidth = 2;
    ctx.stroke();
    const symbol = god === "om" ? SYMBOLS.om : god === "swastik" ? SYMBOLS.swastik : SYMBOLS.kalash;
    if (symbol.kind === "glyph") {
      ctx.font = `${r * 1.3}px ${symbol.font === "display" ? film.fonts.display : film.fonts.sans}`;
      ctx.fillStyle = colours.accentText;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(symbol.text, cx, cy + r * 0.06);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      const unit = r * 0.7;
      ctx.scale(unit, unit);
      const ink: Record<string, string> = {
        paper: colours.plate,
        ink: colours.ink,
        inkMuted: colours.inkMuted,
        gold: colours.gilt,
        goldText: colours.giltDark,
        accent: colours.jewel,
        accentText: colours.accentText,
        back: colours.deep,
      };
      for (const shape of symbol.shapes) {
        const path = new Path2D(shape.d);
        if (shape.fill) {
          ctx.fillStyle = ink[shape.fill] ?? colours.gilt;
          ctx.fill(path);
        }
        if (shape.stroke) {
          ctx.strokeStyle = ink[shape.stroke] ?? colours.gilt;
          ctx.lineWidth = shape.width ?? 0.3;
          ctx.stroke(path);
        }
      }
      ctx.restore();
    }
  }
  return bottom + PAGE_H * 0.02;
}

/** A face for one of the theme's roles, with the host's own font when they chose one. */
function face(film: PreludeFilm, role: TypeRole, size: number): string {
  const set = lettering(SUITES[film.suite].voice ?? "regal", role, film.lang);
  const own = role === "names" ? film.type.names : film.type.words;
  const weight = role === "names" && film.type.bold ? 700 : own ? undefined : set.weight;
  const italic = role === "names" && film.type.italic ? "italic " : "";
  return `${italic}${weight ? `${weight} ` : ""}${size}px ${own ?? set.family}`;
}

function joinerOf(copy: CardCopy): string {
  return !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
}

type Row = {
  text: string;
  font: string;
  size: number;
  colour: string;
  gap: number;
  label?: boolean;
};

/** The words on the closed opening: blessing, names and date on a cream plate with gilt rules. */
function drawPlate(ctx: Ctx, film: PreludeFilm, top: number, seconds: number) {
  const { copy, colours } = film;
  const scale = film.type.scale;
  const maxW = Math.min(68 * CQW, 24 * REM) - 10 * CQW;
  const rows: Row[] = [];
  const blessing = copy.blessing.trim();
  if (blessing)
    rows.push({
      text: blessing,
      font: "script",
      size: 4.2 * CQW,
      colour: colours.accentText,
      gap: 0,
    });
  const nameSize = Math.min(11.5 * CQW, 6.6 * CQH, 4.2 * REM) * scale;
  const nameColour = film.type.colour ?? colours.ink;
  rows.push({
    text: copy.first,
    font: "names",
    size: nameSize,
    colour: nameColour,
    gap: blessing ? 1.2 * CQH : 0,
  });
  const joiner = joinerOf(copy);
  if (joiner) {
    rows.push({
      text: joiner,
      font: "names",
      size: Math.min(6.5 * CQW, 4.2 * CQH) * scale,
      colour: colours.accentText,
      gap: 0,
    });
    rows.push({ text: copy.second, font: "names", size: nameSize, colour: nameColour, gap: 0 });
  }
  const date = copy.date.trim();
  if (date)
    rows.push({
      text: keepDate(date),
      font: "body",
      size: Math.max(13.6, 3.6 * CQW),
      colour: colours.inkMuted,
      gap: 2.4 * CQH,
    });

  const laid = layRows(ctx, film, rows, maxW);
  const height = laid.reduce((sum, row) => sum + row.gap + row.height, 0);
  const width = Math.min(maxW, Math.max(...laid.map((row) => row.width))) + 10 * CQW;
  const padY = 1.6 * CQH + 14;
  const boxH = height + padY * 2;
  // Centred in the room under the crest, a little above the middle of what's left
  const room = PAGE_H * 0.86 - top;
  const y = top + Math.max(0, (room - boxH) * 0.45);
  const x = (PAGE_W - width) / 2;

  ctx.save();
  ctx.shadowColor = "rgb(0 0 0 / 0.45)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;
  platePath(ctx, x - 6, y - 6, width + 12, boxH + 12);
  ctx.fillStyle = colours.plate;
  ctx.fill();
  ctx.restore();
  ctx.save();
  platePath(ctx, x - 6, y - 6, width + 12, boxH + 12);
  ctx.strokeStyle = colours.gilt;
  ctx.lineWidth = 2.4;
  ctx.stroke();
  platePath(ctx, x, y, width, boxH);
  const light = ctx.createRadialGradient(PAGE_W / 2, y, 0, PAGE_W / 2, y, boxH * 0.9);
  light.addColorStop(0, withAlpha(colours.light, 0.35));
  light.addColorStop(1, withAlpha(colours.light, 0));
  ctx.fillStyle = light;
  ctx.fill();
  platePath(ctx, x + 5, y + 5, width - 10, boxH - 10);
  ctx.strokeStyle = withAlpha(colours.gilt, 0.7);
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();

  let cursor = y + padY;
  for (const row of laid) {
    cursor += row.gap;
    if (row.rule) {
      drawFlourish(
        ctx,
        PAGE_W / 2,
        cursor - row.gap / 2,
        Math.min(width * 0.5, 120),
        colours.gilt,
        1,
      );
    }
    drawLines(ctx, row, cursor);
    cursor += row.height;
  }
  void seconds;
}

/** An arch-topped cartouche, as .opening-plate's border-radius draws it. */
function platePath(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const top = Math.min(2.6 * REM, h / 3);
  const r = Math.min(REM, h / 4);
  ctx.beginPath();
  ctx.moveTo(x, y + top);
  ctx.ellipse(x + w / 2, y + top, w / 2, top, 0, Math.PI, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.closePath();
}

type Laid = {
  lines: string[];
  font: string;
  colour: string;
  lineHeight: number;
  height: number;
  width: number;
  gap: number;
  rule: boolean;
  label: boolean;
};

/** Fits each row to the width: long names shrink a little, then wrap. */
function layRows(ctx: Ctx, film: PreludeFilm, rows: readonly Row[], maxW: number): Laid[] {
  return rows.map((row, i) => {
    const role: TypeRole =
      row.font === "names"
        ? "names"
        : row.font === "script"
          ? "script"
          : row.label
            ? "label"
            : "body";
    let size = row.size;
    ctx.font = face(film, role, size);
    const natural = ctx.measureText(row.text).width;
    if (role === "names" && natural > maxW)
      size = Math.max(row.size * 0.7, (size * maxW) / natural);
    const font = row.label ? `${size}px ${film.fonts.label}` : face(film, role, size);
    ctx.font = font;
    const text = row.label ? row.text.toLocaleUpperCase(film.lang) : row.text;
    const lines = wrap(ctx, text, maxW);
    const lineHeight = size * (role === "names" ? 1.08 : 1.3);
    const width = Math.max(...lines.map((line) => ctx.measureText(line).width), 0);
    return {
      lines,
      font,
      colour: row.colour,
      lineHeight,
      height: lines.length * lineHeight,
      width,
      gap: row.gap,
      rule: i > 0 && row.font === "body" && rows[i - 1]?.font === "names",
      label: Boolean(row.label),
    };
  });
}

function drawLines(ctx: Ctx, row: Laid, y: number) {
  ctx.font = row.font;
  ctx.fillStyle = row.colour;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  row.lines.forEach((line, i) => ctx.fillText(line, PAGE_W / 2, y + row.lineHeight * (i + 0.5)));
}

/** A fine gilt line with a dot in its middle, `p` of the way drawn out from the centre. */
function drawFlourish(ctx: Ctx, cx: number, y: number, width: number, colour: string, p: number) {
  if (p <= 0) return;
  const half = (width / 2) * p;
  ctx.save();
  for (const side of [-1, 1]) {
    const g = ctx.createLinearGradient(cx + side * 8, y, cx + side * (half + 1), y);
    g.addColorStop(0, withAlpha(colour, 0));
    g.addColorStop(0.3, colour);
    g.addColorStop(1, withAlpha(colour, 0));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + side * 8, y);
    ctx.lineTo(cx + side * half, y);
    ctx.stroke();
  }
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(cx, y, 3.4 * p, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ---------------------------------------------------------------------- the welcome */

const riseEase = bezier(0.2, 0.7, 0.2, 1);
const popEase = bezier(0.3, 1.4, 0.5, 1);

/** Dark skies carry ivory words; card stock carries ink (opening-welcome.tsx). */
const DARK: Record<WelcomeKind, boolean> = {
  royal: false,
  bloom: false,
  lamps: true,
  night: true,
  party: true,
  letter: false,
};

/** The welcome, `local` seconds after it began to fade in over the opened opening. */
function drawWelcome(ctx: Ctx, film: PreludeFilm, local: number) {
  const { kind } = film;
  const over = isFreshOpening(film.style);
  const dark = DARK[kind] && !over;
  const fade = transition(local, 0.7, 0, ease);
  ctx.save();
  ctx.globalAlpha = fade;
  // It settles in from a touch larger, as welcome-in does
  scaleAbout(ctx, 1.05 - 0.05 * fade, 0.5, 0.5);
  drawWelcomeGround(ctx, film, over, dark);
  drawWelcomeArt(ctx, film, local);
  ctx.restore();

  ctx.save();
  drawWelcomeWords(ctx, film, local, dark);
  ctx.restore();
}

function drawWelcomeGround(ctx: Ctx, film: PreludeFilm, over: boolean, dark: boolean) {
  const { kind, colours: c } = film;
  const W = PAGE_W;
  const H = PAGE_H;
  if (over) {
    // Over a fresh opening the place revealed still shows round the names
    ctx.save();
    ctx.translate(W / 2, H * 0.46);
    ctx.scale(0.75 * W, 0.55 * H);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, withAlpha(c.plate, 0.94));
    g.addColorStop(0.55, withAlpha(c.plate, 0.82));
    g.addColorStop(1, withAlpha(c.plate, 0.3));
    ctx.fillStyle = g;
    ctx.fillRect(-2, -2, 4, 4);
    ctx.restore();
    return;
  }
  if (kind === "night") {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, c.deep);
    g.addColorStop(1, mix(c.jewel, c.deep, 0.48));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    const moon = ctx.createRadialGradient(W * 0.78, H * 0.14, 0, W * 0.78, H * 0.14, H * 0.34);
    moon.addColorStop(0, withAlpha(c.gilt, 0.22));
    moon.addColorStop(1, withAlpha(c.gilt, 0));
    ctx.fillStyle = moon;
    ctx.fillRect(0, 0, W, H);
    return;
  }
  if (kind === "letter") {
    radialFill(ctx, W / 2, H / 2, H * 0.6, [
      [0, mix(c.jewel, c.deep, 0.7)],
      [1, c.deep],
    ]);
    return;
  }
  if (dark) {
    radialFill(ctx, W / 2, H * 0.4, H * 0.7, [
      [0, mix(c.jewel, c.deep, 0.62)],
      [0.72, c.deep],
      [1, c.deep],
    ]);
    return;
  }
  if (kind === "bloom") {
    radialFill(ctx, W / 2, H * 0.46, H * 0.62, [
      [0.3, c.plate],
      [1, mix(c.plate, c.petalFall, 0.72)],
    ]);
    return;
  }
  radialFill(ctx, W / 2, H * 0.42, H * 0.65, [
    [0, mix(c.light, c.plate, 0.7)],
    [0.46, c.plate],
    [1, mix(c.plate, c.gilt, 0.78)],
  ]);
}

function radialFill(ctx: Ctx, x: number, y: number, r: number, stops: [number, string][]) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
}

/** Spread a few things evenly but not in rows, as the welcome does. */
const spread = (i: number, a: number, b: number, span: number, from: number) =>
  ((i * a + b) % span) + from;

function drawWelcomeArt(ctx: Ctx, film: PreludeFilm, u: number) {
  const { kind, colours: c } = film;
  if (kind === "royal") {
    drawRays(ctx, c, u);
    drawToran(ctx, c, u);
    drawPetals(ctx, c, u, 14);
  } else if (kind === "bloom") {
    drawLotus(ctx, c, u);
    drawPetals(ctx, c, u, 10);
  } else if (kind === "lamps") {
    drawLamps(ctx, c, u);
  } else if (kind === "night") {
    drawNight(ctx, c, u);
  } else if (kind === "party") {
    drawParty(ctx, c, u);
  } else {
    drawLetter(ctx, c, u);
  }
}

function drawRays(ctx: Ctx, c: OpeningPalette, u: number) {
  const alpha = transition(u, 1.2, 0.2);
  if (alpha <= 0) return;
  const cx = PAGE_W / 2;
  const cy = PAGE_H * 0.46;
  const r = 0.95 * PAGE_H;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(cx, cy);
  ctx.rotate((u / 60) * Math.PI * 2);
  const g = ctx.createRadialGradient(0, 0, r * 0.08, 0, 0, r * 0.52);
  g.addColorStop(0, withAlpha(c.gilt, 0.2));
  g.addColorStop(1, withAlpha(c.gilt, 0));
  ctx.fillStyle = g;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, a, a + (4 / 360) * Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** A toran of marigold strings and mango leaves swinging in from the top. */
function drawToran(ctx: Ctx, c: OpeningPalette, u: number) {
  const drop = transition(u, 1.1, 0.15, popEase);
  const y = lerp(-60, 0, drop);
  const count = 9;
  const w = PAGE_W / count;
  ctx.save();
  ctx.translate(0, y);
  ctx.fillStyle = c.gilt;
  ctx.fillRect(0, 0, PAGE_W, 5);
  for (let i = 0; i < count; i++) {
    const x = w * (i + 0.5);
    const sway = Math.sin(u * 1.8 + i) * 2;
    // A string of marigolds
    for (let k = 0; k < 5; k++) {
      ctx.fillStyle = k % 2 ? c.marigold : mix(c.marigold, c.jewel, 0.75);
      ctx.beginPath();
      ctx.arc(x + sway * (k / 5), 9 + k * 7.5, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }
    // A mango leaf between strings
    const lx = x + w / 2;
    if (i < count - 1) {
      ctx.fillStyle = mix(c.jewel, c.deep, 0.6);
      ctx.beginPath();
      ctx.moveTo(lx - 7, 5);
      ctx.quadraticCurveTo(lx, 30, lx, 34);
      ctx.quadraticCurveTo(lx, 30, lx + 7, 5);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Marigold and rose petals drifting down the whole screen. */
function drawPetals(ctx: Ctx, c: OpeningPalette, u: number, count: number) {
  const colours = [c.marigold, c.petalFall, c.jewel];
  for (let i = 0; i < count; i++) {
    const local = u - i * 0.26;
    if (local < 0) continue;
    const q = (local % 5.5) / 5.5;
    const alpha = q < 0.1 ? q / 0.1 : q > 0.85 ? ((1 - q) / 0.15) * 0.8 : 0.9;
    const x = (spread(i, 37, 5, 92, 3) / 100) * PAGE_W + 6 * CQW * q;
    const y = -5 * CQH + 110 * CQH * q;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y);
    ctx.rotate((320 * q * Math.PI) / 180);
    ctx.fillStyle = colours[i % 3]!;
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.2 * CQW, 1.7 * CQW, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawLotus(ctx: Ctx, c: OpeningPalette, u: number) {
  const cx = PAGE_W / 2;
  const cy = PAGE_H * 0.46;
  const size = Math.min(118 * CQW, 72 * CQH) / 200;
  const rings: [number, number, number, string, number][] = [
    [12, 96, 26, c.petal, 0],
    [10, 72, 22, mix(c.petal, c.jewel, 0.7), 1],
    [8, 46, 16, mix(c.light, c.plate, 0.6), 2],
  ];
  ctx.save();
  ctx.globalAlpha *= 0.4;
  ctx.translate(cx, cy);
  ctx.scale(size, size);
  ctx.rotate((u / 80) * Math.PI * 2);
  for (const [count, length, width, fill, ring] of rings) {
    const grow = transition(u, 1.2, 0.2 + ring * 0.28, popEase);
    if (grow <= 0) continue;
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.rotate((((360 / count) * i + ring * 15) * Math.PI) / 180);
      ctx.scale(grow, grow);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-width, -length * 0.35, -width * 0.7, -length * 0.85, 0, -length);
      ctx.bezierCurveTo(width * 0.7, -length * 0.85, width, -length * 0.35, 0, 0);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = c.gilt;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawFlame(
  ctx: Ctx,
  c: OpeningPalette,
  x: number,
  y: number,
  size: number,
  lit: number,
  u: number,
) {
  if (lit <= 0) return;
  const flicker = 1 + 0.08 * Math.sin(u * 9 + x);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(lit * size * flicker, lit * size);
  const glow = ctx.createRadialGradient(0, -8, 0, 0, -8, 20);
  glow.addColorStop(0, withAlpha(c.marigold, 0.5));
  glow.addColorStop(1, withAlpha(c.marigold, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(-20, -28, 40, 40);
  ctx.fillStyle = c.marigold;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(5, -10, 5, -4, 0, 0);
  ctx.bezierCurveTo(-5, -4, -5, -10, 0, -18);
  ctx.fill();
  ctx.fillStyle = c.giltBright;
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.bezierCurveTo(2, -8, 2, -5, 0, -2);
  ctx.bezierCurveTo(-2, -5, -2, -8, 0, -13);
  ctx.fill();
  ctx.restore();
}

function drawLamps(ctx: Ctx, c: OpeningPalette, u: number) {
  const y = PAGE_H - 11 * CQH;
  const left = 4 * CQW;
  const span = PAGE_W - 8 * CQW;
  const w = Math.min(10 * CQW, 64);
  for (let i = 0; i < 7; i++) {
    const x = left + w / 2 + ((span - w) * i) / 6;
    const lit = transition(u, 0.5, 0.3 + i * 0.18, easeOut);
    // The diya's bowl
    ctx.fillStyle = c.gilt;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.42, y - w * 0.1);
    ctx.lineTo(x + w * 0.42, y - w * 0.1);
    ctx.quadraticCurveTo(x + w * 0.38, y + w * 0.32, x, y + w * 0.32);
    ctx.quadraticCurveTo(x - w * 0.38, y + w * 0.32, x - w * 0.42, y - w * 0.1);
    ctx.fill();
    ctx.strokeStyle = c.giltDark;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.42, y - w * 0.1);
    ctx.lineTo(x + w * 0.42, y - w * 0.1);
    ctx.stroke();
    drawFlame(ctx, c, x, y - w * 0.1, w / 40, lit, u);
  }
  // Warm motes rising from the row
  for (let i = 0; i < 12; i++) {
    const local = u - 0.6 - i * 0.33;
    if (local < 0) continue;
    const q = (local % 4.2) / 4.2;
    const alpha = q < 0.2 ? q / 0.2 : 1 - (q - 0.2) / 0.8;
    const x = (spread(i, 29, 7, 88, 5) / 100) * PAGE_W;
    const my = PAGE_H - 12 * CQH - 60 * CQH * q;
    const r = 3.2 * (0.6 + 0.8 * q);
    const g = ctx.createRadialGradient(x, my, 0, x, my, r);
    g.addColorStop(0, withAlpha(c.marigold, 0.9 * alpha));
    g.addColorStop(1, withAlpha(c.marigold, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, my - r, r * 2, r * 2);
  }
}

function drawNight(ctx: Ctx, c: OpeningPalette, u: number) {
  for (let i = 0; i < 22; i++) {
    const x = (spread(i, 41, 3, 94, 3) / 100) * PAGE_W;
    const y = (spread(i, 23, 11, 70, 2) / 100) * PAGE_H;
    const tw = 0.5 - 0.5 * Math.cos(((u - i * 0.17) / 2.6) * Math.PI * 2);
    const r = 2.4 * (0.6 + 0.7 * tw);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, withAlpha(c.giltBright, 0.15 + 0.85 * tw));
    g.addColorStop(1, withAlpha(c.giltBright, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // The crescent rises
  const rise = transition(u, 1.6, 0.2, riseEase);
  const size = Math.min(24 * CQW, 144);
  const mx = PAGE_W - 9 * CQW - size / 2;
  const my = 6 * CQH + size / 2 + size * 0.3 * (1 - rise);
  if (rise > 0) {
    ctx.save();
    ctx.globalAlpha *= rise;
    const layer = offscreen(ctx);
    layer.clearRect(0, 0, PAGE_W, PAGE_H);
    layer.fillStyle = c.giltBright;
    layer.shadowColor = withAlpha(c.giltBright, 0.6);
    layer.shadowBlur = 22;
    layer.beginPath();
    layer.arc(mx, my, size * 0.4, 0, Math.PI * 2);
    layer.fill();
    layer.shadowBlur = 0;
    layer.globalCompositeOperation = "destination-out";
    layer.beginPath();
    layer.arc(mx + size * 0.16, my - size * 0.12, size * 0.38, 0, Math.PI * 2);
    layer.fill();
    layer.globalCompositeOperation = "source-over";
    blit(ctx, layer);
    ctx.restore();
  }
  // Lanterns lower on their strings and sway
  [12, 30, 76].forEach((left, i) => {
    const lower = transition(u, 1.2, 0.3 + i * 0.2, easeOut) * [9, 15, 7][i]! * CQH;
    const x = (left / 100) * PAGE_W;
    const lw = Math.min(6.5 * CQW, 40);
    const sway = Math.sin(((u + i * 0.9) / 3.6) * Math.PI * 2) * 5;
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate((sway * Math.PI) / 180);
    ctx.fillStyle = c.gilt;
    ctx.fillRect(-0.5, 0, 1, lower);
    ctx.translate(0, lower);
    const k = lw / 20;
    ctx.scale(k, k);
    ctx.fillStyle = c.gilt;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(4, 5);
    ctx.lineTo(-4, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, 6);
    ctx.lineTo(5, 6);
    ctx.lineTo(7, 22);
    ctx.bezierCurveTo(7, 26, -7, 26, -7, 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c.marigold;
    ctx.globalAlpha *= 0.85 + 0.15 * Math.sin(u * 8 + i);
    ctx.beginPath();
    ctx.moveTo(-3, 9);
    ctx.lineTo(3, 9);
    ctx.lineTo(4, 21);
    ctx.bezierCurveTo(4, 23, -4, 23, -4, 21);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawParty(ctx: Ctx, c: OpeningPalette, u: number) {
  const cx = PAGE_W / 2;
  const cy = PAGE_H * 0.44;
  const colours = [c.marigold, c.giltBright, c.petalFall, c.light];
  for (const i of [0, 1]) {
    const q = transition(u, 1.6, 0.1 + i * 0.45, easeOut);
    if (q <= 0 || q >= 1) continue;
    ctx.save();
    ctx.globalAlpha *= 1 - q;
    ctx.strokeStyle = withAlpha(c.giltBright, 0.7);
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 45 * CQW * q, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const reach = 30 + ((i * 17) % 22);
    const dx = Math.cos(angle) * reach * CQW;
    const dy = Math.sin(angle) * reach * 0.9 * CQH;
    const spin = (i * 47) % 360;
    const local = clamp01((u - 0.15 - i * 0.012) / 2.4);
    if (local <= 0 || local >= 1) continue;
    let x: number;
    let y: number;
    let rot: number;
    let alpha = 1;
    if (local < 0.45) {
      const q = bezier(0.1, 0.8, 0.3, 1)(local / 0.45);
      x = dx * q;
      y = dy * q;
      rot = spin * q;
    } else {
      const q = (local - 0.45) / 0.55;
      x = lerp(dx, dx * 1.1, q);
      y = lerp(dy, dy + 30 * CQH, q);
      rot = lerp(spin, spin * 3, q);
      alpha = 1 - q;
    }
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(cx + x, cy + y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.fillStyle = colours[i % 4]!;
    ctx.fillRect(-0.8 * CQW, -1.3 * CQW, 1.6 * CQW, 2.6 * CQW);
    ctx.restore();
  }
  for (let i = 0; i < 8; i++) {
    const local = u - 0.4 - i * 0.42;
    if (local < 0) continue;
    const q = (local % 4.8) / 4.8;
    const alpha = q < 0.1 ? (q / 0.1) * 0.85 : lerp(0.85, 0.6, (q - 0.1) / 0.9);
    const x = (spread(i, 31, 4, 90, 4) / 100) * PAGE_W;
    const y = lerp(-16 * CQH, 110 * CQH, q);
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y);
    ctx.rotate((lerp(8, -14, q) * Math.PI) / 180);
    ctx.fillStyle = colours[i % 4]!;
    roundRect(ctx, 0, 0, 1.2 * CQW, 14 * CQH, 1.2 * CQW);
    ctx.fill();
    ctx.restore();
  }
}

function drawLetter(ctx: Ctx, c: OpeningPalette, u: number) {
  const unfold = transition(u, 0.9, 0, bezier(0.3, 1.1, 0.4, 1));
  const x = 6 * CQW;
  const y = 9 * CQH;
  const w = PAGE_W - 12 * CQW;
  const h = PAGE_H - 18 * CQH;
  ctx.save();
  ctx.globalAlpha *= clamp01(unfold * 1.5);
  ctx.translate(0, PAGE_H / 2);
  ctx.scale(1, lerp(0.2, 1, unfold));
  ctx.translate(0, -PAGE_H / 2);
  ctx.shadowColor = "rgb(0 0 0 / 0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fillStyle = c.plate;
  ctx.fill();
  ctx.shadowColor = "transparent";
  const g = ctx.createRadialGradient(PAGE_W / 2, y + h * 0.3, 0, PAGE_W / 2, y + h * 0.3, h * 0.6);
  g.addColorStop(0, withAlpha(c.light, 0.4));
  g.addColorStop(1, withAlpha(c.light, 0));
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = withAlpha(c.gilt, 0.7);
  ctx.lineWidth = 1;
  ctx.stroke();
  // Gilt corners draw themselves
  const draw = transition(u, 1.2, 0.6);
  const size = Math.min(12 * CQW, 80);
  const k = size / 40;
  const corners: [number, number, number, number][] = [
    [x + 2 * CQW, y + 2 * CQW, 1, 1],
    [x + w - 2 * CQW, y + 2 * CQW, -1, 1],
    [x + 2 * CQW, y + h - 2 * CQW, 1, -1],
    [x + w - 2 * CQW, y + h - 2 * CQW, -1, -1],
  ];
  if (draw > 0) {
    for (const [cx, cy, sx, sy] of corners) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sx * k, sy * k);
      const path = new Path2D(
        "M2 38 V10 C2 5 5 2 10 2 H38 M8 32 V14 C8 10 10 8 14 8 H32 M14 14 C20 14 20 20 14 20",
      );
      ctx.setLineDash([140 * draw, 140]);
      ctx.strokeStyle = c.gilt;
      ctx.lineWidth = 1.4;
      ctx.stroke(path);
      ctx.restore();
    }
  }
  ctx.restore();
}

/** The names, the line and the day, rising in one after another (opening-welcome.tsx). */
function drawWelcomeWords(ctx: Ctx, film: PreludeFilm, u: number, dark: boolean) {
  const { copy, colours: c, kind } = film;
  const ink = dark ? c.ivory : c.ink;
  const soft = dark ? withAlpha(c.ivory, 0.82) : c.inkMuted;
  const accent = dark ? c.giltBright : c.accentText;
  const pad = kind === "letter" ? 14 * CQW : 8 * CQW;
  const maxW = PAGE_W - pad * 2;
  const gap = 2 * CQH;
  const scale = film.type.scale;
  const nameSize = Math.min(13 * CQW, 8 * CQH, 4.6 * REM) * scale;
  const joiner = joinerOf(copy);
  const line = copy.line.trim();
  const venue = copy.venue.trim();
  const date = copy.date.trim();
  type Item = { row: Row; at: number; kind: "rise" | "name" | "pop" | "rule" | "date" };
  const items: Item[] = [];
  const blessing = copy.blessing.trim();
  if (blessing)
    items.push({
      row: {
        text: blessing,
        font: "script",
        size: Math.max(15.2, 4.6 * CQW),
        colour: accent,
        gap: 0,
      },
      at: 0.35,
      kind: "rise",
    });
  items.push({
    row: { text: copy.first, font: "names", size: nameSize, colour: film.type.colour ?? ink, gap },
    at: 0.55,
    kind: "name",
  });
  if (joiner) {
    items.push({
      row: {
        text: joiner,
        font: "names",
        size: Math.min(7 * CQW, 4.5 * CQH, 2.4 * REM) * scale,
        colour: accent,
        gap: 0,
      },
      at: 0.9,
      kind: "pop",
    });
    items.push({
      row: {
        text: copy.second,
        font: "names",
        size: nameSize,
        colour: film.type.colour ?? ink,
        gap: 0,
      },
      at: 1.05,
      kind: "name",
    });
  }
  items.push({
    row: { text: "", font: "body", size: 12, colour: c.gilt, gap },
    at: 1.35,
    kind: "rule",
  });
  if (line)
    items.push({
      row: { text: line, font: "body", size: Math.max(13.6, 3.8 * CQW), colour: soft, gap },
      at: 1.55,
      kind: "rise",
    });
  if (date)
    items.push({
      row: {
        text: keepDate(date),
        font: "body",
        size: Math.max(12, 3.2 * CQW),
        colour: ink,
        gap,
        label: film.lang === "en",
      },
      at: 1.8,
      kind: "date",
    });
  if (venue)
    items.push({
      row: {
        text: venue,
        font: "body",
        size: Math.max(12.8, 3.4 * CQW),
        colour: soft,
        gap: date ? 4 : gap,
      },
      at: 1.8,
      kind: "rise",
    });

  const laid = layRows(
    ctx,
    film,
    items.map((item) => item.row),
    maxW,
  ).map((row, i) => {
    const item = items[i]!;
    const height =
      item.kind === "rule" ? 12 : item.kind === "date" ? row.height + 1.6 * CQH : row.height;
    return { ...row, rule: false, height, item };
  });
  const total = laid.reduce((sum, row) => sum + row.gap + row.height, 0);
  const offset = kind === "royal" ? 4 * CQH : kind === "lamps" ? -7 * CQH : 0;
  let y = (PAGE_H - total) / 2 + offset;
  for (const row of laid) {
    y += row.gap;
    const { item } = row;
    const local = u - item.at;
    if (item.kind === "rule") {
      drawFlourish(
        ctx,
        PAGE_W / 2,
        y + 6,
        Math.min(46 * CQW, 13 * REM),
        c.gilt,
        transition(local, 0.9, 0, bezier(0.6, 0, 0.2, 1)),
      );
    } else if (local > 0) {
      const duration = item.kind === "name" ? 1.3 : item.kind === "pop" ? 0.8 : 1;
      const q = transition(local, duration, 0, item.kind === "pop" ? popEase : riseEase);
      ctx.save();
      ctx.globalAlpha *= clamp01(q);
      if (item.kind === "pop") {
        const cy = y + row.height / 2;
        ctx.translate(PAGE_W / 2, cy);
        ctx.rotate((-12 * (1 - q) * Math.PI) / 180);
        const s = lerp(0.4, 1, q);
        ctx.scale(s, s);
        ctx.translate(-PAGE_W / 2, -cy);
      } else {
        ctx.translate(0, (item.kind === "name" ? 0.4 * row.lineHeight : 19) * (1 - q));
      }
      if (item.kind === "name") {
        if ("letterSpacing" in ctx) ctx.letterSpacing = `${(0.12 * (1 - q)).toFixed(3)}em`;
        ctx.shadowColor = withAlpha(c.gilt, 0.4 * q);
        ctx.shadowBlur = row.lineHeight * 0.3;
        ctx.shadowOffsetY = row.lineHeight * 0.05;
      }
      if (item.kind === "date") {
        const w = row.width + 8 * CQW;
        roundRect(ctx, (PAGE_W - w) / 2, y, w, row.height, 16);
        ctx.fillStyle = withAlpha(c.gilt, 0.16);
        ctx.fill();
        ctx.strokeStyle = withAlpha(c.gilt, 0.6);
        ctx.lineWidth = 1;
        ctx.stroke();
        if ("letterSpacing" in ctx) ctx.letterSpacing = row.label ? "0.18em" : "0px";
        drawLines(ctx, row, y + 0.8 * CQH);
      } else {
        drawLines(ctx, row, y);
      }
      ctx.restore();
    }
    y += row.height;
  }
}

/* ---------------------------------------------------------------------- small tools */

/** Breathing, -1 to 1, slow, so a waiting opening is never quite still. */
function breathe(seconds: number): number {
  return Math.sin((seconds / 4.5) * Math.PI);
}

function scaleAbout(ctx: Ctx, scale: number, fx: number, fy: number) {
  ctx.translate(PAGE_W * fx, PAGE_H * fy);
  ctx.scale(scale, scale);
  ctx.translate(-PAGE_W * fx, -PAGE_H * fy);
}

function rotateAbout(ctx: Ctx, degrees: number, x: number, y: number) {
  ctx.translate(x, y);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.translate(-x, -y);
}

/** A few motes of light drifting up, as the painted openings have while they wait. */
function drawMotes(ctx: Ctx, colour: string, seconds: number, alpha: number) {
  if (alpha <= 0) return;
  const random = seededRandom(23);
  ctx.save();
  for (let i = 0; i < 14; i++) {
    const x = PAGE_W * (0.3 + random() * 0.4);
    const speed = 8 + random() * 10;
    const y = PAGE_H * 0.85 - ((random() * PAGE_H * 0.6 + seconds * speed) % (PAGE_H * 0.6));
    const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(seconds * (0.7 + random()) + i));
    ctx.globalAlpha = alpha * 0.7 * twinkle;
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x + Math.sin(seconds * 0.5 + i) * 5, y, 1.1 + random() * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Two rgb() colours mixed, `t` of the first, as color-mix(in oklab) does closely enough. */
export function mix(a: string, b: string, t: number): string {
  const pa = rgbOf(a);
  const pb = rgbOf(b);
  if (!pa || !pb) return a;
  const at = (i: number) => Math.round(pa[i]! * t + pb[i]! * (1 - t));
  return `rgb(${at(0)}, ${at(1)}, ${at(2)})`;
}

function rgbOf(colour: string): number[] | null {
  const match = colour.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  return match[1]!
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(Number);
}

function sizeOf(image: CanvasImageSource): { width: number; height: number } {
  if ("naturalWidth" in image) return { width: image.naturalWidth, height: image.naturalHeight };
  if ("videoWidth" in image) return { width: image.videoWidth, height: image.videoHeight };
  const { width, height } = image as { width: number | SVGAnimatedLength; height: number };
  return { width: typeof width === "number" ? width : 0, height: Number(height) || 0 };
}

let spare: { canvas: HTMLCanvasElement; ctx: Ctx } | null = null;

/** A second canvas the size of the video, with the page's own scale, for masked layers. */
function offscreen(main: Ctx): Ctx {
  if (!spare) {
    const canvas = document.createElement("canvas");
    canvas.width = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas");
    spare = { canvas, ctx };
  }
  const { ctx } = spare;
  ctx.setTransform(main.getTransform());
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  return ctx;
}

/** Lays the spare canvas over the frame, whatever the frame's transform. */
function blit(ctx: Ctx, layer: Ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(layer.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}
