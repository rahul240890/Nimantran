/*
 * Joins the opening (prelude-draw.ts) to the pages or the scene: the pages cross-fade in
 * over the welcome, then play as they always have. Browser only.
 */

import type { VideoFilm } from "./encode";
import { CROSSFADE, VIDEO_HEIGHT, VIDEO_WIDTH } from "./timeline";

let spare: CanvasRenderingContext2D | null = null;

/** The opening for its first `lead` seconds, then the pages fading in over it. */
export function withPrelude(prelude: VideoFilm, lead: number, pages: VideoFilm): VideoFilm {
  return {
    total: Number((lead + pages.total).toFixed(3)),
    draw: (ctx, seconds) => {
      const local = seconds - lead;
      if (local < 0) {
        prelude.draw(ctx, seconds);
        return;
      }
      if (local >= CROSSFADE) {
        pages.draw(ctx, local);
        return;
      }
      prelude.draw(ctx, seconds);
      if (!spare) {
        const canvas = document.createElement("canvas");
        canvas.width = VIDEO_WIDTH;
        canvas.height = VIDEO_HEIGHT;
        spare = canvas.getContext("2d", { alpha: false });
      }
      if (!spare) return;
      pages.draw(spare, local);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = local / CROSSFADE;
      ctx.drawImage(spare.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    },
  };
}
