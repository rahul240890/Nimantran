import type { GalleryDesign } from "@/lib/gallery/catalog";
import type { DesignFormat } from "./format-filter";

/** A design's kind, as an occasion list's format filter names it. */
export const designFormat = (design: GalleryDesign): DesignFormat =>
  design.format === "scene" ? "scene" : design.suite === "classic" ? "card" : "story";
