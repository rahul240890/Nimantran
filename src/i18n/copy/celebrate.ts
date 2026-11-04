import * as enCelebrate from "@/content/celebrate";
import * as hiCelebrate from "@/content/hi/celebrate";
import * as mrCelebrate from "@/content/mr/celebrate";
import * as guCelebrate from "@/content/gu/celebrate";
import * as bnCelebrate from "@/content/bn/celebrate";
import * as taCelebrate from "@/content/ta/celebrate";
import type { Localized } from "../text";

/* The celebration once an invitation goes live, in each site language. */
export const celebrateText: Localized<typeof enCelebrate> = {
  en: enCelebrate,
  hi: hiCelebrate,
  mr: mrCelebrate,
  gu: guCelebrate,
  bn: bnCelebrate,
  ta: taCelebrate,
};
