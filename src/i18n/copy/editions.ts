import * as enEditions from "@/content/editions";
import * as hiEditions from "@/content/hi/editions";
import * as mrEditions from "@/content/mr/editions";
import * as guEditions from "@/content/gu/editions";
import * as bnEditions from "@/content/bn/editions";
import * as taEditions from "@/content/ta/editions";
import type { Localized } from "../text";

/* Editions copy in each site language. */
export const editionsText: Localized<typeof enEditions> = {
  en: enEditions,
  hi: hiEditions,
  mr: mrEditions,
  gu: guEditions,
  bn: bnEditions,
  ta: taEditions,
};
