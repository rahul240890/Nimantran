import { offersCopy as en } from "@/content/pages";
import { offersCopy as hi } from "@/content/hi/pages";
import { offersCopy as mr } from "@/content/mr/pages";
import { offersCopy as gu } from "@/content/gu/pages";
import { offersCopy as bn } from "@/content/bn/pages";
import { offersCopy as ta } from "@/content/ta/pages";
import type { Localized } from "../text";

/* Only the offers words, for the offer bar, the blog strip and the design preview in the browser. */
export const offersText: Localized<typeof en> = { en, hi, mr, gu, bn, ta };
