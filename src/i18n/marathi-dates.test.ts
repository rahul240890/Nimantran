import { format, formatDistance } from "date-fns";
import { describe, expect, it } from "vitest";
import { mr } from "./marathi-dates";

describe("Marathi dates", () => {
  it("name the months and days in Marathi", () => {
    const day = new Date(2026, 10, 20);
    expect(format(day, "EEEE, d MMMM yyyy", { locale: mr })).toBe("शुक्रवार, 20 नोव्हेंबर 2026");
    expect(format(day, "d MMM", { locale: mr })).toBe("20 नोव्हें.");
  });

  it("say how long ago in Marathi", () => {
    const now = new Date(2026, 10, 20, 12);
    const before = new Date(2026, 10, 17, 12);
    expect(formatDistance(before, now, { addSuffix: true, locale: mr })).toBe("3 दिवस पूर्वी");
    expect(formatDistance(now, before, { addSuffix: true, locale: mr })).toBe("3 दिवस नंतर");
  });
});
