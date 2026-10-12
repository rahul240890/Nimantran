import { describe, expect, it } from "vitest";
import { newDraft } from "@/lib/editor/draft";
import { scenePage } from "@/lib/suites/scene";
import { coupleLayouts, draftCouple, draftFrames, draftFrameSlots } from "./frames";

describe("design photo frames", () => {
  it("offers a two-frame Scene one photo each, or one of the couple", () => {
    const draft = { ...newDraft(), suite: "gulmohar" as const, format: "scene" as const };
    expect(coupleLayouts(draft)).toEqual(["one", "two"]);
    // It starts with one each, as it always has
    expect(draftFrameSlots(draft)).toEqual([null, null]);
    expect(draftCouple({ ...draft, couplePhotos: { layout: "one", ids: [] } }).layout).toBe("one");
  });

  it("shows one photo on a two-frame Scene through both frames", () => {
    const draft = {
      ...newDraft(),
      suite: "gulmohar" as const,
      format: "scene" as const,
      photos: [{ id: "a", width: 3, height: 4 }],
      couplePhotos: { layout: "two" as const, ids: ["a", ""], strict: true },
    };
    const [spot, ...rest] = draftFrames(draft);
    expect(rest).toEqual([]);
    const [first, second] = scenePage("gulmohar", 1)!.frames;
    // The one photo's box reaches over both frames
    expect(spot!.box![0]).toBeLessThan(Math.min(first![0], second![0]));
    expect(spot!.box![0] + spot!.box![2]).toBeGreaterThan(
      Math.max(first![0] + first![2], second![0] + second![2]),
    );
  });

  it("starts a two-photo card with both frames, even on a one-name occasion", () => {
    const draft = {
      ...newDraft(),
      categoryId: "birthday" as const,
      suite: "judwa-taare" as const,
      format: "scene" as const,
    };
    expect(coupleLayouts(draft)).toEqual(["one", "two"]);
    expect(draftFrameSlots(draft)).toEqual([null, null]);
  });

  it("keeps one photo for a one-frame Scene", () => {
    const draft = { ...newDraft(), suite: "udaipur-lake" as const, format: "scene" as const };
    expect(coupleLayouts(draft)).toEqual(["one"]);
  });

  it("asks an illustrated card for no photos, its couple being painted", () => {
    const draft = { ...newDraft(), suite: "mor-kamal" as const, format: "scene" as const };
    expect(coupleLayouts(draft)).toEqual(["none"]);
    expect(draftCouple({ ...draft, couplePhotos: { layout: "two", ids: [] } }).layout).toBe("none");
    expect(draftFrameSlots(draft)).toEqual([]);
  });
});
