import { pagesText } from "@/i18n/copy/pages";
import type { UiLocale } from "@/i18n/locales";
import type { SiteOffer } from "@/lib/payments/coupons";
import { formatRupees } from "@/lib/plans/catalog";

/** "25% off" or "₹200 off", in the page's language. */
export function offerValue(
  offer: Pick<SiteOffer, "percentOff" | "amountOffPaise">,
  locale: UiLocale,
): string {
  const copy = pagesText[locale].offersCopy;
  return offer.percentOff !== null
    ? copy.percentOff(offer.percentOff)
    : copy.amountOff(formatRupees(offer.amountOffPaise ?? 0));
}
