/*
 * Petals and sky lanterns for the 3D invitation, simulated in plain typed arrays so a
 * hundred-odd particles cost almost nothing per frame and the logic can be unit tested.
 * The scene copies positions into instanced meshes; nothing here touches three.js.
 */

import { clamp } from "@/lib/hero-motion";

/** Small, fast, seeded random numbers so every guest sees the same choreography. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Bounds = { x: number; top: number; bottom: number; zNear: number; zFar: number };

const GRAVITY = -2.4;
/** Air drag per second; with gravity this gives petals a gentle terminal speed. */
const DRAG = 2.2;
/** Open amount at which the doors part far enough for petals to burst out. */
const BURST_AT = 0.3;

export type PetalField = {
  count: number;
  /** x, y, z per petal. */
  position: Float32Array;
  /** Rotation axis x, y, z (unit length) and angle in radians per petal. */
  rotation: Float32Array;
  /** 0 hidden, otherwise the petal's scale. */
  scale: Float32Array;
  /** Which petal colour each petal uses. */
  colour: Uint8Array;
  step: (dt: number, open: number) => void;
  /** Lays petals on the ground at `groundY` around the card, for still mode. */
  rest: (open: number, groundY: number) => void;
};

export function createPetalField(
  count: number,
  bounds: Bounds,
  colours: number,
  seed = 7,
): PetalField {
  const random = seededRandom(seed);
  const position = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 3);
  const rotation = new Float32Array(count * 4);
  const spin = new Float32Array(count);
  const sway = new Float32Array(count * 3); // phase, frequency, amplitude
  const size = new Float32Array(count);
  const scale = new Float32Array(count);
  const colour = new Uint8Array(count);
  /* Seconds until a waiting petal starts falling from the top; -1 while in flight */
  const wait = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    let ax = random() * 2 - 1;
    let ay = random() * 2 - 1;
    let az = random() * 2 - 1;
    const length = Math.hypot(ax, ay, az) || 1;
    ax /= length;
    ay /= length;
    az /= length;
    rotation.set([ax, ay, az, random() * Math.PI * 2], i * 4);
    spin[i] = (random() * 2 - 1) * 3.2;
    sway.set([random() * Math.PI * 2, 0.6 + random() * 1.1, 0.12 + random() * 0.28], i * 3);
    size[i] = 0.75 + random() * 0.5;
    colour[i] = Math.floor(random() * Math.max(colours, 1));
    wait[i] = 0;
  }

  let burst = false;
  let time = 0;

  const spawnAtTop = (i: number) => {
    position[i * 3] = (random() * 2 - 1) * bounds.x;
    position[i * 3 + 1] = bounds.top + random() * 0.3;
    position[i * 3 + 2] = bounds.zFar + random() * (bounds.zNear - bounds.zFar);
    velocity.set([0, -0.4 - random() * 0.4, 0], i * 3);
    wait[i] = -1;
  };

  const spawnAtSeam = (i: number) => {
    const side = random() < 0.5 ? -1 : 1;
    position.set([side * random() * 0.08, (random() - 0.35) * 0.9, 0.12], i * 3);
    velocity.set([side * (0.5 + random() * 1.5), 1 + random() * 1.8, 0.4 + random() * 1.3], i * 3);
    wait[i] = -1;
  };

  const step = (dt: number, open: number) => {
    // Large gaps (a background tab) would fling petals; cap the step
    const h = Math.min(dt, 1 / 20);
    time += h;

    if (open >= BURST_AT && !burst) {
      burst = true;
      // A third burst out of the seam; the rest drift down from above, one after another
      const fromSeam = Math.round(count * 0.35);
      for (let i = 0; i < count; i++) {
        if (i < fromSeam) spawnAtSeam(i);
        else wait[i] = ((i - fromSeam) / Math.max(count - fromSeam, 1)) * 4 + random() * 0.6;
      }
    }
    if (open < BURST_AT * 0.5) burst = false;
    const raining = burst && open >= BURST_AT;

    for (let i = 0; i < count; i++) {
      const p = i * 3;
      if (wait[i]! >= 0) {
        scale[i] = 0;
        if (!raining) continue;
        wait[i] = wait[i]! - h;
        if (wait[i]! < 0) spawnAtTop(i);
        else continue;
      }

      // Gravity and drag, then a sideways sway like a falling leaf
      velocity[p + 1] = velocity[p + 1]! + GRAVITY * h;
      for (let k = 0; k < 3; k++) velocity[p + k] = velocity[p + k]! * (1 - DRAG * h);
      const phase = sway[p]!;
      const frequency = sway[p + 1]!;
      const amplitude = sway[p + 2]!;
      position[p] =
        position[p]! + (velocity[p]! + Math.sin(time * frequency * 2 + phase) * amplitude) * h;
      position[p + 1] = position[p + 1]! + velocity[p + 1]! * h;
      position[p + 2] = clamp(position[p + 2]! + velocity[p + 2]! * h, bounds.zFar, bounds.zNear);
      rotation[i * 4 + 3] = rotation[i * 4 + 3]! + spin[i]! * h;
      scale[i] = size[i]!;

      if (position[p + 1]! < bounds.bottom) {
        // Fallen out of view: go round again while the card is open, otherwise rest
        if (raining) spawnAtTop(i);
        else {
          wait[i] = 0;
          scale[i] = 0;
        }
      }
    }
  };

  const rest = (open: number, groundY: number) => {
    const shown = open > 0.5;
    const r = seededRandom(seed + 1);
    for (let i = 0; i < count; i++) {
      // A loose ring on the ground in front of and beside the card
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (0.5 + r() * 0.9);
      position.set([x, groundY + 0.01 + r() * 0.01, -0.2 + r() * 0.9], i * 3);
      // Lying flat, turned a random way
      rotation.set([0, 1, 0, r() * Math.PI * 2], i * 4);
      scale[i] = shown && i < Math.min(count, 18) ? size[i]! : 0;
      wait[i] = 0;
    }
    burst = false;
  };

  return { count, position, rotation, scale, colour, step, rest };
}

export type Lantern = {
  x: number;
  z: number;
  /** Units per second upward. */
  speed: number;
  size: number;
  phase: number;
};

export function createLanterns(count: number, seed = 11): Lantern[] {
  const random = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => {
    const spread = (i / Math.max(count - 1, 1)) * 2 - 1;
    return {
      x: spread * 2.6 + (random() - 0.5) * 0.6,
      z: -1.6 - random() * 3.8,
      speed: 0.07 + random() * 0.08,
      size: 0.8 + random() * 0.5,
      phase: random(),
    };
  });
}

/**
 * Where a lantern is at time t (seconds): it rises from below the view to above it and
 * wraps round, swaying gently. `flicker` is the flame's brightness, 0.75 to 1.
 */
export function lanternAt(
  lantern: Lantern,
  t: number,
  bottom: number,
  top: number,
): { x: number; y: number; z: number; flicker: number } {
  const span = top - bottom;
  const travelled = (lantern.phase * span + t * lantern.speed) % span;
  const y = bottom + travelled;
  const x = lantern.x + Math.sin(t * 0.35 + lantern.phase * 9) * 0.12;
  const flicker =
    0.87 +
    0.08 * Math.sin(t * 7.3 + lantern.phase * 40) +
    0.05 * Math.sin(t * 12.9 + lantern.phase * 17);
  return { x, y, z: lantern.z, flicker };
}
