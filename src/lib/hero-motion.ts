/*
 * The maths behind the landing page hero: how far the invite has opened for a scroll position,
 * how quickly it eases toward that, and how much motion a device can take.
 * Kept free of the DOM so it can be unit tested.
 */

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * How far through its scroll track the hero is, from 0 (track top at the top of the viewport)
 * to 1 (track bottom at the bottom of the viewport). `offset` is the sticky header height.
 */
export function trackProgress(
  trackTop: number,
  trackHeight: number,
  viewportHeight: number,
  offset = 0,
): number {
  const distance = trackHeight - (viewportHeight - offset);
  if (distance <= 0) return trackTop <= offset ? 1 : 0;
  return clamp((offset - trackTop) / distance);
}

/**
 * The doors start opening a little after the stage pins and finish before it lets go,
 * so the open card rests on screen for a moment. Smoothstep keeps both ends soft.
 */
export function openAmount(progress: number, start = 0.08, end = 0.72): number {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/**
 * Frame-rate independent easing toward a target. `rate` is roughly how many times per second
 * the remaining gap closes, so the motion feels the same at 60Hz and 120Hz.
 */
export function approach(current: number, target: number, rate: number, dtMs: number): number {
  const next = current + (target - current) * (1 - Math.exp((-rate * dtMs) / 1000));
  return Math.abs(target - next) < 0.0005 ? target : next;
}

export type MotionTier = "full" | "lite";

type DeviceHints = {
  saveData?: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

/** Phones with little memory, few cores, or data saver on get fewer petals and no float. */
export function motionTier({
  saveData,
  deviceMemory,
  hardwareConcurrency,
}: DeviceHints): MotionTier {
  if (saveData) return "lite";
  if (deviceMemory !== undefined && deviceMemory <= 2) return "lite";
  if (hardwareConcurrency !== undefined && hardwareConcurrency <= 2) return "lite";
  return "full";
}

/** Reads the hints the browser offers. Most are Chrome-only, so missing means "assume capable". */
export function readDeviceHints(): DeviceHints {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    saveData: nav.connection?.saveData,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
  };
}

/**
 * Watches real frame times while the hero animates. If the phone cannot keep up
 * (most frames slower than about 30fps), it reports once so the hero can step down.
 */
export function createFrameBudget(onSlow: () => void, sampleSize = 45, slowMs = 34) {
  let samples = 0;
  let slow = 0;
  let done = false;
  return (dtMs: number) => {
    if (done || dtMs > 250) return; // a long gap is a background tab, not a slow phone
    samples += 1;
    if (dtMs > slowMs) slow += 1;
    if (samples >= sampleSize) {
      done = true;
      if (slow / samples > 0.5) onSlow();
    }
  };
}
