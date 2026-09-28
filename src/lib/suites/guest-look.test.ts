import { describe, expect, it } from "vitest";
import { SUITES, SUITE_IDS } from "./catalog";
import {
  GUEST_STYLES,
  STYLE_LOOKS,
  guestLook,
  guestLookSchema,
  monogram,
  resolveGuestLook,
} from "./guest-look";

describe("guest page looks", () => {
  it("fills a theme's choice out from its style", () => {
    expect(resolveGuestLook({ style: "garden" })).toEqual(STYLE_LOOKS.garden);
    expect(resolveGuestLook({ style: "palace", frame: "polaroid" })).toEqual({
      ...STYLE_LOOKS.palace,
      frame: "polaroid",
    });
  });

  it("gives every style a complete look", () => {
    for (const style of GUEST_STYLES) {
      expect(guestLookSchema.parse(STYLE_LOOKS[style])).toEqual(STYLE_LOOKS[style]);
    }
  });

  it("checks what a theme stores, as the admin will save it", () => {
    expect(guestLookSchema.safeParse({ style: "party", lights: "bulbs" }).success).toBe(true);
    expect(guestLookSchema.safeParse({ style: "castle" }).success).toBe(false);
    expect(guestLookSchema.safeParse({ style: "party", lights: "neon" }).success).toBe(false);
    expect(guestLookSchema.safeParse({ style: "party", extra: 1 }).success).toBe(false);
  });

  it("switches on painted themes only", () => {
    expect(guestLook("rajwada-bagh")?.style).toBe("palace");
    expect(guestLook("kayal")?.style).toBe("garden");
    expect(guestLook("classic")).toBeNull();
    for (const id of SUITE_IDS) {
      const choice = SUITES[id].guest;
      if (!choice) continue;
      expect(guestLookSchema.safeParse(choice).success).toBe(true);
      expect(SUITES[id].images.cover).toBeTruthy();
    }
  });

  it("makes a monogram from the names", () => {
    expect(monogram("Arjun", "Sia")).toBe("A & S");
    expect(monogram(" riya ", "")).toBe("R");
    expect(monogram("", "")).toBe("");
  });
});
