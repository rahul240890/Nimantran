import * as enEditor from "@/content/editor";
import * as hiEditor from "@/content/hi/editor";
import type { Localized } from "../text";

/* Editor copy in each site language (one module per area, so pages ship only their own words). */
export const editorText: Localized<typeof enEditor> = { en: enEditor, hi: hiEditor };
