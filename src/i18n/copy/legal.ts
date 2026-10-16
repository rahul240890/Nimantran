import * as enLegal from "@/content/legal";
import * as hiLegal from "@/content/hi/legal";
import * as mrLegal from "@/content/mr/legal";
import * as guLegal from "@/content/gu/legal";
import * as bnLegal from "@/content/bn/legal";
import * as taLegal from "@/content/ta/legal";
import type { Localized } from "../text";

/* Legal copy in each site language (one module per area, so pages ship only their own words). */
export const legalText: Localized<typeof enLegal> = {
  en: enLegal,
  hi: hiLegal,
  mr: mrLegal,
  gu: guLegal,
  bn: bnLegal,
  ta: taLegal,
};
