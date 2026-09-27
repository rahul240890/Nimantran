import * as enUi from "@/lib/ui-strings";
import * as hiUi from "@/content/hi/ui";
import type { Localized } from "../text";

/* Ui copy in each site language (one module per area, so pages ship only their own words). */
export const uiText: Localized<typeof enUi> = { en: enUi, hi: hiUi };
