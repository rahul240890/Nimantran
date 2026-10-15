import { describe, expect, it } from "vitest";
import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import {
  FREE_EDITION,
  PLANS,
  editionAfter,
  editionFor,
  formatRupees,
  inviteLimit,
  packagePrice,
  planNeeded,
  planShortfalls,
  upgradePricePaise,
} from "./catalog";
import { DEFAULT_PRICING } from "./design-tiers";

const bilingual = (): InviteDraft => ({ ...newDraft(), languages: ["en", "hi"] });

describe("packages", () => {
  it("cost the design, plus ₹400 for Celebration and ₹600 for Grand", () => {
    expect(formatRupees(packagePrice("basic", "premium"))).toBe("₹499");
    expect(formatRupees(packagePrice("celebration", "premium"))).toBe("₹899");
    expect(formatRupees(packagePrice("grand", "premium"))).toBe("₹1,099");
    expect(formatRupees(packagePrice("basic", "royal"))).toBe("₹799");
    expect(formatRupees(packagePrice("grand", "royal"))).toBe("₹1,399");
    expect(packagePrice("basic", "free")).toBe(0);
    expect(formatRupees(packagePrice("celebration", "free"))).toBe("₹400");
  });

  it("mark only free invites", () => {
    expect(PLANS.free.watermark).toBe(true);
    expect(PLANS.basic.watermark).toBe(false);
    expect(PLANS.celebration.video).toBe("one");
    expect(PLANS.grand.video).toBe("every");
  });

  it("allow 100 invites, 500 with Celebration and no limit with Grand", () => {
    expect(inviteLimit("free", DEFAULT_PRICING)).toBe(100);
    expect(inviteLimit("basic", DEFAULT_PRICING)).toBe(100);
    expect(inviteLimit("celebration", DEFAULT_PRICING)).toBe(500);
    expect(inviteLimit("grand", DEFAULT_PRICING)).toBeNull();
  });

  it("charge only the difference when moving up, and never for moving down", () => {
    const free = { plan: "free", tier: "free", design: null } as const;
    const basic = { plan: "basic", tier: "premium", design: null } as const;
    expect(upgradePricePaise(free, "basic", "premium")).toBe(49_900);
    expect(upgradePricePaise(free, "celebration", "free")).toBe(40_000);
    expect(upgradePricePaise(basic, "celebration", "premium")).toBe(40_000);
    expect(upgradePricePaise(basic, "grand", "royal")).toBe(90_000);
    expect(
      upgradePricePaise({ plan: "grand", tier: "royal", design: null }, "basic", "premium"),
    ).toBeNull();
  });

  it("have nothing to buy for Basic on a free design, or a package already covering the design", () => {
    const free = { plan: "free", tier: "free", design: null } as const;
    expect(upgradePricePaise(free, "basic", "free")).toBeNull();
    expect(
      upgradePricePaise({ plan: "basic", tier: "royal", design: null }, "basic", "premium"),
    ).toBeNull();
  });

  it("charge the design's difference when a paid invite moves to a dearer design", () => {
    expect(
      upgradePricePaise({ plan: "basic", tier: "premium", design: null }, "basic", "royal"),
    ).toBe(30_000);
  });

  it("ask a paid design for its package, and a second language for Celebration", () => {
    const draft = newDraft();
    const free = { plan: "free", tier: "free", design: null } as const;
    expect(planShortfalls(draft, free, "free")).toEqual([]);
    expect(planShortfalls(draft, free, "premium")).toEqual([{ limit: "design", used: 1 }]);
    expect(planNeeded(draft, "free")).toBe("free");
    expect(planNeeded(draft, "royal")).toBe("basic");
    const two = bilingual();
    expect(
      planShortfalls(two, { plan: "basic", tier: "premium", design: null }, "premium"),
    ).toEqual([{ limit: "languages", used: 2 }]);
    expect(planNeeded(two, "premium")).toBe("celebration");
  });

  it("let every package play the host's own song", () => {
    const draft = newDraft();
    draft.music = {
      ...draft.music,
      clip: { id: "c1", name: "Song", type: "audio/mp4", seconds: 30 },
    } as InviteDraft["music"];
    expect(planShortfalls(draft, { plan: "free", tier: "free", design: null }, "free")).toEqual([]);
    expect(planNeeded(draft, "free")).toBe("free");
  });
});

describe("one payment, one design", () => {
  const kayal = { plan: "basic", tier: "premium", design: "kayal-scene" } as const;

  it("covers the design it was bought for, and nothing on another", () => {
    expect(editionFor(kayal, "kayal-scene")).toBe(kayal);
    expect(editionFor(kayal, "noor-bagh-scene")).toEqual(FREE_EDITION);
    // A free invite and an admin's gift (no design) are the same on every design
    expect(editionFor(FREE_EDITION, "noor-bagh")).toBe(FREE_EDITION);
    const gift = { plan: "grand", tier: "royal", design: null } as const;
    expect(editionFor(gift, "noor-bagh")).toBe(gift);
  });

  it("asks a new design for its own package, at its full price", () => {
    const draft = newDraft();
    const other = editionFor(kayal, "noor-bagh-scene");
    expect(planShortfalls(draft, other, "premium")).toEqual([{ limit: "design", used: 1 }]);
    expect(upgradePricePaise(other, "basic", "premium")).toBe(49_900);
    expect(upgradePricePaise(other, "celebration", "premium")).toBe(89_900);
  });

  it("still upgrades the same design for the difference", () => {
    const same = editionFor(kayal, "kayal-scene");
    expect(planShortfalls(newDraft(), same, "premium")).toEqual([]);
    expect(upgradePricePaise(same, "celebration", "premium")).toBe(40_000);
    expect(upgradePricePaise(same, "basic", "premium")).toBeNull();
  });

  it("records the design a purchase is for", () => {
    expect(editionAfter(FREE_EDITION, "basic", "royal", "rajwada-bagh")).toEqual({
      plan: "basic",
      tier: "royal",
      design: "rajwada-bagh",
    });
    expect(editionAfter(kayal, "grand", "premium")).toEqual({
      plan: "grand",
      tier: "premium",
      design: "kayal-scene",
    });
  });
});
