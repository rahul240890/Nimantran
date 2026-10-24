import { ArrowRight, CalendarClock, Check, TicketPercent } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CopyButton } from "@/components/blog/copy-button";
import { Mandala } from "@/components/brand/mandala";
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
import { pagePath } from "@/lib/seo/paths";
import { cn } from "@/lib/cn";
import { OfferPicture } from "./offer-picture";
import { offerValue } from "./offer-value";

/*
 * Offers the admin shows on the site (Admin, Offers): the offers page at /offers, the
 * featured ones in a band on the home page. Each is a
 * ticket: its painting with what it takes off, its code to copy (none for a festival
 * offer), who and what it's for, until when, and its terms.
 */

export { offerValue };

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
    // The ticket's shadow sits on its holder: the notches would cut a box shadow
    <div className="group h-full drop-shadow-md transition-[filter,translate] duration-500 ease-out-expo hover:-translate-y-1 hover:drop-shadow-xl motion-still:hover:translate-y-0">
      <article
        aria-labelledby={id}
        data-offer={offer.code}
        style={{ "--notch-y": "11rem" } as CSSProperties}
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface offer-ticket"
      >
        <OfferPicture
          offer={offer}
          value={offerValue(offer, locale)}
          className="h-44 shrink-0"
          sizes="(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw"
        />
        {/* Festival or not, and until when, over the painting */}
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start gap-2 p-4 pe-14">
          {offer.autoApply && (
            <Badge tone="rose" className="shadow-raised">
              {copy.festival}
            </Badge>
          )}
          {offer.endsAt && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-night/70 px-2.5 py-1 text-xs font-semibold text-card-ivory backdrop-blur-sm">
              <CalendarClock aria-hidden className="size-3.5" />
              {copy.validTill(day.format(new Date(offer.endsAt)))}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 border-t-2 border-dashed border-line p-5">
          <div className="flex flex-col gap-1.5">
            <Heading id={id} className="font-display text-2xl leading-tight break-words">
              {title}
            </Heading>
            {offer.description && <p className="text-ink-muted">{offer.description}</p>}
          </div>

          {offer.autoApply ? (
            <p className="flex items-start gap-2 rounded-md bg-success/10 px-3 py-2 text-sm font-semibold text-success">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
              {copy.noCode}
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="flex items-center gap-2">
                <span className="sr-only">{copy.code}: </span>
                <span
                  translate="no"
                  className="rounded-md border-2 border-dashed border-marigold-edge bg-marigold/10 px-3 py-1.5 font-mono text-lg font-semibold tracking-[0.14em] break-all"
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
            {!offer.endsAt && (
              <li className="flex items-start gap-2 font-semibold">
                <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
                {copy.noEnd}
              </li>
            )}
          </ul>

          <div className="mt-auto flex flex-col gap-2">
            {terms.length > 0 && (
              <details className="rounded-md border border-line bg-surface-2/60">
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
            <Link
              href={pagePath({ kind: "gallery" }, locale)}
              className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-accent-text underline-offset-4 hover:underline"
            >
              {copy.grab}
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </article>
    </div>
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
        className="mx-auto w-full max-w-site px-4 pb-4 sm:px-6 lg:px-8"
      >
        {offers.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-line-strong bg-surface-2/60 p-6 sm:p-8">
            <TicketPercent aria-hidden className="size-7 text-accent-text" />
            <h2 className="font-display text-2xl">{copy.emptyTitle}</h2>
            <p className="max-w-xl text-ink-muted">{copy.emptyBody}</p>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <li key={offer.id} className="reveal-on-scroll">
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
      title={<span className="text-gold-shimmer">{copy.homeTitle}</span>}
      intro={copy.homeIntro}
      className="relative isolate overflow-hidden border-y border-line bg-surface-2/50"
    >
      {/* A warm glow and a slowly turning mandala behind the tickets */}
      <div
        aria-hidden
        className="absolute start-1/2 top-24 -z-10 size-[36rem] max-w-full -translate-x-1/2 rounded-full bg-marigold/15 blur-3xl rtl:translate-x-1/2"
      />
      <Mandala className="pointer-events-none absolute -end-24 -top-24 -z-10 size-72 text-marigold/25 motion-safe:animate-[spin_120s_linear_infinite]" />
      <ul
        className={cn(
          "grid gap-6",
          offers.length === 1 && "mx-auto max-w-md",
          offers.length === 2 && "mx-auto max-w-4xl md:grid-cols-2",
          offers.length === 3 && "md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {offers.map((offer) => (
          <li key={offer.id} className="reveal-on-scroll">
            <OfferCard offer={offer} locale={locale} />
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
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
