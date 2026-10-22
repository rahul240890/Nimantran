/*
 * The mark on a preview video (owner, 2026-10-14): every host can make and watch their
 * invitation video for free, and the clean MP4 to download or share comes with a package.
 * The preview carries the brand's name in faint rows across the whole frame and a badge at
 * the foot (the Shubh icon, "Made with Shubh" and the site's address, owner 2026-10-22), so
 * it shows the whole invitation but isn't the one to send. Browser only.
 */

import { site } from "@/lib/site";
import type { VideoFilm } from "./encode";
import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./timeline";

export type WatermarkLook = {
  /** The mark's colour and its shadow's, as the browser resolves the design tokens. */
  light: string;
  dark: string;
  /** The brand's gold, for the badge's fine edge. */
  gold: string;
  /** The small-capitals label face (Tenor Sans). */
  font: string;
  /** The Shubh icon, for the badge; null if it didn't load. */
  logo: CanvasImageSource | null;
};

const LOGO = "/brand/shubh-icon.png";

/** The site's own address for the badge, without its scheme or www. */
const HOST = new URL(site.url).host.replace(/^www\./, "");

/** Reads the mark's colours and face from the page's own tokens, and loads the icon. */
export async function loadWatermarkLook(): Promise<WatermarkLook> {
  const probe = document.createElement("span");
  probe.style.cssText = "position:fixed;left:-9999px;transition:none;";
  probe.className = "font-label";
  document.body.append(probe);
  const read = (token: string) => {
    probe.style.color = token;
    return getComputedStyle(probe).color;
  };
  const colours = {
    light: read("var(--card-ivory)"),
    dark: read("var(--night)"),
    gold: read("var(--marigold)"),
    font: getComputedStyle(probe).fontFamily,
  };
  probe.remove();
  const image = new Image();
  image.src = LOGO;
  const logo = await image.decode().then(
    () => image,
    () => null,
  );
  return { ...colours, logo };
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

/** The brand's name, tiled across the frame on a slant. */
const TILE = site.name.toUpperCase();

function drawWatermark(ctx: CanvasRenderingContext2D, text: string, look: WatermarkLook) {
  ctx.save();
  ctx.setTransform(ctx.canvas.width / VIDEO_WIDTH, 0, 0, ctx.canvas.height / VIDEO_HEIGHT, 0, 0);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // The brand's name in rows across the whole frame, so no crop leaves a clean part
  ctx.save();
  ctx.translate(VIDEO_WIDTH / 2, VIDEO_HEIGHT / 2);
  ctx.rotate(-Math.PI / 7);
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = look.light;
  ctx.shadowColor = look.dark;
  ctx.shadowBlur = 6;
  ctx.font = `600 34px ${look.font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "8px";
  const step = ctx.measureText(TILE).width + 140;
  const reach = Math.hypot(VIDEO_WIDTH, VIDEO_HEIGHT) / 2 + step;
  for (let row = 0, y = -reach; y <= reach; row += 1, y += 190) {
    // Every other row shifts by half, like bricks
    for (let x = -reach + (row % 2 ? step / 2 : 0); x <= reach; x += step) {
      ctx.fillText(TILE, x, y);
    }
  }
  ctx.restore();

  // The badge at the foot: the icon, "Made with Shubh" and the site's address
  const label = text.toUpperCase();
  const logoSize = look.logo ? 84 : 0;
  ctx.font = `600 32px ${look.font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "5px";
  const labelW = Math.min(ctx.measureText(label).width, VIDEO_WIDTH - 360);
  ctx.font = `500 28px ${look.font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
  const hostW = ctx.measureText(HOST).width;
  const gap = logoSize ? 24 : 0;
  const padX = 34;
  const textW = Math.max(labelW, hostW);
  const width = padX * 2 + logoSize + gap + textW;
  const height = 124;
  const x = (VIDEO_WIDTH - width) / 2;
  const y = VIDEO_HEIGHT - 56 - height;

  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, height / 2);
  ctx.fillStyle = look.dark;
  ctx.shadowColor = "rgb(0 0 0 / 0.4)";
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 5, width - 10, height - 10, (height - 10) / 2);
  ctx.strokeStyle = look.gold;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  if (look.logo) {
    const lx = x + padX;
    const ly = y + (height - logoSize) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(lx, ly, logoSize, logoSize, 20);
    ctx.clip();
    ctx.drawImage(look.logo, lx, ly, logoSize, logoSize);
    ctx.restore();
  }
  const tx = x + padX + logoSize + gap + textW / 2;
  ctx.fillStyle = look.light;
  ctx.font = `600 32px ${look.font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "5px";
  ctx.fillText(label, tx, y + height / 2 - 20, labelW);
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = look.gold;
  ctx.font = `500 28px ${look.font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
  ctx.fillText(HOST, tx, y + height / 2 + 24);
  ctx.restore();
}
