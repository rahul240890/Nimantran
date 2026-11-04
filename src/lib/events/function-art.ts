import type { FunctionId } from "./functions";

/*
 * The small painting at the top of each celebration's card on the guest page (owner,
 * 2026-11-04): the owner's occasion paintings in public/celebrate, the same ones the
 * celebration after publishing shows. Each is one object on a clear background (a haldi
 * urli, mehendi cones, a dholak, a flower arch, a diya), with no person or deity, so every
 * family and faith can have them.
 */

export const FUNCTION_ART_IMAGES = [
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
  "puja",
  "business",
] as const;
export type FunctionArtImage = (typeof FUNCTION_ART_IMAGES)[number];

const ART: Record<FunctionId, FunctionArtImage> = {
  roka: "engagement",
  engagement: "engagement",
  tilak: "engagement",
  mameru: "engagement",
  "ganesh-puja": "puja",
  "grah-shanti": "puja",
  mandap: "wedding",
  haldi: "haldi",
  mehendi: "mehendi",
  sangeet: "sangeet",
  garba: "sangeet",
  bhoj: "wedding",
  baraat: "wedding",
  "baraat-welcome": "wedding",
  wedding: "wedding",
  vidaai: "wedding",
  reception: "wedding",
  birthday: "birthday",
  anniversary: "anniversary",
  party: "birthday",
  "baby-shower": "baby",
  diwali: "festival",
  housewarming: "housewarming",
  puja: "puja",
  "thread-ceremony": "puja",
  annaprashan: "baby",
  christening: "baby",
  // A prayer meeting is quiet: the lamp
  "prayer-meet": "puja",
  retirement: "birthday",
  "farewell-party": "birthday",
  "shop-opening": "business",
  launch: "business",
  "ganesh-chaturthi": "puja",
  navratri: "festival",
  janmashtami: "puja",
  onam: "festival",
  sankranti: "festival",
  // Lohri, Eid, Holi, Christmas and the harvest festivals: the flower arch, not diyas
  lohri: "wedding",
  eid: "wedding",
  "naming-ceremony": "baby",
  holi: "wedding",
  christmas: "wedding",
  reunion: "birthday",
  graduation: "birthday",
  "gudi-padwa": "festival",
  baisakhi: "wedding",
  bihu: "wedding",
  "raksha-bandhan": "festival",
  "karva-chauth": "festival",
};

/** The painting at the top of this celebration's card. */
export function functionArt(kind: FunctionId): string {
  return `/celebrate/${ART[kind]}.webp`;
}
