import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TemplateCover } from "@/components/brand/template-cover";
import { designNamesText } from "@/i18n/copy/design-names";
import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES } from "@/lib/categories/catalog";
import { allDesigns, occasionDesigns } from "@/lib/gallery/catalog";
import { designCatalog, tierOf } from "@/lib/gallery/filters";
import { fillHomeSections } from "@/lib/gallery/home-fill";
import {
  fixedSize,
  newestDesigns,
  sectionOccasion,
  shownSections,
  type HomeSectionId,
} from "@/lib/gallery/home-sections";
import { getBestsellers, getHomeSections } from "@/lib/gallery/home-sections-store";
import { getTrending } from "@/lib/gallery/trending-store";
import { resolvePricing } from "@/lib/plans/design-defaults";
import { getPricing } from "@/lib/plans/pricing";
import { pagePath } from "@/lib/seo/paths";
import { TEMPLATE_IDS } from "@/lib/templates/ids";
import { HomeShelvesLater } from "./home-later";
import type { HomeSection } from "./home-shelves";

/** The 3D cards' covers, drawn on the server (see DesignCard). */
function covers(locale: UiLocale) {
  return Object.fromEntries(
    TEMPLATE_IDS.map((id) => [
      id,
      <TemplateCover key={id} id={id} locale={locale} className="max-w-[16rem]" />,
    ]),
  );
}

/**
 * Designs to choose from, the way large shops lay out a catalogue: Trending and Best sellers
 * first, then a section for each main occasion, each a grid ending in View all, and the way
 * on to all of them. Which sections show, in what order and with which designs is the
 * master admin's (Admin, Home page; lib/gallery/home-sections.ts).
 */
export async function HomeDesigns({ locale }: { locale: UiLocale }) {
  const { homeRows } = landingText[locale];
  const { occasionTaglines, shelfCopy } = galleryText[locale];
  const designsPath = pagePath({ kind: "designs" }, locale);
  const [settings, { trending, pinned }, bestsellers, stored] = await Promise.all([
    getHomeSections(),
    getTrending(),
    getBestsellers(),
    getPricing(),
  ]);
  const everyDesign = allDesigns().length;
  const own: Record<"trending" | "bestsellers" | "new", { title: string; intro: string }> = {
    trending: shelfCopy.trending,
    bestsellers: homeRows.bestsellers,
    new: homeRows.newest,
  };
  const shown = shownSections(settings);
  // Royal and Signature first, and no design twice on the page (home-fill.ts)
  const pricing = resolvePricing(stored);
  const filled = fillHomeSections({
    sections: shown,
    chosen: settings.designs,
    trending,
    pinned,
    bestsellers,
    newest: newestDesigns(),
    entries: designCatalog(),
    tierOf: (id) => tierOf(pricing, id),
  });
  const sections: HomeSection[] = shown.map((id: HomeSectionId) => {
    const designs = filled[id] ?? [];
    const fixed = fixedSize(id);
    const occasion = sectionOccasion(id);
    if (!occasion) {
      const kind = own[id as keyof typeof own];
      return {
        id,
        title: kind.title,
        intro: kind.intro,
        href: designsPath,
        designs,
        fixed,
        total: everyDesign,
      };
    }
    return {
      id,
      title: CATEGORIES[occasion].names[locale],
      intro: occasionTaglines[occasion] ?? "",
      href: pagePath({ kind: "occasion", id: occasion }, locale),
      designs,
      fixed,
      total: occasionDesigns(occasion).length,
    };
  });
  const all = (
    <Link
      href={designsPath}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-marigold-edge hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {homeRows.allDesigns}
      <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
    </Link>
  );
  return (
    <section
      id="designs"
      tabIndex={-1}
      aria-labelledby="designs-title"
      className="scroll-mt-16 border-t border-line bg-surface-2/40 outline-none"
    >
      <div className="mx-auto flex w-full max-w-site flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:gap-12 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="flex max-w-2xl min-w-0 flex-col gap-2">
            <p className="flex items-center gap-3 font-label text-xs tracking-[0.24em] text-accent-text uppercase">
              <span aria-hidden className="h-px w-6 bg-marigold" />
              {homeRows.eyebrow}
            </p>
            <h2 id="designs-title" className="font-display text-[1.6rem] leading-tight sm:text-3xl">
              {homeRows.title}
            </h2>
            <p className="text-ink-muted sm:text-lg">{homeRows.intro}</p>
          </div>
          <div className="max-sm:hidden">{all}</div>
        </div>
        <HomeShelvesLater
          sections={sections}
          covers={covers(locale)}
          names={designNamesText[locale]}
        />
        <div className="flex justify-center">{all}</div>
      </div>
    </section>
  );
}
