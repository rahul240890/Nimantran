import { ArrowRight, CalendarClock, Check, TicketPercent } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/blog/copy-button";
import { designWords } from "@/components/gallery/design-words";
import { Section } from "@/components/landing/section";
import { Block, PageHero, PublicShell } from "@/components/seo/public-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { editionsText } from "@/i18n/copy/editions";
import { galleryText } from "@/i18n/copy/gallery";
import { pagesText } from "@/i18n/copy/pages";
import { seoText } from "@/i18n/copy/seo";
import { intlLocale, type UiLocale } from "@/i18n/locales";
import { designById } from "@/lib/gallery/catalog";
import { siteOffers, type SiteOffer } from "@/lib/payments/coupons";
import { formatRupees } from "@/lib/plans/catalog";
import { pagePath } from "@/lib/seo/paths";
import { cn } from "@/lib/cn";

/*
 * Offers the admin shows on the site (Admin, Offers): the offers page at /offers, and the
 * featured ones in a band on the home page. Each is a ticket: what it takes off, its code
 * to copy (none for a festival offer), who and what it's for, until when, and its terms.
 */

/** "25% off" or "₹200 off", in the page's language. */
export function offerValue(offer: SiteOffer, locale: UiLocale): string {
  const copy = pagesText[locale].offersCopy;
  return offer.percentOff !== null
    ? copy.percentOff(offer.percentOff)
    : copy.amountOff(formatRupees(offer.amountOffPaise ?? 0));
}

/** Who, which packages and which designs, and how often: one short line each. */
function offerFacts(offer: SiteOffer, locale: UiLocale): string[] {
  const copy = pagesText[locale].offersCopy;
  const { planCopy } = editionsText[locale];
  const { tiers } = galleryText[locale].galleryCopy;
  const designs = [
    ...offer.designTiers.map((tier) => copy.tierDesigns(tiers[tier])),
    ...offer.designIds.flatMap((id) => {
      const design = designById(id);
      return design ? [designWords(design, locale).name] : [];
    }),
  ];
  return [
    copy.audience[offer.audience],
    offer.planIds.length
      ? copy.onPackages(copy.and(offer.planIds.map((id) => planCopy[id].name)))
      : copy.everyPackage,
    designs.length ? copy.onDesigns(copy.and(designs)) : copy.everyDesign,
    ...(offer.perUserLimit !== null ? [copy.perHost(offer.perUserLimit)] : []),
  ];
}

