/*
 * The header's tabs as data, apart from the server code that fills them (site-menu.ts):
 * the header draws them in the browser, and importing that file there would ship the
 * whole catalogue in every language with it.
 */

export type MenuLink = {
  label: string;
  href: string;
  /** A short second line, such as how many designs there are. */
  note?: string;
  /** Its name in its own script, beside the label. */
  native?: { text: string; lang: string } | null;
  /** The one to look at first in its list (the Complete Wedding Set). */
  star?: boolean;
};

export type MenuTab = {
  id: "weddings" | "engagement" | "birthday" | "occasions" | "traditions";
  label: string;
  links: MenuLink[];
  /** Small links in a row under the list (a wedding's functions). */
  more?: { title: string; links: MenuLink[] };
  /** The way on to everything of its kind, at the foot of the list. */
  all?: MenuLink;
  /** Two columns on a wide screen, for the longer lists. */
  wide?: boolean;
};

export type SiteMenu = { tabs: MenuTab[]; sample: MenuLink; help: MenuLink };
