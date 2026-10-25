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
export function DesignPrice({ designId, className }: { designId: string; className?: string }) {
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
          "font-display text-xl leading-tight font-semibold tabular-nums",
          price ? "text-ink" : "text-success",
        )}
      >
        {price ?? name}
      </span>
      {price && (
        <span
          aria-hidden
          className="inline-flex items-center gap-1 font-label text-[0.65rem] tracking-[0.12em] whitespace-nowrap text-accent-text uppercase"
        >
          <Icon className="size-3.5 shrink-0" />
          {name}
        </span>
      )}
      <span className="sr-only">{galleryCopy.tierLabel(name, price)}</span>
    </p>
  );
}
