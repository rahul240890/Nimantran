import type { CategoryId } from "@/lib/categories/catalog";
import { PAID_PLAN_IDS, PLANS, planRank, type PaidPlanId, type PlanId } from "@/lib/plans/catalog";
import type { Faith } from "@/lib/traditions/faith";

/*
 * The celebration that plays once over the share page when an invitation first goes live
 * (owner, 2026-11-04): the occasion's painting and wishes, what the host's package lets them
 * do now and what it leaves out, and one suggestion for the next package. The paintings sit
 * in public/celebrate; none shows a person or a deity, so every faith can have them.
 */

/** Occasions grouped by the wishes and painting they share. */
export const CELEBRATION_FAMILIES = [
  "wedding",
  "engagement",
  "haldi",
  "mehendi",
  "sangeet",
  "anniversary",
  "birthday",
  "baby",
  "housewarming",
  "festival",
  "lights",
  "puja",
  "prayer",
  "business",
] as const;
export type CelebrationFamily = (typeof CELEBRATION_FAMILIES)[number];

/** What moves around the painting: falling petals, confetti, rising balloons, or nothing. */
export type CelebrationParticles = "petals" | "confetti" | "balloons" | "none";

export type CelebrationLook = {
  /** The painting, in public/celebrate. */
  image: string;
  particles: CelebrationParticles;
  /** The marigold toran across the top. */
  toran: boolean;
};

const FAMILY_OF: Record<CategoryId, CelebrationFamily> = {
  wedding: "wedding",
  engagement: "engagement",
  "save-the-date": "wedding",
  roka: "engagement",
  haldi: "haldi",
  mehendi: "mehendi",
  sangeet: "sangeet",
  reception: "wedding",
  birthday: "birthday",
  anniversary: "anniversary",
  party: "business",
  "baby-shower": "baby",
  diwali: "lights",
  housewarming: "housewarming",
  puja: "puja",
  "thread-ceremony": "puja",
  "ganesh-chaturthi": "puja",
  navratri: "lights",
  annaprashan: "baby",
  eid: "festival",
  "naming-ceremony": "baby",
  retirement: "birthday",
  janmashtami: "puja",
  sankranti: "festival",
  "farewell-party": "birthday",
  "shop-opening": "business",
  onam: "lights",
  lohri: "festival",
  holi: "festival",
  launch: "business",
  christmas: "festival",
  reunion: "birthday",
  graduation: "birthday",
  "gudi-padwa": "lights",
  baisakhi: "festival",
  bihu: "festival",
  "raksha-bandhan": "lights",
  "karva-chauth": "lights",
  christening: "baby",
  "prayer-meet": "prayer",
};

export function celebrationFamily(categoryId: CategoryId): CelebrationFamily {
  return FAMILY_OF[categoryId] ?? "wedding";
}

export const CELEBRATION_LOOKS: Record<CelebrationFamily, CelebrationLook> = {
  wedding: { image: "wedding", particles: "petals", toran: true },
  engagement: { image: "engagement", particles: "petals", toran: true },
  haldi: { image: "haldi", particles: "petals", toran: true },
  mehendi: { image: "mehendi", particles: "petals", toran: true },
  sangeet: { image: "sangeet", particles: "confetti", toran: true },
  anniversary: { image: "anniversary", particles: "petals", toran: false },
  birthday: { image: "birthday", particles: "balloons", toran: false },
  baby: { image: "baby", particles: "petals", toran: false },
  housewarming: { image: "housewarming", particles: "petals", toran: true },
  // Holi, Eid, Christmas and the harvest festivals: the flower arch, not diyas
  festival: { image: "wedding", particles: "confetti", toran: false },
  lights: { image: "festival", particles: "petals", toran: true },
  puja: { image: "puja", particles: "petals", toran: true },
  // A prayer meeting is quiet: a lamp, no confetti, no garlands
  prayer: { image: "puja", particles: "none", toran: false },
  business: { image: "business", particles: "confetti", toran: false },
};

export const celebrationImage = (family: CelebrationFamily) =>
  `/celebrate/${CELEBRATION_LOOKS[family].image}.webp`;

/** Families whose wishes carry the family's own blessing line. */
const BLESSED: readonly CelebrationFamily[] = [
  "wedding",
  "engagement",
  "haldi",
  "mehendi",
  "sangeet",
  "anniversary",
  "baby",
  "housewarming",
  "puja",
];

/** The faith whose blessing closes the wishes, or null for none. */
export function celebrationBlessing(
  family: CelebrationFamily,
  faith: Faith,
): Exclude<Faith, "none"> | null {
  return BLESSED.includes(family) && faith !== "none" ? faith : null;
}

/** What a package gives, in the order the celebration lists it. */
export const PERK_IDS = [
  "share",
  "guests",
  "noMark",
  "video",
  "photoWall",
  "cohosts",
  "cards",
  "aiList",
  "priority",
] as const;
export type PerkId = (typeof PERK_IDS)[number];

export type Perk = {
  id: PerkId;
  included: boolean;
  /** The lowest package that has it, for a perk left out. */
  from: PaidPlanId | null;
};

/** Whether a package gives this perk at all. */
function has(plan: PlanId, perk: PerkId): boolean {
  const rules = PLANS[plan];
  switch (perk) {
    case "share":
    case "guests":
    case "aiList":
      return true;
    case "noMark":
      return !rules.watermark;
    case "video":
      return rules.video !== "none";
    case "photoWall":
      return rules.albumDays > 0;
    case "cohosts":
      return rules.cohosts === null || rules.cohosts > 1;
    case "cards":
      return rules.cards;
    case "priority":
      return plan === "grand";
  }
}

/** Every perk, with whether this package gives it and, if not, which package does. */
export function packagePerks(plan: PlanId): Perk[] {
  return PERK_IDS.map((id) => {
    const included = has(plan, id);
    const from = included ? null : (PAID_PLAN_IDS.find((paid) => has(paid, id)) ?? null);
    return { id, included, from };
  });
}

/** The one package suggested next, and why: the most useful thing it adds. */
export type Suggestion = {
  plan: PaidPlanId;
  reason: "noMark" | "video" | "everyVideo" | "cards";
};

export function nextSuggestion(plan: PlanId, functions: number): Suggestion | null {
  const next = PAID_PLAN_IDS.find((paid) => planRank(paid) > planRank(plan));
  if (!next) return null;
  if (next === "basic") return { plan: next, reason: "noMark" };
  if (next === "celebration") return { plan: next, reason: "video" };
  return { plan: next, reason: functions > 1 ? "everyVideo" : "cards" };
}

/** Where the share page asks for the celebration, once, right after publishing. */
export const CELEBRATE_PARAM = "celebrate";

/** Browser storage key: the invites whose celebration has played on this device. */
export const CELEBRATED_KEY = "nimantran-celebrated";
