import * as enLanding from "@/content/landing";
import * as hiLanding from "@/content/hi/landing";
import * as mrLanding from "@/content/mr/landing";
import * as guLanding from "@/content/gu/landing";
import * as bnLanding from "@/content/bn/landing";
import * as taLanding from "@/content/ta/landing";
import type { Localized } from "../text";

/* Landing copy in each site language (one module per area, so pages ship only their own words). */
export const landingText: Localized<typeof enLanding> = {
  en: enLanding,
  hi: hiLanding,
  mr: mrLanding,
  gu: guLanding,
  bn: bnLanding,
  ta: taLanding,
};
