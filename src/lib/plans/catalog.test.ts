import { describe, expect, it } from "vitest";
import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import {
  PLANS,
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
  it("cost the design, plus ₹500 for Celebration and ₹1,500 for Grand", () => {
    expect(formatRupees(packagePrice("basic", "premium"))).toBe("₹499");
    expect(formatRupees(packagePrice("celebration", "premium"))).toBe("₹999");
    expect(formatRupees(packagePrice("grand", "premium"))).toBe("₹1,999");
    expect(formatRupees(packagePrice("basic", "royal"))).toBe("₹599");
    expect(formatRupees(packagePrice("grand", "royal"))).toBe("₹2,099");
    expect(packagePrice("basic", "free")).toBe(0);
    expect(formatRupees(packagePrice("celebration", "free"))).toBe("₹500");
  });

  it("mark only free invites", () => {
    expect(PLANS.free.watermark).toBe(true);
    expect(PLANS.basic.watermark).toBe(false);
    expect(PLANS.celebration.video).toBe("one");
    expect(PLANS.grand.video).toBe("every");
  });

  it("allow 50 invites, 500 with Celebration and no limit with Grand", () => {
    expect(inviteLimit("free", DEFAULT_PRICING)).toBe(50);
    expect(inviteLimit("basic", DEFAULT_PRICING)).toBe(50);
    expect(inviteLimit("celebration", DEFAULT_PRICING)).toBe(500);
    expect(inviteLimit("grand", DEFAULT_PRICING)).toBeNull();
  });

  it("charge only the difference when moving up, and never for moving down", () => {
    const free = { plan: "free", tier: "free" } as const;
    const basic = { plan: "basic", tier: "premium" } as const;
    expect(upgradePricePaise(free, "basic", "premium")).toBe(49_900);
    expect(upgradePricePaise(free, "celebration", "free")).toBe(50_000);
    expect(upgradePricePaise(basic, "celebration", "premium")).toBe(50_000);
    expect(upgradePricePaise(basic, "grand", "royal")).toBe(1_60_000);
    expect(upgradePricePaise({ plan: "grand", tier: "royal" }, "basic", "premium")).toBeNull();
  });

  it("have nothing to buy for Basic on a free design, or a package already covering the design", () => {
    const free = { plan: "free", tier: "free" } as const;
    expect(upgradePricePaise(free, "basic", "free")).toBeNull();
    expect(upgradePricePaise({ plan: "basic", tier: "royal" }, "basic", "premium")).toBeNull();
  });

  it("charge the design's difference when a paid invite moves to a dearer design", () => {
    expect(upgradePricePaise({ plan: "basic", tier: "premium" }, "basic", "royal")).toBe(10_000);
  });

  it("ask a paid design for its package, and a second language for Celebration", () => {
    const draft = newDraft();
    const free = { plan: "free", tier: "free" } as const;
    expect(planShortfalls(draft, free, "free")).toEqual([]);
    expect(planShortfalls(draft, free, "premium")).toEqual([{ limit: "design", used: 1 }]);
    expect(planNeeded(draft, "free")).toBe("free");
    expect(planNeeded(draft, "royal")).toBe("basic");
    const two = bilingual();
    expect(planShortfalls(two, { plan: "basic", tier: "premium" }, "premium")).toEqual([
      { limit: "languages", used: 2 },
    ]);
    expect(planNeeded(two, "premium")).toBe("celebration");
  });

  it("put the host's own song in Celebration", () => {
    const draft = newDraft();
    draft.music = {
      ...draft.music,
      clip: { id: "c1", name: "Song", type: "audio/mp4", seconds: 30 },
    } as InviteDraft["music"];
    expect(planShortfalls(draft, { plan: "basic", tier: "free" }, "free")).toEqual([
      { limit: "ownSong", used: 1 },
    ]);
    expect(planNeeded(draft, "free")).toBe("celebration");
  });
});
