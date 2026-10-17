/*
 * The header's menus as data, apart from the server code that fills them (site-menu.ts):
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
};

export type MenuPanel = {
  groups: { title: string; links: MenuLink[] }[];
  all: MenuLink;
  feature: { title: string; text: string; image: string; href: string };
};

export type SiteMenu = Record<"designs" | "collections" | "weddings" | "occasions", MenuPanel>;

export const MENU_IDS = ["designs", "collections", "weddings", "occasions"] as const;

export function isMenuId(id: string): id is keyof SiteMenu {
  return (MENU_IDS as readonly string[]).includes(id);
}
