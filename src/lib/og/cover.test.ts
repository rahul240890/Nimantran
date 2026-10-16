import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { coverPath } = await import("./cover");

describe("the cover's address", () => {
  it("carries a version that changes with every save", () => {
    const first = coverPath("aarav-weds-meera", "2026-10-16T10:00:00.000Z");
    const later = coverPath("aarav-weds-meera", "2026-10-16T10:05:00.000Z");
    expect(first).toMatch(/^\/i\/aarav-weds-meera\/cover\?v=[0-9a-z]+$/);
    expect(later).not.toBe(first);
    expect(coverPath("aarav-weds-meera", "2026-10-16T10:00:00.000Z")).toBe(first);
  });
});
