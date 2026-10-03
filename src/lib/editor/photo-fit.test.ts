import { describe, expect, it } from "vitest";
import { defaultCrop, isDefaultCrop, photoPlacement, turnedAspect } from "./photo-fit";

const covers = (p: ReturnType<typeof photoPlacement>) =>
  p.left <= 1e-9 && p.top <= 1e-9 && p.left + p.width >= 1 - 1e-9 && p.top + p.height >= 1 - 1e-9;

describe("placing a photo in a frame", () => {
  it("covers a round frame with a tall photo, centred", () => {
    const p = photoPlacement({ aspect: 3 / 4, x: 0.5, y: 0.5, zoom: 1, turn: 0, tilt: 0 }, 1);
    expect(p.width).toBeCloseTo(1);
    expect(p.height).toBeCloseTo(4 / 3);
    expect(p.top).toBeCloseTo(0.5 - 0.5 * (4 / 3));
    expect(covers(p)).toBe(true);
  });

  it("never lets the photo slide off an edge", () => {
    const p = photoPlacement({ aspect: 1.5, x: 0, y: 1, zoom: 1.4, turn: 0, tilt: 0 }, 0.8);
    expect(covers(p)).toBe(true);
    expect(p.left).toBeCloseTo(0);
    expect(p.top + p.height).toBeCloseTo(1);
  });

  it("keeps covering when zoomed out past the frame", () => {
    const p = photoPlacement({ aspect: 1, x: 0.5, y: 0.5, zoom: 0.2, turn: 0, tilt: 0 }, 1);
    expect(p.width).toBeCloseTo(1);
  });

  it("treats a quarter-turned photo as its turned shape", () => {
    expect(turnedAspect(4 / 3, 1)).toBeCloseTo(3 / 4);
    const p = photoPlacement({ aspect: 4 / 3, x: 0.5, y: 0.5, zoom: 1, turn: 1, tilt: 0 }, 1);
    expect(p.width).toBeCloseTo(1);
    expect(p.height).toBeCloseTo(4 / 3);
    expect(p.turn).toBe(1);
  });

  it("grows a tilted photo so no corner shows", () => {
    const flat = photoPlacement({ aspect: 1, x: 0.5, y: 0.5, zoom: 1, turn: 0, tilt: 0 }, 1);
    const tilted = photoPlacement({ aspect: 1, x: 0.5, y: 0.5, zoom: 1, turn: 0, tilt: 10 }, 1);
    expect(tilted.width).toBeGreaterThan(flat.width);
    // A frame corner, turned back into the photo's own square, stays inside it
    const t = (10 * Math.PI) / 180;
    const corner = 0.5 * (Math.cos(t) + Math.sin(t));
    expect(corner).toBeLessThanOrEqual(tilted.width / 2 + 1e-9);
  });

  it("starts where the pages placed photos before, faces high", () => {
    const crop = defaultCrop(3 / 4, 1);
    const p = photoPlacement({ aspect: 3 / 4, ...crop }, 1);
    // object-position 50% 30%: the top is 30% of the overhang above the frame
    expect(p.top).toBeCloseTo(0.3 * (1 - 4 / 3));
    expect(p.left).toBeCloseTo(0);
    expect(isDefaultCrop(crop, 3 / 4, 1)).toBe(true);
    expect(isDefaultCrop({ ...crop, zoom: 1.5 }, 3 / 4, 1)).toBe(false);
  });
});
