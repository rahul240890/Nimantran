import * as enLegal from "@/content/legal";
import * as hiLegal from "@/content/hi/legal";
import type { Localized } from "../text";

/* Legal copy in each site language (one module per area, so pages ship only their own words). */
export const legalText: Localized<typeof enLegal> = { en: enLegal, hi: hiLegal };