function OfferCard({
  offer,
  locale,
  headingLevel = "h3",
}: {
  offer: SiteOffer;
  locale: UiLocale;
  headingLevel?: "h2" | "h3";
}) {
  const copy = pagesText[locale].offersCopy;
  const day = new Intl.DateTimeFormat(intlLocale[locale], {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  });
  const Heading = headingLevel;
  const id = `offer-${offer.id}`;
  const title = offer.label || offerValue(offer, locale);
  const terms = offer.terms
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    <article
      aria-labelledby={id}
      data-offer={offer.code}
      className="relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-raised @lg/offer:flex-row"
    >
      {/* The ticket's stub: what it takes off, on the marigold */}
      <div className="flex shrink-0 flex-col justify-center gap-1 border-b border-dashed border-marigold-edge bg-marigold/10 px-5 py-4 @lg/offer:w-40 @lg/offer:border-e @lg/offer:border-b-0 @lg/offer:px-4 @lg/offer:text-center">
        <TicketPercent aria-hidden className="size-6 text-accent-text @lg/offer:mx-auto" />
        <p className="font-display text-[1.9rem] leading-none break-words">
          {offerValue(offer, locale)}
        </p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1.5">
          {offer.autoApply && (
            <Badge tone="rose" className="self-start">
              {copy.festival}
            </Badge>
          )}
          <Heading id={id} className="font-display text-2xl leading-tight break-words">
            {title}
          </Heading>
          {offer.description && <p className="text-ink-muted">{offer.description}</p>}
        </div>

        {offer.autoApply ? (
          <p className="text-sm font-semibold text-success">{copy.noCode}</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="flex items-center gap-2">
              <span className="sr-only">{copy.code}: </span>
              <span
                translate="no"
                className="rounded-md border-2 border-dashed border-marigold-edge bg-paper px-3 py-1.5 font-mono text-lg font-semibold tracking-[0.12em] break-all"
              >
                {offer.code}
              </span>
            </p>
            <CopyButton
              text={offer.code}
              label={copy.copyCode}
              copied={copy.copied}
              failed={copy.copyFailed}
            />
          </div>
        )}

        <ul className="flex flex-col gap-1 text-sm">
          {offerFacts(offer, locale).map((fact) => (
            <li key={fact} className="flex items-start gap-2">
              <Check
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-success"
                strokeWidth={2.5}
              />
              {fact}
            </li>
          ))}
          <li className="flex items-start gap-2 font-semibold">
            <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
            {offer.endsAt ? copy.validTill(day.format(new Date(offer.endsAt))) : copy.noEnd}
          </li>
        </ul>

        {terms.length > 0 && (
          <details className="group mt-auto rounded-md border border-line bg-surface-2/60">
            <summary className="flex min-h-11 cursor-pointer items-center px-3 text-sm font-semibold marker:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              {copy.terms}
            </summary>
            <ul className="flex flex-col gap-1.5 px-3 ps-8 pb-3 text-sm text-ink-muted marker:text-marigold">
              {terms.map((line, index) => (
                <li key={index} className="list-disc break-words">
                  {line}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  );
}

/** The offers page: every offer running now, then how offers work. */
export async function OffersPage({ locale }: { locale: UiLocale }) {
  const copy = pagesText[locale].offersCopy;
  const offers = await siteOffers();
  const gallery = pagePath({ kind: "gallery" }, locale);
  return (
    <PublicShell
      locale={locale}
      crumbs={[
        { name: seoText[locale].seoCopy.home, path: pagePath({ kind: "home" }, locale) },
        { name: copy.crumb, path: pagePath({ kind: "offers" }, locale) },
      ]}
    >
      <PageHero
        locale={locale}
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        intro={copy.intro}
        createHref={gallery}
        createLabel={copy.start}
      />
      <section
        aria-label={copy.crumb}
        className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 lg:px-8"
      >
        {offers.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-line-strong bg-surface-2/60 p-6 sm:p-8">
            <TicketPercent aria-hidden className="size-7 text-accent-text" />
            <h2 className="font-display text-2xl">{copy.emptyTitle}</h2>
            <p className="max-w-xl text-ink-muted">{copy.emptyBody}</p>
          </div>
        ) : (
          <ul className="grid gap-5 lg:grid-cols-2">
            {offers.map((offer) => (
              <li key={offer.id} className="@container/offer">
                <OfferCard offer={offer} locale={locale} headingLevel="h2" />
              </li>
            ))}
          </ul>
        )}
      </section>
      <Block id="how-offers-work" heading={copy.howHeading}>
        <ol className="flex max-w-3xl flex-col gap-3 ps-6 marker:font-semibold marker:text-accent-text">
          {copy.how.map((line) => (
            <li key={line} className="list-decimal ps-1">
              {line}
            </li>
          ))}
        </ol>
      </Block>
    </PublicShell>
  );
}

/** The home page's band of featured offers; nothing at all while none is featured. */
export async function HomeOffers({ locale }: { locale: UiLocale }) {
  const offers = (await siteOffers()).filter((offer) => offer.featured).slice(0, 3);
  if (offers.length === 0) return null;
  const copy = pagesText[locale].offersCopy;
  return (
    <Section
      id="offers"
      eyebrow={copy.homeEyebrow}
      title={copy.homeTitle}
      intro={copy.homeIntro}
      className="border-y border-line bg-surface-2/50"
    >
      <ul
        className={cn(
          "grid gap-5",
          offers.length === 1 ? "mx-auto max-w-2xl" : offers.length === 2 && "lg:grid-cols-2",
          offers.length === 3 && "lg:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {offers.map((offer) => (
          <li key={offer.id} className="@container/offer reveal-on-scroll">
            <OfferCard offer={offer} locale={locale} />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Button asChild variant="secondary">
          <Link href={pagePath({ kind: "offers" }, locale)}>
            {copy.homeAll}
            <ArrowRight aria-hidden className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
