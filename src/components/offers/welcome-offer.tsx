"use client";

import {
  ArrowRight,
  CalendarClock,
  Check,
  Clapperboard,
  Copy,
  Eye,
  Globe,
  Languages,
  Music2,
  Sparkles,
  SquareLibrary,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { Mandala } from "@/components/brand/mandala";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/ui/toast";
import { useLocale, useText } from "@/i18n/client";
import { offersText } from "@/i18n/copy/offers";
import { intlLocale } from "@/i18n/locales";
import type { SiteOffer } from "@/lib/payments/coupons";
import { pagePath } from "@/lib/seo/paths";
import { cn } from "@/lib/cn";
import { offerValueIn, useSiteOffers } from "./use-site-offers";

/*
 * The popup a visitor sees once, on their first visit to the home page or a public page:
 * the featured offer running now (Admin, Offers), so it always matches the offer bar and
 * checkout, and what Shubh makes at a glance. Never on a guest's invitation page. Seen once
 * per device; ?welcome on any public page shows it again, for checking how it looks.
 */

/** Set once the popup has shown on this device. */
const SEEN_KEY = "shubhdwar-welcome-seen";

/** How long the page shows by itself before the popup comes up. */
const DELAY_MS = 1400;

type FeatureId = "website" | "video" | "cards" | "music" | "language" | "preview";

/**
 * The paintings. Null shows a painted-look placeholder: a medallion with the feature's sign.
 * Each one the owner sends goes in public/welcome/ under its id and is named here.
 */
const HERO_ART = "/occasions/festival.webp";
const FEATURE_ART: Record<FeatureId, string | null> = {
  website: null,
  video: null,
  cards: null,
  music: null,
  language: null,
  preview: null,
};

const ICONS: Record<FeatureId, LucideIcon> = {
  website: Globe,
  video: Clapperboard,
  cards: SquareLibrary,
  music: Music2,
  language: Languages,
  preview: Eye,
};

/** Each placeholder's wash, so the six read apart. */
const WASH: Record<FeatureId, string> = {
  website: "from-marigold/35 via-marigold/10 to-rose/15 text-accent-text",
  video: "from-rose/30 via-rose/10 to-marigold/15 text-rose",
  cards: "from-card-gold/35 via-card-ivory/30 to-marigold/15 text-card-gold-text",
  music: "from-success/25 via-success/5 to-marigold/15 text-success",
  language: "from-marigold/30 via-card-ivory/20 to-success/15 text-accent-text",
  preview: "from-rose/25 via-marigold/10 to-card-gold/25 text-rose",
};

/** Decided once per page load, however many times the popup's holder mounts. */
let decided = false;

function shouldShow(): boolean {
  if (decided) return false;
  decided = true;
  if (new URLSearchParams(window.location.search).has("welcome")) return true;
  // Headless browsers and test runs never see it
  if (navigator.webdriver) return false;
  try {
    if (localStorage.getItem(SEEN_KEY)) return false;
    localStorage.setItem(SEEN_KEY, new Date().toISOString());
    return true;
  } catch {
    // Storage blocked: it would show on every page, so it shows on none
    return false;
  }
}

export function WelcomeOffer() {
  const offers = useSiteOffers();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Waits for the offers, so the popup comes up whole
    if (offers === null) return;
    if (!shouldShow()) return;
    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [offers]);

  if (offers === null) return null;
  const offer = offers.find((entry) => entry.featured) ?? offers[0] ?? null;
  return <WelcomeDialog open={open} onOpenChange={setOpen} offer={offer} />;
}

function WelcomeDialog({
  open,
  onOpenChange,
  offer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: SiteOffer | null;
}) {
  const words = useText(offersText);
  const copy = words.welcome;
  const locale = useLocale();
  const start = useRef<HTMLAnchorElement>(null);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim backdrop-blur-[3px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
          <DialogPrimitive.Content
            data-welcome-offer={offer?.code ?? ""}
            aria-label={copy.label}
            aria-describedby={undefined}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              // Without scrolling, so a phone opens on the offer, not on the buttons below it
              start.current?.focus({ preventScroll: true });
            }}
            className={cn(
              "pointer-events-auto relative grid max-h-[calc(100dvh-24px)] w-full max-w-md overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface text-ink shadow-overlay outline-none",
              "md:max-w-5xl md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:overflow-hidden",
              "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
            )}
          >
            <OfferSide offer={offer} />

            <div className="flex min-h-0 flex-col md:overflow-y-auto">
              <div className="flex flex-col gap-2 px-5 pt-5 sm:px-7 sm:pt-7 md:pe-16">
                <DialogPrimitive.Title className="font-display text-2xl leading-tight text-balance sm:text-3xl">
                  {copy.heading}
                </DialogPrimitive.Title>
                <p className="text-ink-muted">{copy.intro}</p>
              </div>

              <ul className="grid grid-cols-2 gap-3 px-5 py-5 sm:grid-cols-3 sm:gap-4 sm:px-7">
                {copy.features.map((feature, index) => (
                  <FeatureTile
                    key={feature.id}
                    id={feature.id}
                    title={feature.title}
                    body={feature.body}
                    index={index}
                  />
                ))}
              </ul>

              {/* Stays in view while the features scroll, so the way on and the way out are always there */}
              <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-2 border-t border-line bg-surface px-5 py-3 sm:flex sm:items-center sm:px-7 sm:py-4">
                <Button asChild size="md" className="col-span-2 sm:order-last sm:ms-auto">
                  <Link
                    ref={start}
                    href={pagePath({ kind: "gallery" }, locale)}
                    onClick={() => onOpenChange(false)}
                  >
                    {copy.start}
                    <ArrowRight aria-hidden className="rtl:rotate-180" />
                  </Link>
                </Button>
                {offer && (
                  <Button
                    asChild
                    variant="secondary"
                    size="md"
                    // The code and its dates are already on the painting: a phone keeps to the two ways on
                    className="hidden sm:inline-flex"
                  >
                    <Link
                      href={pagePath({ kind: "offers" }, locale)}
                      onClick={() => onOpenChange(false)}
                    >
                      {copy.allOffers}
                    </Link>
                  </Button>
                )}
                <DialogPrimitive.Close asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="col-span-2 h-auto min-h-11 py-2 text-balance whitespace-normal sm:h-12 sm:text-ui"
                  >
                    {copy.later}
                  </Button>
                </DialogPrimitive.Close>
              </div>
            </div>

            <DialogPrimitive.Close
              aria-label={copy.close}
              className="absolute end-2 top-2 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-night/55 text-card-ivory backdrop-blur-sm transition-colors hover:bg-night/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-card-ivory md:bg-surface-2 md:text-ink md:hover:bg-line md:focus-visible:outline-ring"
            >
              <X aria-hidden className="size-5" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** The painting with the offer on it: what it takes off, its code, until when. */
