"use client";

import { ArrowRight, TicketPercent } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CopyButton } from "@/components/blog/copy-button";
import { useLocale, useText } from "@/i18n/client";
import { offersText } from "@/i18n/copy/offers";
import { pagePath } from "@/lib/seo/paths";
import { cn } from "@/lib/cn";
import { OfferPicture } from "./offer-picture";
import { offerValueIn, useSiteOffers } from "./use-site-offers";

/**
 * Offers running now as small sideways tickets, for the blog: the painting with what it
 * takes off, the title and the code to copy. Nothing while no offer is shown.
 */
export function OfferStrip({ className }: { className?: string }) {
  const copy = useText(offersText);
  const locale = useLocale();
  const offers = (useSiteOffers() ?? []).slice(0, 3);
  if (offers.length === 0) return null;
  return (
    <section
      aria-labelledby="offer-strip-title"
      className={cn("flex animate-fade-in flex-col gap-4", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="flex flex-col gap-1">
          <h2 id="offer-strip-title" className="flex items-center gap-2 font-display text-2xl">
            <TicketPercent aria-hidden className="size-6 shrink-0 text-accent-text" />
            {copy.stripHeading}
          </h2>
          <p className="text-sm text-ink-muted">{copy.stripIntro}</p>
        </div>
        <Link
          href={pagePath({ kind: "offers" }, locale)}
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          {copy.homeAll}
          <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <li
            key={offer.id}
            className="group drop-shadow-sm transition-[filter,translate] duration-500 ease-out-expo hover:-translate-y-0.5 hover:drop-shadow-lg motion-still:hover:translate-y-0"
          >
            <article
              data-offer-strip={offer.code}
              style={{ "--notch-x": "7rem" } as CSSProperties}
              className="flex h-full overflow-hidden rounded-lg border border-line bg-surface offer-ticket-x"
            >
              <OfferPicture
                offer={offer}
                value={offerValueIn(copy, offer)}
                compact
                className="w-28 shrink-0"
                sizes="7rem"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2 border-s-2 border-dashed border-line p-3">
                <h3 className="font-display text-lg leading-tight break-words">
                  {offer.label || offerValueIn(copy, offer)}
                </h3>
                {offer.autoApply ? (
                  <p className="text-sm font-semibold text-success">{copy.noCode}</p>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="sr-only">{copy.code}: </span>
                    <span
                      translate="no"
                      className="rounded-md border-2 border-dashed border-marigold-edge bg-marigold/10 px-2 py-1 font-mono text-sm font-semibold tracking-[0.12em] break-all"
                    >
                      {offer.code}
                    </span>
                    <CopyButton
                      text={offer.code}
                      label={copy.copyCode}
                      copied={copy.copied}
                      failed={copy.copyFailed}
                    />
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
