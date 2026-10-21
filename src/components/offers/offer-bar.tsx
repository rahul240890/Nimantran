"use client";

import { Check, Copy, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { toast } from "@/components/ui/toast";
import { useLocale, useText } from "@/i18n/client";
import { offersText } from "@/i18n/copy/offers";
import { pagePath } from "@/lib/seo/paths";
import { offerValueIn, useSiteOffers } from "./use-site-offers";

/** The offer the visitor hid; a different offer shows again. */
const HIDDEN_KEY = "shubhdwar-offer-bar-hidden";

/** The code of the offer hidden on this device, shared by every bar on the page. */
const hiddenStore = (() => {
  const listeners = new Set<() => void>();
  // Kept here too, so hiding still works for the visit when storage is blocked
  let hidden: string | null | undefined;
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    get(): string | null {
      if (hidden === undefined) {
        try {
          hidden = localStorage.getItem(HIDDEN_KEY);
        } catch {
          hidden = null;
        }
      }
      return hidden;
    },
    set(code: string) {
      hidden = code;
      try {
        localStorage.setItem(HIDDEN_KEY, code);
      } catch {
        // Storage blocked: hidden for this visit
      }
      listeners.forEach((listener) => listener());
    },
  };
})();

/** The bar over every public page, with the offer running now: a featured one first. */
export function OfferBar() {
  const offers = useSiteOffers();
  const copy = useText(offersText);
  const locale = useLocale();
  const offer = offers?.find((entry) => entry.featured) ?? offers?.[0];
  if (!offers || !offer) return null;
  const others = offers.length - 1;
  return (
    <OfferBarView
      offerKey={offer.code}
      words={{
        label: copy.barLabel,
        value: offerValueIn(copy, offer),
        title: offer.label,
        code: offer.autoApply ? null : offer.code,
        festival: copy.festival,
        more: others > 0 ? copy.moreOffers(others) : null,
        href: pagePath({ kind: "offers" }, locale),
        copyCode: copy.copyCode,
        copied: copy.copied,
        copyFailed: copy.copyFailed,
        hide: copy.hideBar,
      }}
    />
  );
}

type OfferBarWords = {
  label: string;
  value: string;
  title: string;
  /** Null for a festival offer, which needs no code. */
  code: string | null;
  festival: string;
  more: string | null;
  href: string;
  copyCode: string;
  copied: string;
  copyFailed: string;
  hide: string;
};

/**
 * A slim bar over the site header with the offer running now: what it takes off and its
 * code to copy, a link to every offer, and a button to hide it.
 */
function OfferBarView({ offerKey, words }: { offerKey: string; words: OfferBarWords }) {
  const hidden = useSyncExternalStore(hiddenStore.subscribe, hiddenStore.get, () => null);
  const [done, setDone] = useState(false);

  if (hidden === offerKey) return null;

  const copy = async () => {
    if (!words.code) return;
    try {
      await navigator.clipboard.writeText(words.code);
      setDone(true);
      toast({ title: words.copied, tone: "success" });
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      toast({ title: words.copyFailed, tone: "error" });
    }
  };

  return (
    <aside
      aria-label={words.label}
      data-offer-bar={offerKey}
      className="offer-shine relative z-40 order-first animate-fade-in overflow-hidden bg-night text-card-ivory"
    >
      <div className="mx-auto flex min-h-11 w-full max-w-6xl items-center gap-2 ps-3 pe-1 sm:px-6 lg:px-8">
        <Sparkles aria-hidden className="size-4 shrink-0 animate-twinkle text-card-gold" />
        <Link
          href={words.href}
          className="flex min-h-11 min-w-0 items-center gap-2 rounded-sm text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-card-ivory"
        >
          <span className="shrink-0 font-display text-base text-card-gold">{words.value}</span>
          <span className="hidden truncate sm:inline">{words.title}</span>
          {words.more && (
            <span className="hidden shrink-0 text-card-ivory/75 lg:inline">· {words.more}</span>
          )}
        </Link>
        <div className="ms-auto flex shrink-0 items-center gap-1 sm:ms-2">
          {words.code ? (
            <button
              type="button"
              onClick={copy}
              aria-label={`${words.copyCode}: ${words.code}`}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md px-1.5 focus-visible:outline-2 focus-visible:outline-card-ivory"
            >
              <span
                translate="no"
                className="rounded border border-dashed border-card-gold px-2 py-0.5 font-mono text-sm font-semibold tracking-[0.12em]"
              >
                {words.code}
              </span>
              {done ? (
                <Check aria-hidden className="size-4" />
              ) : (
                <Copy aria-hidden className="size-4" />
              )}
            </button>
          ) : (
            <span className="rounded-full bg-card-ivory/15 px-2.5 py-0.5 text-xs font-semibold">
              {words.festival}
            </span>
          )}
          <button
            type="button"
            onClick={() => hiddenStore.set(offerKey)}
            aria-label={words.hide}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-card-ivory/80 transition-colors hover:text-card-ivory focus-visible:outline-2 focus-visible:outline-card-ivory"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
