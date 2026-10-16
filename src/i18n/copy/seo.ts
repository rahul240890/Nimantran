import * as enSeo from "@/content/seo";
import * as hiSeo from "@/content/hi/seo";
import * as mrSeo from "@/content/mr/seo";
import * as guSeo from "@/content/gu/seo";
import * as bnSeo from "@/content/bn/seo";
import * as taSeo from "@/content/ta/seo";
import type { Localized } from "../text";

/* Seo copy in each site language (one module per area, so pages ship only their own words). */
export const seoText: Localized<typeof enSeo> = {
  en: enSeo,
  hi: hiSeo,
  mr: mrSeo,
  gu: guSeo,
  bn: bnSeo,
  ta: taSeo,
};
