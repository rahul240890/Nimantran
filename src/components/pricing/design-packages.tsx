"use client";

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
export function DesignPackages({ designId, className }: { designId: string; className?: string }) {
  const { galleryCopy } = useText(galleryText);
  const { planCopy, invitesCount } = useText(editionsText);
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
        className="font-label text-xs tracking-[0.2em] text-card-ivory/75 uppercase"
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
              className="flex min-w-0 flex-col gap-0.5 rounded-lg border border-card-ivory/15 bg-card-ivory/5 px-2.5 py-2"
            >
              <span className="truncate text-xs text-card-ivory/75">{planCopy[id].name}</span>
              <span className="font-display text-lg leading-tight tabular-nums">
                {paise === 0 ? galleryCopy.packageFree : formatRupees(paise)}
              </span>
              <span className="text-[0.7rem] leading-snug text-card-ivory/70">
                {guests.value} {guests.label}
              </span>
            </li>
          );
        })}
      </ul>
      <Link
        href={pagePath({ kind: "pricing" }, locale)}
        className="inline-flex min-h-11 items-center self-start text-sm font-semibold text-card-ivory underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-card-ivory"
      >
        {galleryCopy.comparePackages}
      </Link>
    </section>
  );
}
