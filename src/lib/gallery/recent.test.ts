import { describe, expect, it } from "vitest";
import { RECENT_KEPT, parseRecent, withRecent } from "./recent";

describe("recently viewed designs", () => {
  it("reads only design ids, each once", () => {
    expect(parseRecent(null)).toEqual([]);
    expect(parseRecent("not json")).toEqual([]);
    expect(parseRecent('{"a":1}')).toEqual([]);
    expect(parseRecent('["kayal", 3, "kayal", "saath"]')).toEqual(["kayal", "saath"]);
  });

  it("puts the latest first and keeps only a few", () => {
    expect(withRecent(["kayal", "saath"], "saath")).toEqual(["saath", "kayal"]);
    const many = Array.from({ length: 20 }, (_, index) => `design-${index}`);
    expect(withRecent(many, "kayal")).toHaveLength(RECENT_KEPT);
    expect(withRecent(many, "kayal")[0]).toBe("kayal");
  });
});
