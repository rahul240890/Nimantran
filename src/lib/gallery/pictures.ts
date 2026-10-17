import type { GalleryDesign } from "@/lib/gallery/catalog";
import { PAGE_ARTS, SUITES, type PageArt, type SuiteId } from "@/lib/suites/catalog";
import { scenePage } from "@/lib/suites/scene";

/*
 * The pictures the gallery shows a design by, for its cards and for the image sitemap,
 * so search engines are told about exactly the pictures the pages show.
 */

/** The pages a design has paintings for, in the order guests see them. */
export function paintedPages(design: GalleryDesign): { page: PageArt; src: string }[] {
  const { images } = SUITES[design.suite];
  return PAGE_ARTS.flatMap((page) => (images[page] ? [{ page, src: images[page]! }] : []));
}

/** A Scene theme's painting with the card in place, as its card shows it. */
export function scenePicture(suite: SuiteId): string | null {
  const page = scenePage(suite, 2);
  return page ? (page.card && SUITES[suite].images.cover) || page.image : null;
}

/** The picture a design's card shows; none for a 3D card, which is drawn, not pictured. */
export function designPicture(design: GalleryDesign): string | null {
  if (design.format === "scene") return scenePicture(design.suite);
  return paintedPages(design)[0]?.src ?? null;
}
