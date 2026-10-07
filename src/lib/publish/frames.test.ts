import { describe, expect, it } from "vitest";
import { newDraft } from "@/lib/editor/draft";
import { coupleLayouts, draftCouple, draftFrameSlots } from "./frames";

describe("design photo frames", () => {
  it("asks a two-frame Scene for the bride's photo and the groom's", () => {
    const draft = { ...newDraft(), suite: "gulmohar" as const, format: "scene" as const };
    expect(coupleLayouts(draft)).toEqual(["two"]);
    expect(draftCouple({ ...draft, couplePhotos: { layout: "one", ids: [] } }).layout).toBe("two");
    expect(draftFrameSlots(draft)).toEqual([null, null]);
  });

  it("keeps one photo for a one-frame Scene", () => {
    const draft = { ...newDraft(), suite: "udaipur-lake" as const, format: "scene" as const };
    expect(coupleLayouts(draft)).toEqual(["one"]);
  });
});
