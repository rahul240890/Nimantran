import * as enSeo from "@/content/seo";
import * as hiSeo from "@/content/hi/seo";
import type { Localized } from "../text";

/* Seo copy in each site language (one module per area, so pages ship only their own words). */
export const seoText: Localized<typeof enSeo> = { en: enSeo, hi: hiSeo };
