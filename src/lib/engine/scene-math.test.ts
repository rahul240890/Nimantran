import { describe, expect, it } from "vitest";
import {
  cameraDistance,
  CARD,
  cardBounds,
  doorAngles,
  fitDistance,
  FOV,
  maxDoorAngle,
  seamGlow,
} from "./scene-math";

describe("doorAngles", () => {
  it("is shut at 0 and fully open at 1", () => {
    expect(doorAngles(0, 140)).toEqual({ left: 0, right: 0 });
    expect(doorAngles(1, 140)).toEqual({ left: 140, right: 140 });
  });

  it("lets the left door lead a little", () => {
    const { left, right } = doorAngles(0.4, 140);
    expect(left).toBeGreaterThan(right);
  });

  it("never swings backwards as the card opens", () => {
    let last = { left: 0, right: 0 };
    for (let open = 0; open <= 1; open += 0.02) {
      const next = doorAngles(open, 130);
      expect(next.left).toBeGreaterThanOrEqual(last.left);
      expect(next.right).toBeGreaterThanOrEqual(last.right);
      last = next;
    }
  });
});

describe("maxDoorAngle", () => {
  it("opens less on tall phone screens and wider on desktops", () => {
    expect(maxDoorAngle(0.5)).toBe(116);
    expect(maxDoorAngle(2)).toBe(140);
    expect(maxDoorAngle(1)).toBeGreaterThan(116);
    expect(maxDoorAngle(1)).toBeLessThan(140);
  });
});

describe("cardBounds", () => {
  it("is the card itself when shut", () => {
    const bounds = cardBounds(0);
    expect(bounds.width).toBeCloseTo(CARD.width);
    expect(bounds.depth).toBeCloseTo(0);
  });

  it("reaches forward at a right angle and widens past it", () => {
    expect(cardBounds(90).width).toBeCloseTo(CARD.width);
    expect(cardBounds(90).depth).toBeCloseTo(CARD.width / 2);
    expect(cardBounds(180).width).toBeCloseTo(CARD.width * 2);
  });
});

describe("fitDistance", () => {
  it("places the camera so the box just fits the view, with a margin", () => {
    const distance = fitDistance({ fovY: 30, aspect: 1, width: 2, height: 1, margin: 1 });
    // Width-bound: the half width fills exactly half the horizontal field of view
    expect(Math.atan(1 / distance) * 2 * (180 / Math.PI)).toBeCloseTo(30);
    expect(fitDistance({ fovY: 30, aspect: 1, width: 2, height: 1, margin: 1.2 })).toBeGreaterThan(
      distance,
    );
  });

  it("steps back further for parts that reach toward the camera", () => {
    const flat = fitDistance({ fovY: 30, aspect: 1.5, width: 2, height: 1 });
    expect(fitDistance({ fovY: 30, aspect: 1.5, width: 2, height: 1, depth: 0.5 })).toBeCloseTo(
      flat + 0.5,
    );
  });
});

describe("cameraDistance", () => {
  it("pulls back as the card opens on a wide screen, keeping the open doors in view", () => {
    const aspect = 1.6;
    expect(cameraDistance(1, aspect)).toBeGreaterThan(cameraDistance(0, aspect));
    const { width, depth } = cardBounds(maxDoorAngle(aspect));
    const halfFov = Math.atan(Math.tan(((FOV / 2) * Math.PI) / 180) * aspect);
    const tipAngle = Math.atan(width / 2 / (cameraDistance(1, aspect) - depth));
    expect(tipAngle).toBeLessThanOrEqual(halfFov);
  });

  it("keeps the inside large on a tall phone by letting the doors frame the edges", () => {
    const aspect = 0.5;
    const wholeCard = fitDistance({
      fovY: FOV,
      aspect,
      width: cardBounds(maxDoorAngle(aspect)).width,
      height: CARD.height,
      depth: cardBounds(maxDoorAngle(aspect)).depth,
    });
    expect(cameraDistance(1, aspect)).toBeLessThan(wholeCard);
  });
});

describe("seamGlow", () => {
  it("is dark when shut, flares as the doors part and fades once they're open", () => {
    expect(seamGlow(0)).toBe(0);
    expect(seamGlow(0.3)).toBeGreaterThan(0.8);
    expect(seamGlow(1)).toBe(0);
  });
});
