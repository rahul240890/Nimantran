import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { OCCASIONS, WEDDING_KINDS, WEDDING_KIND_ENTRIES } from "@/lib/gallery/catalog";
import {
  NO_FILTERS,
  designCatalog,
  filterCatalog,
  type DesignFilters,
} from "@/lib/gallery/filters";
import { DEMO_PATH } from "@/lib/sample/paths";
import { pagePath } from "@/lib/seo/paths";
import type { MenuLink, SiteMenu } from "./menu";
import { helpPath } from "./nav-links";

/*
 * The header's tabs, worked out on the server so the header ships only these words and
 * links: Wedding, Engagement, Birthday, More occasions and Traditions, each one short list
 * that lands on its designs (owner, 2026-10-24: simple and clean, straight to what the
 * family wants). The invitation video, the save-the-date and thank-you cards and the
 * Complete Wedding Set open the packages that include them on the Pricing page.
 */

/** More occasions: the ones families ask for most, then All occasions. */
const MORE_OCCASIONS = [
  "baby-shower",
  "naming-ceremony",
  "housewarming",
  "puja",
  "diwali",
  "ganesh-chaturthi",
  "retirement",
  "shop-opening",
] as const satisfies readonly CategoryId[];

const WEDDING_FUNCTIONS = [
  "haldi",
  "mehendi",
  "sangeet",
  "reception",
] as const satisfies readonly CategoryId[];

export function siteMenu(locale: UiLocale): SiteMenu {
  const { menuCopy } = landingText[locale];
  const { weddingKindCopy, catalogCopy } = galleryText[locale];
  const entries = designCatalog();
  const count = (change: Partial<DesignFilters>) =>
    catalogCopy.count(filterCatalog(entries, { ...NO_FILTERS, ...change }, () => "").length);
  const occasion = (id: CategoryId, withCount = true): MenuLink => ({
    label: OCCASIONS.find((item) => item.category === id)!.names[locale],
    href: pagePath({ kind: "occasion", id }, locale),
    note: withCount ? count({ occasion: id }) : undefined,
  });
  const pricing = pagePath({ kind: "pricing" }, locale);

  return {
    tabs: [
      {
        id: "weddings",
        label: menuCopy.tabs.weddings,
        links: [
          { ...occasion("wedding"), label: menuCopy.weddingAll },
          {
            label: menuCopy.video.title,
            note: menuCopy.video.note,
            href: `${pricing}#plan-celebration`,
          },
          { label: menuCopy.cards.title, note: menuCopy.cards.note, href: `${pricing}#plan-grand` },
          {
            label: menuCopy.set.title,
            note: menuCopy.set.note,
            href: `${pricing}#plan-grand`,
            star: true,
          },
        ],
        more: {
          title: menuCopy.functions,
          links: WEDDING_FUNCTIONS.map((id) => occasion(id, false)),
        },
      },
      {
        id: "engagement",
        label: menuCopy.tabs.engagement,
        links: (["engagement", "roka", "save-the-date"] as const).map((id) => occasion(id)),
      },
      {
        id: "birthday",
        label: menuCopy.tabs.birthday,
        links: (["birthday", "anniversary", "party"] as const).map((id) => occasion(id)),
      },
      {
        id: "occasions",
        label: menuCopy.tabs.occasions,
        links: MORE_OCCASIONS.map((id) => occasion(id, false)),
        all: {
          label: menuCopy.allOccasions(CATEGORY_IDS.length),
          href: pagePath({ kind: "gallery" }, locale),
        },
        wide: true,
      },
      {
        id: "traditions",
        label: menuCopy.tabs.traditions,
        links: WEDDING_KINDS.map((kind) => ({
          label: weddingKindCopy[kind].name,
          href: pagePath({ kind: "wedding-kind", id: kind }, locale),
          // Beside the English name; a page in an Indian language already names it in its script
          native: locale === "en" ? WEDDING_KIND_ENTRIES[kind].nativeName : null,
          note: count({ kind }),
        })),
        wide: true,
      },
    ],
    sample: { label: menuCopy.sample, href: DEMO_PATH },
    help: { label: menuCopy.help, href: helpPath(locale) },
  };
}
