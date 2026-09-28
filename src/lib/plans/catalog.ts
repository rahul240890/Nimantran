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
  limits: PlanLimits;
};

const UNLIMITED = Number.POSITIVE_INFINITY;

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    pricePaise: 0,
    watermark: true,
    limits: { functions: 1, photos: 3, languages: 1, couplePhotos: 1, guests: 50 },
  },
  premium: {
    id: "premium",
    pricePaise: 49_900,
    watermark: false,
    limits: { functions: 3, photos: 20, languages: 2, couplePhotos: 1, guests: 500 },
  },
  royal: {
    id: "royal",
    pricePaise: 1_99_900,
    watermark: false,
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
    pricePaise: 2_99_900,
    watermark: false,
    limits: {
      functions: UNLIMITED,
      photos: UNLIMITED,
      languages: 2,
      couplePhotos: 2,
      guests: UNLIMITED,
    },
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (PLAN_IDS as readonly string[]).includes(value);
}

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return isPlanId(value) && value !== "free";
}

export const planRank = (id: PlanId) => PLAN_IDS.indexOf(id);

/** What moving from one edition to a higher one costs: the difference, never less than ₹1. */
export function upgradePricePaise(from: PlanId, to: PaidPlanId): number | null {
  if (planRank(to) <= planRank(from)) return null;
  return Math.max(100, PLANS[to].pricePaise - PLANS[from].pricePaise);
}

/** "₹499", "₹1,999": whole rupees in Indian grouping, paise only when there are any. */
export function formatRupees(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export type PlanNeed = { limit: keyof PlanLimits; used: number };

/** What an invite uses that the edition doesn't cover; empty when it fits. */
export function planShortfalls(draft: InviteDraft, plan: PlanId): PlanNeed[] {
  const limits = PLANS[plan].limits;
  const used: Pick<PlanLimits, "functions" | "photos" | "languages" | "couplePhotos"> = {
    functions: includedFunctions(draft).length,
    photos: draft.photos.length,
    languages: cardLanguages(draft).length,
    couplePhotos: draft.photos.length ? frameCount(draft.couplePhotos.layout) : 0,
  };
  return (Object.keys(used) as (keyof typeof used)[]).flatMap((limit) =>
    used[limit] > limits[limit] ? [{ limit, used: used[limit] }] : [],
  );
}

/** The lowest edition an invite fits in, as the host has made it. */
export function planNeeded(draft: InviteDraft): PlanId {
  return PLAN_IDS.find((id) => planShortfalls(draft, id).length === 0) ?? "royal";
}