function OfferSide({ offer }: { offer: SiteOffer | null }) {
  const words = useText(offersText);
  const copy = words.welcome;
  const locale = useLocale();
  const ends =
    offer?.endsAt &&
    new Intl.DateTimeFormat(intlLocale[locale], {
      day: "numeric",
      month: "long",
      timeZone: "Asia/Kolkata",
    }).format(new Date(offer.endsAt));

  return (
    <div className="offer-shine relative isolate flex min-h-72 flex-col justify-end overflow-hidden bg-night p-5 pt-28 text-card-ivory sm:min-h-80 sm:p-7 sm:pt-32 md:min-h-[36rem]">
      <Image
        src={HERO_ART}
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 26rem, 100vw"
        className="-z-10 animate-welcome-drift object-cover motion-still:animate-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/60 to-night/0"
      />
      <Sparkles
        aria-hidden
        className="absolute start-6 top-6 size-5 animate-twinkle text-card-gold"
      />
      <Sparkles
        aria-hidden
        className="absolute start-14 top-14 size-3.5 animate-twinkle text-card-ivory [animation-delay:1.3s]"
      />

      {offer ? (
        <div className="flex flex-col gap-3">
          <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-card-ivory/15 px-3 py-1 font-label text-xs tracking-[0.14em] uppercase backdrop-blur-sm">
            <Sparkles aria-hidden className="size-3.5 text-card-gold" />
            {offer.label || words.festival}
          </p>
          <p className="font-display text-5xl leading-none drop-shadow-md sm:text-6xl">
            {offerValueIn(words, offer)}
          </p>
          {offer.description && (
            <p className="max-w-sm text-card-ivory/90 drop-shadow">{offer.description}</p>
          )}
          {offer.autoApply ? (
            <p className="text-sm text-card-ivory/85">{words.noCode}</p>
          ) : (
            <CodeChip code={offer.code} hint={copy.codeHint} />
          )}
          {ends && (
            <p className="inline-flex items-center gap-1.5 text-sm text-card-ivory/85">
              <CalendarClock aria-hidden className="size-4 shrink-0" />
              {words.validTill(ends)}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="font-display text-3xl leading-tight text-balance drop-shadow-md sm:text-4xl">
            {copy.noOfferTitle}
          </p>
          <p className="max-w-sm text-card-ivory/90">{copy.noOfferBody}</p>
        </div>
      )}
    </div>
  );
}

function CodeChip({ code, hint }: { code: string; hint: string }) {
  const words = useText(offersText);
  const [done, setDone] = useState(false);
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      toast({ title: words.copied, tone: "success" });
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      toast({ title: words.copyFailed, tone: "error" });
    }
  };
  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={copyCode}
        aria-label={`${words.copyCode}: ${code}`}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-md border border-dashed border-card-gold bg-night/45 px-3 backdrop-blur-sm transition-colors hover:bg-night/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-card-ivory"
      >
        <span translate="no" className="font-mono text-lg font-semibold tracking-[0.16em]">
          {code}
        </span>
        {done ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
      </button>
      <p className="text-xs text-card-ivory/80">{hint}</p>
    </div>
  );
}

function FeatureTile({
  id,
  title,
  body,
  index,
}: {
  id: FeatureId;
  title: string;
  body: string;
  index: number;
}) {
  const art = FEATURE_ART[id];
  const Icon = ICONS[id];
  return (
    <li
      className="flex animate-rise flex-col gap-2 motion-still:animate-none"
      style={{ animationDelay: `${120 + index * 70}ms` }}
    >
      <div
        className={cn(
          "relative isolate grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-line",
          !art && "bg-linear-to-br",
          !art && WASH[id],
        )}
      >
        {art ? (
          <Image
            src={art}
            alt=""
            fill
            sizes="(min-width: 768px) 11rem, 45vw"
            className="object-cover"
          />
        ) : (
          <>
            <Mandala
              simple
              className="absolute -end-6 -bottom-6 -z-10 size-24 opacity-20 sm:size-28"
            />
            <span className="grid size-12 place-items-center rounded-full bg-surface/80 shadow-raised ring-1 ring-current/25 sm:size-14">
              <Icon aria-hidden className="size-6 sm:size-7" />
            </span>
          </>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm leading-snug font-semibold">{title}</h3>
        <p className="text-xs leading-snug text-ink-muted">{body}</p>
      </div>
    </li>
  );
}
