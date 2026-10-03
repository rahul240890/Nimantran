import * as enPages from "@/content/pages";
import * as hiPages from "@/content/hi/pages";
import type { Localized } from "../text";

/* Pricing, contact and blog copy in each site language. */
export const pagesText: Localized<typeof enPages> = { en: enPages, hi: hiPages };
