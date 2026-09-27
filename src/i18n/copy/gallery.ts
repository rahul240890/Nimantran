import * as enGallery from "@/content/gallery";
import * as hiGallery from "@/content/hi/gallery";
import type { Localized } from "../text";

/* Gallery copy in each site language (one module per area, so pages ship only their own words). */
export const galleryText: Localized<typeof enGallery> = {
  en: enGallery,
  hi: hiGallery,
};
