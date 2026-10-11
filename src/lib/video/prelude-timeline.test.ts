import { describe, expect, it } from "vitest";
import { OPENING_STYLES } from "@/lib/opening/catalog";
import { PRELUDE_IDLE, PRELUDE_WELCOME, preludeTimeline } from "./prelude-timeline";
import { sceneTimeline } from "./scene-timeline";
import { CROSSFADE, VIDEO_LONGEST_SECONDS, videoTimeline } from "./timeline";
import type { StoryBeat } from "@/lib/engine/story";

describe("preludeTimeline", () => {
  it("holds closed, opens, welcomes, then hands over to the pages", () => {
    const gate = preludeTimeline("rajwada-pol")!;
    expect(gate.open).toBe(PRELUDE_IDLE);
    expect(gate.welcome).toBeGreaterThan(gate.open);
    expect(gate.pages - gate.welcome).toBeCloseTo(PRELUDE_WELCOME);
    expect(gate.total).toBeCloseTo(gate.pages + CROSSFADE);
  });

  it("opens a drawn opening sooner than a painted one", () => {
    expect(preludeTimeline("palace")!.welcome).toBeLessThan(preludeTimeline("pankhi")!.welcome);
  });

  it("has no opening without one, and one for every other style", () => {
    expect(preludeTimeline("none")).toBeNull();
    for (const style of OPENING_STYLES.filter((style) => style !== "none")) {
      expect(preludeTimeline(style)).not.toBeNull();
    }
  });
});

describe("the opening counts towards the minute", () => {
  const beat = (seconds: number, i: number) =>
    ({ id: `p${i}`, seconds, lines: [], scene: "cover" }) as unknown as StoryBeat;

  it("keeps a long story's video within a minute, opening included", () => {
    const lead = preludeTimeline("rajwada-pol")!.pages;
    const story = Array.from({ length: 14 }, (_, i) => beat(6, i));
    expect(lead + videoTimeline(story, { lead }).total).toBeLessThanOrEqual(
      VIDEO_LONGEST_SECONDS + 0.01,
    );
  });

  it("keeps a scene with many cards within a minute, opening included", () => {
    const lead = preludeTimeline("pankhi")!.pages;
    expect(lead + sceneTimeline(10, lead).total).toBeLessThanOrEqual(VIDEO_LONGEST_SECONDS + 0.01);
  });
});
