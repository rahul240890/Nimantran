"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLocale, useText } from "@/i18n/client";
import { editionsText } from "@/i18n/copy/editions";
import { galleryText } from "@/i18n/copy/gallery";
import { PAID_PLAN_IDS, formatRupees, inviteLimit, packagePrice } from "@/lib/plans/catalog";
import { pagePath } from "@/lib/seo/paths";
import { cn } from "@/lib/cn";
import { useDesignTier, usePricing } from "./pricing-provider";

/**
 * What each package costs on this one design, so the badge's price is never mistaken for
 * the whole story: Basic is the design, Celebration and Grand add the video and more guests.
 */
/** Its colours: on the night of a preview, or on the page's own paper (a design's page). */
const TONES = {
  night: {
    heading: "text-card-ivory/75",
    box: "border-card-ivory/15 bg-card-ivory/5",
    name: "text-card-ivory/75",
    guests: "text-card-ivory/70",
    link: "text-card-ivory focus-visible:outline-card-ivory",
  },
  paper: {
    heading: "text-ink-muted",
    box: "border-line bg-surface",
    name: "text-ink-muted",
    guests: "text-ink-muted",
    link: "text-accent-text focus-visible:outline-ring",
  },
} as const;

export function DesignPackages({
  designId,
  tone = "night",
  className,
}: {
  designId: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const colours = TONES[tone];
  const { galleryCopy } = useText(galleryText);
  const { planCopy, invitesCount, upgradeCopy } = useText(editionsText);
  const locale = useLocale();
  const pricing = usePricing();
  const { tier } = useDesignTier(designId);

  return (
    <section
      aria-labelledby={`packages-${designId}`}
      data-design-packages
      className={cn("flex flex-col gap-2", className)}
    >
      <h3
        id={`packages-${designId}`}
        className={cn("font-label text-xs tracking-[0.2em] uppercase", colours.heading)}
      >
        {galleryCopy.packagesHeading}
      </h3>
      <ul className="grid grid-cols-3 gap-2">
        {PAID_PLAN_IDS.map((id) => {
          const paise = packagePrice(id, tier, pricing);
          const guests = invitesCount(inviteLimit(id, pricing));
          return (
            <li
              key={id}
              data-plan={id}
              className={cn(
                "flex min-w-0 flex-col gap-0.5 rounded-lg border px-2.5 py-2",
                colours.box,
              )}
            >
              <span className={cn("truncate text-xs", colours.name)}>{planCopy[id].name}</span>
              <span className="font-display text-lg leading-tight tabular-nums">
                {paise === 0 ? galleryCopy.packageFree : formatRupees(paise)}
              </span>
              <span className={cn("text-[0.7rem] leading-snug", colours.guests)}>
                {guests.value} {guests.label}
              </span>
            </li>
          );
        })}
      </ul>
      {/* What makes paying feel safe, right beside the prices */}
      <div data-pay-safely className={cn("flex flex-col gap-1 text-xs", colours.guests)}>
        <p className="flex items-start gap-1.5">
          <ShieldCheck aria-hidden className="mt-px size-3.5 shrink-0 text-success" />
          {upgradeCopy.secure}
        </p>
        <p className="ps-5">{upgradeCopy.refunds}</p>
      </div>
      <Link
        href={pagePath({ kind: "pricing" }, locale)}
        className={cn(
          "inline-flex min-h-11 items-center self-start text-sm font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline-2",
          colours.link,
        )}
      >
        {galleryCopy.comparePackages}
      </Link>
    </section>
  );
}
