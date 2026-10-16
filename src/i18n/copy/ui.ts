import * as enUi from "@/lib/ui-strings";
import * as hiUi from "@/content/hi/ui";
import * as mrUi from "@/content/mr/ui";
import * as guUi from "@/content/gu/ui";
import * as bnUi from "@/content/bn/ui";
import * as taUi from "@/content/ta/ui";
import type { Localized } from "../text";

/* Ui copy in each site language (one module per area, so pages ship only their own words). */
export const uiText: Localized<typeof enUi> = {
  en: enUi,
  hi: hiUi,
  mr: mrUi,
  gu: guUi,
  bn: bnUi,
  ta: taUi,
};
