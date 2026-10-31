import { describe, expect, it } from "vitest";
import { TURNS, glowAfter, turnAlpha, turnFor, writtenFor, NAME_GLOW } from "./motion";
import { cycle } from "./moving-draw";
import { floatInstances, floatPaths, movingScene } from "@/lib/suites/moving";
import { MOVING_IDS } from "@/lib/suites/catalog";

describe("page changes", () => {
  it("fades into the first page, then takes the others in turn", () => {
    expect(turnFor(0)).toBe("fade");
    const turns = Array.from({ length: 9 }, (_, i) => turnFor(i + 1));
    expect(turns.slice(0, TURNS.length)).toEqual(TURNS);
    // No two pages in a row change the same way
    turns.slice(1).forEach((turn, i) => expect(turn).not.toBe(turns[i]));
  });

  it("reveals the whole new page on the doors, sweep and circle, and fades the rest", () => {
    expect(turnAlpha("doors", 0.3)).toBe(1);
    expect(turnAlpha("iris", 0.3)).toBe(1);
    expect(turnAlpha("sweep", 0.3)).toBe(1);
    expect(turnAlpha("petals", 0.3)).toBe(0.3);
    expect(turnAlpha("fade", 0.3)).toBe(0.3);
  });
});

describe("the names", () => {
  it("write their lines one after another", () => {
    expect(writtenFor(0.25, 0, 2)).toBe(0.5);
    expect(writtenFor(0.25, 1, 2)).toBe(0);
    expect(writtenFor(0.75, 0, 2)).toBe(1);
    expect(writtenFor(0.75, 1, 2)).toBe(0.5);
    expect(writtenFor(1, 1, 2)).toBe(1);
  });

  it("glow once written, then settle", () => {
    expect(glowAfter(-0.1)).toBe(0);
    expect(glowAfter(NAME_GLOW / 2)).toBeCloseTo(1);
    expect(glowAfter(NAME_GLOW)).toBe(0);
  });
});

describe("moving scenes in the video", () => {
  it("run CSS animations' cycles, alternate ones going back", () => {
    expect(cycle(0.5, 2)).toBe(0.25);
    expect(cycle(2.5, 2)).toBe(0.25);
    expect(cycle(2.5, 2, 0, true)).toBe(0.75);
    // A delay still to come holds the start; a negative one is already part-way
    expect(cycle(0.5, 2, 1)).toBe(0);
    expect(cycle(0, 2, -1)).toBe(0.5);
  });

  it("float the pieces on the same journeys as the live scene", () => {
    for (const id of MOVING_IDS) {
      const scene = movingScene(id);
      const paths = floatPaths(scene);
      const live = floatInstances(scene);
      expect(paths.map((path) => path.key)).toEqual(live.map((float) => float.key));
      paths.forEach((path, i) => {
        const style = live[i]!.style as Record<string, unknown>;
        expect(style["--x0"]).toBe(`${path.from[0]}cqw`);
        expect(style["--y1"]).toBe(`${path.to[1]}cqh`);
        expect(style["--delay"]).toBe(`${path.delay.toFixed(2)}s`);
        expect(path.delay).toBeLessThanOrEqual(0);
        expect(path.tall).toBeGreaterThan(0);
      });
    }
  });
});
