import { describe, expect, it } from "vitest";
import { SUITE_IDS } from "./catalog";
import { BOX_HEADS, EVENT_BOXES, eventBox } from "./event-boxes";
import { GUEST_STYLES, guestLook } from "./guest-look";

describe("each theme's event box", () => {
  it("is the same every time, and one of its style's own", () => {
    for (const style of GUEST_STYLES) {
      expect(eventBox("rajwada-bagh", style)).toBe(eventBox("rajwada-bagh", style));
      expect(EVENT_BOXES[style]).toContain(eventBox("rajwada-bagh", style));
    }
  });

  it("uses every box of a style across that style's themes", () => {
    for (const style of GUEST_STYLES) {
      const themes = SUITE_IDS.filter((suite) => guestLook(suite)?.style === style);
      const used = new Set(themes.map((suite) => eventBox(suite, style)));
      for (const box of EVENT_BOXES[style]) expect(used, `${style}: ${box}`).toContain(box);
    }
  });

  it("gives every box a heading", () => {
    for (const style of GUEST_STYLES)
      for (const box of EVENT_BOXES[style]) expect(BOX_HEADS[box]).toBeDefined();
  });
});
