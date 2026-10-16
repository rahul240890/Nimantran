import * as enAccount from "@/content/account";
import * as hiAccount from "@/content/hi/account";
import * as mrAccount from "@/content/mr/account";
import * as guAccount from "@/content/gu/account";
import * as bnAccount from "@/content/bn/account";
import * as taAccount from "@/content/ta/account";
import type { Localized } from "../text";

/* Account copy in each site language (one module per area, so pages ship only their own words). */
export const accountText: Localized<typeof enAccount> = {
  en: enAccount,
  hi: hiAccount,
  mr: mrAccount,
  gu: guAccount,
  bn: bnAccount,
  ta: taAccount,
};
