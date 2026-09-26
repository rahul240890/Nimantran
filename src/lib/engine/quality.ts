/*
 * Quality levels for the invitation engine: what each level draws, how a device's first level
 * is chosen, and how the engine steps down when a phone can't keep up.
 * Kept free of React and three.js so it can be unit tested.
 */

export type QualityLevel = "high" | "medium" | "low" | "2d";
export type RenderLevel = Exclude<QualityLevel, "2d">;

export const QUALITY_ORDER: readonly QualityLevel[] = ["high", "medium", "low", "2d"];

export type QualitySettings = {
  /** Device pixel ratio range for the canvas. */
  dpr: [number, number];
  antialias: boolean;
  /** Doors cast real shadows onto the inside of the card. */
  shadows: boolean;
  /** Soft studio reflections on the gold foil. */
  environment: boolean;
  /** Gold foil shine and letterpress relief (one extra texture per face). */
  foil: boolean;
  /** Width in pixels of the inside face's texture; the doors use half. */
  textureWidth: number;
  petals: number;
  lanterns: number;
};

export const QUALITY: Record<RenderLevel, QualitySettings> = {
  high: {
    dpr: [1, 2],
    antialias: true,
    shadows: true,
    environment: true,
    foil: true,
    textureWidth: 2048,
    petals: 140,
    lanterns: 12,
  },
  medium: {
    dpr: [1, 1.5],
    antialias: true,
    shadows: false,
    environment: true,
    foil: true,
    textureWidth: 1536,
    petals: 72,
    lanterns: 7,
  },
  low: {
    dpr: [1, 1],
    antialias: false,
    shadows: false,
    environment: false,
    foil: false,
    textureWidth: 1024,
    petals: 28,
    lanterns: 3,
  },
};

export type QualityReason =
  | "chosen"
  | "no-webgl"
  | "software-gpu"
  | "save-data"
  | "slow-network"
  | "low-memory"
  | "weak-gpu"
  | "phone"
  | "capable"
  | "slow-frames"
  | "graphics-lost"
  | "load-failed";

export type DeviceProfile = {
  /** Highest WebGL version the browser offers, 0 when none. */
  webgl: 0 | 1 | 2;
  /** The GPU name, when the browser shares it. */
  renderer?: string;
  /** The browser warned that WebGL would be slow (usually software rendering). */
  majorPerformanceCaveat?: boolean;
  saveData?: boolean;
  /** navigator.connection.effectiveType: "slow-2g", "2g", "3g" or "4g". */
  effectiveType?: string;
  /** navigator.deviceMemory in GB (Chrome rounds to 0.25 … 8). */
  deviceMemory?: number;
  hardwareConcurrency?: number;
  /** A touch-first device, such as a phone or tablet. */
  coarsePointer?: boolean;
};

const SOFTWARE_GPU = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;
/* Old mobile GPUs that manage the card but not the full scene */
const WEAK_GPU = /mali-(4|t6|t7)|adreno \(tm\) (2|3|4|50)\d\d|powervr sgx|videocore|tegra [234]/i;

/** Picks the first quality level for a device. The engine can still step down later. */
export function pickQuality(device: DeviceProfile): { level: QualityLevel; reason: QualityReason } {
  if (device.webgl === 0) return { level: "2d", reason: "no-webgl" };
  if (device.majorPerformanceCaveat || (device.renderer && SOFTWARE_GPU.test(device.renderer))) {
    return { level: "2d", reason: "software-gpu" };
  }
  if (device.saveData) return { level: "2d", reason: "save-data" };
  if (device.effectiveType === "slow-2g" || device.effectiveType === "2g") {
    return { level: "2d", reason: "slow-network" };
  }

  const memory = device.deviceMemory;
  const cores = device.hardwareConcurrency;
  if ((memory !== undefined && memory <= 2) || (cores !== undefined && cores <= 2)) {
    return { level: "low", reason: "low-memory" };
  }
  if (device.renderer && WEAK_GPU.test(device.renderer))
    return { level: "low", reason: "weak-gpu" };
  if (device.webgl === 1) return { level: "medium", reason: "weak-gpu" };
  if ((memory !== undefined && memory <= 4) || (cores !== undefined && cores <= 4)) {
    return { level: "medium", reason: "low-memory" };
  }
  if (device.coarsePointer) {
    // Phones start at medium unless they report plenty of memory and cores
    const strong = (memory ?? 0) >= 6 && (cores ?? 0) >= 6;
    return strong ? { level: "high", reason: "capable" } : { level: "medium", reason: "phone" };
  }
  return { level: "high", reason: "capable" };
}

export function stepDown(level: QualityLevel): QualityLevel {
  const index = QUALITY_ORDER.indexOf(level);
  return QUALITY_ORDER[Math.min(index + 1, QUALITY_ORDER.length - 1)]!;
}

/** Lowest frame rate each level must hold before the engine steps down a level. */
export const MIN_FPS: Record<RenderLevel, number> = { high: 48, medium: 40, low: 24 };

/**
 * Watches real frame times while the scene animates and steps down a level when the average
 * over a window drops below that level's minimum. Ignores the first frames (shader compiles
 * and texture uploads) and long gaps (a background tab, not a slow phone).
 */
export function createQualityGovernor(
  start: RenderLevel,
  onStepDown: (next: QualityLevel) => void,
  { warmupMs = 1200, windowMs = 1600 }: { warmupMs?: number; windowMs?: number } = {},
) {
  let level: QualityLevel = start;
  let warm = 0;
  let elapsed = 0;
  let frames = 0;

  return {
    get level() {
      return level;
    },
    /** Feed one frame's duration in milliseconds. */
    sample(dtMs: number) {
      if (level === "2d" || dtMs <= 0) return;
      if (dtMs > 250) {
        elapsed = frames = 0;
        return;
      }
      if (warm < warmupMs) {
        warm += dtMs;
        return;
      }
      elapsed += dtMs;
      frames += 1;
      if (elapsed < windowMs) return;
      const fps = (frames * 1000) / elapsed;
      elapsed = frames = 0;
      if (fps < MIN_FPS[level]) {
        level = stepDown(level);
        // Give the lighter level its own warm-up before judging it
        warm = 0;
        onStepDown(level);
      }
    },
  };
}

/** Reads what the browser shares about the device. Runs in the browser only. */
export function readDeviceProfile(): DeviceProfile {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const profile: DeviceProfile = {
    webgl: 0,
    saveData: nav.connection?.saveData,
    effectiveType: nav.connection?.effectiveType,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    coarsePointer: window.matchMedia?.("(pointer: coarse)").matches,
  };

  try {
    const canvas = document.createElement("canvas");
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });
    if (gl) profile.webgl = 2;
    else {
      gl = canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
      if (gl) profile.webgl = 1;
      else if (canvas.getContext("webgl2") || canvas.getContext("webgl")) {
        // WebGL exists, but only with the slow fallback the browser warned about
        profile.webgl = 1;
        profile.majorPerformanceCaveat = true;
      }
    }
    if (gl) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info
        ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
      if (typeof renderer === "string") profile.renderer = renderer;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    profile.webgl = 0;
  }
  return profile;
}
