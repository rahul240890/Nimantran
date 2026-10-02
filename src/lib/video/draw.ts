/*
 * Draws the story's pages onto a canvas, one video frame at a time (Step 17c). The same
 * paintings, words, lettering and colours as the live pages, laid out for a phone 390px
 * wide and scaled up to full HD. Colours come from the design tokens, read once from the
 * page, so the video matches the theme exactly. Browser only.
 */

import { SYMBOLS } from "@/components/invitation/art/symbols";
import type { PageType } from "@/lib/editor/type";
import type { LineStyle, StoryBeat } from "@/lib/engine/story";
import { seededRandom } from "@/lib/engine/particles";
import { DEFAULT_AREA, textArea, type TextArea } from "@/lib/suites/areas";
import {
  ROLES,
  lettering,
  lineSpace,
  roleSize,
  ruleAt,
  type TypeRole,
} from "@/lib/suites/lettering";
import { SUITES, pageLook, paintedTone, type Mood, type SuiteId } from "@/lib/suites/catalog";
import { photoPage } from "@/lib/suites/photo-frames";
import type { CardCopy } from "@/lib/templates/content";
import type { StockRole } from "@/lib/templates/schema";
import {
  lineProgress,
  pagesAt,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  type VideoBeat,
  type VideoTimeline,
} from "./timeline";

/** The page is laid out as a 390px-wide phone, then scaled to the video. */
const PAGE_W = 390;
const PAGE_H = (PAGE_W * VIDEO_HEIGHT) / VIDEO_WIDTH;
const SCALE = VIDEO_WIDTH / PAGE_W;
const REM = 16;
/** Status and Reels lay their own name, caption and buttons over the top and bottom. */
const SAFE_TOP = 0.1;
const SAFE_BOTTOM = 0.13;

/** Colours a page is drawn in, as the browser resolved them. */
export type Palette = Record<
  "paper" | "ink" | "inkMuted" | "gold" | "goldText" | "accent" | "accentText" | "glow" | "near",
  string
>;

export type Fonts = { display: string; sans: string; label: string };

export type VideoScene = {
  timeline: VideoTimeline;
  copy: CardCopy;
  suite: SuiteId;
  textBox: boolean;
  type?: PageType;
  lang: string;
  fonts: Fonts;
  /** A palette for each page's light and whether its words are printed light or dark. */
  palette: (mood: Mood, tone: "light" | "dark" | null) => Palette;
  /** Loaded paintings and photos, by their address. */
  images: ReadonlyMap<string, CanvasImageSource>;
  /** The closing card. */
  ending: { brand: string; open: string; link: string };
};

/** Every painting and photo a video needs, so they can load before drawing starts. */
export function videoImages(timeline: VideoTimeline, suite: SuiteId): string[] {
  const urls = new Set<string>();
  for (const { beat } of timeline.beats) {
    const image = paintingFor(suite, beat);
    if (image) urls.add(image);
    for (const photo of beat.photos ?? []) urls.add(photo.src);
  }
  const cover = SUITES[suite].images.cover;
  if (cover) urls.add(cover);
  return [...urls];
}

function paintingFor(suite: SuiteId, beat: StoryBeat): string | undefined {
  if (SUITES[suite].art === "card") return undefined;
  const frames = beat.photos?.length ? photoPage(suite, beat.photos.length) : null;
  return frames?.image ?? SUITES[suite].images[pageLook(beat.scene).art];
}

/** Draws the frame `seconds` into the video. */
export function drawFrame(ctx: CanvasRenderingContext2D, scene: VideoScene, seconds: number) {
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  const { current, previous, fade } = pagesAt(scene.timeline, seconds);
  if (previous !== null) drawPage(ctx, scene, scene.timeline.beats[previous]!, seconds, 1);
  if (current === "end") drawEnding(ctx, scene, seconds, previous === null ? 1 : fade);
  else drawPage(ctx, scene, scene.timeline.beats[current]!, seconds, fade);
}

