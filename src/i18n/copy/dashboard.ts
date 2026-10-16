import * as enDashboard from "@/content/dashboard";
import * as hiDashboard from "@/content/hi/dashboard";
import * as mrDashboard from "@/content/mr/dashboard";
import * as guDashboard from "@/content/gu/dashboard";
import * as bnDashboard from "@/content/bn/dashboard";
import * as taDashboard from "@/content/ta/dashboard";
import type { Localized } from "../text";

/* Dashboard copy in each site language (one module per area, so pages ship only their own words). */
export const dashboardText: Localized<typeof enDashboard> = {
  en: enDashboard,
  hi: hiDashboard,
  mr: mrDashboard,
  gu: guDashboard,
  bn: bnDashboard,
  ta: taDashboard,
};
