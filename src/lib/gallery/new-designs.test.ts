import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { suitePreview } from "@/lib/suites/catalog";
import { PAINTED_SUITES } from "./catalog";
import { NEW_SUITES, pickNewSuites } from "./new-designs";

describe("new designs", () => {
  it("lists painted themes with a JPEG preview for emails", () => {
    expect(new Set(NEW_SUITES).size).toBe(NEW_SUITES.length);
    for (const suite of NEW_SUITES) {
      expect(PAINTED_SUITES).toContain(suite);
      const preview = suitePreview(suite);
      expect(preview && existsSync(join(process.cwd(), "public", preview))).toBe(true);
    }
  });

  it("picks the same few for one person and different ones for another", () => {
    expect(pickNewSuites("user-1", 6)).toEqual(pickNewSuites("user-1", 6));
    expect(new Set(pickNewSuites("user-1", 6)).size).toBe(6);
    expect(pickNewSuites("user-1", 6)).not.toEqual(pickNewSuites("user-2", 6));
  });
});
