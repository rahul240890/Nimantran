import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import type { Category } from "@/lib/categories/schema";
import { isSceneTheme } from "@/lib/suites/catalog";
import { designLayouts } from "@/lib/suites/photo-layouts";
import { hasScene } from "@/lib/suites/scene";
import type { GalleryDesign } from "./catalog";

/*
 * What photos a design takes, for its tile, and the gallery's order: designs of each kind
 * (Scene, Story, 3D card) and each photo need spread evenly through the list, so a host sees
 * the variety at once instead of every illustrated card in one long run.
 */

/**
 * A design's photos, as the editor will ask for them: none (an illustrated card), one photo
 * (one guest of honour), one couple photo, one each, a couple photo or one each, or photos
 * only if the host wants a photo page.
 */
export type PhotoNeed = "none" | "one" | "couple" | "two" | "either" | "optional";

export function designPhotos(design: GalleryDesign, category: CategoryId = "wedding"): PhotoNeed {
  const one = (CATEGORIES[category] as Category).people === "one";
  const scene = (design.format === "scene" || isSceneTheme(design.suite)) && hasScene(design.suite);
  const layouts = designLayouts(design.suite, scene, one);
  if (layouts.includes("none")) return layouts.length === 1 ? "none" : "optional";
  if (layouts.includes("two")) return layouts.includes("one") ? "either" : "two";
  return one ? "one" : "couple";
}

const kindOf = (design: GalleryDesign) =>
  `${design.format === "scene" ? "scene" : design.suite === "classic" ? "card" : "story"}-${designPhotos(design)}`;

/**
 * The designs with each kind spread evenly through the list, keeping each kind's own order.
 * Each design takes the middle of its share of the list ((n + ½) / count); ties go to the
 * kind listed first. The same designs always come out in the same order.
 */
export function mixDesigns(designs: readonly GalleryDesign[]): GalleryDesign[] {
  const groups = new Map<string, GalleryDesign[]>();
  for (const design of designs) {
    const key = kindOf(design);
    groups.set(key, [...(groups.get(key) ?? []), design]);
  }
  return [...groups.values()]
    .flatMap((group, rank) =>
      group.map((design, index) => ({ design, rank, at: (index + 0.5) / group.length })),
    )
    .sort((x, y) => x.at - y.at || x.rank - y.rank)
    .map(({ design }) => design);
}
