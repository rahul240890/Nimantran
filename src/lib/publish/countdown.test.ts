import { describe, expect, it } from "vitest";
import { CARD_COUNTDOWN_WORDS, daysAway } from "@/lib/templates/story-words";
import { remaining, startsAt } from "./countdown";

describe("the doorway's countdown", () => {
  it("counts to the main event's start in India", () => {
    expect(startsAt("2026-10-15", "09:47")).toBe(Date.parse("2026-10-15T04:17:00Z"));
    // Without a time, from the start of the day
    expect(startsAt("2026-10-15")).toBe(Date.parse("2026-10-14T18:30:00Z"));
    expect(startsAt("")).toBeNull();
    expect(startsAt("15 October")).toBeNull();
  });

  it("splits what is left into days, hours, minutes and seconds", () => {
    const at = Date.parse("2026-10-15T04:17:00Z");
    expect(remaining(at, Date.parse("2026-10-10T03:30:00Z"))).toEqual({
      days: 5,
      hours: 0,
      minutes: 47,
      seconds: 0,
    });
    expect(remaining(at, at)).toBeNull();
    expect(remaining(at, at + 1000)).toBeNull();
  });

  it("says how far away each event is in the card's language", () => {
    expect(daysAway(5, CARD_COUNTDOWN_WORDS.en)).toBe("In 5 days");
    expect(daysAway(1, CARD_COUNTDOWN_WORDS.gu)).toBe("આવતીકાલે");
    expect(daysAway(0, CARD_COUNTDOWN_WORDS.hi)).toBe("आज");
    expect(daysAway(-1, CARD_COUNTDOWN_WORDS.en)).toBe("");
    for (const words of Object.values(CARD_COUNTDOWN_WORDS)) {
      expect(words.inDays(3)).toContain("3");
    }
  });
});
