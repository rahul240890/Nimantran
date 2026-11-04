import { describe, expect, it } from "vitest";
import { SUITE_IDS } from "./catalog";
import { EVENT_BOXES, ORNATE_BOXES, eventBox, templateBox } from "./event-boxes";
import { GUEST_STYLES, guestLook } from "./guest-look";

describe("each theme's event card", () => {
  it("is the same every time, and one of its style's own", () => {
    for (const style of GUEST_STYLES) {
      expect(eventBox("rajwada-bagh", style)).toBe(eventBox("rajwada-bagh", style));
      expect(EVENT_BOXES[style]).toContain(eventBox("rajwada-bagh", style));
    }
  });

  it("uses every card of a style across that style's themes", () => {
    for (const style of GUEST_STYLES) {
      const themes = SUITE_IDS.filter((suite) => guestLook(suite)?.style === style);
      const used = new Set(themes.map((suite) => eventBox(suite, style)));
      for (const box of EVENT_BOXES[style]) expect(used, `${style}: ${box}`).toContain(box);
    }
  });

  it("hangs every card in some theme", () => {
    const used = new Set(
      SUITE_IDS.flatMap((suite) => {
        const style = guestLook(suite)?.style;
        return style ? [eventBox(suite, style)] : [];
      }),
    );
    for (const box of ORNATE_BOXES) expect(used, box).toContain(box);
  });

  it("gives colour-card templates a card of their own too", () => {
    expect(ORNATE_BOXES).toContain(templateBox("marigold"));
    expect(templateBox("marigold")).toBe(templateBox("marigold"));
  });
});
