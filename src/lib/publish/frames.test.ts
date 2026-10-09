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

  it("asks a two-photo card for both photos, even on a one-name occasion", () => {
    const draft = {
      ...newDraft(),
      categoryId: "birthday" as const,
      suite: "judwa-taare" as const,
      format: "scene" as const,
    };
    expect(coupleLayouts(draft)).toEqual(["two"]);
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
