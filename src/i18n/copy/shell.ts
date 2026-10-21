import { nav as enNav, shell as enShell } from "@/content/landing";
import { nav as hiNav, shell as hiShell } from "@/content/hi/landing";
import { nav as mrNav, shell as mrShell } from "@/content/mr/landing";
import { nav as guNav, shell as guShell } from "@/content/gu/landing";
import { nav as bnNav, shell as bnShell } from "@/content/bn/landing";
import { nav as taNav, shell as taShell } from "@/content/ta/landing";
import type { Localized } from "../text";

/*
 * The header's words in each site language, taken from the landing copy one export at a
 * time, so the header (on every page) doesn't ship the whole home page's words with it.
 */
export const shellText: Localized<{ nav: typeof enNav; shell: typeof enShell }> = {
  en: { nav: enNav, shell: enShell },
  hi: { nav: hiNav, shell: hiShell },
  mr: { nav: mrNav, shell: mrShell },
  gu: { nav: guNav, shell: guShell },
  bn: { nav: bnNav, shell: bnShell },
  ta: { nav: taNav, shell: taShell },
};
