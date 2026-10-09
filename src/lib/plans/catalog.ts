import { cardLanguages, type InviteDraft } from "@/lib/editor/draft";
import {
  DEFAULT_PRICING,
  higherTier,
  tierPricePaise,
  tierRank,
  type DesignTier,
  type Pricing,
} from "./design-tiers";

/*
 * The three packages a host chooses from for one invite (docs/PRICING.md, section 2):
 * Basic is the design's own price, and Celebration and Grand add a fixed amount on top,
 * all set by the admin (Admin, Designs). "free" is an invite nobody has paid for: a free
 * design's Basic, with "Made with Shubh" in a corner. The server charges from these
 * prices, never from the browser.
 */

export const PLAN_IDS = ["free", "basic", "celebration", "grand"] as const;
export type PlanId = (typeof PLAN_IDS)[number];
export type PaidPlanId = Exclude<PlanId, "free">;

/** The packages, in the order the checkout shows them. */
export const PAID_PLAN_IDS = ["basic", "celebration", "grand"] as const satisfies PaidPlanId[];

/** How many videos for WhatsApp Status and Reels: none, one of the whole invite, or one per function too. */
export type VideoAllowance = "none" | "one" | "every";

export type Plan = {
  id: PlanId;
  /** A small "Made with Shubh" in the corner of the guest's pages. */
  watermark: boolean;
  /** Languages on the card. */
  languages: number;
  /** The host's own song instead of the design's raga. */
  ownSong: boolean;
  /** The story as an MP4 for WhatsApp Status and Reels (Step 17c). */
  video: VideoAllowance;
  /** Days the guest photo wall stays open after the last function (Step 24); 0 for none. */
  albumDays: number;
  /** Co-hosts besides the owner; null for no limit. */
  cohosts: number | null;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    watermark: true,
    languages: 1,
    ownSong: false,
    video: "none",
    albumDays: 0,
    cohosts: 1,
  },
  basic: {
    id: "basic",
    watermark: false,
    languages: 1,
    ownSong: false,
    video: "none",
    albumDays: 0,
    cohosts: 1,
  },
  celebration: {
    id: "celebration",
    watermark: false,
    languages: 2,
    ownSong: true,
    video: "one",
    albumDays: 30,
    cohosts: 3,
  },
  grand: {
    id: "grand",
    watermark: false,
    languages: 2,
    ownSong: true,
    video: "every",
    albumDays: 365,
    cohosts: null,
  },
};

export const cohostLimit = (plan: PlanId): number | null => PLANS[plan].cohosts;

/** Guests an invite can have by link (personal links and open-link replies); null for no limit. */
export function inviteLimit(plan: PlanId, pricing: Pick<Pricing, "invites">): number | null {
  if (plan === "grand") return null;
  return plan === "celebration" ? pricing.invites.celebration : pricing.invites.basic;
}

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (PLAN_IDS as readonly string[]).includes(value);
}

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return isPlanId(value) && value !== "free";
}

export const planRank = (id: PlanId) => PLAN_IDS.indexOf(id);

/**
 * What an invite has: its package, and the dearest design tier paid for. A free invite's
 * tier is "free"; Basic bought for a ₹499 design is { basic, premium }.
 */
export type Edition = { plan: PlanId; tier: DesignTier };

export const FREE_EDITION: Edition = { plan: "free", tier: "free" };

/** A package's price for a design of this tier: the design, plus what the package adds. */
export function packagePrice(
  plan: PaidPlanId,
  tier: DesignTier,
  pricing: Pick<Pricing, "designs" | "packages"> = DEFAULT_PRICING,
): number {
  return tierPricePaise(pricing, tier) + (plan === "basic" ? 0 : pricing.packages[plan]);
}

/** What an invite's edition is worth at today's prices: what moving up is counted against. */
export function editionValue(
  edition: Edition,
  pricing: Pick<Pricing, "designs" | "packages"> = DEFAULT_PRICING,
): number {
  return edition.plan === "free" ? 0 : packagePrice(edition.plan, edition.tier, pricing);
}

/** The edition an invite has after buying a package for its design; the tier never goes down. */
export const editionAfter = (current: Edition, plan: PaidPlanId, design: DesignTier): Edition => ({
  plan,
  tier: higherTier(current.tier, design),
});

/**
 * What buying a package costs an invite with this edition and design: the package's price
 * less what the invite already has, never less than ₹1. Null when there is nothing to buy:
 * a lower package, the same one already covering the design, or Basic on a free design.
 */
export function upgradePricePaise(
  current: Edition,
  plan: PaidPlanId,
  design: DesignTier,
  pricing: Pick<Pricing, "designs" | "packages"> = DEFAULT_PRICING,
): number | null {
  if (planRank(plan) < planRank(current.plan)) return null;
  const next = editionAfter(current, plan, design);
  const target = packagePrice(plan, next.tier, pricing);
  if (target === 0) return null;
  if (next.plan === current.plan && next.tier === current.tier) return null;
  return Math.max(100, target - editionValue(current, pricing));
}

/** "₹499", "₹1,999": whole rupees in Indian grouping, paise only when there are any. */
export function formatRupees(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Something an invite uses beyond its edition: its design, when it costs more than the
 * tier paid for (`used` is then the design's tier rank), a second card language, or the
 * host's own song.
 */
export type PlanNeed = { limit: "design" | "languages" | "ownSong"; used: number };

/** What an invite uses that its edition doesn't cover; empty when it fits. */
export function planShortfalls(
  draft: InviteDraft,
  edition: Edition,
  design: DesignTier = "free",
): PlanNeed[] {
  const plan = PLANS[edition.plan];
  const needs: PlanNeed[] = [];
  if (tierRank(design) > tierRank(edition.tier)) {
    needs.push({ limit: "design", used: tierRank(design) });
  }
  const languages = cardLanguages(draft).length;
  if (languages > plan.languages) needs.push({ limit: "languages", used: languages });
  if (draft.music.clip && !plan.ownSong) needs.push({ limit: "ownSong", used: 1 });
  return needs;
}

/**
 * The lowest package that covers what the invite uses, as the host has made it, for its
 * design. "free" when a free design needs nothing paid.
 */
export function planNeeded(draft: InviteDraft, design: DesignTier = "free"): PlanId {
  return (
    PLAN_IDS.find(
      (plan) =>
        (plan !== "free" || design === "free") &&
        planShortfalls(draft, { plan, tier: design }, design).length === 0,
    ) ?? "grand"
  );
}
