/*
 * Draws One Scene onto a canvas, one video frame at a time: the painting with the couple's
 * photo showing through its frame, the names and line printed on it, and the slot's card
 * flying in from its own side with each celebration, the painting's light following the
 * celebration on the card. The same painting, card, lettering and colours as the live
 * scene (one-scene.tsx), laid out on a phone 390px wide and scaled up to full HD.
 * Browser only.
 */

import type { PageType } from "@/lib/editor/type";
import type { StoryFunction, StoryPhoto } from "@/lib/engine/story";
import { SUITES, type Mood } from "@/lib/suites/catalog";
import type { Voice } from "@/lib/suites/lettering";
import { sceneLight, type Entrance, type ScenePage } from "@/lib/suites/scene";
import { sceneFont, type SceneFont, type SceneRole } from "@/lib/suites/scene-type";
import type { FrameBox } from "@/lib/suites/photo-frames";
import {
  PAGE_H,
  PAGE_W,
  SCALE,
  drawEnding,
  drawMotes,
  fillWith,
  roundRect,
  withAlpha,
  wrap,
  zoomAbout,
  type EndingScene,
  type Palette,
} from "./draw";
import { shotsAt, type SceneShot, type SceneTimeline } from "./scene-timeline";
import { CROSSFADE } from "./timeline";

/** What the slot carries in turn: the invitation's line, or a celebration. */
export type SceneItem = { kind: "line"; text: string } | { kind: "function"; fn: StoryFunction };

export type SceneFilm = EndingScene & {
  page: ScenePage;
  items: readonly SceneItem[];
  photos: readonly StoryPhoto[];
  timeline: SceneTimeline;
  /** The small labels over a celebration's day and place, in the card's language. */
  labels: { when: string; where: string };
  lang: string;
  type?: PageType;
};

/** How long the painting takes to change its light for the next celebration. */
const LIGHT_CHANGE = 1.4;
/** One share of the painting's width, as the live scene's cqw. */
const CQW = PAGE_W / 100;

/** Every picture the scene's video needs, so they can load before drawing starts. */
export function sceneVideoImages(film: Pick<SceneFilm, "page" | "photos" | "suite">): string[] {
  const urls = new Set<string>([film.page.image]);
  if (film.page.card) urls.add(film.page.card.image);
  for (const photo of film.photos) urls.add(photo.src);
  const cover = SUITES[film.suite].images.cover;
  if (cover) urls.add(cover);
  return [...urls];
}

/** Draws the frame `seconds` into the scene's video. */
export function drawSceneFrame(ctx: CanvasRenderingContext2D, film: SceneFilm, seconds: number) {
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  const { end } = film.timeline;
  if (seconds >= end + CROSSFADE) {
    drawEnding(ctx, film, seconds - end, 1);
    return;
  }
  drawScene(ctx, film, seconds);
  if (seconds >= end)
    drawEnding(ctx, film, seconds - end, Math.min(1, (seconds - end) / CROSSFADE));
}

function drawScene(ctx: CanvasRenderingContext2D, film: SceneFilm, seconds: number) {
  const { page, timeline } = film;
  const { current, leaving, flight } = shotsAt(timeline, seconds);
  const index = current ? timeline.shots.indexOf(current) : -1;
  const before = index > 0 ? timeline.shots[index - 1]! : null;
  const mood = moodOf(film, current);
  const change = current ? Math.min(1, (seconds - current.start) / LIGHT_CHANGE) : 1;
  const voice = SUITES[film.suite].voice ?? "regal";

  ctx.save();
  // The painting drifts a little closer over the whole video
  zoomAbout(ctx, 1 + 0.035 * Math.min(1, seconds / Math.max(timeline.end, 1)));
  const base = film.palette(mood, null);
  ctx.fillStyle = base.paper;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  drawPhotos(ctx, film, base);
  const painting = film.images.get(page.image);
  if (painting) fillWith(ctx, painting, 0, 0, PAGE_W, PAGE_H);

  // The light of the celebration on the card, eased over from the one before
  if (before && change < 1) drawLight(ctx, film, moodOf(film, before), 1 - change);
  drawLight(ctx, film, mood, change);

  const tone = mood === "night" ? "dark" : "light";
  const printed = film.palette(mood, tone);
  drawNames(ctx, film, voice, printed, rise(seconds, 0.3));
  if (page.line && film.copy.line.trim()) {
    drawPrinted(ctx, film, voice, printed, page.line, film.copy.line, rise(seconds, 0.75));
  }

  if (leaving && current) {
    drawCard(ctx, film, voice, leaving, { motion: "out", side: current.from, t: flight });
  }
  if (current) drawCard(ctx, film, voice, current, { motion: "in", side: current.from, t: flight });
  ctx.restore();
  drawMotes(ctx, base.glow, seconds, 0.8);
}

