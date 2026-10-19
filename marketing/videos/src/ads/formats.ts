/*
 * The sizes each ad is cut to, with the area platform buttons and captions leave clear.
 * Reels and Stories: Meta keeps the top 14%, the bottom 35% and 6% each side for its own UI.
 */
export type FormatId = "reel" | "feed" | "square" | "wide";

export type Format = {
  width: number;
  height: number;
  /** Space kept clear on each side, in px. */
  safe: { top: number; bottom: number; side: number };
  caption: number;
};

export const FORMATS: Record<FormatId, Format> = {
  reel: { width: 1080, height: 1920, safe: { top: 280, bottom: 680, side: 72 }, caption: 66 },
  feed: { width: 1080, height: 1350, safe: { top: 70, bottom: 120, side: 64 }, caption: 60 },
  square: { width: 1080, height: 1080, safe: { top: 60, bottom: 90, side: 60 }, caption: 54 },
  wide: { width: 1920, height: 1080, safe: { top: 60, bottom: 110, side: 96 }, caption: 58 },
};

export const tall = (f: FormatId) => f === "reel";
export const landscape = (f: FormatId) => f === "wide";
