import type { designNames } from "@/content/design-names";
import type { Translation } from "@/i18n/text";
import type { GalleryDesign } from "@/lib/gallery/catalog";

/** One language's design names and descriptions (content/design-names.ts). */
export type DesignNames = Translation<typeof designNames>;

/** A design's name and description from one language's list. */
export function nameOf(
  names: DesignNames,
  design: GalleryDesign,
): { name: string; description: string } {
  if (design.suite === "classic") return names.cards[design.template];
  return { name: names.names[design.suite], description: names.descriptions[design.suite] };
}
