/*
 * A moving scene's layers in the video, one frame at a time: the sky and the place
 * breathing at their own rates, the place rising in, the water shimmering, the pieces in
 * front coming in from their edges and swaying from where they hang or grow, and the small
 * pieces falling, rising, gliding, bobbing or twinkling. The same motion the live scene
 * plays in CSS (globals.css, "Moving scenes"; moving-layers.tsx), worked out for any moment
 * so the video moves as the guest's phone does. Browser only.
 */

import type { FrameBox } from "@/lib/suites/photo-frames";
import { floatPaths, type FloatPath, type MovingScene } from "@/lib/suites/moving";
import { PAGE_H, PAGE_W, fillWith } from "./draw";
import { bezier, clamp01, ease, easeInOut, lerp } from "./ease";

/** The front pieces' way in, as globals.css times it. */
const frontIn = bezier(0.2, 0.85, 0.3, 1.04);
const riseIn = bezier(0.2, 0.85, 0.3, 1);

/** Every picture a moving scene's layers need, for loading before drawing. */
export function movingVideoImages(scene: MovingScene): string[] {
  const floats = floatPaths(scene).flatMap((path) =>
    path.pair ? [path.src, path.pair] : path.src,
  );
  return [scene.layers.sky, scene.layers.middleImage, ...scene.front.map((p) => p.src), ...floats];
}

/** A CSS animation's progress at `seconds`: 0 to 1 through each run, or back for `alternate`. */
export function cycle(seconds: number, duration: number, delay = 0, alternate = false): number {
  const runs = (seconds - delay) / duration;
  if (runs < 0) return 0;
  const whole = Math.floor(runs);
  const part = runs - whole;
  return alternate && whole % 2 === 1 ? 1 - part : part;
}

/** Between keyframes at 0, 50% and 100% (from, to, from), each half eased. */
function swing(t: number): number {
  return t < 0.5 ? easeInOut(t * 2) : 1 - easeInOut((t - 0.5) * 2);
}

const at = ([x, y, w, h]: FrameBox) => ({
  x: (x / 100) * PAGE_W,
  y: (y / 100) * PAGE_H,
  w: (w / 100) * PAGE_W,
  h: (h / 100) * PAGE_H,
});

/** Draws the layers `seconds` after the scene opened, over its flat painting. */
export function drawMovingLayers(
  ctx: CanvasRenderingContext2D,
  scene: MovingScene,
  images: ReadonlyMap<string, CanvasImageSource>,
  seconds: number,
) {
  const sky = images.get(scene.layers.sky);
  const middle = images.get(scene.layers.middleImage);
  ctx.save();
  if (sky) {
    // The sky fades in, then breathes slowly from a point high in the painting
    ctx.save();
    ctx.globalAlpha *= ease(clamp01(seconds / 0.8));
    scaleAbout(
      ctx,
      PAGE_W * 0.5,
      PAGE_H * 0.3,
      lerp(1, 1.05, easeInOut(cycle(seconds, 18, 0, true))),
    );
    fillWith(ctx, sky, 0, 0, PAGE_W, PAGE_H);
    ctx.restore();
  }
  if (middle) drawMiddle(ctx, scene, middle, seconds);
  for (const path of floatPaths(scene)) drawFloat(ctx, path, images, seconds);
  scene.front.forEach((piece, i) => {
    const image = images.get(piece.src);
    if (image) drawFront(ctx, piece, i, image, seconds);
  });
  ctx.restore();
}

/** The place rises in over the sky's foot, then breathes at its own rate; its water shimmers. */
function drawMiddle(
  ctx: CanvasRenderingContext2D,
  scene: MovingScene,
  image: CanvasImageSource,
  seconds: number,
) {
  const box = at(scene.layers.middle);
  const come = riseIn(clamp01((seconds - 0.2) / 1.1));
  const breathe = lerp(1, 1.022, easeInOut(cycle(seconds, 18, 1.3, true)));
  ctx.save();
  ctx.globalAlpha *= come;
  ctx.translate(0, (1 - come) * box.h * 0.06);
  scaleAbout(ctx, box.x + box.w / 2, box.y + box.h, breathe);
  ctx.drawImage(image, box.x, box.y, box.w, box.h);
  if (scene.water) {
    // The water again over itself, a little apart, so it shimmers
    const [top, bottom] = scene.water;
    const t = easeInOut(cycle(seconds, 3.2, 0, true));
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, (top / 100) * PAGE_H, box.w, ((bottom - top) / 100) * PAGE_H);
    ctx.clip();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha *= lerp(0.25, 0.55, t);
    ctx.translate(lerp(-0.6, 0.6, t) * (PAGE_W / 100), lerp(0.15, -0.15, t) * (PAGE_H / 100));
    ctx.drawImage(image, box.x, box.y, box.w, box.h);
    ctx.restore();
  }
  ctx.restore();
}