function moodOf(film: SceneFilm, shot: SceneShot | null): Mood {
  const item = shot ? film.items[shot.item] : null;
  return sceneLight(item?.kind === "function" ? item.fn.kind : "line").mood;
}

/** 0 until a moment, then easing up to 1 over most of a second. */
function rise(seconds: number, at: number): number {
  const p = Math.max(0, Math.min(1, (seconds - at) / 0.9));
  return 1 - (1 - p) ** 3;
}

const px = ([x, y, w, h]: FrameBox) => ({
  x: (x / 100) * PAGE_W,
  y: (y / 100) * PAGE_H,
  w: (w / 100) * PAGE_W,
  h: (h / 100) * PAGE_H,
});

/** The photos under the painting, or the names' initials when there are none. */
function drawPhotos(ctx: CanvasRenderingContext2D, film: SceneFilm, colours: Palette) {
  const names = [film.copy.first, film.copy.second].filter((name) => name.trim());
  const joiner = film.copy.joiner && film.copy.joiner !== "&" ? film.copy.joiner : "&";
  film.page.frames.forEach((frame, i) => {
    const [x, y, w, h] = frame;
    // A touch larger than the opening, as the live scene does, so no edge shows
    const box = px([x - 0.8, y - 0.5, w + 1.6, h + 1]);
    const src = film.photos[i]?.src;
    const photo = src ? film.images.get(src) : undefined;
    if (photo) {
      // Faces sit in the upper part of most photos, as object-position 50% 30% keeps them
      fillWith(ctx, photo, box.x, box.y, box.w, box.h, 0.3);
      return;
    }
    ctx.fillStyle = colours.paper;
    ctx.fillRect(box.x, box.y, box.w, box.h);
    const initials =
      film.page.frames.length === 1
        ? [names[0]?.slice(0, 1), names[1]?.slice(0, 1)].filter(Boolean).join(` ${joiner} `)
        : (names[i] ?? "").slice(0, 1);
    ctx.fillStyle = colours.goldText;
    ctx.font = `${9 * CQW}px ${film.fonts.display}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, box.x + box.w / 2, box.y + box.h / 2);
  });
}

/** The hour's light over the painting: a gold morning, a dusk, a lamplit night. */
function drawLight(ctx: CanvasRenderingContext2D, film: SceneFilm, mood: Mood, weight: number) {
  if (weight <= 0 || mood === "day") return;
  const colours = film.palette(mood, null);
  ctx.save();
  if (mood === "dawn") {
    ctx.globalCompositeOperation = "soft-light";
    const wash = ctx.createLinearGradient(0, 0, 0, PAGE_H * 0.85);
    wash.addColorStop(0, withAlpha(colours.glow, 0.7 * weight));
    wash.addColorStop(1, withAlpha(colours.glow, 0));
    ctx.fillStyle = wash;
  } else {
    ctx.globalCompositeOperation = "multiply";
    const deep = mood === "night" ? 0.55 : 0.28;
    const wash = ctx.createLinearGradient(0, 0, 0, PAGE_H);
    wash.addColorStop(0, withAlpha(colours.near, deep * weight));
    wash.addColorStop(1, withAlpha(colours.near, deep * 0.6 * weight));
    ctx.fillStyle = wash;
  }
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  if (mood === "night") {
    // The lamps still glow low in the painting
    ctx.globalCompositeOperation = "screen";
    const lamps = ctx.createRadialGradient(
      PAGE_W / 2,
      PAGE_H * 0.78,
      0,
      PAGE_W / 2,
      PAGE_H * 0.78,
      PAGE_W * 0.7,
    );
    lamps.addColorStop(0, withAlpha(colours.glow, 0.3 * weight));
    lamps.addColorStop(1, withAlpha(colours.glow, 0));
    ctx.fillStyle = lamps;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  }
  ctx.restore();
}

/** A line of text as drawn: its wrapped lines in one font. */
type Row = {
  kind: "text";
  lines: string[];
  font: string;
  size: number;
  leading: number;
  spacing: number;
  colour: string;
  /** Space above, in px. */
  gap: number;
  /** Printed on the painting: the glow behind the letters. */
  glow?: string;
};
type RuleRow = { kind: "rule"; width: number; gap: number; colour: string };
type ColumnsRow = {
  kind: "columns";
  columns: Row[][];
  /** Each column's width, and the room between two. */
  width: number;
  between: number;
  gap: number;
  divider: string;
};
type Block = Row | RuleRow | ColumnsRow;

function textRow(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: SceneFont,
  fit: number,
  width: number,
  colour: string,
  lang: string,
  gap = 0,
): Row {
  const size = font.size * fit;
  const css = `${font.prefix}${size}px ${font.family}`;
  ctx.font = css;
  ctx.letterSpacing = `${font.tracking * size}px`;
  const shown = font.upper ? text.toLocaleUpperCase(lang) : text;
  return {
    kind: "text",
    lines: wrap(ctx, shown, width),
    font: css,
    size,
    leading: font.leading,
    spacing: font.tracking * size,
    colour: font.colour ?? colour,
    gap,
  };
}

function heightOf(block: Block): number {
  if (block.kind === "rule") return block.gap;
  if (block.kind === "columns") {
    return (
      block.gap +
      Math.max(...block.columns.map((rows) => rows.reduce((h, r) => h + heightOf(r), 0)))
    );
  }
  return block.gap + block.lines.length * block.size * block.leading;
}

/** Whether every line fits the width it was wrapped to (a single long word may not). */
function fitsWidth(ctx: CanvasRenderingContext2D, block: Block, width: number): boolean {
  if (block.kind === "rule") return true;
  if (block.kind === "columns") {
    return block.columns.every((rows) => rows.every((row) => fitsWidth(ctx, row, block.width)));
  }
  ctx.font = block.font;
  ctx.letterSpacing = `${block.spacing}px`;
  return block.lines.every((line) => ctx.measureText(line).width <= width + 0.5);
}

function drawBlocks(
  ctx: CanvasRenderingContext2D,
  blocks: readonly Block[],
  cx: number,
  top: number,
  alpha: number,
) {
  let y = top;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const block of blocks) {
    if (block.kind === "rule") {
      drawRule(ctx, cx, y + block.gap / 2, block.width, block.colour, alpha);
      y += block.gap;
      continue;
    }
    if (block.kind === "columns") {
      y += block.gap;
      const count = block.columns.length;
      const total = block.width * count + block.between * (count - 1);
      const tallest = Math.max(
        ...block.columns.map((rows) => rows.reduce((h, r) => h + heightOf(r), 0)),
      );
      block.columns.forEach((rows, i) => {
        const x = cx - total / 2 + block.width / 2 + i * (block.width + block.between);
        drawBlocks(ctx, rows, x, y, alpha);
      });
      if (count > 1) {
        // A fine gold line between the day and the place
        ctx.save();
        ctx.globalAlpha *= alpha;
        ctx.fillStyle = block.divider;
        ctx.fillRect(cx - 0.4, y, 0.8, tallest);
        ctx.restore();
      }
      y += tallest;
      continue;
    }
    y += block.gap;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = block.font;
    ctx.letterSpacing = `${block.spacing}px`;
    ctx.fillStyle = block.colour;
    if (block.glow) {
      ctx.shadowColor = block.glow;
      ctx.shadowBlur = block.size * 0.6;
    }
    block.lines.forEach((line, i) => {
      const lineY = y + block.size * block.leading * (i + 0.5);
      // Letter spacing adds space after the last letter too; centre what is seen
      ctx.fillText(line, cx + block.spacing / 2, lineY);
      if (block.glow) ctx.fillText(line, cx + block.spacing / 2, lineY);
    });
    ctx.restore();
    y += block.lines.length * block.size * block.leading;
  }
}

/** The hairline with a small diamond between a celebration's name and its details. */
function drawRule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  colour: string,
  alpha: number,
) {
  const half = width / 2;
  ctx.save();
  ctx.globalAlpha *= alpha;
  const line = ctx.createLinearGradient(x - half, y, x + half, y);
  line.addColorStop(0, withAlpha(colour, 0));
  line.addColorStop(0.3, colour);
  line.addColorStop(0.7, colour);
  line.addColorStop(1, withAlpha(colour, 0));
  ctx.fillStyle = line;
  ctx.fillRect(x - half, y - 0.5, width, 1);
  ctx.fillStyle = colour;
  const d = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - d);
  ctx.lineTo(x + d, y);
  ctx.lineTo(x, y + d);
  ctx.lineTo(x - d, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Lays words out in a box, shrinking them together (from a little larger) until they fit,
 * then returns the blocks and their height.
 */
function fitBlocks(
  ctx: CanvasRenderingContext2D,
  build: (fit: number) => Block[],
  width: number,
  height: number,
  { max = 1.1, min = 0.6 } = {},
): { blocks: Block[]; height: number } {
  let fit = max;
  let blocks = build(fit);
  let tall = blocks.reduce((h, b) => h + heightOf(b), 0);
  while (fit > min && (tall > height || !blocks.every((b) => fitsWidth(ctx, b, width)))) {
    fit = Math.max(min, fit * 0.94);
    blocks = build(fit);
    tall = blocks.reduce((h, b) => h + heightOf(b), 0);
  }
  return { blocks, height: tall };
}

/** The couple's names on the painting, on one line when they fit, else stacked. */
function drawNames(
  ctx: CanvasRenderingContext2D,
  film: SceneFilm,
  voice: Voice,
  colours: Palette,
  alpha: number,
) {
  if (alpha <= 0) return;
  const { copy, lang, type } = film;
  const names = [copy.first, copy.second].filter((name) => name.trim());
  if (!names.length) return;
  const joiner = !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const box = px(film.page.names);
  const nameFont = sceneFont(voice, "names", lang, PAGE_W, type);
  const joinFont = sceneFont(voice, "joiner", lang, PAGE_W, type);
  const glow = colours.glow;
  ctx.save();
  ctx.translate(0, (1 - alpha) * 6);
  // One line, as on the live scene, when it fits the band
  for (let fit = 1.1; fit >= 0.6; fit *= 0.94) {
    const parts = names.length > 1 ? [names[0]!, ` ${joiner} `, names[1]!] : [names[0]!];
    const fonts = names.length > 1 ? [nameFont, joinFont, nameFont] : [nameFont];
    const widths = parts.map((part, i) => {
      const font = fonts[i]!;
      const size = font.size * fit;
      ctx.font = `${font.prefix}${size}px ${font.family}`;
      ctx.letterSpacing = `${font.tracking * size}px`;
      return ctx.measureText(font.upper ? part.toLocaleUpperCase(lang) : part).width;
    });
    const width = widths.reduce((a, b) => a + b, 0);
    const height = nameFont.size * fit * nameFont.leading;
    if (width <= box.w && height <= box.h) {
      let x = box.x + (box.w - width) / 2;
      const y = box.y + box.h / 2;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.globalAlpha *= alpha;
      parts.forEach((part, i) => {
        const font = fonts[i]!;
        const size = font.size * fit;
        ctx.font = `${font.prefix}${size}px ${font.family}`;
        ctx.letterSpacing = `${font.tracking * size}px`;
        ctx.fillStyle = font.colour ?? (i === 1 ? colours.accentText : colours.ink);
        ctx.shadowColor = glow;
        ctx.shadowBlur = size * 0.5;
        const text = font.upper ? part.toLocaleUpperCase(lang) : part;
        ctx.fillText(text, x, y);
        ctx.fillText(text, x, y);
        x += widths[i]!;
      });
      ctx.restore();
      return;
    }
  }
  // Too long for one line: each name on its own, the joiner small between
  const { blocks, height } = fitBlocks(
    ctx,
    (fit) =>
      names.flatMap((name, i) => [
        ...(i > 0
          ? [glowing(textRow(ctx, joiner, joinFont, fit, box.w, colours.accentText, lang), glow)]
          : []),
        glowing(textRow(ctx, name, nameFont, fit, box.w, colours.ink, lang), glow),
      ]),
    box.w,
    box.h,
    { max: 1, min: 0.5 },
  );
  drawBlocks(ctx, blocks, box.x + box.w / 2, box.y + (box.h - height) / 2, alpha);
  ctx.restore();
}

function glowing(row: Row, glow: string): Row {
  return { ...row, glow };
}

/** The invitation's line printed on the painting under the names. */
function drawPrinted(
  ctx: CanvasRenderingContext2D,
  film: SceneFilm,
  voice: Voice,
  colours: Palette,
  where: FrameBox,
  text: string,
  alpha: number,
) {
  if (alpha <= 0) return;
  const box = px(where);
  const font = sceneFont(voice, "line", film.lang, PAGE_W, film.type);
  const { blocks } = fitBlocks(
    ctx,
    (fit) => [
      glowing(textRow(ctx, text, font, fit, box.w, colours.inkMuted, film.lang), colours.glow),
    ],
    box.w,
    box.h,
  );
  ctx.save();
  ctx.translate(0, (1 - alpha) * 6);
  drawBlocks(ctx, blocks, box.x + box.w / 2, box.y, alpha);
  ctx.restore();
}

/** Where a card starts (coming in) or ends (going out), as the live scene's CSS has it. */
const SIDES: Record<Entrance, { dx: number; dy: number; rot: number }> = {
  right: { dx: 1.35, dy: 0, rot: 9 },
  left: { dx: -1.35, dy: 0, rot: -9 },
  bottom: { dx: 0, dy: 1.5, rot: -3 },
  top: { dx: 0, dy: -1.2, rot: 3 },
};

/** Like the live card's arrival curve, with a little settle at the end. */
function easeIn(t: number): number {
  const c = 1.25;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  film: SceneFilm,
  voice: Voice,
  shot: SceneShot,
  { motion, side, t }: { motion: "in" | "out"; side: Entrance; t: number },
) {
  const item = film.items[shot.item];
  if (!item) return;
  const slot = px(film.page.slot);
  const { dx, dy, rot } = SIDES[side];
  // Arriving, it travels from its side to its place; leaving, out the other way
  const away = motion === "in" ? 1 - easeIn(t) : -(t ** 2);
  const alpha = motion === "in" ? Math.min(1, t / 0.45) : 1 - t;
  if (alpha <= 0) return;
  const scale = 1 - 0.2 * Math.abs(away);

  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(slot.x + slot.w / 2 + dx * slot.w * away, slot.y + slot.h / 2 + dy * slot.h * away);
  ctx.rotate(((rot * away) / 180) * Math.PI);
  ctx.scale(scale, scale);
  const mood = sceneLight(item.kind === "function" ? item.fn.kind : "line").mood;
  const colours = film.palette(mood, null);
  const inner = drawCardFace(ctx, film, slot.w, slot.h, colours);
  drawCardWords(ctx, film, voice, item, inner, colours);
  ctx.restore();
}

/** The card itself, centred on the origin; returns the box its words go in. */
function drawCardFace(
  ctx: CanvasRenderingContext2D,
  film: SceneFilm,
  w: number,
  h: number,
  colours: Palette,
): { x: number; y: number; w: number; h: number; painted: boolean } {
  const left = -w / 2;
  const top = -h / 2;
  const { card, style } = film.page;
  const image = card ? film.images.get(card.image) : undefined;
  ctx.save();
  ctx.shadowColor = "rgb(0 0 0 / 0.32)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  if (card && image) {
    ctx.drawImage(image, left, top, w, h);
    ctx.restore();
    // Proportions of the card, not the page
    const tx = left + (card.text[0] / 100) * w;
    const ty = top + (card.text[1] / 100) * h;
    const tw = (card.text[2] / 100) * w;
    const th = (card.text[3] / 100) * h;
    // A margin inside the painted border, so the words never touch it
    const pad = 0.025 * tw;
    return { x: tx + pad, y: ty + pad, w: tw - pad * 2, h: th - pad * 2, painted: true };
  }
  ctx.fillStyle = colours.paper;
  if (style === "jharokha") {
    ctx.beginPath();
    ctx.roundRect(left, top, w, h, [
      { x: w / 2, y: h * 0.26 },
      { x: w / 2, y: h * 0.26 },
      1.4 * CQW,
      1.4 * CQW,
    ]);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = colours.gold;
    ctx.lineWidth = 0.5 * CQW;
    ctx.stroke();
    // The small dome over the arch
    ctx.fillStyle = colours.gold;
    ctx.beginPath();
    ctx.ellipse(0, top, 2.2 * CQW, 2.6 * CQW, 0, Math.PI, 0);
    ctx.fill();
    return {
      x: left + 7 * CQW,
      y: top + 6.5 * CQW,
      w: w - 14 * CQW,
      h: h - 10.1 * CQW,
      painted: false,
    };
  }
  roundRect(ctx, left, top, w, h, (style === "kasavu" ? 0.8 : 1.4) * CQW);
  ctx.fill();
  ctx.restore();
  if (style === "kasavu") {
    // Kerala's kasavu: gold bands top and bottom
    ctx.fillStyle = colours.gold;
    for (const [from, to] of [
      [0, 0.05],
      [0.08, 0.1],
      [0.9, 0.92],
      [0.95, 1],
    ] as const) {
      ctx.fillRect(left, top + from * h, w, (to - from) * h);
    }
    return {
      x: left + 6 * CQW,
      y: top + 5 * CQW,
      w: w - 12 * CQW,
      h: h - 10 * CQW,
      painted: false,
    };
  }
  return {
    x: left + 6 * CQW,
    y: top + 3.4 * CQW,
    w: w - 12 * CQW,
    h: h - 6.8 * CQW,
    painted: false,
  };
}

/** A celebration's name, a rule, then its day and its place side by side under labels. */
function drawCardWords(
  ctx: CanvasRenderingContext2D,
  film: SceneFilm,
  voice: Voice,
  item: SceneItem,
  box: { x: number; y: number; w: number; h: number; painted: boolean },
  colours: Palette,
) {
  const { lang, type, labels } = film;
  const font = (role: SceneRole, script = lang) => sceneFont(voice, role, script, PAGE_W, type);
  const build = (fit: number): Block[] => {
    if (item.kind === "line")
      return [textRow(ctx, item.text, font("line"), fit, box.w, colours.ink, lang)];
    const fn = item.fn;
    const blocks: Block[] = [
      textRow(ctx, fn.name, font("function"), fit, box.w, colours.ink, lang),
    ];
    if (fn.localName) {
      blocks.push(
        textRow(
          ctx,
          fn.localName.text,
          font("detail", fn.localName.lang),
          fit,
          box.w,
          colours.accentText,
          fn.localName.lang,
        ),
      );
    }
    const when = Boolean(fn.date || fn.time);
    if (!when && !fn.venue) return blocks;
    const nameSize = font("function").size * fit;
    blocks.push({
      kind: "rule",
      width: Math.min(112, Math.max(40, 20 * CQW)) * fit,
      gap: nameSize * 0.9,
      colour: colours.goldText,
    });
    const both = when && Boolean(fn.venue);
    const width = both ? (box.w * 0.88) / 2 : box.w;
    const label = (text: string) =>
      textRow(ctx, text, font("countdown"), fit, width, colours.goldText, lang);
    const columns: Row[][] = [];
    if (when) {
      const rows: Row[] = [label(labels.when)];
      if (fn.date)
        rows.push(
          textRow(ctx, fn.date, font("date"), fit, width, colours.ink, lang, rows[0]!.size * 0.35),
        );
      if (fn.time) {
        const time = fn.muhurat ? `${fn.muhurat.text} · ${fn.time}` : fn.time;
        rows.push(
          textRow(
            ctx,
            time,
            font("detail"),
            fit,
            width,
            colours.inkMuted,
            lang,
            rows[0]!.size * 0.2,
          ),
        );
      }
      columns.push(rows);
    }
    if (fn.venue) {
      const first = label(labels.where);
      columns.push([
        first,
        textRow(ctx, fn.venue, font("date"), fit, width, colours.ink, lang, first.size * 0.35),
      ]);
    }
    blocks.push({
      kind: "columns",
      columns,
      width,
      between: box.w * 0.12,
      gap: 0,
      divider: withAlpha(colours.gold, 0.45),
    });
    return blocks;
  };
  const { blocks, height } = fitBlocks(ctx, build, box.w, box.h, {
    max: 1.15,
    min: box.painted ? 0.5 : 0.6,
  });
  drawBlocks(ctx, blocks, box.x + box.w / 2, box.y + (box.h - height) / 2, 1);
}
