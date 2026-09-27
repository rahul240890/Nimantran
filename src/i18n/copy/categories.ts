import * as enCategories from "@/content/categories";
import * as hiCategories from "@/content/hi/categories";
import type { Localized } from "../text";

/* Categories copy in each site language (one module per area, so pages ship only their own words). */
export const categoriesText: Localized<typeof enCategories> = {
  en: enCategories,
  hi: hiCategories,
};