/** A piece in front: in from its edge, then swaying, rippling or bobbing from its anchor. */
function drawFront(
  ctx: CanvasRenderingContext2D,
  piece: MovingScene["front"][number],
  index: number,
  image: CanvasImageSource,
  seconds: number,
) {
  const box = at(piece.box);
  const local = clamp01((seconds - 0.45) / 1);
  const come = frontIn(local);
  const inX = piece.side === "left" ? -0.4 : piece.side === "right" ? 0.4 : 0;
  const inY = piece.side === "top" ? -0.4 : piece.side === "bottom" ? 0.4 : 0;
  const ox = box.x + (piece.origin[0] / 100) * box.w;
  const oy = box.y + (piece.origin[1] / 100) * box.h;
  // As the live scene staggers them: each piece its own pace, already part-way through
  const time = 6 + ((index * 1.7) % 3.4);
  const delay = -((index * 2.3) % 5);
  const sway = swing(cycle(seconds, time, delay));
  const amount = (piece.amount * Math.PI) / 180;
  ctx.save();
  ctx.globalAlpha *= clamp01(local / 0.4);
  ctx.translate((1 - come) * inX * box.w, (1 - come) * inY * box.h);
  ctx.translate(ox, oy);
  if (piece.motion === "sway") ctx.rotate(lerp(-amount, amount, sway));
  else if (piece.motion === "flutter") {
    ctx.transform(1, 0, Math.tan(lerp(-amount, amount, sway)), 1, 0, 0);
    ctx.scale(1, lerp(1, 1.012, sway));
  } else if (piece.motion === "bob") {
    ctx.translate(0, lerp(-0.5, 0.5, sway) * (PAGE_H / 100));
    ctx.rotate((lerp(-0.6, 0.6, sway) * Math.PI) / 180);
  }
  ctx.translate(-ox, -oy);
  ctx.drawImage(image, box.x, box.y, box.w, box.h);
  ctx.restore();
}

/** A floating piece somewhere along its journey, turning and wobbling as it goes. */
function drawFloat(
  ctx: CanvasRenderingContext2D,
  path: FloatPath,
  images: ReadonlyMap<string, CanvasImageSource>,
  seconds: number,
) {
  // A bird's or a butterfly's two wing shapes, shown in turn
  const flap = path.pair && cycle(seconds, 0.42) >= 0.5 ? path.pair : path.src;
  const image = images.get(flap) ?? images.get(path.src);
  if (!image) return;
  const cqw = PAGE_W / 100;
  const cqh = PAGE_H / 100;
  const w = path.width * cqw;
  const h = w * path.tall;
  let x = path.from[0] * cqw;
  let y = path.from[1] * cqh;
  let alpha = 1;
  let shift = 0;
  let rise = 0;
  let turn = 0;
  let scale = 1;
  if (path.kind === "twinkle") {
    const t = swing(cycle(seconds, path.time, path.delay));
    alpha = t;
    scale = lerp(0.4, 1, t);
  } else if (path.kind === "bob") {
    // A kite tugging on its string
    const t = easeInOut(cycle(seconds, path.time, path.delay, true));
    shift = lerp(-1.5, 1.5, t) * cqw;
    rise = lerp(1, -1, t) * cqh;
    turn = lerp(-7, 7, t);
  } else {
    const t = cycle(seconds, path.time, path.delay);
    x = lerp(path.from[0], path.to[0], t) * cqw;
    y = lerp(path.from[1], path.to[1], t) * cqh;
    alpha = t < 0.08 ? t / 0.08 : t > 0.88 ? (1 - t) / 0.12 : 1;
    const wobble = easeInOut(cycle(seconds, path.wobbleTime, path.delay, true));
    shift = lerp(-path.wobble, path.wobble, wobble) * cqw;
    turn = lerp(-path.spin, path.spin, wobble);
  }
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x + w / 2 + shift, y + h / 2 + rise);
  ctx.rotate((turn * Math.PI) / 180);
  ctx.scale(scale * path.face, scale);
  ctx.drawImage(image, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function scaleAbout(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-x, -y);
}
