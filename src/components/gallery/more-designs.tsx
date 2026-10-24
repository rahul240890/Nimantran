"use client";

import type { ReactNode } from "react";
import { designHref, type GalleryDesign, type WeddingKind } from "@/lib/gallery/catalog";
import { designPhotos } from "@/lib/gallery/photos";
import type { CategoryId } from "@/lib/categories/catalog";
import { samplePath } from "@/lib/sample/paths";
import type { TemplateId } from "@/lib/templates/ids";
import { DesignCard } from "./design-card";
import { designFormat } from "./design-format";
import { useAllShown } from "./format-filter";

/**
 * The designs of an occasion's list past the first few, drawn once Show all is pressed or a
 * kind is chosen (FormatFilter). The first few come from the server; these only from here.
 */
export function MoreDesigns({
  designs,
  category,
  kind,
  occasion,
  covers,
}: {
  /** With their names and descriptions in the page's language, from the server. */
  designs: readonly { design: GalleryDesign; name: string; description: string }[];
  category: CategoryId;
  kind: WeddingKind | null;
  /** The page's occasion, for the pictures' descriptions (DesignCard). */
  occasion: string;
  /** The 3D cards' covers among them, drawn on the server (see DesignCard's cover). */
  covers: Partial<Record<TemplateId, ReactNode>>;
}) {
  if (!useAllShown()) return null;
  return designs.map(({ design, name, description }) => {
    return (
      <li key={design.id} data-format-item={designFormat(design)}>
        <DesignCard
          design={design}
          name={name}
          description={description}
          href={designHref(design, { category, kind })}
          sampleHref={samplePath(design.id, kind ? { kind } : { occasion: category })}
          photos={designPhotos(design, category)}
          occasion={occasion}
          category={category}
          cover={design.suite === "classic" ? covers[design.template] : undefined}
        />
      </li>
    );
  });
}
