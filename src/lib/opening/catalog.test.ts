import { describe, expect, it } from "vitest";
import { noOpening, offersGods, openingGod, openingStyle, openingStyles } from "./catalog";

describe("openings", () => {
  it("follows the design until the host picks one", () => {
    // A painted theme splits its cover; the colour card and a Scene open as palace gates
    expect(openingStyle(noOpening, "rajwada-bagh", false)).toBe("doors");
    expect(openingStyle(noOpening, "classic", false)).toBe("palace");
    expect(openingStyle(noOpening, "rajwada-bagh", true)).toBe("palace");
    expect(openingStyle({ style: "lotus", god: null }, "classic", false)).toBe("lotus");
  });

  it("offers the cover's doors only with a cover, and going straight in only for a Scene", () => {
    expect(openingStyles("classic", false)).not.toContain("doors");
    expect(openingStyles("rajwada-bagh", false)).not.toContain("none");
    expect(openingStyles("rajwada-bagh", true)).toContain("none");
    // A choice the theme can't show falls back to the design's own
    expect(openingStyle({ style: "doors", god: null }, "classic", false)).toBe("palace");
    expect(openingStyle({ style: "none", god: null }, "kayal", false)).toBe("doors");
  });

  it("keeps gods off party occasions", () => {
    expect(offersGods("wedding")).toBe(true);
    expect(offersGods("party")).toBe(false);
    expect(openingGod({ style: null, god: "ganesha" }, "wedding")).toBe("ganesha");
    expect(openingGod({ style: null, god: "ganesha" }, "farewell-party")).toBeNull();
  });
});
