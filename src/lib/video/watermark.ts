/*
 * The mark on a preview video (owner, 2026-10-14): every host can make and watch their
 * invitation video for free, and the clean MP4 to download or share comes with a package.
 * The preview carries "Made with Shubh" across the middle and in a corner of every frame,
 * so it shows the whole invitation but isn't the one to send. Browser only.
 */

import type { VideoFilm } from "./encode";
import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./timeline";

export type WatermarkLook = {
  /** The mark's colour and its shadow's, as the browser resolves the design tokens. */
  light: string;
  dark: string;
  /** The small-capitals label face (Tenor Sans). */
  font: string;
};

/** Reads the mark's colours and face from the page's own tokens. */
export function readWatermarkLook(): WatermarkLook {
  const probe = document.createElement("span");
  probe.style.cssText = "position:fixed;left:-9999px;transition:none;";
  probe.className = "font-label";
  document.body.append(probe);
  const read = (token: string) => {
    probe.style.color = token;
    return getComputedStyle(probe).color;
  };
  const look = {
    light: read("var(--card-ivory)"),
    dark: read("var(--night)"),
    font: getComputedStyle(probe).fontFamily,
  };
  probe.remove();
  return look;
}

/** The film with the mark drawn over every frame. */
export function withWatermark(film: VideoFilm, text: string, look: WatermarkLook): VideoFilm {
  return {
    total: film.total,
    draw: (ctx, seconds) => {
      film.draw(ctx, seconds);
      drawWatermark(ctx, text, look);
    },
  };
}

function drawWatermark(ctx: CanvasRenderingContext2D, text: string, look: WatermarkLook) {
  const label = text.toUpperCase();
  ctx.save();
  ctx.setTransform(ctx.canvas.width / VIDEO_WIDTH, 0, 0, ctx.canvas.height / VIDEO_HEIGHT, 0, 0);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = look.dark;
  ctx.shadowBlur = 18;
  ctx.fillStyle = look.light;

  // Across the middle, on a slant, large enough that it can't be cropped away
  ctx.save();
  ctx.translate(VIDEO_WIDTH / 2, VIDEO_HEIGHT / 2);
  ctx.rotate(-Math.PI / 7);
  ctx.globalAlpha = 0.42;
  ctx.font = `600 84px ${look.font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "10px";
  ctx.fillText(label, 0, 0, VIDEO_WIDTH * 1.05);
  ctx.restore();

  // And small at the foot, as the free link carries it
  ctx.globalAlpha = 0.8;
  ctx.font = `600 38px ${look.font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "6px";
  ctx.fillText(label, VIDEO_WIDTH / 2, VIDEO_HEIGHT - 110, VIDEO_WIDTH - 120);
  ctx.restore();
}