function drawPage(
  ctx: CanvasRenderingContext2D,
  scene: VideoScene,
  entry: VideoBeat,
  seconds: number,
  alpha: number,
) {
  const { beat } = entry;
  const suite = SUITES[scene.suite];
  const look = pageLook(beat.scene);
  const frames = beat.photos?.length ? photoPage(scene.suite, beat.photos.length) : null;
  const src = paintingFor(scene.suite, beat);
  const painting = src ? scene.images.get(src) : undefined;
  const painted = suite.art !== "card" && Boolean(painting);
  // A page the host gave its own box setting (Step 12s) keeps it
  const printed = painted && !(beat.layout?.box ?? scene.textBox);
  const tone = printed ? paintedTone(look.art, scene.suite) : null;
  const colours = scene.palette(look.mood, tone);
  const progress = Math.min(1, Math.max(0, (seconds - entry.start) / entry.seconds));

  ctx.save();
  ctx.globalAlpha = alpha;
  // The painting drifts closer through the page, as the live pages do
  const zoom = 1 + 0.05 * progress;
  if (painted && painting) {
    ctx.save();
    zoomAbout(ctx, zoom);
    ctx.fillStyle = colours.paper;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
    // Couple photos lie under the painting and show through its cut-out frames
    frames?.frames.forEach((box, i) => {
      const photo = beat.photos?.[i] && scene.images.get(beat.photos[i]!.src);
      if (!photo) return;
      const [x, y, w, h] = box;
      fillWith(
        ctx,
        photo,
        (x / 100) * PAGE_W,
        (y / 100) * PAGE_H,
        (w / 100) * PAGE_W,
        (h / 100) * PAGE_H,
      );
    });
    fillWith(ctx, painting, 0, 0, PAGE_W, PAGE_H);
    ctx.restore();
    drawMotes(ctx, colours.glow, seconds, alpha);
  } else {
    drawPaper(ctx, colours, zoom);
  }

  const area = frames
    ? frames.area
    : painted
      ? textArea(scene.suite, look.art)
      : { ...DEFAULT_AREA, top: (80 / PAGE_H) * 100, bottom: 4 };
  drawWords(ctx, scene, entry, seconds, colours, safe(area), { painted, printed });
  ctx.restore();
}

/** Keeps the words clear of what Status and Reels draw over the video. */
function safe(area: TextArea): TextArea {
  return {
    ...area,
    top: Math.max(area.top, SAFE_TOP * 100),
    bottom: Math.max(area.bottom, SAFE_BOTTOM * 100),
  };
}

function zoomAbout(ctx: CanvasRenderingContext2D, zoom: number) {
  ctx.translate(PAGE_W / 2, PAGE_H / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-PAGE_W / 2, -PAGE_H / 2);
}

/** Draws an image to fill a box, cropping what overflows, like object-fit: cover. */
function fillWith(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const { width, height } = sizeOf(image);
  if (!width || !height) return;
  const scale = Math.max(w / width, h / height);
  const sw = w / scale;
  const sh = h / scale;
  ctx.drawImage(image, (width - sw) / 2, (height - sh) / 2, sw, sh, x, y, w, h);
}

function sizeOf(image: CanvasImageSource): { width: number; height: number } {
  if ("naturalWidth" in image) return { width: image.naturalWidth, height: image.naturalHeight };
  if ("videoWidth" in image) return { width: image.videoWidth, height: image.videoHeight };
  const { width, height } = image as { width: number | SVGAnimatedLength; height: number };
  return { width: typeof width === "number" ? width : 0, height: Number(height) || 0 };
}

/** The card's own paper for themes without paintings: warm stock with a double gold rule. */
function drawPaper(ctx: CanvasRenderingContext2D, colours: Palette, zoom: number) {
  ctx.fillStyle = colours.paper;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  const light = ctx.createRadialGradient(
    PAGE_W / 2,
    PAGE_H * 0.42,
    PAGE_W * 0.1,
    PAGE_W / 2,
    PAGE_H * 0.5,
    PAGE_H * 0.7,
  );
  light.addColorStop(0, withAlpha(colours.glow, 0.5));
  light.addColorStop(1, withAlpha(colours.near, 0.12));
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  ctx.save();
  zoomAbout(ctx, 1 + (zoom - 1) * 0.4);
  ctx.strokeStyle = colours.gold;
  ctx.lineWidth = 1.6;
  roundRect(ctx, 16, 16, PAGE_W - 32, PAGE_H - 32, 22);
  ctx.stroke();
  ctx.lineWidth = 0.8;
  roundRect(ctx, 23, 23, PAGE_W - 46, PAGE_H - 46, 17);
  ctx.stroke();
  ctx.restore();
}

