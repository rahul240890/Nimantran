import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FUNCTION_ART_IMAGES, functionArt } from "./function-art";
import { FUNCTION_IDS } from "./functions";

describe("each celebration's card painting", () => {
  it("is a painting that exists, for every celebration", () => {
    for (const kind of FUNCTION_IDS) {
      const path = functionArt(kind);
      expect(existsSync(join(process.cwd(), "public", path)), `${kind}: ${path}`).toBe(true);
    }
  });

  it("matches the wedding's own functions", () => {
    expect(functionArt("haldi")).toBe("/celebrate/haldi.webp");
    expect(functionArt("mehendi")).toBe("/celebrate/mehendi.webp");
    expect(functionArt("sangeet")).toBe("/celebrate/sangeet.webp");
    expect(functionArt("wedding")).toBe("/celebrate/wedding.webp");
    expect(FUNCTION_ART_IMAGES).toHaveLength(12);
  });
});
