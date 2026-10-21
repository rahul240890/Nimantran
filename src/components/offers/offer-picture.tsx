import { Sparkles } from "lucide-react";
import Image from "next/image";
import type { SiteOffer } from "@/lib/payments/coupons";
import { offerArtImage } from "@/lib/plans/offers";
import { cn } from "@/lib/cn";

/**
 * An offer's painting, with a light sweeping over it now and then and what it takes off on
 * top. Its holder carries `group`, so the painting leans in on hover.
 */
export function OfferPicture({
  offer,
  value,
  sizes,
  className,
  compact = false,
}: {
  offer: Pick<SiteOffer, "art">;
  /** "20% off", in the page's language. */
  value: string;
  sizes: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("offer-shine relative isolate overflow-hidden bg-night", className)}>
      <Image
        src={offerArtImage(offer.art)}
        alt=""
        fill
        sizes={sizes}
        className="-z-10 object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/45 to-night/5"
      />
      <Sparkles
        aria-hidden
        className={cn(
          "absolute animate-twinkle text-card-gold",
          compact ? "end-2 top-2 size-4" : "end-4 top-4 size-5",
        )}
      />
      {!compact && (
        <Sparkles
          aria-hidden
          className="absolute end-11 top-11 size-3.5 animate-twinkle text-card-ivory [animation-delay:1.3s]"
        />
      )}
      <p
        className={cn(
          "absolute inset-x-0 bottom-0 font-display leading-none break-words text-card-ivory drop-shadow-md",
          compact ? "p-2.5 text-xl" : "p-5 text-[2.6rem]",
        )}
      >
        {value}
      </p>
    </div>
  );
}
