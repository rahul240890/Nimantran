/*
 * Geometry and timing for the 3D gate-fold card: its size, how far each door swings for
 * an open amount, and how far back the camera sits so the whole card fits on screen.
 * Pure functions, unit tested.
 */

import { clamp } from "@/lib/hero-motion";

/** The closed card in world units, 5:4 like the 2D card. */
export const CARD = { width: 1.6, height: 1.28, thickness: 0.014 } as const;

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Degrees the doors swing to when fully open: less on tall screens so the card stays large. */
export function maxDoorAngle(aspect: number): number {
  const t = clamp((aspect - 0.7) / (1.4 - 0.7));
  return 116 + t * (140 - 116);
}

/**
 * Each door's angle in degrees for an overall open amount (0 shut, 1 open).
 * The left door leads by a moment, as when a person opens a real card.
 */
export function doorAngles(open: number, maxAngle: number): { left: number; right: number } {
  const left = smootherstep(clamp(open * 1.1));
  const right = smootherstep(clamp(open * 1.1 - 0.1));
  return { left: left * maxAngle, right: right * maxAngle };
}

/** The space the card takes up at a door angle: width, and how far the doors reach forward. */
export function cardBounds(angleDeg: number, width = CARD.width): { width: number; depth: number } {
  const rad = (angleDeg * Math.PI) / 180;
  const half = width / 2;
  return {
    width: width + 2 * half * Math.max(0, -Math.cos(rad)),
    depth: half * Math.max(0, Math.sin(rad)),
  };
}

/**
 * Camera distance that fits a box of `width` by `height` (with `depth` reaching toward the
 * camera) inside a perspective view, leaving `margin` around it.
 */
export function fitDistance({
  fovY,
  aspect,
  width,
  height,
  depth = 0,
  margin = 1.15,
}: {
  fovY: number;
  aspect: number;
  width: number;
  height: number;
  depth?: number;
  margin?: number;
}): number {
  const vHalf = (fovY * Math.PI) / 180 / 2;
  const hHalf = Math.atan(Math.tan(vHalf) * aspect);
  const byHeight = ((height / 2) * margin) / Math.tan(vHalf);
  const byWidth = ((width / 2) * margin) / Math.tan(hHalf);
  return Math.max(byHeight, byWidth) + depth;
}

/** Warm light from the seam: grows as the doors crack open, settles once they're wide. */
export function seamGlow(open: number): number {
  return clamp(Math.min(open * 3, (1 - open) * 2.2));
}

/** The camera's vertical field of view, in degrees. */
export const FOV = 30;

/**
 * How far the camera sits from the card for an open amount and screen shape. On wide
 * screens the whole open card fits. On tall phone screens the open doors frame the view
 * from the sides, partly off screen, so the inside of the card stays large enough to read.
 */
export function cameraDistance(open: number, aspect: number): number {
  const angles = doorAngles(open, maxDoorAngle(aspect));
  const bounds = cardBounds(Math.max(angles.left, angles.right));
  const tall = aspect < 0.8;
  return fitDistance({
    fovY: FOV,
    aspect,
    width: tall ? CARD.width + (bounds.width - CARD.width) * 0.3 : bounds.width,
    height: CARD.height + 0.3,
    depth: tall ? bounds.depth * 0.25 : bounds.depth,
    margin: 1.06,
  });
}
