import { describe, expect, it } from "vitest";
import { draftCopy, newDraft, withGalleryChoice } from "./draft";
import { parseDraft } from "./draft-checks";
import { FONTS, FONT_IDS, defaultType, fontsFor, pageType, usableFont } from "./type";

describe("lettering", () => {
  it("offers only fonts that write every one of the card's languages", () => {
    const gujarati = fontsFor(["gu"], "names");
    expect(gujarati).toContain("mogra");
    expect(gujarati).not.toContain("great-vibes");
    for (const id of gujarati) expect(FONTS[id].scripts).toContain("gujarati");
    // A Gujarati and English card needs both scripts in one face
    for (const id of fontsFor(["gu", "en"], "words")) {
      expect(FONTS[id].scripts).toEqual(expect.arrayContaining(["gujarati", "latin"]));
    }
    expect(fontsFor(["en"], "names").length).toBeGreaterThan(fontsFor(["ta"], "names").length);
  });

  it("gives every font a role and falls back when a language can't use it", () => {
    for (const id of FONT_IDS) expect(FONTS[id].family).not.toBe("");
    expect(usableFont("great-vibes", ["en"], "names")).toBe("great-vibes");
    expect(usableFont("great-vibes", ["hi"], "names")).toBeNull();
    expect(usableFont("marcellus", ["en"], "names")).toBeNull();
  });

  it("turns the host's choice into what the pages draw", () => {
    expect(pageType(defaultType, ["en"])).toEqual({
      names: undefined,
      words: undefined,
      scale: 1,
      bold: false,
      italic: false,
      capitals: false,
      colour: undefined,
    });
    const type = pageType(
      { ...defaultType, names: "mogra", size: "large", bold: true, colour: "maroon" },
      ["gu"],
    );
    expect(type.names).toMatch(/^"Mogra"/);
    expect(type.scale).toBeGreaterThan(1);
    expect(type.colour).toBe("var(--card-back)");
  });

  it("reads saved lettering leniently", () => {
    const saved = { ...newDraft(), type: { names: "no-such-font", size: "huge", bold: true } };
    expect(parseDraft(saved)?.type).toEqual({ ...defaultType, bold: true });
    const older: Record<string, unknown> = { ...newDraft() };
    delete older.type;
    expect(parseDraft(older)?.type).toEqual(defaultType);
  });
});

describe("a card's sample wording", () => {
  const gujarati = withGalleryChoice(newDraft(), {
    category: "wedding",
    tradition: "gujarati",
    suite: "shahi-savari",
    template: "bandhani",
  });

  it("previews in the card's own language before the host types", () => {
    const copy = draftCopy(gujarati);
    expect(copy.first).toBe("રાધા");
    expect(copy.second).toBe("અર્જુન");
    expect(copy.families).toBe("પટેલ પરિવાર અને શાહ પરિવાર");
    expect(copy.line).not.toMatch(/[a-z]/i);
    expect(copy.date).not.toMatch(/[a-z]/i);
  });

  it("keeps the host's own words and the English side in English", () => {
    const typed = { ...gujarati, content: { first: "Radha" } };
    expect(draftCopy(typed).first).toBe("Radha");
    const english = { ...gujarati, languages: ["gu", "en"] as const };
    expect(draftCopy({ ...english, languages: [...english.languages] }, "en").line).toMatch(
      /[a-z]/i,
    );
  });
});