/** A few gold motes drifting up through the page's light. */
function drawMotes(ctx: CanvasRenderingContext2D, colour: string, seconds: number, alpha: number) {
  const random = seededRandom(17);
  ctx.save();
  for (let i = 0; i < 22; i++) {
    const x = random() * PAGE_W;
    const speed = 6 + random() * 10;
    const y = PAGE_H - ((random() * PAGE_H + seconds * speed) % (PAGE_H + 20)) + 10;
    const size = 0.8 + random() * 1.6;
    const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(seconds * (0.6 + random()) + i));
    ctx.globalAlpha = alpha * 0.55 * twinkle;
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x + Math.sin(seconds * 0.4 + i) * 4, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

type Placed = {
  kind: "text" | "symbol";
  lines: string[];
  font: string;
  size: number;
  height: number;
  colour: string;
  spacing: number;
  lineHeight: number;
  /** Space above it, and whether a fine rule sits in that space (a function's page). */
  space: number;
  rule?: boolean;
};

function styleOf(
  style: LineStyle,
  name: boolean,
  cq: number,
  scene: VideoScene,
  colours: Palette,
  lang: string,
) {
  // The same lettering as the live pages (lettering.ts): the theme's voice in the line's script
  const role: TypeRole = name ? "names" : style === "symbol" ? "label" : style;
  const set = lettering(SUITES[scene.suite].voice ?? "regal", role, lang);
  const names = ROLES[role].face === "names";
  const type = scene.type;
  const own = names ? type?.names : type?.words;
  const scale = (type?.scale ?? 1) * (own ? set.size / set.faceSize : set.size);
  const bold = names && type?.bold ? 700 : own ? undefined : set.weight;
  const italic = names && type?.italic ? "italic " : "";
  const capitals = name && Boolean(type?.capitals);
  return {
    size: roleSize(role, cq, REM) * scale,
    family: own ?? set.family,
    colour: name && type?.colour ? type.colour : colours[ROLE_INK[role]],
    lineHeight: set.leading,
    spacing: capitals ? 0.04 : set.tracking,
    upper: capitals || set.upper,
    prefix: `${italic}${bold ? `${bold} ` : ""}`,
    role,
  };
}

const ROLE_INK: Record<TypeRole, keyof Palette> = {
  names: "ink",
  display: "ink",
  date: "ink",
  script: "accentText",
  joiner: "accentText",
  body: "inkMuted",
  small: "inkMuted",
  label: "goldText",
};

function greedy(ctx: CanvasRenderingContext2D, words: readonly string[], width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Wraps to the width, then evens the lines out, as text-wrap: balance does on the pages. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = greedy(ctx, words, width);
  if (lines.length < 2) return lines;
  let low = width / lines.length;
  let high = width;
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    if (greedy(ctx, words, mid).length > lines.length) low = mid;
    else high = mid;
  }
  return greedy(ctx, words, high);
}

