import { accountMenu as enMenu } from "@/content/account-menu";
import { accountMenu as hiMenu } from "@/content/hi/account-menu";
import { accountMenu as mrMenu } from "@/content/mr/account-menu";
import { accountMenu as guMenu } from "@/content/gu/account-menu";
import { accountMenu as bnMenu } from "@/content/bn/account-menu";
import { accountMenu as taMenu } from "@/content/ta/account-menu";
import type { Localized } from "../text";

/* The account menu's words in each site language (one module per area: the header is on every page). */
export const accountMenuText: Localized<{ accountMenu: typeof enMenu }> = {
  en: { accountMenu: enMenu },
  hi: { accountMenu: hiMenu },
  mr: { accountMenu: mrMenu },
  gu: { accountMenu: guMenu },
  bn: { accountMenu: bnMenu },
  ta: { accountMenu: taMenu },
};
