import { describe, expect, it } from "vitest";
import { legalText } from "@/i18n/copy/legal";
import { LEGAL_UPDATED } from "./legal";

describe("privacy policy and terms", () => {
  it("have the same sections, in the same order, in every language", () => {
    for (const kind of ["privacy", "terms"] as const) {
      const ids = legalText.en[kind].sections.map((section) => section.id);
      expect(legalText.hi[kind].sections.map((section) => section.id)).toEqual(ids);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("carry a real date", () => {
    expect(LEGAL_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(new Date(LEGAL_UPDATED).getTime())).toBe(false);
  });
});
