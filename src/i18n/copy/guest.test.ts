import { describe, expect, it } from "vitest";
import { CARD_LANGUAGES, formatCardDayMonth } from "@/lib/templates/card-languages";
import { guestText } from "./guest";

/** Every plain string in a copy tree, with its path. */
function strings(tree: unknown, path = ""): [string, string][] {
  if (typeof tree === "string") return [[path, tree]];
  if (tree && typeof tree === "object") {
    return Object.entries(tree).flatMap(([key, value]) => strings(value, `${path}.${key}`));
  }
  return [];
}

describe("guestText", () => {
  const english = new Map(strings(guestText.en));

  it.each(CARD_LANGUAGES.filter((language) => language !== "en"))(
    "has %s words for everything a guest reads, none left in English",
    (language) => {
      const own = strings(guestText[language]);
      expect(own.map(([path]) => path)).toEqual([...english.keys()]);
      const untranslated = own.filter(([path, text]) => text === english.get(path));
      expect(untranslated).toEqual([]);
    },
  );

  it("counts and dates in the card's language", () => {
    expect(guestText.gu.rsvpCopy.people(3)).toBe("3 વ્યક્તિ");
    expect(guestText.ta.wallCopy.count(2)).toBe("2 புகைப்படங்கள்");
    expect(formatCardDayMonth("2026-12-12", "en")).toBe("Sat, 12 Dec");
    expect(formatCardDayMonth("2026-12-12", "mr")).toBe("शनिवार, 12 डिसेंबर");
  });
});
