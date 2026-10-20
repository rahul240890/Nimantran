import { describe, expect, it } from "vitest";
import { UI_LOCALES } from "@/i18n/locales";
import { allDesigns, designById } from "@/lib/gallery/catalog";
import { storyFamily } from "@/lib/publish/story";
import { draftCopy, draftFaith } from "@/lib/editor/draft";
import { sampleFaith, sampleInvite } from "./invite";

const design = (id: string) => {
  const found = designById(id);
  if (!found) throw new Error(id);
  return found;
};

describe("a design's sample", () => {
  it("blesses in the faith of the weddings it's made for", () => {
    expect(sampleFaith(design("phulkari-haveli"))).toBe("sikh");
    expect(sampleFaith(design("noor-bagh"))).toBe("muslim");
    expect(sampleFaith(design("chapel"))).toBe("christian");
    expect(sampleFaith(design("rajwada-bagh"))).toBe("hindu");
    expect(sampleFaith(design("card-bandhani"))).toBe("hindu");
  });

  it("starts with that faith's own blessing and names, in either language", () => {
    const sikh = sampleInvite(design("phulkari-haveli"), "en").draft;
    expect(draftFaith(sikh)).toBe("sikh");
    expect(draftCopy(sikh).blessing).toBe("Ik Onkar Satgur Prasad");
    expect(sikh.content.first).toBe("Arjan");
    const nikah = sampleInvite(design("noor-bagh"), "hi").draft;
    expect(draftCopy(nikah).blessing).not.toMatch(/गणे/);
    expect(nikah.content.second).toBe("ज़ोया");
    const church = sampleInvite(design("chapel"), "en").draft;
    expect(draftCopy(church).blessing).not.toMatch(/Ganesh/);
    // A Hindu palace garden keeps Ganesha's blessing and the usual couple
    const palace = sampleInvite(design("rajwada-bagh"), "en").draft;
    expect(draftCopy(palace).blessing).toBe("With the blessings of Lord Ganesha");
    expect(palace.content.first).toBe("Arjun");
  });

  it("fills the family page of every design, in every language", () => {
    for (const locale of UI_LOCALES) {
      for (const one of allDesigns()) {
        const { draft } = sampleInvite(one, locale);
        // A party or a launch only says whom to call; everything else says more
        expect(storyFamily(draft).length, `${one.id} in ${locale}`).toBeGreaterThan(0);
      }
    }
  });

  it("gives a wedding both sides' parents, in its faith's and language's own words", () => {
    const palace = storyFamily(sampleInvite(design("rajwada-bagh"), "hi").draft);
    const sides = palace.filter((block) => block.parts);
    expect(sides).toHaveLength(2);
    expect(sides[0]!.text).toMatch(/^सुपुत्र /);
    expect(sides[1]!.text).toMatch(/^सुपुत्री /);
    const nikah = storyFamily(sampleInvite(design("noor-bagh"), "en").draft);
    expect(nikah.map((block) => block.text).join(" ")).toMatch(/Begum/);
    const tamil = storyFamily(sampleInvite(design("rajwada-bagh"), "ta").draft);
    expect(tamil.find((block) => block.id === "first")!.text).toMatch(/அன்பு மகன்$/);
  });

  it("varies the families from one wedding design to the next", () => {
    const parents = new Set(
      allDesigns()
        .filter((one) => sampleInvite(one, "en").category === "wedding")
        .map((one) => sampleInvite(one, "en").draft.family.first.parents),
    );
    expect(parents.size).toBeGreaterThan(3);
  });

  it("names a birthday child's parents, and keeps a festival to its hosts", () => {
    const sampleOf = (category: string) => {
      const found = allDesigns().find((one) => sampleInvite(one, "gu").category === category);
      if (!found) throw new Error(category);
      return storyFamily(sampleInvite(found, "gu").draft);
    };
    const birthday = sampleOf("birthday");
    expect(birthday.find((block) => block.id === "first")?.text).toMatch(/^સુપુત્રી /);
    expect(birthday.map((block) => block.id)).toContain("blessingsFrom");
    const diwali = sampleOf("diwali");
    expect(diwali.some((block) => block.parts)).toBe(false);
    expect(diwali.map((block) => block.id)).toEqual(
      expect.arrayContaining(["blessingsFrom", "requesters", "contacts"]),
    );
  });
});
