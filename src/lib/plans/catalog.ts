import { frameCount } from "@/lib/editor/couple-photos";
import { cardLanguages, includedFunctions, type InviteDraft } from "@/lib/editor/draft";

/*
 * The editions a host can buy for one invite (docs/PRICING.md, section 2). Prices are in
 * paise and include GST; the server charges from this table, never from the browser.
 * Family Plus and the business plans come with Steps 16a and 26.
 */

export const PLAN_IDS = ["free", "premium", "royal", "bundle"] as const;
export type PlanId = (typeof PLAN_IDS)[number];
export type PaidPlanId = Exclude<PlanId, "free">;

export const PAID_PLAN_IDS = ["premium", "royal", "bundle"] as const satisfies PaidPlanId[];

export type PlanLimits = {
  /** Functions on one invite (haldi, wedding, reception…). */
  functions: number;
  /** Photos on one invite. */
  photos: number;
  /** Languages on the card. */
  languages: number;
  /** Frames on the couple photo page. */
  couplePhotos: number;
  /** Guests with RSVP; shown on the plan, enforced with the guest list later. */
  guests: number;
};

/** Names and selling points are copy, in each site language (src/content/editions.ts). */
export type Plan = {
  id: PlanId;
  pricePaise: number;
  /** "Made with Shubh" across the guest's pages. */
  watermark: boolean;
  /** The story as an MP4 for WhatsApp Status and Reels (Step 17c). */
  video: boolean;
  /** Days the guest photo wall stays open after the last function (Step 24); 0 for none. */
  albumDays: number;
  limits: PlanLimits;
};

const UNLIMITED = Number.POSITIVE_INFINITY;

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    albumDays: 0,
    pricePaise: 0,
    watermark: true,
    video: false,
    limits: { functions: 1, photos: 3, languages: 1, couplePhotos: 1, guests: 50 },
  },
  premium: {
    id: "premium",
    albumDays: 30,
    pricePaise: 49_900,
    watermark: false,
    video: true,
    limits: { functions: 3, photos: 20, languages: 2, couplePhotos: 1, guests: 500 },
  },
  royal: {
    id: "royal",
    albumDays: 365,
    pricePaise: 1_99_900,
    watermark: false,
    video: true,
    limits: {
      functions: UNLIMITED,
      photos: UNLIMITED,
      languages: 2,
      couplePhotos: 2,
      guests: UNLIMITED,
    },
  },
  bundle: {
    id: "bundle",
    albumDays: UNLIMITED,
    pricePaise: 2_99_900,
    watermark: false,
    video: true,
    limits: {
      functions: UNLIMITED,
      photos: UNLIMITED,
      languages: 2,
      couplePhotos: 2,
      guests: UNLIMITED,
    },
  },
};

/**
 * Co-hosts each edition includes (docs/PRICING.md); null for no limit. Kept apart from
 * PlanLimits because the database counts them (cohost_limit()), not the invite's draft.
 */
const COHOSTS: Record<PlanId, number | null> = { free: 1, premium: 3, royal: null, bundle: null };

export const cohostLimit = (plan: PlanId): number | null => COHOSTS[plan];

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (PLAN_IDS as readonly string[]).includes(value);
}

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return isPlanId(value) && value !== "free";
}

export const planRank = (id: PlanId) => PLAN_IDS.indexOf(id);

/** Each paid edition's price in paise; the admin can change them (Admin, Designs). */
export type EditionPrices = Record<PaidPlanId, number>;

const LIST_PRICES: EditionPrices = {
  premium: PLANS.premium.pricePaise,
  royal: PLANS.royal.pricePaise,
  bundle: PLANS.bundle.pricePaise,
};

/** An edition's price today: nothing for Free, else the admin's price or the list price. */
export const editionPrice = (id: PlanId, prices: EditionPrices = LIST_PRICES): number =>
  id === "free" ? 0 : prices[id];

/** What moving from one edition to a higher one costs: the difference, never less than ₹1. */
export function upgradePricePaise(
  from: PlanId,
  to: PaidPlanId,
  prices: EditionPrices = LIST_PRICES,
): number | null {
  if (planRank(to) <= planRank(from)) return null;
  return Math.max(100, editionPrice(to, prices) - editionPrice(from, prices));
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
 * Something an invite uses beyond its edition: a limit and how much of it is used, or its
 * design, which asks for an edition of its own (`used` is then that edition's rank).
 */
export type PlanNeed = { limit: keyof PlanLimits | "design"; used: number };

/**
 * What an invite uses that the edition doesn't cover; empty when it fits. `design` is the
 * edition the invite's design asks for (src/lib/plans/design-tiers.ts).
 */
export function planShortfalls(
  draft: InviteDraft,
  plan: PlanId,
  design: PlanId = "free",
): PlanNeed[] {
  const limits = PLANS[plan].limits;
  const needsDesign: PlanNeed[] =
    planRank(plan) < planRank(design) ? [{ limit: "design", used: planRank(design) }] : [];
  const used: Pick<PlanLimits, "functions" | "photos" | "languages" | "couplePhotos"> = {
    functions: includedFunctions(draft).length,
    photos: draft.photos.length,
    languages: cardLanguages(draft).length,
    couplePhotos: draft.photos.length ? frameCount(draft.couplePhotos.layout) : 0,
  };
  return [
    ...needsDesign,
    ...(Object.keys(used) as (keyof typeof used)[]).flatMap((limit) =>
      used[limit] > limits[limit] ? [{ limit, used: used[limit] }] : [],
    ),
  ];
}

/** The lowest edition an invite fits in, as the host has made it, with its design's edition. */
export function planNeeded(draft: InviteDraft, design: PlanId = "free"): PlanId {
  return PLAN_IDS.find((id) => planShortfalls(draft, id, design).length === 0) ?? "royal";
}
