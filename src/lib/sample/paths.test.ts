import { describe, expect, it } from "vitest";
import { designById } from "@/lib/gallery/catalog";
import { LIVE_DEMOS, anotherDemoPath, demoPath, pickDemo } from "./paths";

describe("the live demos", () => {
  it("are 10 to 15 real designs, one of them a 3D card", () => {
    expect(LIVE_DEMOS.length).toBeGreaterThanOrEqual(10);
    expect(LIVE_DEMOS.length).toBeLessThanOrEqual(15);
    expect(new Set(LIVE_DEMOS).size).toBe(LIVE_DEMOS.length);
    for (const id of LIVE_DEMOS) expect(designById(id), id).toBeDefined();
    expect(LIVE_DEMOS.some((id) => id.startsWith("card-"))).toBe(true);
  });

  it("never repeat the one just seen or the last one shown", () => {
    for (let i = 0; i < 200; i++) {
      const random = () => i / 200;
      const id = pickDemo("kayal", "chapel", random);
      expect(id).not.toBe("kayal");
      expect(id).not.toBe("chapel");
      expect(LIVE_DEMOS).toContain(id);
    }
    // Every demo can come up
    const seen = new Set(
      Array.from({ length: 100 }, (_, i) => pickDemo(null, null, () => i / 100)),
    );
    expect(seen.size).toBe(LIVE_DEMOS.length);
    // Even a random() of 1 stays in the list
    expect(LIVE_DEMOS).toContain(pickDemo(null, null, () => 1));
  });

  it("open as a sample, with the way to another", () => {
    expect(demoPath("kayal")).toBe("/sample/kayal?demo=1");
    expect(anotherDemoPath("kayal")).toBe("/sample?after=kayal");
  });
});
