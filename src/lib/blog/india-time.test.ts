import { describe, expect, it } from "vitest";
import { fromIndiaLocal, indiaLocal } from "./india-time";

describe("India time for post dates", () => {
  it("reads and writes the box in India time", () => {
    expect(indiaLocal("2026-10-03T04:00:00.000Z")).toBe("2026-10-03T09:30");
    expect(fromIndiaLocal("2026-10-03T09:30").toISOString()).toBe("2026-10-03T04:00:00.000Z");
    expect(indiaLocal(fromIndiaLocal("2027-01-01T00:15").toISOString())).toBe("2027-01-01T00:15");
  });
});
