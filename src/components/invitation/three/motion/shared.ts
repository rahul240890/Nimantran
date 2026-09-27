import type { RefObject } from "react";
import type { TrackId } from "@/lib/engine/motion";

/** What every regional motion piece reads each frame from the stage. */
export type MotionClock = {
  /** How far along each part of the opening is, 0 to 1. */
  tracks: RefObject<Record<TrackId, number>>;
  /** Seconds since the card was opened (the whole opening once in still mode). */
  time: RefObject<number>;
  /** The doors' open amount, 0 to 1. */
  open: RefObject<number>;
  still: boolean;
};

export const ease = {
  outBack: (t: number) => {
    const c = 1.4;
    return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
  },
  out: (t: number) => 1 - (1 - t) ** 3,
};

/** A colour's relative luminance, for hex colours; other formats count as mid-grey. */
export function luminanceOf(colour: string): number {
  const hex = /^#([0-9a-f]{6})$/i.exec(colour.trim())?.[1];
  if (!hex) return 0.5;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/**
 * Rice-paste white shows on a dark page but vanishes on a light one; there the pattern
 * is drawn in the card's gold instead.
 */
export function legible(colour: string, dark: boolean, fallback: string): string {
  return !dark && luminanceOf(colour) > 0.8 ? fallback : colour;
}
