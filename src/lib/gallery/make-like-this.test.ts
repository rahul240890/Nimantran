import { describe, expect, it } from "vitest";
import { newDraft } from "@/lib/editor/draft";
import { makeLikeThisHref } from "./make-like-this";

describe("make an invitation like this", () => {
  it("opens the same design's page, counted as coming from a guest", () => {
    const draft = { ...newDraft("marigold", "wedding"), suite: "rajwada-bagh" as const };
    expect(makeLikeThisHref(draft)).toBe("/create/rajwada-bagh?category=wedding&utm_source=guest");
  });

  it("keeps the occasion, and a plain card leads to its card design", () => {
    expect(makeLikeThisHref(newDraft("marigold", "birthday"))).toBe(
      "/create/gubbara?category=birthday&utm_source=guest",
    );
    const card = { ...newDraft("marigold", "wedding"), suite: "classic" as const };
    expect(makeLikeThisHref(card)).toBe("/create/card-marigold?category=wedding&utm_source=guest");
  });
});
