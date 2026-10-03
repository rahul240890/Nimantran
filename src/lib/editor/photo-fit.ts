/*
 * How a host's photo sits in a frame: which point of the photo is at the frame's centre,
 * how far it is zoomed, whether it is turned a quarter at a time, and a small tilt to
 * straighten it. The point is a share of the photo (0 to 1 across and down, after any
 * quarter turn), not of the frame, so one adjustment carries over to every theme's frame
 * shape: a round medallion, a tall arch or a wide window all keep the same face in the
 * middle. Kept free of the validator so the guest's page can read it without zod.
 */

export type PhotoCrop = {
  /** The point of the photo at the frame's centre, as a share of its width and height. */
  x: number;
  y: number;
  /** 1 just covers the frame; more brings the photo closer. */
  zoom: number;
  /** Quarter turns clockwise, 0 to 3. */
  turn: number;
  /** Degrees of straightening, clockwise, within ±MAX_TILT. */
  tilt: number;
};

/** A photo's own shape and how the host placed it, as the pages need it. */
export type PhotoFit = PhotoCrop & {
  /** The photo file's width over its height, before any turn. */
  aspect: number;
};

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;
export const MAX_TILT = 15;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** The photo's width over height as it is shown, after its quarter turns. */
export function turnedAspect(aspect: number, turn: number): number {
  return turn % 2 ? 1 / aspect : aspect;
}

/**
 * Where a photo lies in a frame `frameAspect` wide for each unit of height. `width` and
 * `left` are shares of the frame's width, `height` and `top` of its height; the box is the
 * turned photo, which is then tilted round the frame's centre. A frame is always covered:
 * the photo is never smaller than the frame and never slides off an edge.
 */
export function photoPlacement(fit: PhotoFit, frameAspect: number) {
  const shown = turnedAspect(fit.aspect, fit.turn);
  const tilt = clamp(fit.tilt, -MAX_TILT, MAX_TILT);
  const radians = (Math.abs(tilt) * Math.PI) / 180;
  // A tilted photo grows just enough that its corners never show inside the frame
  const tiltGrow = Math.cos(radians) + Math.sin(radians) * Math.max(frameAspect, 1 / frameAspect);
  const zoom = clamp(fit.zoom, MIN_ZOOM, MAX_ZOOM);
  const width = Math.max(1, shown / frameAspect) * zoom * tiltGrow;
  const height = (width / shown) * frameAspect;
  const spanX = 0.5 / width;
  const spanY = 0.5 / height;
  const x = clamp(fit.x, spanX, 1 - spanX);
  const y = clamp(fit.y, spanY, 1 - spanY);
  return {
    width,
    height,
    left: 0.5 - x * width,
    top: 0.5 - y * height,
    /** The point at the frame's centre, after keeping the frame covered. */
    x,
    y,
    turn: ((fit.turn % 4) + 4) % 4,
    tilt,
  };
}

/**
 * The placement pages used before hosts could adjust photos: covering the frame, centred
 * across, and with the photo's top 30% in line with the frame's (faces sit high in most
 * photos), as CSS `object-position: 50% 30%` places it.
 */
export function defaultCrop(aspect: number, frameAspect: number): PhotoCrop {
  const width = Math.max(1, aspect / frameAspect);
  const height = (width / aspect) * frameAspect;
  // The frame's centre is 0.5 down it; the photo's top sits at 0.3 × (1 - height)
  const y = (0.5 - 0.3 * (1 - height)) / height;
  return { x: 0.5, y: clamp(y, 0, 1), zoom: 1, turn: 0, tilt: 0 };
}

/** Whether a crop leaves the photo as the pages place it by default. */
export function isDefaultCrop(crop: PhotoCrop, aspect: number, frameAspect: number): boolean {
  const base = defaultCrop(aspect, frameAspect);
  return (
    crop.turn % 4 === 0 &&
    Math.abs(crop.tilt) < 0.01 &&
    Math.abs(crop.zoom - 1) < 0.01 &&
    Math.abs(crop.x - base.x) < 0.005 &&
    Math.abs(crop.y - base.y) < 0.005
  );
}

/** A frame's shape as a width over height, from its box on a painting of `paintingAspect`. */
export function frameAspectOf(
  [, , width, height]: readonly [number, number, number, number],
  paintingAspect: number,
): number {
  return (width / height) * paintingAspect;
}
