"use client";

import { CalendarHeart } from "lucide-react";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/lib/categories/catalog";
import type { GalleryDesign } from "@/lib/gallery/catalog";
import { occasionsOf } from "@/lib/gallery/filters";

/**
 * The occasions a design can be used for, under its name (owner, 2026-11-07: so a host
 * knows before opening it whether it fits their event). A card names the first few and
 * how many more; the preview names them all.
 */
export function DesignOccasions({
  design,
  all = false,
  className,
}: {
  design: GalleryDesign;
  all?: boolean;
  className?: string;
}) {
  const { galleryCopy } = useText(galleryText);
  const locale = useLocale();
  const occasions = occasionsOf(design);
  if (occasions.length === 0) return null;
  const shown = all ? occasions : occasions.slice(0, 3);
  const more = occasions.length - shown.length;
  const names = shown.map((id) => CATEGORIES[id].names[locale]).join(", ");
  return (
    <p
      data-occasions={occasions.join(" ")}
      className={cn("flex items-start gap-1.5 text-xs", className)}
    >
      <CalendarHeart aria-hidden className="mt-px size-3.5 shrink-0" />
      <span className={cn(!all && "line-clamp-2")}>
        <span className="font-semibold">{galleryCopy.usedFor}:</span> {names}
        {more > 0 && ` +${more}`}
      </span>
    </p>
  );
}
