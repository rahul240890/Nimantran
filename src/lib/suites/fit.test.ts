import { describe, expect, it } from "vitest";
import { FIT_GROW, FIT_MAX, FIT_MIN, fitGrowth, fitScale } from "./fit";

describe("fitting words to a painting", () => {
  it("grows short words up to the most, never past it", () => {
    expect(fitScale(() => true)).toEqual({ scale: FIT_MAX, overflow: false });
  });

  it("finds the largest size that fits, just under the limit", () => {
    const { scale, overflow } = fitScale((s) => s <= 0.83);
    expect(overflow).toBe(false);
    expect(scale).toBeLessThanOrEqual(0.83);
    expect(scale).toBeGreaterThan(0.82);
  });

  it("stops at the smallest readable size and says the page is too full", () => {
    expect(fitScale(() => false)).toEqual({ scale: FIT_MIN, overflow: true });
  });

  it("never hands back a size a hair past the largest that fits", () => {
    for (const limit of [0.7016, 0.8333, 0.9999]) {
      const { scale } = fitScale((scale) => scale <= limit, { steps: 12 });
      expect(scale).toBeLessThanOrEqual(limit);
    }
  });
});

describe("how far a page's words may grow", () => {
  it("keeps a page of names or a function's title to the theme's proportions", () => {
    expect(fitGrowth(["names", "joiner", "names"])).toBe(FIT_MAX);
    expect(fitGrowth(["display", "date", "venue"])).toBe(FIT_MAX);
  });

  it("lets a family page of reading words grow to fill its calm space", () => {
    expect(fitGrowth(["body", "label", "body", "small"])).toBe(FIT_GROW);
  });

  it("grows a page with a day on it less than one of reading words only", () => {
    const withDay = fitGrowth(["body", "label", "date"]);
    expect(withDay).toBeGreaterThan(FIT_MAX);
    expect(withDay).toBeLessThan(FIT_GROW);
  });

  it("treats an empty page as any other", () => {
    expect(fitGrowth([])).toBe(FIT_MAX);
  });
});
