import { Check, Mail } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { editionsText } from "@/i18n/copy/editions";
import { pagesText } from "@/i18n/copy/pages";
import { seoText } from "@/i18n/copy/seo";
import type { UiLocale } from "@/i18n/locales";
import type { Business } from "@/lib/payments/business-details";
import { PAID_PLAN_IDS, formatRupees, inviteLimit, packagePrice } from "@/lib/plans/catalog";
import { getPricing } from "@/lib/plans/pricing";
import { pagePath } from "@/lib/seo/paths";
import { faqPage } from "@/lib/seo/structured-data";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Block, PageHero, PublicShell, type Crumb } from "./public-page";

/*
 * Pricing and contact: the pages a payment provider checks before it takes the site on,
 * and buyers read before they pay. Prices come from the plan catalogue, never typed twice.
 */

function crumbs(locale: UiLocale, last: Crumb): Crumb[] {
  return [{ name: seoText[locale].seoCopy.home, path: pagePath({ kind: "home" }, locale) }, last];
}

export async function PricingPage({ locale }: { locale: UiLocale }) {
  const { pricingPageCopy: copy } = pagesText[locale];
  // The admin's prices (Admin, Designs), shown for a Premium design
  const pricing = await getPricing();
  const { planCopy, invitesLine } = editionsText[locale];
  const design = formatRupees(pricing.designs.premium);
  return (
    <PublicShell
      locale={locale}
      crumbs={crumbs(locale, { name: copy.crumb, path: pagePath({ kind: "pricing" }, locale) })}
      jsonLd={[faqPage(copy.faq, locale)]}
    >
      <PageHero
        locale={locale}
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        intro={copy.intro}
        createHref="/create"
        createLabel={copy.create}
      />
      <Block
        id="editions"
        heading={copy.editionsHeading}
        intro={copy.editionsIntro}
        className="pt-0 sm:pt-0"
      >
        <ul className="grid gap-4 lg:grid-cols-3">
          {PAID_PLAN_IDS.map((id) => {
            const pricePaise = packagePrice(id, "premium", pricing);
            const words = planCopy[id];
            const popular = id === "celebration";
            return (
              <li key={id} className="flex">
                <article
                  aria-labelledby={`plan-${id}`}
                  className={cn(
                    "relative flex w-full flex-col gap-4 rounded-lg border bg-surface p-5 shadow-raised sm:p-6",
                    popular ? "border-marigold-edge ring-2 ring-marigold/45" : "border-line",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 id={`plan-${id}`} className="font-display text-2xl">
                      {words.name}
                    </h3>
                    {popular && (
                      <Badge tone="gold" dot>
                        {copy.popular}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-4xl leading-none">
                        {formatRupees(pricePaise)}
                      </span>
                      <span className="text-sm text-ink-muted">{copy.onDesign(design)}</span>
                    </p>
                    <p className="text-sm text-ink-muted">
                      {id === "basic"
                        ? copy.freeDesign
                        : copy.addOn(formatRupees(pricing.packages[id]))}
                    </p>
                  </div>
                  <p className="text-sm text-ink-muted">
                    {copy.bestFor}: {words.bestFor}
                  </p>
                  <ul className="flex flex-col gap-2 border-t border-line pt-4">
                    {[invitesLine(inviteLimit(id, pricing)), ...words.highlights].map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <Check
                          aria-hidden
                          className="mt-0.5 size-5 shrink-0 text-success"
                          strokeWidth={2.5}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ul>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="notes-heading" className="flex flex-col gap-3">
            <h3 id="notes-heading" className="font-display text-xl sm:text-2xl">
              {copy.notesHeading}
            </h3>
            <ul className="flex flex-col gap-2 ps-6 marker:text-marigold">
              {copy.notes.map((note) => (
                <li key={note} className="list-disc">
                  {note}
                </li>
              ))}
            </ul>
            <p>
              <Link
                href={pagePath({ kind: "refunds" }, locale)}
                className="inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
              >
                {copy.refundsLink}
              </Link>
            </p>
          </section>
          <section aria-labelledby="pricing-faq-heading" className="flex flex-col gap-3">
            <h3 id="pricing-faq-heading" className="font-display text-xl sm:text-2xl">
              {copy.faqHeading}
            </h3>
            <dl className="flex flex-col gap-4">
              {copy.faq.map((item) => (
                <div key={item.q} className="flex flex-col gap-1">
                  <dt className="font-semibold">{item.q}</dt>
                  <dd className="text-ink-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </Block>
    </PublicShell>
  );
}

/** Who runs the site and how to reach them; the business lines come from Admin, Business details. */
export function ContactPage({ locale, business }: { locale: UiLocale; business: Business }) {
  const { contactPageCopy: copy } = pagesText[locale];
  const rows = (
    [
      ["legalName", business.legalName],
      ["address", business.address],
      ["phone", business.phone],
      ["gstin", business.gstin],
    ] as const
  ).filter(([, value]) => value);
  const email = site.contactEmail ?? (business.email || null);
  return (
    <PublicShell
      locale={locale}
      crumbs={crumbs(locale, { name: copy.crumb, path: pagePath({ kind: "contact" }, locale) })}
    >
      <article
        aria-labelledby="page-title"
        className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pt-6 pb-20 sm:px-6 lg:px-8"
      >
        <header className="flex flex-col gap-4">
          <h1
            id="page-title"
            className="font-display text-[2.3rem] leading-[1.06] break-words sm:text-[3.2rem]"
          >
            {copy.heading}
          </h1>
          <p className="text-lg text-ink-muted">{copy.intro}</p>
        </header>

        <section
          aria-labelledby="email-heading"
          className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5 shadow-raised sm:p-6"
        >
          <h2 id="email-heading" className="font-display text-2xl">
            {copy.emailHeading}
          </h2>
          {email ? (
            <>
              <p>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center gap-2 text-lg font-semibold break-all text-accent-text underline underline-offset-4 hover:no-underline"
                >
                  <Mail aria-hidden className="size-5 shrink-0" />
                  {email}
                </a>
              </p>
              <p className="text-ink-muted">{copy.emailNote}</p>
            </>
          ) : (
            <p>{copy.emailPending}</p>
          )}
        </section>

        {rows.length > 0 && (
          <section aria-labelledby="business-heading" className="flex flex-col gap-3">
            <h2 id="business-heading" className="font-display text-2xl">
              {copy.businessHeading}
            </h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
              {rows.map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="text-sm text-ink-muted sm:pt-0.5">{copy[key]}</dt>
                  <dd className="break-words whitespace-pre-line">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section aria-labelledby="help-heading" className="flex flex-col gap-3">
          <h2 id="help-heading" className="font-display text-2xl">
            {copy.helpHeading}
          </h2>
          <ul className="-ms-2 flex flex-col">
            {copy.help.map((item) => (
              <li key={item.id}>
                <Link
                  href={pagePath({ kind: item.id }, locale)}
                  className="inline-flex min-h-11 items-center rounded-md px-2 font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="include-heading" className="flex flex-col gap-3">
          <h2 id="include-heading" className="font-display text-2xl">
            {copy.includeHeading}
          </h2>
          <ul className="flex list-disc flex-col gap-2 ps-6 marker:text-marigold">
            {copy.include.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </PublicShell>
  );
}
