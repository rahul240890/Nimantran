"use client";

import { Send } from "lucide-react";
import { useLocale, useText } from "@/i18n/client";
import { trustText } from "@/i18n/copy/trust";
import { cn } from "@/lib/cn";
import { Stars } from "./stars";
import { useTrust } from "./use-trust";

/**
 * The average of families' reviews and how many invitations have gone live, beside a call
 * to start: only what is real, and nothing while there is too little to say.
 */
export function TrustLine({ className }: { className?: string }) {
  const trust = useTrust();
  const { trustCopy } = useText(trustText);
  const locale = useLocale();
  if (!trust || (trust.sent === null && trust.average === null)) return null;
  const numbers = new Intl.NumberFormat(`${locale}-IN`);
  return (
    <p
      data-trust-line
      className={cn(
        "flex animate-fade-in flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted",
        className,
      )}
    >
      {trust.average !== null && (
        <span className="inline-flex items-center gap-2">
          <Stars value={trust.average} label={trustCopy.stars(trust.average)} />
          {trustCopy.rating(numbers.format(trust.average), trust.count)}
        </span>
      )}
      {trust.sent !== null && (
        <span className="inline-flex items-center gap-1.5">
          <Send aria-hidden className="size-4 text-accent-text rtl:-scale-x-100" />
          {trustCopy.sent(numbers.format(trust.sent))}
        </span>
      )}
    </p>
  );
}
