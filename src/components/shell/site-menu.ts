import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import type { CategoryId } from "@/lib/categories/catalog";
import {
  OCCASIONS,
  OCCASION_SECTIONS,
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  occasionTile,
  suiteImage,
} from "@/lib/gallery/catalog";
import { NO_FILTERS, designCatalog, filterCatalog, filtersToParams } from "@/lib/gallery/filters";
import type { DesignFilters } from "@/lib/gallery/filters";
import { normalize } from "@/lib/gallery/search";
import { pagePath } from "@/lib/seo/paths";
import { searchWords } from "@/components/gallery/design-words";

/*
 * The header's menus, worked out on the server so the header ships only these words and
 * links, not the catalogue: Designs (by photos, by kind, popular lists), Weddings (by
 * tradition and by function) and Occasions (by section). Each link lands on a list:
 * a View all of the Designs page, or a gallery page.
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

export type SiteMenu = Record<"designs" | "weddings" | "occasions", MenuPanel>;

export const MENU_IDS = ["designs", "weddings", "occasions"] as const;

export function isMenuId(id: string): id is keyof SiteMenu {
  return (MENU_IDS as readonly string[]).includes(id);
}

const POPULAR: readonly Partial<DesignFilters>[] = [
  { kind: "gujarati" },
  { kind: "marathi" },
  { kind: "north-indian" },
  { kind: "modern" },
  { occasion: "haldi" },
  { occasion: "birthday" },
];

/** Looks a host may want, each a search of every design's words (in every site language). */
const LOOKS = [
  "garden",
  "palace",
  "temple",
  "lotus",
  "peacock",
  "sea",
  "night",
  "balloon",
  "modern",
] as const;
export type Look = (typeof LOOKS)[number];

/** Weddings by where the family is from, then by community and faith. */
const REGIONS = ["north-indian", "rajasthani", "gujarati", "marathi", "bengali", "tamil"] as const;
const COMMUNITIES = ["punjabi", "muslim", "modern"] as const;

export function siteMenu(locale: UiLocale): SiteMenu {
  const { menuCopy } = landingText[locale];
  const { shelfCopy, weddingKindCopy, catalogCopy, sectionNames } = galleryText[locale];
  const designs = pagePath({ kind: "designs" }, locale);
  const entries = designCatalog();
  const words = searchWords();
  const text = new Map(
    entries.map((entry) => [entry.design.id, normalize(words.design(entry.design).join(" "))]),
  );
  const count = (filters: DesignFilters) =>
    filterCatalog(entries, filters, (design) => text.get(design.id) ?? "").length;
  const view = (change: Partial<DesignFilters>, label: string): MenuLink => {
    const filters = { ...NO_FILTERS, ...change };
    return {
      label,
      href: `${designs}${filtersToParams(filters)}`,
      note: catalogCopy.count(count(filters)),
    };
  };
  const kindLink = (kind: (typeof WEDDING_KINDS)[number]): MenuLink => ({
    label: weddingKindCopy[kind].name,
    href: pagePath({ kind: "wedding-kind", id: kind }, locale),
    native: WEDDING_KIND_ENTRIES[kind].nativeName,
    note: catalogCopy.count(count({ ...NO_FILTERS, kind })),
  });
  const occasionName = (id: CategoryId) =>
    OCCASIONS.find((occasion) => occasion.category === id)!.names[locale];
  const occasionLink = (id: CategoryId): MenuLink => ({
    label: occasionName(id),
    href: pagePath({ kind: "occasion", id }, locale),
    note: catalogCopy.count(count({ ...NO_FILTERS, occasion: id })),
  });

  return {
    designs: {
      groups: [
        {
          title: menuCopy.photos,
          links: (["none", "one", "two"] as const).map((photos) =>
            view({ photos }, shelfCopy.photos[photos].title),
          ),
        },
        {
          title: menuCopy.kinds,
          links: (["story", "scene", "card"] as const).map((format) =>
            view({ format }, shelfCopy.format[format].title),
          ),
        },
        {
          title: menuCopy.popular,
          links: POPULAR.map((filters) =>
            view(
              filters,
              filters.kind
                ? shelfCopy.tradition(weddingKindCopy[filters.kind].name)
                : occasionName(filters.occasion!),
            ),
          ),
        },
        {
          title: menuCopy.looks,
          links: LOOKS.map((look) => view({ query: look }, menuCopy.lookNames[look])),
        },
      ],
      all: { label: menuCopy.allDesigns(entries.length), href: designs },
      feature: {
        ...menuCopy.designsFeature,
        image: suiteImage("kutch-toran", "cover") ?? occasionTile("wedding")!,
        href: designs,
      },
    },
    weddings: {
      groups: [
        { title: menuCopy.regions, links: REGIONS.map(kindLink) },
        { title: menuCopy.communities, links: COMMUNITIES.map(kindLink) },
        {
          title: menuCopy.functions,
          links: OCCASIONS.filter(
            (occasion) =>
              occasion.section === "wedding" &&
              occasion.category &&
              occasion.category !== "wedding",
          ).map((occasion) => occasionLink(occasion.category!)),
        },
      ],
      all: {
        label: menuCopy.allWeddings,
        href: pagePath({ kind: "occasion", id: "wedding" }, locale),
      },
      feature: {
        ...menuCopy.weddingsFeature,
        image: occasionTile("wedding")!,
        href: pagePath({ kind: "occasion", id: "wedding" }, locale),
      },
    },
    occasions: {
      groups: OCCASION_SECTIONS.filter((section) => section !== "wedding")
        .map((section) => ({
          title: sectionNames[section],
          links: OCCASIONS.filter(
            (occasion) => occasion.section === section && occasion.category,
          ).map((occasion) => occasionLink(occasion.category!)),
        }))
        .filter((group) => group.links.length > 0),
      all: { label: menuCopy.allOccasions, href: pagePath({ kind: "gallery" }, locale) },
      feature: {
        ...menuCopy.occasionsFeature,
        image: occasionTile("birthday")!,
        href: pagePath({ kind: "gallery" }, locale),
      },
    },
  };
}
