import { describe, expect, it } from "vitest";
import { beatSeconds, type StoryBeat, type StoryLine } from "@/lib/engine/story";
import {
  CROSSFADE,
  END_SECONDS,
  lineProgress,
  pagesAt,
  VIDEO_BEAT_MIN,
  VIDEO_MAX_SECONDS,
  VIDEO_MIN_SECONDS,
  videoTimeline,
} from "./timeline";

const lines = (count: number): StoryLine[] =>
  Array.from({ length: count }, (_, i) => ({ text: `Line number ${i}`, style: "body" }));

const beat = (id: string, count = 3): StoryBeat => ({
  id,
  scene: "cover",
  lines: lines(count),
  symbol: false,
  seconds: beatSeconds(lines(count)),
});

describe("video timeline", () => {
  it("stretches a short story to at least 30 seconds", () => {
    const timeline = videoTimeline([beat("cover"), beat("reply", 1)]);
    expect(timeline.total).toBeGreaterThanOrEqual(VIDEO_MIN_SECONDS - 0.01);
    expect(timeline.total - timeline.end).toBe(END_SECONDS);
  });

  it("squeezes a long wedding into 45 seconds, no page too fast to see", () => {
    const story = Array.from({ length: 12 }, (_, i) => beat(`page-${i}`, 6));
    const timeline = videoTimeline(story);
    expect(timeline.total).toBeLessThanOrEqual(VIDEO_MAX_SECONDS + 0.01);
    for (const entry of timeline.beats)
      expect(entry.seconds).toBeGreaterThanOrEqual(VIDEO_BEAT_MIN - 0.01);
    // Pages follow one another with no gaps
    timeline.beats.slice(1).forEach((entry, i) => {
      const before = timeline.beats[i]!;
      expect(entry.start).toBeCloseTo(before.start + before.seconds, 2);
    });
  });

  it("keeps a story that already fits as it is", () => {
    const story = [
      beat("a", 4),
      beat("b", 4),
      beat("c", 4),
      beat("d", 4),
      beat("e", 4),
      beat("f", 4),
    ];
    const timeline = videoTimeline(story);
    expect(timeline.beats.map((entry) => entry.seconds)).toEqual(story.map((b) => b.seconds));
  });

  it("brings lines in one after another", () => {
    const entry = videoTimeline([beat("cover")]).beats[0]!;
    expect(lineProgress(entry, 0, 0)).toBe(0);
    expect(lineProgress(entry, 0, 5)).toBe(1);
    expect(lineProgress(entry, 1, 0.9)).toBeLessThan(lineProgress(entry, 0, 0.9));
  });

  it("fades each page into the next, then into the closing card", () => {
    const timeline = videoTimeline([beat("a"), beat("b")]);
    const second = timeline.beats[1]!;
    expect(pagesAt(timeline, second.start + CROSSFADE / 2)).toMatchObject({
      current: 1,
      previous: 0,
    });
    expect(pagesAt(timeline, second.start + CROSSFADE + 0.1)).toMatchObject({
      current: 1,
      previous: null,
    });
    expect(pagesAt(timeline, timeline.end + 0.1)).toMatchObject({ current: "end", previous: 1 });
    expect(pagesAt(timeline, 0)).toMatchObject({ current: 0, previous: null, fade: 1 });
  });
});
