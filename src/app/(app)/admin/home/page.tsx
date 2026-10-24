import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { HomeSectionsEditor, type SectionInfo } from "@/components/admin/home-sections-editor";
import { designWords } from "@/components/gallery/design-words";
import { requireAdmin } from "@/lib/admin/access";
import { CATEGORIES } from "@/lib/categories/catalog";
import { allDesigns, occasionDesigns } from "@/lib/gallery/catalog";
import { designCatalog } from "@/lib/gallery/filters";
import { HOME_SECTION_IDS, newestDesigns, sectionOccasion } from "@/lib/gallery/home-sections";
import { getBestsellers, getHomeSections } from "@/lib/gallery/home-sections-store";
import { shelfEntries } from "@/lib/gallery/shelves";
import { getTrending } from "@/lib/gallery/trending-store";

export const metadata: Metadata = { title: "Home page" };

const OWN_TITLES = { trending: "Trending", bestsellers: "Best sellers", new: "New designs" };

/** The home page's sections of designs: which show, in what order, and with which designs. */
export default async function HomeSectionsPage() {
  await requireAdmin("/admin/home");
  const [saved, { trending }, bestsellers] = await Promise.all([
    getHomeSections(),
    getTrending(),
    getBestsellers(),
  ]);
  const catalog = designCatalog();
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
        auto: id === "trending" ? trending : id === "bestsellers" ? bestsellers : newestDesigns(),
      };
    }
    return {
      id,
      title: CATEGORIES[occasion].names.en,
      choices: occasionDesigns(occasion).map((design) => design.id),
      auto: shelfEntries(catalog, {
        id: `occasion-${occasion}`,
        kind: "occasion",
        value: occasion,
      }).shown.map((entry) => entry.design.id),
    };
  });

  return (
    <>
      <AdminHeading
        eyebrow="Site"
        title="Home page"
        intro="The sections of designs on the home page, top to bottom. Switch a section on or off, move it, and choose the designs it shows. A section left to fill itself shows Trending by what hosts choose, Best sellers by what families pay for, or its occasion's designs. Phones show the first 5, laptops 7 and wide screens 9, then View all."
      />
      <HomeSectionsEditor sections={sections} names={names} saved={saved} />
    </>
  );
}
