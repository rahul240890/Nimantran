import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { HomeSectionsEditor, type SectionInfo } from "@/components/admin/home-sections-editor";
import { designWords } from "@/components/gallery/design-words";
import { requireAdmin } from "@/lib/admin/access";
import { CATEGORIES } from "@/lib/categories/catalog";
import { allDesigns, occasionDesigns } from "@/lib/gallery/catalog";
import { designCatalog, tierOf } from "@/lib/gallery/filters";
import { fillHomeSections, type HomeFillInput } from "@/lib/gallery/home-fill";
import {
  HOME_SECTION_IDS,
  newestDesigns,
  sectionOccasion,
  shownSections,
} from "@/lib/gallery/home-sections";
import { getBestsellers, getHomeSections } from "@/lib/gallery/home-sections-store";
import { getTrending } from "@/lib/gallery/trending-store";
import { resolvePricing } from "@/lib/plans/design-defaults";
import { getPricing } from "@/lib/plans/pricing";

export const metadata: Metadata = { title: "Home page" };

const OWN_TITLES = { trending: "Trending", bestsellers: "Best sellers", new: "New designs" };

/** The home page's sections of designs: which show, in what order, and with which designs. */
export default async function HomeSectionsPage() {
  await requireAdmin("/admin/home");
  const [saved, { trending, pinned }, bestsellers, stored] = await Promise.all([
    getHomeSections(),
    getTrending(),
    getBestsellers(),
    getPricing(),
  ]);
  const catalog = designCatalog();
  const pricing = resolvePricing(stored);
  // What each section shows by itself, as the home page fills it (home-fill.ts)
  const fill: Omit<HomeFillInput, "sections" | "chosen"> = {
    trending,
    pinned,
    bestsellers,
    newest: newestDesigns(),
    entries: catalog,
    tierOf: (id) => tierOf(pricing, id),
  };
  const shown = shownSections(saved);
  const onPage = fillHomeSections({ ...fill, sections: shown, chosen: saved.designs });
  const auto = (id: (typeof HOME_SECTION_IDS)[number]) =>
    (shown.includes(id) && !saved.designs[id] ? onPage[id] : undefined) ??
    fillHomeSections({ ...fill, sections: [id], chosen: {} })[id] ??
    [];
  const kinds = {
    moving: "Moving",
    storybook: "Storybook",
    scene: "Scene",
    story: "Story",
    card: "3D card",
  };
  const names = Object.fromEntries(
    catalog.map((entry) => [
      entry.design.id,
      `${designWords(entry.design, "en").name} (${kinds[entry.format]})`,
    ]),
  );
  const sections: SectionInfo[] = HOME_SECTION_IDS.map((id) => {
    const occasion = sectionOccasion(id);
    if (!occasion) {
      const own = OWN_TITLES[id as keyof typeof OWN_TITLES];
      return {
        id,
        title: own,
        choices: allDesigns().map((design) => design.id),
        auto: auto(id),
      };
    }
    return {
      id,
      title: CATEGORIES[occasion].names.en,
      choices: occasionDesigns(occasion).map((design) => design.id),
      auto: auto(id),
    };
  });

  return (
    <>
      <AdminHeading
        eyebrow="Site"
        title="Home page"
        intro="The sections of designs on the home page, top to bottom. Switch a section on or off, move it, and choose the designs it shows. A section left to fill itself shows Trending by what hosts choose, Best sellers by what families pay for, or its occasion's designs, Royal and Signature first with only a few others (two, or four in the wedding and the engagement), and never a design another section already shows. Trending and Best sellers show 10, the wedding and the engagement 24; the others show 5 on phones, 7 on laptops and 9 on wide screens, then View all."
      />
      <HomeSectionsEditor sections={sections} names={names} saved={saved} />
    </>
  );
}
