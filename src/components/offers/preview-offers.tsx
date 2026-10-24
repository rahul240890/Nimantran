"use client";

import { ArrowRight, Check, Copy, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDesignTier } from "@/components/pricing/pricing-provider";
import { toast } from "@/components/ui/toast";
import { useLocale, useText } from "@/i18n/client";
import { offersText } from "@/i18n/copy/offers";
import { cn } from "@/lib/cn";
import { offerArtImage } from "@/lib/plans/offers";
import { pagePath } from "@/lib/seo/paths";
import { offerValueIn, useSiteOffers } from "./use-site-offers";

/*
 * Offers in the design preview: the ones running now that cover the design, as small
 * tickets with what they take off and the code to copy.
 */

/** Its colours: on the night of a preview, or on the page's own paper (a design's page). */
const TONES = {
  night: {
    heading: "text-card-ivory/75",
    ticket: "bg-card-ivory/5",
    edge: "border-card-ivory/20",
    note: "text-card-ivory/80",
    focus: "focus-visible:outline-card-ivory",
    link: "text-card-ivory focus-visible:outline-card-ivory",
  },
  paper: {
    heading: "text-ink-muted",
    ticket: "bg-surface",
    edge: "border-line",
    note: "text-ink-muted",
    focus: "focus-visible:outline-ring",
    link: "text-accent-text focus-visible:outline-ring",
  },
} as const;

function CopyCode({
  code,
  words,
  focus,
}: {
  code: string;
  words: { copyCode: string; copied: string; copyFailed: string };
  focus: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setDone(true);
          toast({ title: words.copied, tone: "success" });
          window.setTimeout(() => setDone(false), 2000);
        } catch {
          toast({ title: words.copyFailed, tone: "error" });
        }
      }}
      aria-label={`${words.copyCode}: ${code}`}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-md focus-visible:outline-2",
        focus,
      )}
    >
      <span
        translate="no"
        className="rounded border border-dashed border-marigold px-2 py-0.5 font-mono text-sm font-semibold tracking-[0.12em]"
      >
        {code}
      </span>
      {done ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
    </button>
  );
}

export function PreviewOffers({
  designId,
  tone = "night",
  className,
}: {
  designId: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const colours = TONES[tone];
  const words = useText(offersText);
  const locale = useLocale();
  const { tier } = useDesignTier(designId);
  const offers = (useSiteOffers() ?? [])
    .filter(
      (offer) =>
        (offer.designTiers.length === 0 && offer.designIds.length === 0) ||
        offer.designTiers.includes(tier) ||
        offer.designIds.includes(designId),
    )
    .slice(0, 3);
  if (offers.length === 0) return null;

  return (
    <section
      aria-labelledby={`offers-${designId}`}
      data-preview-offers
      className={cn("flex flex-col gap-2", className)}
    >
      <h3
        id={`offers-${designId}`}
        className={cn(
          "flex items-center gap-2 font-label text-xs tracking-[0.2em] uppercase",
          colours.heading,
        )}
      >
        <Sparkles aria-hidden className="size-4 animate-twinkle text-marigold" />
        {words.previewHeading}
      </h3>
      <ul className="flex flex-col gap-2">
        {offers.map((offer) => (
          <li
            key={offer.id}
            className={cn(
              "group flex overflow-hidden rounded-lg border border-marigold/40",
              colours.ticket,
            )}
          >
            <div className="offer-shine relative isolate w-24 shrink-0 overflow-hidden bg-night">
              <Image
                src={offerArtImage(offer.art)}
                alt=""
                fill
                sizes="6rem"
                className="-z-10 object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/40 to-transparent"
              />
              <p className="absolute inset-x-0 bottom-0 p-2 font-display text-lg leading-none text-card-ivory">
                {offerValueIn(words, offer)}
              </p>
            </div>
            <div
              className={cn(
                "flex min-w-0 flex-1 flex-col gap-0.5 border-s-2 border-dashed px-3 py-2",
                colours.edge,
              )}
            >
              <p className="font-semibold break-words">{offer.label}</p>
              {offer.autoApply ? (
                <p className={cn("text-xs", colours.note)}>{words.noCode}</p>
              ) : (
                <CopyCode code={offer.code} words={words} focus={colours.focus} />
              )}
            </div>
          </li>
        ))}
      </ul>
      <Link
        href={pagePath({ kind: "offers" }, locale)}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline-2",
          colours.link,
        )}
      >
        {words.homeAll}
        <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
      </Link>
    </section>
  );
}
