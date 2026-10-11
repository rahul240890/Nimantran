/*
 * CSS timing in the video: cubic-bezier curves and transitions with a delay, so the
 * opening moves in the video as it does on the guest's link (globals.css). Pure maths.
 */

/** A CSS cubic-bezier(x1, y1, x2, y2) as a function of progress 0 to 1. */
export function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const at = (a: number, b: number, t: number) =>
    3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Find the curve's t for this x by bisection, then read its y
    let low = 0;
    let high = 1;
    let t = x;
    for (let i = 0; i < 24; i++) {
      t = (low + high) / 2;
      if (at(x1, x2, t) < x) low = t;
      else high = t;
    }
    return at(y1, y2, t);
  };
}

export const ease = bezier(0.25, 0.1, 0.25, 1);
export const easeInOut = bezier(0.42, 0, 0.58, 1);
export const easeOut = bezier(0, 0, 0.58, 1);
export const linear = (t: number) => t;

/** 0 to 1 over `duration` seconds after `delay`, eased. */
export function transition(
  seconds: number,
  duration: number,
  delay = 0,
  curve: (t: number) => number = ease,
): number {
  return curve(clamp01((seconds - delay) / duration));
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/** Between a and b, `t` of the way. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
