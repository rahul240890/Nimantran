import * as enFunctions from "@/content/functions";
import * as hiFunctions from "@/content/hi/functions";
import * as mrFunctions from "@/content/mr/functions";
import * as guFunctions from "@/content/gu/functions";
import * as bnFunctions from "@/content/bn/functions";
import * as taFunctions from "@/content/ta/functions";
import type { Localized } from "../text";

/*
 * The functions' names, descriptions and dress ideas in each site language, kept apart from
 * the editor's other words (editorText carries them too) so the guest page ships only these.
 */
export const functionText: Localized<typeof enFunctions> = {
  en: enFunctions,
  hi: hiFunctions,
  mr: mrFunctions,
  gu: guFunctions,
  bn: bnFunctions,
  ta: taFunctions,
};
