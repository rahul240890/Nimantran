import { describe, expect, it } from "vitest";
import { contrast, firstReadable, readableOn } from "./contrast";

describe("readableOn", () => {
  it("keeps light paper on a dark back", () => {
    expect(readableOn("#7a2238", "#f8efdc", "#2a1a24")).toBe("#f8efdc");
  });

  it("switches to the light ink when the card's paper is dark", () => {
    // Emerald Palace: deep green paper, cream ink, on a maroon back
    expect(readableOn("#6d1a2b", "#0e3a2d", "#f5ead0")).toBe("#f5ead0");
    expect(contrast("#f5ead0", "#6d1a2b")).toBeGreaterThan(4.5);
  });

  it("reads short hex colours", () => {
    expect(contrast("#fff", "#000")).toBeCloseTo(21);
  });
});

describe("firstReadable", () => {
  it("keeps the gold when it reads on the back", () => {
    expect(firstReadable("#6d1a2b", 3, "#c9a45a", "#f5ead0")).toBe("#c9a45a");
  });

  it("falls back when the gold is too close to the back", () => {
    expect(firstReadable("#2f3e6b", 3, "#5a5f8a", "#f8efdc")).toBe("#f8efdc");
  });
});
