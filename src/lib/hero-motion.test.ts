import { describe, expect, it, vi } from "vitest";
import { approach, createFrameBudget, motionTier, openAmount, trackProgress } from "./hero-motion";

describe("trackProgress", () => {
  it("is 0 before the track reaches the top and 1 once it has scrolled through", () => {
    expect(trackProgress(200, 1800, 900)).toBe(0);
    expect(trackProgress(0, 1800, 900)).toBe(0);
    expect(trackProgress(-450, 1800, 900)).toBeCloseTo(0.5);
    expect(trackProgress(-900, 1800, 900)).toBe(1);
    expect(trackProgress(-2000, 1800, 900)).toBe(1);
  });

  it("accounts for the sticky header", () => {
    expect(trackProgress(64, 1800, 900, 64)).toBe(0);
    expect(trackProgress(64 - 964, 1800, 900, 64)).toBe(1);
  });

  it("never divides by zero when the track fits on screen", () => {
    expect(trackProgress(10, 500, 900)).toBe(0);
    expect(trackProgress(-10, 500, 900)).toBe(1);
  });
});

describe("openAmount", () => {
  it("stays shut at the start, fully open before the end, and eases between", () => {
    expect(openAmount(0)).toBe(0);
    expect(openAmount(0.08)).toBe(0);
    expect(openAmount(0.4)).toBeCloseTo(0.5, 1);
    expect(openAmount(0.72)).toBe(1);
    expect(openAmount(1)).toBe(1);
  });

  it("only ever moves forward as progress grows", () => {
    let last = 0;
    for (let p = 0; p <= 1; p += 0.01) {
      const value = openAmount(p);
      expect(value).toBeGreaterThanOrEqual(last);
      last = value;
    }
  });
});

describe("approach", () => {
  it("moves toward the target and settles exactly on it", () => {
    let value = 0;
    for (let i = 0; i < 200; i++) value = approach(value, 1, 8, 16);
    expect(value).toBe(1);
  });

  it("covers the same ground at 60Hz and 120Hz", () => {
    let at60 = 0;
    let at120 = 0;
    for (let i = 0; i < 30; i++) at60 = approach(at60, 1, 4, 1000 / 60);
    for (let i = 0; i < 60; i++) at120 = approach(at120, 1, 4, 1000 / 120);
    expect(at60).toBeCloseTo(at120, 5);
  });
});

describe("motionTier", () => {
  it("steps down for data saver, little memory or few cores", () => {
    expect(motionTier({ saveData: true, deviceMemory: 8 })).toBe("lite");
    expect(motionTier({ deviceMemory: 2 })).toBe("lite");
    expect(motionTier({ hardwareConcurrency: 2 })).toBe("lite");
  });

  it("assumes a capable phone when the browser offers no hints", () => {
    expect(motionTier({})).toBe("full");
    expect(motionTier({ deviceMemory: 4, hardwareConcurrency: 8 })).toBe("full");
  });
});

describe("createFrameBudget", () => {
  it("reports a phone that drops most frames, once", () => {
    const onSlow = vi.fn();
    const frame = createFrameBudget(onSlow, 10);
    for (let i = 0; i < 20; i++) frame(50);
    expect(onSlow).toHaveBeenCalledTimes(1);
  });

  it("stays quiet on a smooth phone and ignores background-tab gaps", () => {
    const onSlow = vi.fn();
    const frame = createFrameBudget(onSlow, 10);
    for (let i = 0; i < 5; i++) frame(1000);
    for (let i = 0; i < 20; i++) frame(16);
    expect(onSlow).not.toHaveBeenCalled();
  });
});
