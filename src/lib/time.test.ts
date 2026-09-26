import { hi } from "date-fns/locale";
import { describe, expect, it } from "vitest";
import { formatTime, timeSlots, toMinutes } from "./time";

describe("timeSlots", () => {
  it("covers the whole day in 15-minute steps by default", () => {
    const slots = timeSlots();
    expect(slots).toHaveLength(96);
    expect(slots[0]).toBe("00:00");
    expect(slots.at(-1)).toBe("23:45");
  });

  it("respects a window and step", () => {
    expect(timeSlots(30, "18:00", "19:30")).toEqual(["18:00", "18:30", "19:00", "19:30"]);
  });

  it("rejects steps that don't divide a day", () => {
    expect(() => timeSlots(7)).toThrow();
    expect(() => timeSlots(0)).toThrow();
  });
});

describe("toMinutes", () => {
  it("parses HH:mm and rejects anything else", () => {
    expect(toMinutes("19:30")).toBe(1170);
    expect(() => toMinutes("7:30")).toThrow();
    expect(() => toMinutes("24:00")).toThrow();
  });
});

describe("formatTime", () => {
  it("formats in English (India) by default", () => {
    expect(formatTime("19:30")).toBe("7:30 PM");
    expect(formatTime("00:15")).toBe("12:15 AM");
  });

  it("formats in other languages", () => {
    expect(formatTime("19:30", hi)).toContain("7:30");
    expect(formatTime("19:30", hi)).not.toContain("PM");
  });
});
