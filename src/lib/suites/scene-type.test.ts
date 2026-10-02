import { describe, expect, it } from "vitest";
import { SCENE_SIZES, sceneLine, sceneSize } from "./scene-type";

describe("scene lettering", () => {
  it("keeps every line readable on a small phone and in proportion on a large one", () => {
    for (const role of Object.keys(SCENE_SIZES) as (keyof typeof SCENE_SIZES)[]) {
      expect(sceneSize(role, 200)).toBeGreaterThanOrEqual(11);
      expect(sceneSize(role, 1200)).toBeLessThanOrEqual(56);
    }
    // The names lead, the details follow
    expect(sceneSize("names", 360)).toBeGreaterThan(sceneSize("function", 360));
    expect(sceneSize("function", 360)).toBeGreaterThan(sceneSize("detail", 360));
  });

  it("sets each script in the theme's voice and shrinks with the fit", () => {
    const english = sceneLine("regal", "names", "en");
    const hindi = sceneLine("regal", "names", "hi");
    expect(english.fontFamily).not.toBe(hindi.fontFamily);
    expect(String(english.fontSize)).toContain("var(--scene-fit, 1)");
  });

  it("uses the host's own lettering for the names", () => {
    const own = sceneLine("regal", "names", "en", {
      names: "var(--font-test)",
      scale: 1.2,
      bold: true,
      italic: false,
      capitals: true,
    });
    expect(own.fontFamily).toBe("var(--font-test)");
    expect(own.textTransform).toBe("uppercase");
  });
});
