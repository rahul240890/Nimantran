import { describe, expect, it } from "vitest";
import {
  SCENE_FLY,
  SCENE_HOLD,
  SCENE_HOLD_MIN,
  SCENE_INTRO,
  sceneTimeline,
  shotsAt,
} from "./scene-timeline";
import {
  END_SECONDS,
  VIDEO_BEAT_MIN,
  VIDEO_LONGEST_SECONDS,
  VIDEO_MAX_SECONDS,
  VIDEO_MIN_SECONDS,
} from "./timeline";

describe("sceneTimeline", () => {
  it.each([0, 1, 2, 3, 5, 6, 8])("lasts 30 to 45 seconds with %i cards", (count) => {
    const { total, end } = sceneTimeline(count);
    expect(total).toBeGreaterThanOrEqual(VIDEO_MIN_SECONDS - 0.01);
    expect(total).toBeLessThanOrEqual(VIDEO_MAX_SECONDS + 0.01);
    expect(total - end).toBeCloseTo(END_SECONDS);
  });

  it.each([9, 10, 12])("grows towards a minute rather than rush %i cards", (count) => {
    const { total, shots } = sceneTimeline(count);
    expect(total).toBeGreaterThan(VIDEO_MAX_SECONDS);
    expect(total).toBeLessThanOrEqual(VIDEO_LONGEST_SECONDS + 0.01);
    shots.forEach((shot) => expect(shot.seconds).toBeGreaterThanOrEqual(SCENE_HOLD_MIN));
  });

  it("never runs past a minute, however many cards", () => {
    expect(sceneTimeline(20).total).toBeLessThanOrEqual(VIDEO_LONGEST_SECONDS + 0.01);
  });

  it("shows every card in order, back to back after the intro", () => {
    const { shots, end } = sceneTimeline(5);
    expect(shots.map((shot) => shot.item)).toEqual([0, 1, 2, 3, 4]);
    expect(shots[0]!.start).toBe(SCENE_INTRO);
    shots.slice(1).forEach((shot, i) => {
      expect(shot.start).toBeCloseTo(shots[i]!.start + shots[i]!.seconds, 2);
    });
    const last = shots.at(-1)!;
    expect(last.start + last.seconds).toBeCloseTo(end, 2);
  });

  it("brings each card in from a different side than the one before", () => {
    const { shots } = sceneTimeline(6);
    shots.slice(1).forEach((shot, i) => expect(shot.from).not.toBe(shots[i]!.from));
  });

  it("gives each card time to read when there are few", () => {
    const { shots } = sceneTimeline(5);
    shots.forEach((shot) => expect(shot.seconds).toBeGreaterThanOrEqual(SCENE_HOLD));
  });

  it("brings a short list round again rather than one card waiting long", () => {
    const { shots } = sceneTimeline(1);
    expect(shots.length).toBeGreaterThan(1);
    shots.forEach((shot) => expect(shot.item).toBe(0));
    shots.forEach((shot) => expect(shot.seconds).toBeLessThanOrEqual(8));
  });

  it("shortens each card for a long list, but never below a readable beat", () => {
    const { shots } = sceneTimeline(20);
    expect(shots).toHaveLength(20);
    shots.forEach((shot) => expect(shot.seconds).toBeGreaterThanOrEqual(VIDEO_BEAT_MIN));
  });
});

describe("shotsAt", () => {
  const timeline = sceneTimeline(3);
  const [first, second] = timeline.shots;

  it("shows no card before the first flies in", () => {
    expect(shotsAt(timeline, 0.5).current).toBeNull();
  });

  it("flies the next card in while the one before leaves", () => {
    const moment = shotsAt(timeline, second!.start + SCENE_FLY / 2);
    expect(moment.current).toBe(second);
    expect(moment.leaving).toBe(first);
    expect(moment.flight).toBeCloseTo(0.5);
  });

  it("holds a card once it has landed", () => {
    const moment = shotsAt(timeline, first!.start + SCENE_FLY + 0.1);
    expect(moment.current).toBe(first);
    expect(moment.leaving).toBeNull();
    expect(moment.flight).toBe(1);
  });
});
