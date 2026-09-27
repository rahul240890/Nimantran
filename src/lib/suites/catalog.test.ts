import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FUNCTION_IDS } from "@/lib/events/functions";
import { TEMPLATE_IDS } from "@/lib/templates/ids";
import { TRADITION_IDS } from "@/lib/traditions/schema";
import { MOODS, PAGE_ARTS, SUITES, SUITE_IDS, pageLook, suiteFor, type PageArt } from "./catalog";
import { DEFAULT_AREA, textArea } from "./areas";

describe("event suites", () => {
  it("lets the host's own choice win", () => {
    expect(suiteFor({ suite: "kayal", tradition: "rajasthani", templateId: "marigold" })).toBe(
      "kayal",
    );
  });

  it("suggests a theme from the tradition, then the design", () => {
    expect(suiteFor({ suite: null, tradition: "rajasthani", templateId: "marigold" })).toBe(
      "shahi-savari",
    );
    expect(suiteFor({ suite: null, tradition: "gujarati", templateId: "marigold" })).toBe(
      "kutch-toran",
    );
    expect(suiteFor({ suite: null, tradition: "tamil", templateId: "marigold" })).toBe("kayal");
    expect(suiteFor({ suite: null, tradition: "bengali", templateId: "marigold" })).toBe("rajbari");
    expect(suiteFor({ suite: null, tradition: "marathi", templateId: "marigold" })).toBe(
      "peshwai-wada",
    );
    expect(suiteFor({ suite: null, tradition: null, templateId: "phulkari" })).toBe(
      "phulkari-haveli",
    );
    expect(suiteFor({ suite: null, tradition: null, templateId: "kasavu" })).toBe("kayal");
    expect(suiteFor({ suite: null, tradition: null, templateId: "marigold" })).toBe("rajwada-bagh");
  });

  it("gives every tradition a theme and every page a painting and a light", () => {
    for (const tradition of TRADITION_IDS) {
      expect(SUITE_IDS).toContain(suiteFor({ suite: null, tradition, templateId: "marigold" }));
    }
    for (const kind of [...FUNCTION_IDS, "cover", "family", "reply"] as const) {
      const look = pageLook(kind);
      expect(PAGE_ARTS).toContain(look.art);
      expect(MOODS).toContain(look.mood);
    }
  });

  it("pairs each theme with a card design that exists", () => {
    for (const id of SUITE_IDS) {
      const pair = SUITES[id].template;
      if (pair) expect(TEMPLATE_IDS).toContain(pair);
    }
  });
});

describe("painted backgrounds", () => {
  it("point at files that exist under public", () => {
    for (const id of SUITE_IDS) {
      for (const src of Object.values(SUITES[id].images)) {
        expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
      }
    }
  });
});

describe("text areas", () => {
  it("give every painting a calm area tall and wide enough for its words", () => {
    for (const id of SUITE_IDS) {
      for (const art of Object.keys(SUITES[id].images) as PageArt[]) {
        const area = textArea(id, art);
        expect(area, `${id} ${art}`).not.toBe(DEFAULT_AREA);
        expect(100 - area.top - area.bottom, `${id} ${art}`).toBeGreaterThanOrEqual(24);
        expect(100 - area.left - area.right, `${id} ${art}`).toBeGreaterThanOrEqual(60);
      }
    }
  });
});
