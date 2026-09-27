import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FUNCTION_IDS } from "@/lib/events/functions";
import { TEMPLATE_IDS } from "@/lib/templates/ids";
import { TRADITION_IDS } from "@/lib/traditions/schema";
import { MOODS, PAGE_ARTS, SUITES, SUITE_IDS, pageLook, suiteFor } from "./catalog";

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
      "shahi-savari",
    );
    expect(suiteFor({ suite: null, tradition: "tamil", templateId: "marigold" })).toBe("kayal");
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
