import { describe, expect, it, vi } from "vitest";
import {
  createQualityGovernor,
  MIN_FPS,
  pickQuality,
  QUALITY,
  QUALITY_ORDER,
  stepDown,
  type DeviceProfile,
} from "./quality";

const desktop: DeviceProfile = {
  webgl: 2,
  renderer: "ANGLE (NVIDIA GeForce RTX 3060)",
  deviceMemory: 8,
  hardwareConcurrency: 12,
  coarsePointer: false,
};

describe("pickQuality", () => {
  it("gives a capable desktop the full scene", () => {
    expect(pickQuality(desktop)).toEqual({ level: "high", reason: "capable" });
  });

  it("uses the 2D card when WebGL is missing or would run in software", () => {
    expect(pickQuality({ ...desktop, webgl: 0 })).toEqual({ level: "2d", reason: "no-webgl" });
    expect(pickQuality({ ...desktop, majorPerformanceCaveat: true }).level).toBe("2d");
    for (const renderer of [
      "Google SwiftShader",
      "llvmpipe (LLVM 15.0.7, 256 bits)",
      "Microsoft Basic Render Driver",
    ]) {
      expect(pickQuality({ ...desktop, renderer })).toEqual({
        level: "2d",
        reason: "software-gpu",
      });
    }
  });

  it("saves data for guests on data saver or a 2G network", () => {
    expect(pickQuality({ ...desktop, saveData: true })).toEqual({
      level: "2d",
      reason: "save-data",
    });
    expect(pickQuality({ ...desktop, effectiveType: "2g" }).reason).toBe("slow-network");
    expect(pickQuality({ ...desktop, effectiveType: "slow-2g" }).reason).toBe("slow-network");
    // 3G still gets 3D: it loads behind the 2D card, which is already usable
    expect(pickQuality({ ...desktop, effectiveType: "3g" }).level).toBe("high");
  });

  it("starts low-end Android phones on the low level", () => {
    const budgetPhone = {
      webgl: 2,
      deviceMemory: 2,
      hardwareConcurrency: 8,
      coarsePointer: true,
    } as const;
    expect(pickQuality(budgetPhone)).toEqual({ level: "low", reason: "low-memory" });
    expect(pickQuality({ ...desktop, hardwareConcurrency: 2 }).level).toBe("low");
    expect(pickQuality({ ...desktop, renderer: "Mali-T720" })).toEqual({
      level: "low",
      reason: "weak-gpu",
    });
    expect(pickQuality({ ...desktop, renderer: "Adreno (TM) 308" }).level).toBe("low");
  });

  it("starts mid-range devices, WebGL 1 and most phones on medium", () => {
    expect(pickQuality({ ...desktop, deviceMemory: 4 }).level).toBe("medium");
    expect(pickQuality({ ...desktop, webgl: 1 }).level).toBe("medium");
    expect(pickQuality({ webgl: 2, coarsePointer: true })).toEqual({
      level: "medium",
      reason: "phone",
    });
  });

  it("lets a strong phone start high", () => {
    expect(
      pickQuality({ webgl: 2, coarsePointer: true, deviceMemory: 8, hardwareConcurrency: 8 }).level,
    ).toBe("high");
  });

  it("assumes a capable browser when hints are missing (Safari, Firefox)", () => {
    expect(pickQuality({ webgl: 2 }).level).toBe("high");
  });
});

describe("levels", () => {
  it("step down one at a time and stop at the 2D card", () => {
    expect(QUALITY_ORDER.map(stepDown)).toEqual(["medium", "low", "2d", "2d"]);
  });

  it("each draw less than the one above", () => {
    const [high, medium, low] = [QUALITY.high, QUALITY.medium, QUALITY.low];
    for (const key of ["petals", "lanterns", "textureWidth"] as const) {
      expect(high[key]).toBeGreaterThan(medium[key]);
      expect(medium[key]).toBeGreaterThan(low[key]);
    }
    expect(low.dpr[1]).toBe(1);
    expect(low.shadows || low.foil || low.environment).toBe(false);
  });
});

describe("createQualityGovernor", () => {
  const frames = (governor: { sample: (ms: number) => void }, ms: number, count: number) => {
    for (let i = 0; i < count; i++) governor.sample(ms);
  };

  it("keeps the level while frames are smooth", () => {
    const onStepDown = vi.fn();
    const governor = createQualityGovernor("high", onStepDown);
    frames(governor, 16.7, 600);
    expect(onStepDown).not.toHaveBeenCalled();
    expect(governor.level).toBe("high");
  });

  it("ignores the first slow frames while shaders compile", () => {
    const onStepDown = vi.fn();
    const governor = createQualityGovernor("high", onStepDown);
    frames(governor, 100, 10); // one second of stutter
    frames(governor, 16.7, 300);
    expect(onStepDown).not.toHaveBeenCalled();
  });

  it("steps down when a level can't hold its frame rate, then judges the new level afresh", () => {
    const onStepDown = vi.fn();
    const governor = createQualityGovernor("high", onStepDown);
    const slowForHigh = 1000 / (MIN_FPS.high - 8);
    frames(governor, slowForHigh, 200);
    expect(onStepDown).toHaveBeenCalledWith("medium");
    expect(onStepDown).toHaveBeenCalledTimes(1);

    // The same rate is fine for medium
    frames(governor, slowForHigh, 200);
    expect(onStepDown).toHaveBeenCalledTimes(1);

    // A phone that can't manage even the low level ends on the 2D card
    frames(governor, 1000 / 12, 400);
    expect(onStepDown).toHaveBeenLastCalledWith("2d");
    expect(governor.level).toBe("2d");
  });

  it("treats a long pause as a background tab, not a slow phone", () => {
    const onStepDown = vi.fn();
    const governor = createQualityGovernor("high", onStepDown);
    frames(governor, 16.7, 100);
    for (let i = 0; i < 20; i++) {
      governor.sample(2000);
      frames(governor, 16.7, 60);
    }
    expect(onStepDown).not.toHaveBeenCalled();
  });
});
