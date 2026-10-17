import * as enCards from "@/content/cards";
import * as hiCards from "@/content/hi/cards";
import * as mrCards from "@/content/mr/cards";
import * as guCards from "@/content/gu/cards";
import * as bnCards from "@/content/bn/cards";
import * as taCards from "@/content/ta/cards";
import type { Localized } from "../text";

/* Save-the-date and thank-you card copy in each site language. */
export const cardsText: Localized<typeof enCards> = {
  en: enCards,
  hi: hiCards,
  mr: mrCards,
  gu: guCards,
  bn: bnCards,
  ta: taCards,
};
