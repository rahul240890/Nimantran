"use client";

import { Clapperboard, Crown, Gift, Sparkles } from "lucide-react";
import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import { formatRupees } from "@/lib/plans/catalog";
import type { DesignTier } from "@/lib/plans/design-tiers";
import { useDesignTier } from "./pricing-provider";

const ICONS: Record<DesignTier, typeof Gift> = {
  free: Gift,
  premium: Sparkles,
  royal: Crown,
  signature: Clapperboard,
};

const TONES = {
  /** On a painting: dark glass for Free, gold for the paid tiers. */
  overlay: {
    free: "bg-night/70 text-card-ivory ring-1 ring-card-ivory/30 backdrop-blur-sm",
    premium: "bg-marigold text-on-marigold",
    royal: "bg-marigold text-on-marigold",
    // The moving scenes: ink with a gold ring, so they stand apart from the gold tiers
    signature: "bg-night text-marigold ring-1 ring-marigold/70",
  },
  /** On the page's own paper, as in the editor's lists. */
  plain: {
    free: "border border-success/35 bg-success/10 text-success",
    premium: "border border-marigold/50 bg-marigold/15 text-accent-text",
    royal: "border border-marigold/50 bg-marigold/15 text-accent-text",
    signature: "border border-marigold bg-marigold/25 text-accent-text",
  },
} satisfies Record<string, Record<DesignTier, string>>;

/**
 * A design's tier and price: "Free", "Premium · ₹499" or "Royal · ₹1,999". The price is
 * the tier's edition, which is what publishing the design without a watermark costs.
 */
export function TierBadge({
  designId,
  variant = "overlay",
  className,
}: {
  designId: string;
  variant?: keyof typeof TONES;
  className?: string;
}) {
  const { galleryCopy } = useText(galleryText);
  const { tier, pricePaise } = useDesignTier(designId);
  const name = galleryCopy.tiers[tier];
  const price = pricePaise ? formatRupees(pricePaise) : null;
  const Icon = ICONS[tier];

  return (
    <span
      data-tier={tier}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-label text-[0.65rem] tracking-[0.12em] whitespace-nowrap uppercase",
        TONES[variant][tier],
        className,
      )}
    >
      {/* In a narrow tile (a container named "tile"), a paid tier shows its price alone */}
      <Icon aria-hidden className={cn("size-3.5 shrink-0", price && "@max-[13rem]/tile:hidden")} />
      {price ? (
        <>
          <span aria-hidden className="@max-[13rem]/tile:hidden">
            {galleryCopy.tierPrice(name, price)}
          </span>
          <span aria-hidden className="hidden tabular-nums @max-[13rem]/tile:inline">
            {price}
          </span>
        </>
      ) : (
        <span aria-hidden>{name}</span>
      )}
      <span className="sr-only">{galleryCopy.tierLabel(name, price)}</span>
    </span>
  );
}
