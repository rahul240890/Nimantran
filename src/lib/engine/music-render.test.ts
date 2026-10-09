import { describe, expect, it } from "vitest";
import { ragaScore } from "./music-render";

describe("raga score", () => {
  it("writes out the drone and melody for exactly the video's length", () => {
    const score = ragaScore({ raga: "yaman" }, 40);
    expect(score.some((strike) => strike.voice === "tanpura")).toBe(true);
    // Yaman is played on the bansuri
    expect(score.some((strike) => strike.voice === "bansuri")).toBe(true);
    expect(Math.max(...score.map((strike) => strike.at))).toBeLessThan(40);
    expect(Math.min(...score.map((strike) => strike.at))).toBeGreaterThanOrEqual(0);
  });

  it("plays the same every time, so a video can be made again", () => {
    expect(ragaScore({ raga: "bihag" }, 30)).toEqual(ragaScore({ raga: "bihag" }, 30));
  });

  it("follows the tempo", () => {
    const slow = ragaScore({ raga: "yaman", tempo: 50 }, 30).filter((s) => s.voice === "tanpura");
    const fast = ragaScore({ raga: "yaman", tempo: 90 }, 30).filter((s) => s.voice === "tanpura");
    expect(fast.length).toBeGreaterThan(slow.length);
  });
});
