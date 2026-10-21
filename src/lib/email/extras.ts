import "server-only";
import { designWords } from "@/components/gallery/design-words";
import { offerValue } from "@/components/offers/offer-value";
import { editionsText } from "@/i18n/copy/editions";
import { pagesText } from "@/i18n/copy/pages";
import { designHref, paintedDesign, suiteOccasion } from "@/lib/gallery/catalog";
import { pickNewSuites } from "@/lib/gallery/new-designs";
import { siteOffers, type SiteOffer } from "@/lib/payments/coupons";
import { suitePreview } from "@/lib/suites/catalog";
import type { EmailDesign, EmailOffer } from "./templates";

/*
 * What the welcome and new-designs emails show: the offers running now that the person can
 * use, and new painted designs picked for them. Pictures are JPEGs, which every email app
 * shows (public/occasions/*-email.jpg and each theme's preview.jpg).
 */

const absolute = (siteUrl: string, path: string) => `${siteUrl.replace(/\/$/, "")}${path}`;

const day = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

/**
 * Offers on the site for someone who has bought before or not (unknown: both kinds), the
 * ones ending soonest first.
 */
export async function emailOffers(
  siteUrl: string,
  bought: boolean | null,
  limit = 3,
): Promise<EmailOffer[]> {
  const copy = pagesText.en.offersCopy;
  const { planCopy } = editionsText.en;
  const fits = (offer: SiteOffer) =>
    offer.audience === "everyone" ||
    (offer.audience === "first-order" && bought !== true) ||
    (offer.audience === "returning" && bought !== false);
  const offers = (await siteOffers()).filter(fits).slice(0, limit);
  return offers.map((offer) => ({
    title: offer.label || offerValue(offer, "en"),
    value: offerValue(offer, "en"),
    description: offer.description,
    code: offer.autoApply ? null : offer.code,
    note: [
      offer.endsAt ? copy.validTill(day.format(new Date(offer.endsAt))) : copy.noEnd,
      copy.audience[offer.audience],
      offer.planIds.length
        ? copy.onPackages(copy.and(offer.planIds.map((id) => planCopy[id].name)))
        : copy.everyPackage,
    ].join(" · "),
    image: absolute(siteUrl, `/occasions/${offer.art}-email.jpg`),
  }));
}

/** New painted designs, a different few for each person (seeded by their account). */
export function emailDesigns(siteUrl: string, seed: string, count: number): EmailDesign[] {
  return pickNewSuites(seed, count).flatMap((suite) => {
    const image = suitePreview(suite);
    if (!image) return [];
    const design = paintedDesign(suite);
    return [
      {
        name: designWords(design, "en").name,
        image: absolute(siteUrl, image),
        href: absolute(siteUrl, designHref(design, { category: suiteOccasion(suite) })),
      },
    ];
  });
}
