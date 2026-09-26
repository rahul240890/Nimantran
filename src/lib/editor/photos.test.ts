import { describe, expect, it } from "vitest";
import { fitWithin } from "./photos";

describe("photo sizing", () => {
  it("shrinks the long side to 1600px and keeps the shape", () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 1600, height: 1200 });
    expect(fitWithin(3024, 4032)).toEqual({ width: 1200, height: 1600 });
  });

  it("never enlarges a small photo", () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
  });
});
