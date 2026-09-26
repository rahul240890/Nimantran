import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { RAGAS } from "@/lib/engine/music";
import { TEMPLATE_LIST, TEMPLATES } from "./catalog";
import { contentSchema, initialOf, sampleContent, slotsOf, toCardCopy } from "./content";
import { isTemplateId, SLOT_RULES, TEMPLATE_IDS, templateSchema } from "./schema";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
const root = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
const values = Object.fromEntries(
  [...root.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((match) => [match[1]!, match[2]!]),
);
const defined = new Set([...css.matchAll(/--([\w-]+):/g)].map((match) => match[1]));

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

it("has the six launch templates and the six Rang designs, in order", () => {
  expect(TEMPLATE_LIST.map((template) => template.name)).toEqual([
    "Marigold Gate",
    "Rose Garden",
    "Emerald Palace",
    "Royal Scroll",
    "Minimal Monogram",
    "Kerala Kasavu",
    "Rang Mahal",
    "Paithani Mor",
    "Bandhani Utsav",
    "Alpona Lal",
    "Gopuram Pon",
    "Phulkari Rang",
  ]);
  expect(Object.keys(TEMPLATES)).toEqual([...TEMPLATE_IDS]);
});

describe.each(TEMPLATE_IDS)("the %s template", (id) => {
  const template = TEMPLATES[id];

  it("matches the schema", () => {
    expect(templateSchema.parse(template)).toEqual(template);
    expect(template.id).toBe(id);
  });

  it("uses only design tokens that exist", () => {
    for (const token of [...Object.values(template.colours), ...template.scene.petals.colours]) {
      expect(defined, `--${token}`).toContain(token);
    }
  });

  it("keeps every line of lettering readable on its paper (AA)", () => {
    const paper = values[template.colours.paper]!;
    for (const role of ["ink", "inkMuted", "goldText", "accentText"] as const) {
      const ink = values[template.colours[role]]!;
      expect(contrast(ink, paper), role).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("plays a raga the composer knows", () => {
    expect(RAGAS[template.music.raga]).toBeDefined();
  });

  it("accepts its own sample wording", () => {
    const samples = sampleContent(template);
    const content = Object.fromEntries(slotsOf(template).map((slot) => [slot, samples[slot]]));
    expect(contentSchema(template).safeParse(content).success).toBe(true);
  });
});

it("gives every template its own ornaments and music", () => {
  const motifs = new Set(TEMPLATE_LIST.map((template) => template.scene.motif));
  const ragas = new Set(TEMPLATE_LIST.map((template) => template.music.raga));
  expect(motifs.size).toBe(TEMPLATE_LIST.length);
  expect(ragas.size).toBe(TEMPLATE_LIST.length);
});

describe("template content", () => {
  const monogram = TEMPLATES.monogram;

  it("fills slots from the host's wording, falling back to the samples", () => {
    const copy = toCardCopy(TEMPLATES.scroll, { first: "  Kiran ", venue: "Jaipur" });
    expect(copy.first).toBe("Kiran");
    expect(copy.second).toBe("Ananya");
    expect(copy.joiner).toBe("weds");
    expect(copy.venue).toBe("Jaipur");
  });

  it("leaves out slots a template doesn't use", () => {
    const copy = toCardCopy(monogram, { blessing: "Om", doorLeft: "Hello" });
    expect(copy.blessing).toBe("");
    expect(copy.doors).toEqual(["", ""]);
  });

  it("lets a host clear an optional slot", () => {
    expect(toCardCopy(TEMPLATES.scroll, { blessing: "" }).blessing).toBe("");
  });

  it("validates the names, date and venue, and each slot's length", () => {
    const schema = contentSchema(TEMPLATES.marigold);
    const result = schema.safeParse({
      first: " ",
      second: "Meera",
      date: "12 December",
      venue: "x".repeat(SLOT_RULES.venue.maxLength + 1),
    });
    expect(result.success).toBe(false);
    const issues = result.error!.issues.map((issue) => [issue.path[0], issue.message]);
    expect(issues).toContainEqual(["first", "required"]);
    expect(issues).toContainEqual(["venue", "too-long"]);
  });

  it("drops slots the template doesn't have", () => {
    const parsed = contentSchema(monogram).parse({
      first: "Dev",
      second: "Tara",
      date: "6 March",
      venue: "Mumbai",
      blessing: "Om",
    });
    expect(parsed).not.toHaveProperty("blessing");
  });

  it("takes a name's first whole letter", () => {
    expect(initialOf(" meera")).toBe("M");
    expect(initialOf("मीरा")).toBe("मी");
    expect(initialOf("")).toBe("");
  });

  it("recognises template ids", () => {
    expect(isTemplateId("kasavu")).toBe(true);
    expect(isTemplateId("toString")).toBe(false);
    expect(isTemplateId(undefined)).toBe(false);
  });
});
