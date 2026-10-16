import * as enGallery from "@/content/gallery";
import * as hiGallery from "@/content/hi/gallery";
import * as mrGallery from "@/content/mr/gallery";
import * as guGallery from "@/content/gu/gallery";
import * as bnGallery from "@/content/bn/gallery";
import * as taGallery from "@/content/ta/gallery";
import type { Localized } from "../text";

/* Gallery copy in each site language (one module per area, so pages ship only their own words). */
export const galleryText: Localized<typeof enGallery> = {
  en: enGallery,
  hi: hiGallery,
  mr: mrGallery,
  gu: guGallery,
  bn: bnGallery,
  ta: taGallery,
};
