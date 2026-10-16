import * as enEditor from "@/content/editor";
import * as hiEditor from "@/content/hi/editor";
import * as mrEditor from "@/content/mr/editor";
import * as guEditor from "@/content/gu/editor";
import * as bnEditor from "@/content/bn/editor";
import * as taEditor from "@/content/ta/editor";
import type { Localized } from "../text";

/* Editor copy in each site language (one module per area, so pages ship only their own words). */
export const editorText: Localized<typeof enEditor> = {
  en: enEditor,
  hi: hiEditor,
  mr: mrEditor,
  gu: guEditor,
  bn: bnEditor,
  ta: taEditor,
};
