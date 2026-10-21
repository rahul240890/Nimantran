"use client";

import { useEffect, useState } from "react";
import type { SiteOffer } from "@/lib/payments/coupons";
import { formatRupees } from "@/lib/plans/catalog";
import type { offersText } from "@/i18n/copy/offers";
import type { UiLocale } from "@/i18n/locales";

/*
 * The offers running now, for the offer bar, the blog strip and the design preview: asked
 * from /api/offers once per visit, however many of them show. Fetched in the browser so
 * the static pages never wait on, or are rebuilt for, an offer the admin saves.
 */

let asked: Promise<SiteOffer[]> | null = null;
let known: SiteOffer[] | null = null;

function ask(): Promise<SiteOffer[]> {
  asked ??= fetch("/api/offers")
    .then((response) => (response.ok ? response.json() : null))
    .then((body: { offers?: unknown } | null) => {
      known = Array.isArray(body?.offers) ? (body.offers as SiteOffer[]) : [];
      return known;
    })
    .catch(() => []);
  return asked;
}

/** Null until they arrive. */
export function useSiteOffers(): SiteOffer[] | null {
  const [offers, setOffers] = useState(known);
  useEffect(() => {
    let live = true;
    void ask().then((list) => live && setOffers(list));
    return () => {
      live = false;
    };
  }, []);
  return offers;
}

/** "20% off" or "₹150 off", from the offers words of the page's language. */
export const offerValueIn = (
  words: (typeof offersText)[UiLocale],
  offer: Pick<SiteOffer, "percentOff" | "amountOffPaise">,
) =>
  offer.percentOff !== null
    ? words.percentOff(offer.percentOff)
    : words.amountOff(formatRupees(offer.amountOffPaise ?? 0));
