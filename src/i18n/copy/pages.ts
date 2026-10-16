import * as enPages from "@/content/pages";
import * as hiPages from "@/content/hi/pages";
import * as mrPages from "@/content/mr/pages";
import * as guPages from "@/content/gu/pages";
import * as bnPages from "@/content/bn/pages";
import * as taPages from "@/content/ta/pages";
import type { Localized } from "../text";

/* Pricing, contact and blog copy in each site language. */
export const pagesText: Localized<typeof enPages> = {
  en: enPages,
  hi: hiPages,
  mr: mrPages,
  gu: guPages,
  bn: bnPages,
  ta: taPages,
};
