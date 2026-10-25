import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import type { FunctionId } from "@/lib/events/functions";
import type { GalleryDesign } from "@/lib/gallery/catalog";
import {
  PAGE_ARTS,
  SUITES,
  isWeddingJourney,
  pageLook,
  type PageArt,
  type SuiteId,
} from "@/lib/suites/catalog";
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

/** One of a design's pages, and the celebration it stands for where that is its name. */
export type DesignPage = { page: PageArt; src: string; celebration?: FunctionId };

/**
 * The pages a design shows for an occasion (owner, 2026-10-24: a birthday's preview turned
 * through the haldi, the mehendi and the baraat). The wedding journey shows every page; any
 * other occasion only the pages its own invitation has: the blessing where one is painted,
 * the cover, the family, its one celebration (on the reception's painting, named for the
 * celebration) and the reply.
 */
export function occasionPages(design: GalleryDesign, category?: CategoryId): DesignPage[] {
  const pages = paintedPages(design);
  if (!category || isWeddingJourney(category)) return pages;
  const celebration = CATEGORIES[category].functions.primary;
  const own = pageLook(celebration).art;
  return (["blessing", "cover", "family", own, "reply"] as const).flatMap((art) => {
    const page = pages.find((found) => found.page === art);
    if (!page) return [];
    return art === own ? [{ ...page, celebration }] : [page];
  });
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
