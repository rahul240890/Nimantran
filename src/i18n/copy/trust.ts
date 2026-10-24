import * as enTrust from "@/content/trust";
import * as hiTrust from "@/content/hi/trust";
import * as mrTrust from "@/content/mr/trust";
import * as guTrust from "@/content/gu/trust";
import * as bnTrust from "@/content/bn/trust";
import * as taTrust from "@/content/ta/trust";
import type { Localized } from "../text";

/* Invitations sent and families' reviews, in each site language (lib/reviews/trust.ts). */
export const trustText: Localized<typeof enTrust> = {
  en: enTrust,
  hi: hiTrust,
  mr: mrTrust,
  gu: guTrust,
  bn: bnTrust,
  ta: taTrust,
};
