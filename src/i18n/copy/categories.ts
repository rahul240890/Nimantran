import * as enCategories from "@/content/categories";
import * as hiCategories from "@/content/hi/categories";
import * as mrCategories from "@/content/mr/categories";
import * as guCategories from "@/content/gu/categories";
import * as bnCategories from "@/content/bn/categories";
import * as taCategories from "@/content/ta/categories";
import type { Localized } from "../text";

/* Categories copy in each site language (one module per area, so pages ship only their own words). */
export const categoriesText: Localized<typeof enCategories> = {
  en: enCategories,
  hi: hiCategories,
  mr: mrCategories,
  gu: guCategories,
  bn: bnCategories,
  ta: taCategories,
};
