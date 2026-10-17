import * as en from "@/content/design-names";
import * as hi from "@/content/hi/design-names";
import * as mr from "@/content/mr/design-names";
import * as gu from "@/content/gu/design-names";
import * as bn from "@/content/bn/design-names";
import * as ta from "@/content/ta/design-names";
import type { Localized } from "../text";

/*
 * Every design's name and description in each site language. Half a megabyte together, so
 * only the server and the search load them all; a page's cards get their own language's
 * list from the server (components/gallery/design-names.tsx).
 */
export const designNamesText: Localized<typeof en.designNames> = {
  en: en.designNames,
  hi: hi.designNames,
  mr: mr.designNames,
  gu: gu.designNames,
  bn: bn.designNames,
  ta: ta.designNames,
};