function drawWords(
  ctx: CanvasRenderingContext2D,
  scene: VideoScene,
  entry: VideoBeat,
  seconds: number,
  colours: Palette,
  area: TextArea,
  { painted, printed }: { painted: boolean; printed: boolean },
) {
  const { beat } = entry;
  const left = (area.left / 100) * PAGE_W;
  const right = PAGE_W - (area.right / 100) * PAGE_W;
  const top = (area.top / 100) * PAGE_H;
  const bottom = PAGE_H - (area.bottom / 100) * PAGE_H;
  const areaW = right - left;
  const areaH = bottom - top;
  const cq = (painted ? Math.min(areaW, areaH) : Math.min(PAGE_W, PAGE_H)) / 100;
  const boxW = Math.min(areaW, 36 * REM);
  const boxed = !printed && SUITES[scene.suite].art !== "card";
  const padX = boxed ? 6 * cq : printed ? 4 * cq : 0;
  const padY = boxed || printed ? 6 * cq : 0;
  const sacred = beat.symbol && scene.copy.symbol ? SYMBOLS[scene.copy.symbol] : null;

  // Lay the words out, shrinking them together if the page's area is too small
  let fit = 1;
  let placed: Placed[] = [];
  let height = 0;
  for (let attempt = 0; attempt < 8; attempt++) {
    placed = [];
    if (sacred) {
      const size = Math.min(7.5 * REM, Math.max(4 * REM, 22 * cq)) * fit;
      placed.push({
        kind: "symbol",
        lines: [],
        font: "",
        size,
        height: size + cq * fit,
        colour: colours.accentText,
        spacing: 0,
        lineHeight: 1,
        space: 0,
      });
    }
    const rule = ruleAt(beat);
    for (const [index, line] of beat.lines.entries()) {
      const name = beat.scene === "cover" && line.style === "display";
      const lang = line.lang ?? scene.lang;
      const style = styleOf(line.style, name, cq, scene, colours, lang);
      const size = style.size * fit;
      const font = `${style.prefix}${size}px ${style.family}`;
      ctx.font = font;
      ctx.letterSpacing = `${style.spacing * size}px`;
      const text = style.upper ? line.text.toLocaleUpperCase(lang) : line.text;
      // Reading lines keep clear of the art's edges, as on the live pages
      const full = ROLES[style.role].face === "names" && style.role !== "date";
      const lines = wrap(ctx, text, (boxW - padX * 2) * (full ? 1 : 0.88));
      placed.push({
        kind: "text",
        lines,
        font,
        size,
        height: lines.length * size * style.lineHeight,
        colour: style.colour,
        spacing: style.spacing * size,
        lineHeight: style.lineHeight,
        space: (lineSpace(beat, index, Boolean(sacred)) + (index === rule ? 2.2 : 0)) * cq * fit,
        rule: index === rule,
      });
    }
    height = placed.reduce((sum, item) => sum + item.space + item.height, 0) + padY * 2;
    if (height <= areaH || fit <= 0.6) break;
    fit *= 0.92;
  }

  const x = left + areaW / 2;
  // The host may have lifted the words to the top of the calm area, or set them low
  const room = Math.max(0, areaH - height);
  const place = beat.layout?.place;
  // Centred words sit a little above the middle, where the eye takes the centre to be
  let y = top + (place === "top" ? 0 : place === "bottom" ? room : room * 0.4);
  const boxTop = y;
  const intro = lineProgress(entry, 0, seconds);

  if (boxed) {
    // The reading plate: ivory, gold-edged, over the painting
    ctx.save();
    ctx.globalAlpha *= Math.min(1, intro * 1.4);
    ctx.shadowColor = withAlpha(colours.near, 0.35);
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = withAlpha(colours.paper, 0.9);
    roundRect(ctx, x - boxW / 2, boxTop, boxW, height, 28);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = withAlpha(colours.gold, 0.7);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  } else if (printed) {
    // A feathered haze in the painting's own light, so printed words stay clear
    ctx.save();
    ctx.globalAlpha *= intro;
    const haze = ctx.createRadialGradient(
      x,
      boxTop + height / 2,
      0,
      x,
      boxTop + height / 2,
      Math.max(boxW, height) * 0.62,
    );
    haze.addColorStop(0.35, withAlpha(colours.glow, 0.62));
    haze.addColorStop(1, withAlpha(colours.glow, 0));
    ctx.fillStyle = haze;
    // The whole page, so the haze fades out on every side with no edge
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
    ctx.restore();
  }

  y += padY;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  placed.forEach((item, index) => {
    y += item.space;
    const p = lineProgress(entry, index, seconds);
    if (p > 0 && item.rule) drawRule(ctx, x, y - item.space / 2, cq * fit, colours, p);
    if (p > 0) {
      const eased = 1 - (1 - p) ** 3;
      ctx.save();
      ctx.globalAlpha *= eased;
      const rise = (1 - eased) * 0.45 * (item.size || 16);
      if (item.kind === "symbol" && sacred) {
        drawSymbol(ctx, sacred, x, y + item.size / 2 + rise, item.size, colours, scene.fonts);
      } else {
        ctx.font = item.font;
        ctx.letterSpacing = `${item.spacing}px`;
        ctx.fillStyle = item.colour;
        if (printed) {
          ctx.shadowColor = colours.glow;
          ctx.shadowBlur = item.size * 0.6;
        }
        if (p < 1) ctx.filter = `blur(${((1 - eased) * 6).toFixed(2)}px)`;
        item.lines.forEach((text, i) => {
          const lineY = y + item.size * item.lineHeight * (i + 0.5) + rise;
          // Letter spacing adds space after the last letter too; centre what is seen
          ctx.fillText(text, x + item.spacing / 2, lineY);
          if (printed) ctx.fillText(text, x + item.spacing / 2, lineY);
        });
      }
      ctx.restore();
    }
    y += item.height;
  });
}

