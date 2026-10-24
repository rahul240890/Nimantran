import { describe, expect, it } from "vitest";
import { designPageHref, editingHref, partHref } from "./design-page";
import { newDraft, type InviteDraft } from "./draft";

const written = (change: Partial<InviteDraft> = {}): InviteDraft => ({
  ...newDraft(),
  suite: "kayal",
  step: "couple",
  updatedAt: 1,
  ...change,
});

describe("the design's page for a draft", () => {
  it("names the draft's design and occasion", () => {
    expect(designPageHref(written())).toBe("/create/kayal?category=wedding");
  });

  it("names a tradition and an invite in the account, so that invite opens there", () => {
    const draft = written({
      tradition: { ...newDraft().tradition, id: "tamil" },
      remoteId: "0b9d2c3e-1a2b-4c5d-8e9f-0a1b2c3d4e5f",
    });
    expect(designPageHref(draft)).toBe(
      "/create/kayal?category=wedding&tradition=tamil&invite=0b9d2c3e-1a2b-4c5d-8e9f-0a1b2c3d4e5f",
    );
  });

  it("is a card's own page for a card, and a Scene's for a Scene", () => {
    expect(designPageHref(written({ suite: "classic", templateId: "kasavu" }))).toBe(
      "/create/card-kasavu?category=wedding",
    );
    expect(designPageHref(written({ suite: "udaipur-lake", format: "scene" }))).toBe(
      "/create/udaipur-lake-scene?category=wedding",
    );
  });
});

describe("where the editor sends a draft that isn't on its preview", () => {
  it("sends a written draft to its design's page", () => {
    expect(editingHref(written(), "en")).toBe("/create/kayal?category=wedding");
  });

  it("sends a new invite to the gallery, and one picking a design to its occasion's", () => {
    expect(editingHref(newDraft(), "en")).toBe("/invitations");
    expect(editingHref(newDraft(), "hi")).toBe("/hi/invitations");
    expect(
      editingHref({ ...newDraft("marigold", "roka"), step: "design", updatedAt: 1 }, "en"),
    ).toBe("/invitations/roka");
  });
});

describe("the preview's Edit for a part", () => {
  it("opens that part on the design's page", () => {
    expect(partHref(written(), "family", "en")).toBe("/create/kayal?category=wedding#part-family");
    expect(partHref(written(), "functions", "en")).toBe("/create/kayal?category=wedding#part-when");
  });

  it("takes another occasion to the gallery", () => {
    expect(partHref(written(), "occasion", "en")).toBe("/invitations");
  });
});
