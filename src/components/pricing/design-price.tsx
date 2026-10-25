"use client";

import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import { formatRupees } from "@/lib/plans/catalog";
import { useDesignTier } from "./pricing-provider";
import { TIER_ICONS } from "./tier-badge";

/**
 * A design's price on its card, large enough to read at a glance (owner, 2026-10-25): the
 * amount, then its tier's name small beside it, or Free in green. The same price as the
 * badge's, the design's own, which is what Basic costs on it.
 */
export function DesignPrice({
  designId,
  size = "md",
  className,
}: {
  designId: string;
  /** "sm" for a small tile, as under a design's page. */
  size?: "md" | "sm";
  className?: string;
}) {
  const { galleryCopy } = useText(galleryText);
  const { tier, pricePaise } = useDesignTier(designId);
  const name = galleryCopy.tiers[tier];
  const price = pricePaise ? formatRupees(pricePaise) : null;
  const Icon = TIER_ICONS[tier];

  return (
    <p
      data-tier={tier}
      data-design-price
      className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}
    >
      <span
        aria-hidden
        className={cn(
          "font-display leading-tight font-semibold tabular-nums",
          size === "sm" ? "text-base" : "text-xl",
          price ? "text-ink" : "text-success",
        )}
      >
        {price ?? name}
      </span>
      {price && (
        <span
          aria-hidden
          className={cn(
            "inline-flex items-center gap-1 font-label tracking-[0.12em] whitespace-nowrap text-accent-text uppercase",
            size === "sm" ? "text-[0.6rem]" : "text-[0.65rem]",
          )}
        >
          <Icon className={cn("shrink-0", size === "sm" ? "size-3" : "size-3.5")} />
          {name}
        </span>
      )}
      <span className="sr-only">{galleryCopy.tierLabel(name, price)}</span>
    </p>
  );
}