/** The fine rule between a function's name and its day: a hairline with a small diamond. */
function drawRule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cq: number,
  colours: Palette,
  progress: number,
) {
  const half = Math.min(4.5 * REM, Math.max(2.25 * REM, 13 * cq));
  ctx.save();
  ctx.globalAlpha *= 1 - (1 - progress) ** 3;
  const line = ctx.createLinearGradient(x - half, y, x + half, y);
  line.addColorStop(0, withAlpha(colours.goldText, 0));
  line.addColorStop(0.3, colours.goldText);
  line.addColorStop(0.7, colours.goldText);
  line.addColorStop(1, withAlpha(colours.goldText, 0));
  ctx.fillStyle = line;
  ctx.fillRect(x - half, y - 0.75, half * 2, 1.5);
  ctx.fillStyle = colours.goldText;
  const d = 0.28 * REM;
  ctx.beginPath();
  ctx.moveTo(x, y - d);
  ctx.lineTo(x + d, y);
  ctx.lineTo(x, y + d);
  ctx.lineTo(x - d, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const ROLE_COLOUR: Record<StockRole, keyof Palette> = {
  paper: "paper",
  ink: "ink",
  inkMuted: "inkMuted",
  gold: "gold",
  goldText: "goldText",
  accent: "accent",
  accentText: "accentText",
  back: "near",
};

function drawSymbol(
  ctx: CanvasRenderingContext2D,
  symbol: (typeof SYMBOLS)[keyof typeof SYMBOLS],
  x: number,
  y: number,
  size: number,
  colours: Palette,
  fonts: Fonts,
) {
  if (symbol.kind === "glyph") {
    ctx.font = `${size * 0.87}px ${symbol.font === "display" ? fonts.display : fonts.sans}`;
    ctx.fillStyle = colours.accentText;
    ctx.fillText(symbol.text, x, y);
    return;
  }
  // Shapes are two units across, centred on the origin, drawn at 92% as the pages do
  ctx.save();
  ctx.translate(x, y);
  const unit = (size / 2) * 0.92;
  ctx.scale(unit, unit);
  for (const shape of symbol.shapes) {
    const path = new Path2D(shape.d);
    ctx.globalAlpha *= shape.opacity ?? 1;
    if (shape.fill) {
      ctx.fillStyle = colours[ROLE_COLOUR[shape.fill]];
      ctx.fill(path);
    }
    if (shape.stroke) {
      ctx.strokeStyle = colours[ROLE_COLOUR[shape.stroke]];
      ctx.lineWidth = shape.width ?? 0.3;
      ctx.stroke(path);
    }
    ctx.globalAlpha /= shape.opacity ?? 1;
  }
  ctx.restore();
}

/** The last seconds: the cover painting dimmed, the names, and where to open the invitation. */
function drawEnding(
  ctx: CanvasRenderingContext2D,
  scene: VideoScene,
  seconds: number,
  alpha: number,
) {
  const colours = scene.palette("night", "dark");
  const local = seconds - scene.timeline.end;
  const cover = SUITES[scene.suite].images.cover;
  const painting = cover ? scene.images.get(cover) : undefined;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colours.near;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  if (painting) {
    ctx.save();
    ctx.filter = "blur(14px)";
    ctx.globalAlpha = alpha * 0.55;
    zoomAbout(ctx, 1.12);
    fillWith(ctx, painting, 0, 0, PAGE_W, PAGE_H);
    ctx.restore();
  }
  const shade = ctx.createLinearGradient(0, 0, 0, PAGE_H);
  shade.addColorStop(0, withAlpha(colours.near, 0.45));
  shade.addColorStop(1, withAlpha(colours.near, 0.8));
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  const rise = (delay: number) => {
    const p = Math.max(0, Math.min(1, (local - delay) / 0.8));
    return 1 - (1 - p) ** 3;
  };
  const { copy, fonts, ending } = scene;
  const names = [copy.first, copy.second]
    .filter((name) => name.trim())
    .join(` ${copy.joiner || "&"} `);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = PAGE_W / 2;
  const lines: {
    text: string;
    family: string;
    weight?: string;
    size: number;
    colour: string;
    y: number;
    delay: number;
    spacing?: number;
    /** Shrinks to fit one line (a link) rather than wrapping. */
    fit?: boolean;
  }[] = [
    {
      text: ending.brand.toLocaleUpperCase(),
      family: fonts.label,
      size: 0.8 * REM,
      colour: colours.goldText,
      y: PAGE_H * 0.36,
      delay: 0.1,
      spacing: 0.3 * 0.8 * REM,
    },
    {
      text: names,
      family: fonts.display,
      size: 2.3 * REM,
      colour: colours.ink,
      y: PAGE_H * 0.45,
      delay: 0.3,
    },
    {
      text: ending.open,
      family: fonts.sans,
      size: 1.05 * REM,
      colour: colours.inkMuted,
      y: PAGE_H * 0.55,
      delay: 0.6,
    },
    {
      text: ending.link,
      family: fonts.sans,
      weight: "600 ",
      size: 1.1 * REM,
      colour: colours.goldText,
      y: PAGE_H * 0.595,
      delay: 0.8,
      fit: true,
    },
  ];
  const room = PAGE_W - 48;
  for (const line of lines) {
    const p = rise(line.delay);
    if (p <= 0) continue;
    ctx.save();
    ctx.globalAlpha = alpha * p;
    let size = line.size;
    ctx.font = `${line.weight ?? ""}${size}px ${line.family}`;
    if (line.fit) {
      size = Math.max(11, Math.min(size, (size * room) / ctx.measureText(line.text).width));
      ctx.font = `${line.weight ?? ""}${size}px ${line.family}`;
    }
    ctx.letterSpacing = `${line.spacing ?? 0}px`;
    ctx.fillStyle = line.colour;
    const text = line.fit ? [line.text] : wrap(ctx, line.text, room);
    text.forEach((part, i) => {
      ctx.fillText(
        part,
        PAGE_W / 2 + (line.spacing ?? 0) / 2,
        line.y + (i - (text.length - 1) / 2) * size * 1.15 + (1 - p) * 8,
        room,
      );
    });
    ctx.restore();
  }
  // A gold rule under the names, drawn out from the middle
  const rule = rise(0.45) * 70;
  ctx.strokeStyle = withAlpha(colours.gold, 0.8 * alpha);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - rule, PAGE_H * 0.505);
  ctx.lineTo(cx + rule, PAGE_H * 0.505);
  ctx.stroke();
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** An rgb() or rgba() colour at a new opacity. */
export function withAlpha(colour: string, alpha: number): string {
  const match = colour.match(/rgba?\(([^)]+)\)/);
  if (!match) return colour;
  const parts = match[1]!
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 3);
  return `rgb(${parts.join(" ")} / ${alpha})`;
}
