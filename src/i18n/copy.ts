import * as enAccount from "@/content/account";
import * as enCategories from "@/content/categories";
import * as enDashboard from "@/content/dashboard";
import * as enEditor from "@/content/editor";
import * as hiAccount from "@/content/hi/account";
import * as hiCategories from "@/content/hi/categories";
import * as hiDashboard from "@/content/hi/dashboard";
import * as hiEditor from "@/content/hi/editor";
import * as hiLanding from "@/content/hi/landing";
import * as hiPublish from "@/content/hi/publish";
import * as hiUi from "@/content/hi/ui";
import * as enLanding from "@/content/landing";
import * as enPublish from "@/content/publish";
import * as enUi from "@/lib/ui-strings";
import type { Localized } from "./text";

/*
 * Every area's copy in each site language. Screens take the area they need, so a page
 * ships only the words it shows: useText(dashboardText) in the browser,
 * getText(dashboardText) on the server.
 */

export const accountText: Localized<typeof enAccount> = { en: enAccount, hi: hiAccount };
export const categoriesText: Localized<typeof enCategories> = {
  en: enCategories,
  hi: hiCategories,
};
export const dashboardText: Localized<typeof enDashboard> = { en: enDashboard, hi: hiDashboard };
export const editorText: Localized<typeof enEditor> = { en: enEditor, hi: hiEditor };
export const landingText: Localized<typeof enLanding> = { en: enLanding, hi: hiLanding };
export const publishText: Localized<typeof enPublish> = { en: enPublish, hi: hiPublish };
export const uiText: Localized<typeof enUi> = { en: enUi, hi: hiUi };
