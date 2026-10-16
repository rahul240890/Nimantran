import * as enPublish from "@/content/publish";
import * as hiPublish from "@/content/hi/publish";
import * as mrPublish from "@/content/mr/publish";
import * as guPublish from "@/content/gu/publish";
import * as bnPublish from "@/content/bn/publish";
import * as taPublish from "@/content/ta/publish";
import type { Localized } from "../text";

/* Publish copy in each site language (one module per area, so pages ship only their own words). */
export const publishText: Localized<typeof enPublish> = {
  en: enPublish,
  hi: hiPublish,
  mr: mrPublish,
  gu: guPublish,
  bn: bnPublish,
  ta: taPublish,
};
