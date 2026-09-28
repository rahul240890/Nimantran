import { describe, expect, it } from "vitest";
import { formatCardTime } from "./card-languages";

describe("formatCardTime", () => {
  it("writes the time in the card's own language", () => {
    expect(formatCardTime("18:30", null, "hi")).toBe("शाम 6:30 बजे");
    expect(formatCardTime("10:00", null, "gu")).toBe("સવારે 10:00 વાગ્યે");
    expect(formatCardTime("13:15", null, "mr")).toBe("दुपारी 1:15 वाजता");
    expect(formatCardTime("21:00", null, "ta")).toBe("இரவு 9:00 மணிக்கு");
    expect(formatCardTime("19:00", null, "bn")).toBe("সন্ধ্যা 7:00");
    expect(formatCardTime("18:30", null, "en")).toBe("6:30 PM");
  });

  it("names the part of the day once when a window stays within it", () => {
    expect(formatCardTime("09:47", "10:31", "hi")).toBe("सुबह 9:47 से 10:31 तक");
    expect(formatCardTime("11:30", "12:15", "gu")).toBe("સવારે 11:30 થી બપોરે 12:15");
    expect(formatCardTime("00:05", "00:40", "hi")).toBe("रात 12:05 से 12:40 तक");
    expect(formatCardTime("09:47", "10:31", "en")).toBe("9:47 AM to 10:31 AM");
  });

  it("never prints Latin day parts on an Indian-language card", () => {
    for (const language of ["hi", "mr", "gu", "bn", "ta"] as const) {
      expect(formatCardTime("18:30", "20:00", language)).not.toMatch(/[AP]M/i);
    }
  });
});
