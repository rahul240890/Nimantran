import * as enLanding from "@/content/landing";
import * as hiLanding from "@/content/hi/landing";
import type { Localized } from "../text";

/* Landing copy in each site language (one module per area, so pages ship only their own words). */
export const landingText: Localized<typeof enLanding> = { en: enLanding, hi: hiLanding };
