import * as enEditions from "@/content/editions";
import * as hiEditions from "@/content/hi/editions";
import type { Localized } from "../text";

/* Editions copy in each site language. */
export const editionsText: Localized<typeof enEditions> = { en: enEditions, hi: hiEditions };
