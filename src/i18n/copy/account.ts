import * as enAccount from "@/content/account";
import * as hiAccount from "@/content/hi/account";
import type { Localized } from "../text";

/* Account copy in each site language (one module per area, so pages ship only their own words). */
export const accountText: Localized<typeof enAccount> = { en: enAccount, hi: hiAccount };
