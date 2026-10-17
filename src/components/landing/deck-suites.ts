import { PAINTED_SUITES } from "@/lib/gallery/catalog";
import { SUITES } from "@/lib/suites/catalog";

/** The home page's deck prints a couple's names, so it deals only the wedding themes. */
export const DECK_SUITES = PAINTED_SUITES.filter((suite) => !SUITES[suite].occasions);
