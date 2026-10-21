"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_PRICING,
  isPricing,
  tierPricePaise,
  type DesignTier,
  type Pricing,
} from "@/lib/plans/design-tiers";

/*
 * The admin's design tiers and package prices (Admin, Designs) for every badge and price
 * on the page. Pages are built with every design at its default tier; the admin's changes
 * are fetched once the page opens, so a static page never has to be rebuilt for them.
 */

/*
 * The context holds a store that never changes, and readers follow the store: a new value
 * in the context itself would reach parts of the page still waiting for their scripts
 * (ui/near-screen.tsx), and React would throw away their drawing to redraw them.
 */
type PricingStore = {
  /** What the page was built with, for the first draw, so it matches the server's. */
  built: Pricing;
  current: () => Pricing;
  set: (pricing: Pricing) => void;
  subscribe: (listener: () => void) => () => void;
};

function pricingStore(built: Pricing): PricingStore {
  let current = built;
  const listeners = new Set<() => void>();
  return {
    built,
    current: () => current,
    set: (pricing) => {
      current = pricing;
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const PricingContext = createContext<PricingStore>(pricingStore(DEFAULT_PRICING));

export function PricingProvider({ pricing, children }: { pricing: Pricing; children: ReactNode }) {
  const [store] = useState(() => pricingStore(pricing));

  useEffect(() => {
    let live = true;
    fetch("/api/pricing")
      .then((response) => (response.ok ? response.json() : null))
      .then((stored: unknown) => {
        if (!live || !isPricing(stored)) return;
        // Stored, it lists only the designs the admin moved; the rest keep their default
        store.set({ ...stored, tiers: { ...pricing.tiers, ...stored.tiers } });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [pricing, store]);

  return <PricingContext.Provider value={store}>{children}</PricingContext.Provider>;
}

export function usePricing(): Pricing {
  const store = useContext(PricingContext);
  return useSyncExternalStore(store.subscribe, store.current, () => store.built);
}

/** A design's tier and what that tier costs, for its badge. */
export function useDesignTier(designId: string): { tier: DesignTier; pricePaise: number } {
  const pricing = usePricing();
  // Every design is listed (BUILT_PRICING); one that isn't is never shown as free
  const tier = pricing.tiers[designId] ?? "premium";
  return { tier, pricePaise: tierPricePaise(pricing, tier) };
}
