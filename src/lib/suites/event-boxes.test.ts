import { describe, expect, it } from "vitest";
import { SUITE_IDS } from "./catalog";
import { BOX_HEADS, EVENT_BOXES, ORNATE_BOXES, eventBox, isOrnate } from "./event-boxes";
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

  it("gives every party box a heading, and every other box is an ornate card", () => {
    for (const box of EVENT_BOXES.party) expect(BOX_HEADS[box]).toBeDefined();
    for (const style of ["palace", "procession", "garden"] as const)
      for (const box of EVENT_BOXES[style]) expect(isOrnate(box)).toBe(true);
  });

  it("hangs every ornate card in some theme", () => {
    const used = new Set(
      SUITE_IDS.flatMap((suite) => {
        const style = guestLook(suite)?.style;
        return style ? [eventBox(suite, style)] : [];
      }),
    );
    for (const box of ORNATE_BOXES) expect(used, box).toContain(box);
  });
});
