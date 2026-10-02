import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { StoryBeat } from "@/lib/engine/story";
import { SUITE_IDS, SUITES } from "./catalog";
import {
  VOICES,
  lettering,
  lineSpace,
  roleOf,
  ruleAt,
  scriptOfLang,
  voiceFaces,
} from "./lettering";

const fontsCss = readFileSync(
  join(process.cwd(), "src/components/invitation/type/fonts.css"),
  "utf8",
);
const page = (scene: StoryBeat["scene"], lines: StoryBeat["lines"]): StoryBeat => ({
  id: scene,
  scene,
  lines,
  symbol: false,
  seconds: 5,
});

describe("lettering on the event pages", () => {
  it("knows each card language's script", () => {
    expect(scriptOfLang("hi")).toBe("devanagari");
    expect(scriptOfLang("mr")).toBe("devanagari");
    expect(scriptOfLang("gu")).toBe("gujarati");
    expect(scriptOfLang("bn-IN")).toBe("bengali");
    expect(scriptOfLang("ta")).toBe("tamil");
    expect(scriptOfLang(undefined)).toBe("latin");
  });

  it("loads every face a voice uses, in the weights it uses", () => {
    const packages: Record<string, string> = {
      "Tiro Devanagari Hindi": "tiro-devanagari-hindi",
      "Baloo Bhai 2": "baloo-bhai-2",
      "Baloo Da 2": "baloo-da-2",
      "Rozha One": "rozha-one",
    };
    for (const voice of Object.values(VOICES)) {
      for (const role of Object.values(voice)) {
        for (const { family, weight } of Object.values(role)) {
          const name = packages[family] ?? family.toLowerCase().replaceAll(" ", "-");
          const loaded =
            fontsCss.includes(`@fontsource/${name}/${weight ?? 400}.css`) ||
            // The site's own display face is loaded for every page
            family === "Rozha One";
          expect(loaded, `${family} ${weight ?? 400}`).toBe(true);
        }
      }
    }
  });

  it("gives Gujarati, Bengali and Tamil their own faces", () => {
    expect(lettering("regal", "names", "gu").family).toContain("Rasa");
    expect(lettering("regal", "body", "bn").family).toContain("Tiro Bangla");
    expect(lettering("regal", "body", "ta").family).toContain("Tiro Tamil");
  });

  it("spaces capitals in Latin headings only, and sets Indian headings larger", () => {
    const latin = lettering("regal", "label", "en");
    const hindi = lettering("regal", "label", "hi");
    expect(latin).toMatchObject({ upper: true });
    expect(latin.tracking).toBeGreaterThan(0);
    expect(hindi).toMatchObject({ upper: false, tracking: 0 });
    expect(hindi.size).toBeGreaterThan(latin.size);
  });

  it("gives Indian scripts taller lines and Tamil a smaller size", () => {
    expect(lettering("regal", "body", "hi").leading).toBeGreaterThan(
      lettering("regal", "body", "en").leading,
    );
    expect(lettering("regal", "body", "ta").size).toBeLessThan(1);
  });

  it("gives every theme a voice whose faces load", () => {
    for (const id of SUITE_IDS) {
      expect(VOICES[SUITES[id].voice ?? "regal"]).toBeDefined();
      expect(voiceFaces(SUITES[id].voice ?? "regal", "gu").length).toBeGreaterThan(1);
    }
  });

  it("draws a function page's rule after its name and local name", () => {
    const sangeet = page("sangeet", [
      { text: "In 5 days", style: "label" },
      { text: "Sangeet", style: "display" },
      { text: "संगीत", style: "script", lang: "hi" },
      { text: "Thursday, 19 November 2026", style: "date" },
    ]);
    expect(ruleAt(sangeet)).toBe(3);
    expect(lineSpace(sangeet, 0, false)).toBe(0);
    // A heading stays close to what it heads
    expect(lineSpace(sangeet, 1, false)).toBeLessThan(lineSpace(sangeet, 3, false));
    expect(ruleAt(page("cover", [{ text: "Arjun", style: "display" }]))).toBe(-1);
  });

  it("sets the cover's names larger than any other line", () => {
    const cover = page("cover", [{ text: "Arjun", style: "display" }]);
    expect(roleOf(cover, "display")).toBe("names");
    expect(roleOf(page("reply", []), "display")).toBe("display");
  });
});
