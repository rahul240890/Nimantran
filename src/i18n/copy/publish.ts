import * as enPublish from "@/content/publish";
import * as hiPublish from "@/content/hi/publish";
import type { Localized } from "../text";

/* Publish copy in each site language (one module per area, so pages ship only their own words). */
export const publishText: Localized<typeof enPublish> = { en: enPublish, hi: hiPublish };
