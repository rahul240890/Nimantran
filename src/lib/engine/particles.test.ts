import { describe, expect, it } from "vitest";
import {
  createLanterns,
  createPetalField,
  lanternAt,
  seededRandom,
  type Bounds,
} from "./particles";

const bounds: Bounds = { x: 2, top: 1.5, bottom: -1.5, zNear: 0.9, zFar: -0.5 };
const visible = (scale: Float32Array) => scale.filter((s) => s > 0).length;

function run(field: ReturnType<typeof createPetalField>, seconds: number, open: number) {
  for (let t = 0; t < seconds; t += 1 / 60) field.step(1 / 60, open);
}

describe("seededRandom", () => {
  it("repeats for the same seed and stays in [0, 1)", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    for (let i = 0; i < 500; i++) {
      const value = a();
      expect(value).toBe(b());
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
    expect(seededRandom(1)()).not.toBe(seededRandom(2)());
  });
});

describe("createPetalField", () => {
  it("shows no petals while the card is shut", () => {
    const field = createPetalField(60, bounds, 3);
    run(field, 2, 0);
    expect(visible(field.scale)).toBe(0);
  });

  it("bursts petals out of the seam as the doors part, then rains the rest from above", () => {
    const field = createPetalField(60, bounds, 3);
    field.step(1 / 60, 0.5);
    const burst = visible(field.scale);
    expect(burst).toBeGreaterThan(10);
    expect(burst).toBeLessThan(40);
    run(field, 6, 1);
    expect(visible(field.scale)).toBeGreaterThan(burst);
  });

  it("keeps falling petals within the stage and never produces NaN", () => {
    const field = createPetalField(80, bounds, 3);
    run(field, 12, 1);
    for (let i = 0; i < 80; i++) {
      const [x, y, z] = [
        field.position[i * 3]!,
        field.position[i * 3 + 1]!,
        field.position[i * 3 + 2]!,
      ];
      expect(Number.isFinite(x + y + z)).toBe(true);
      if (field.scale[i]! > 0) {
        expect(Math.abs(x)).toBeLessThan(bounds.x + 2);
        expect(y).toBeLessThan(bounds.top + 3);
        expect(z).toBeGreaterThanOrEqual(bounds.zFar);
        expect(z).toBeLessThanOrEqual(bounds.zNear);
      }
    }
  });

  it("lets the last petals fall away after the card closes", () => {
    const field = createPetalField(40, bounds, 3);
    run(field, 4, 1);
    run(field, 15, 0);
    expect(visible(field.scale)).toBe(0);
  });

  it("survives a long frame gap without flinging petals away", () => {
    const field = createPetalField(40, bounds, 3);
    run(field, 1, 1);
    field.step(5, 1);
    for (let i = 0; i < 40; i++) expect(Number.isFinite(field.position[i * 3 + 1]!)).toBe(true);
  });

  it("lays a few petals on the ground in still mode, only when open", () => {
    const field = createPetalField(60, bounds, 3);
    field.rest(1, -0.9);
    const resting = visible(field.scale);
    expect(resting).toBeGreaterThan(0);
    expect(resting).toBeLessThanOrEqual(18);
    for (let i = 0; i < 60; i++) {
      if (field.scale[i]! > 0) expect(field.position[i * 3 + 1]).toBeCloseTo(-0.9, 1);
    }
    field.rest(0, -0.9);
    expect(visible(field.scale)).toBe(0);
  });

  it("picks every colour index within range", () => {
    const field = createPetalField(100, bounds, 4);
    expect(Math.max(...field.colour)).toBeLessThan(4);
  });
});

describe("lanterns", () => {
  it("rise, wrap round, and flicker gently", () => {
    const [lantern] = createLanterns(1);
    let lastY = lanternAt(lantern!, 0, -2, 3).y;
    let wrapped = false;
    for (let t = 0.1; t < 120; t += 0.1) {
      const at = lanternAt(lantern!, t, -2, 3);
      expect(at.y).toBeGreaterThanOrEqual(-2);
      expect(at.y).toBeLessThan(3);
      expect(at.flicker).toBeGreaterThanOrEqual(0.74);
      expect(at.flicker).toBeLessThanOrEqual(1);
      if (at.y < lastY) wrapped = true;
      lastY = at.y;
    }
    expect(wrapped).toBe(true);
  });

  it("sit behind the card", () => {
    for (const lantern of createLanterns(12)) expect(lantern.z).toBeLessThan(-1);
  });
});
