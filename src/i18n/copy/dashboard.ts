import * as enDashboard from "@/content/dashboard";
import * as hiDashboard from "@/content/hi/dashboard";
import type { Localized } from "../text";

/* Dashboard copy in each site language (one module per area, so pages ship only their own words). */
export const dashboardText: Localized<typeof enDashboard> = { en: enDashboard, hi: hiDashboard };
