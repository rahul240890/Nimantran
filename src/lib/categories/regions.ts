import type { Locale, RegionCode } from "./schema";

/** The visitor's state, set by src/proxy.ts from the hosting platform's location headers. */
export const REGION_COOKIE = "nimantran-region";

/*
 * The language most families speak in each state, used to show a category's name in a
 * visitor's own script next to the English ("Wedding · വിവാഹം" in Kerala). Hindi where a
 * state has no launch language of its own.
 */
const REGION_LANGUAGE: Partial<Record<RegionCode, Locale>> = {
  MH: "mr",
  GA: "mr",
  GJ: "gu",
  DH: "gu",
  WB: "bn",
  TR: "bn",
  TN: "ta",
  PY: "ta",
  AP: "te",
  TG: "te",
  KA: "kn",
  KL: "ml",
  LD: "ml",
  PB: "pa",
  CH: "pa",
};

export function regionLanguage(region: RegionCode | null | undefined): Locale {
  return (region && REGION_LANGUAGE[region]) || "hi";
}
