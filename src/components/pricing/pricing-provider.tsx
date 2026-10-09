"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_PRICING,
  parsePricing,
  tierPricePaise,
  type DesignTier,
  type Pricing,
} from "@/lib/plans/design-tiers";

/*
 * The admin's design tiers and package prices (Admin, Designs) for every badge and price
 * on the page. Pages are built with every design at its default tier; the admin's changes
 * are fetched once the page opens, so a static page never has to be rebuilt for them.
 */

const PricingContext = createContext<Pricing>(DEFAULT_PRICING);

export function PricingProvider({ pricing, children }: { pricing: Pricing; children: ReactNode }) {
  const [current, setCurrent] = useState(pricing);

  useEffect(() => {
    let live = true;
    fetch("/api/pricing")
      .then((response) => (response.ok ? response.json() : null))
      .then((stored: unknown) => {
        if (!live || !stored) return;
        // Stored, it lists only the designs the admin moved; the rest keep their default
        const admin = parsePricing(stored);
        setCurrent({ ...admin, tiers: { ...pricing.tiers, ...admin.tiers } });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [pricing]);

  return <PricingContext.Provider value={current}>{children}</PricingContext.Provider>;
}

export const usePricing = () => useContext(PricingContext);

/** A design's tier and what that tier costs, for its badge. */
export function useDesignTier(designId: string): { tier: DesignTier; pricePaise: number } {
  const pricing = usePricing();
  // Every design is listed (BUILT_PRICING); one that isn't is never shown as free
  const tier = pricing.tiers[designId] ?? "premium";
  return { tier, pricePaise: tierPricePaise(pricing, tier) };
}
