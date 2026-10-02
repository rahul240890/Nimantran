import {
  ArrowRight,
  Baby,
  Briefcase,
  Cake,
  Flame,
  Flower2,
  GlassWater,
  GraduationCap,
  Hand,
  HeartHandshake,
  House,
  Lamp,
  Moon,
  Palette,
  PartyPopper,
  Rocket,
  Scissors,
  Sparkles,
  Store,
  TreePine,
  Users,
  Coffee,
  Music,
  Heart,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { suiteImage, type Occasion } from "@/lib/gallery/catalog";

/** An occasion without a tile painting yet gets an icon in its place. */
const ICONS: Record<string, LucideIcon> = {
  anniversary: Heart,
  birthday: Cake,
  "baby-shower": Baby,
  "naming-ceremony": Sparkles,
  mundan: Scissors,
  housewarming: House,
  puja: Flame,
  "thread-ceremony": Flower2,
  "fresher-party": GraduationCap,
  "welcome-party": Hand,
  "farewell-party": HeartHandshake,
  "kitty-party": Coffee,
  reunion: Users,
  retirement: Briefcase,
  party: GlassWater,
  diwali: Lamp,
  holi: Palette,
  navratri: Music,
  "ganesh-chaturthi": Flower2,
  eid: Moon,
  christmas: TreePine,
  "shop-opening": Store,
  launch: Rocket,
  "office-party": PartyPopper,
};

type TileProps = {
  occasion: Occasion;
  name: string;
  /** The name in the other language, shown small above it. */
  otherName: { text: string; lang: string } | null;
  tagline: string;
  href: string | null;
  soonLabel: string;
  /** A larger tile that leads its section. */
  feature?: boolean;
  /** The first tiles on the page load their paintings straight away. */
  priority?: boolean;
  /** A small tile in a row of many, with its name in smaller type. */
  compact?: boolean;
  className?: string;
};

/**
 * One occasion: a painted tile that opens its designs. An occasion still to come shows its
 * painting marked "Coming soon", or a quiet card with its icon until a painting exists.
 */
export function OccasionTile({
  occasion,
  name,
  otherName,
  tagline,
  href,
  soonLabel,
  feature = false,
  priority = false,
  compact = false,
  className,
}: TileProps) {
  const image =
    occasion.tile ?? (occasion.art ? suiteImage(occasion.art.suite, occasion.art.page) : null);

  if (!image) {
    const Icon = ICONS[occasion.id] ?? PartyPopper;
    return (
      <div
        data-occasion={occasion.id}
        className={cn(
          "relative flex h-full min-h-36 flex-col gap-3 overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-raised sm:p-5",
          className,
        )}
      >
        <span className="flex items-start justify-between gap-2">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong bg-surface-2 text-accent-text">
            <Icon aria-hidden className="size-5" />
          </span>
          <span className="rounded-full border border-line bg-paper px-2.5 py-1 font-label text-[0.65rem] tracking-[0.14em] text-ink-muted uppercase">
            {soonLabel}
          </span>
        </span>
        <span className="mt-auto flex min-w-0 flex-col gap-0.5">
          {otherName && (
            <span lang={otherName.lang} className="text-sm text-accent-text">
              {otherName.text}
            </span>
          )}
          <span className="font-display text-xl leading-tight break-words">{name}</span>
          <span className="text-sm text-ink-muted">{tagline}</span>
        </span>
      </div>
    );
  }

  return (
    <PaintedTile
      href={href}
      soonLabel={href ? undefined : soonLabel}
      image={image}
      name={name}
      otherName={otherName}
      tagline={tagline}
      feature={feature}
      priority={priority}
      compact={compact}
      className={className}
      data-occasion={occasion.id}
    />
  );
}

/**
 * A tile that is a painting with its name on a plain strip beneath it, leading somewhere,
 * or, with no link yet, marked as coming soon. The words never sit on the painting, so they
 * read the same on a pale haldi morning and a dark sangeet night, in either site theme.
 */
export function PaintedTile({
  href,
  soonLabel,
  image,
  name,
  otherName,
  tagline,
  feature = false,
  priority = false,
  compact = false,
  className,
  ...props
}: {
  href: string | null;
  soonLabel?: string;
  image: string;
  name: string;
  otherName: { text: string; lang: string } | null;
  tagline: string;
  feature?: boolean;
  priority?: boolean;
  compact?: boolean;
  className?: string;
  "data-occasion"?: string;
  "data-kind"?: string;
}) {
  const frame = cn(
    "group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-raised transition-[box-shadow,border-color,translate] duration-300 ease-out-expo outline-offset-3 focus-visible:outline-2 focus-visible:outline-ring",
    href &&
      "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float motion-still:hover:translate-y-0",
    className,
  );
  const inside = (
    <>
      <span
        className={cn(
          "relative isolate block w-full overflow-hidden bg-night",
          feature ? "min-h-56 flex-1 sm:min-h-72" : compact ? "aspect-square" : "aspect-[4/3]",
        )}
      >
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes={
            feature
              ? "(min-width: 64rem) 40vw, 100vw"
              : compact
                ? "(min-width: 64rem) 14vw, (min-width: 40rem) 30vw, 50vw"
                : "(min-width: 64rem) 22vw, 50vw"
          }
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100"
        />
        {soonLabel && (
          <span className="absolute end-2.5 top-2.5 rounded-full bg-night/75 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.14em] text-card-ivory uppercase backdrop-blur-sm">
            {soonLabel}
          </span>
        )}
      </span>
      <span
        className={cn(
          "flex min-w-0 items-end justify-between gap-2",
          compact ? "px-3 py-2.5" : feature ? "p-4 sm:p-5" : "p-3 sm:p-4",
        )}
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          {otherName && (
            <span lang={otherName.lang} className="text-sm leading-snug text-accent-text">
              {otherName.text}
            </span>
          )}
          <span
            className={cn(
              "font-display leading-[1.1] break-words text-ink",
              feature
                ? "text-[1.75rem] sm:text-[2.2rem]"
                : compact
                  ? "text-base sm:text-lg"
                  : "text-[1.2rem] sm:text-[1.35rem]",
            )}
          >
            {name}
          </span>
          {tagline && (
            <span className="line-clamp-2 text-sm leading-snug text-ink-muted">{tagline}</span>
          )}
        </span>
        {href && !compact && (
          <ArrowRight
            aria-hidden
            className="mb-0.5 size-5 shrink-0 text-accent-text transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 motion-still:transition-none"
          />
        )}
      </span>
    </>
  );
  return href ? (
    <Link href={href} {...props} className={frame}>
      {inside}
    </Link>
  ) : (
    <div {...props} className={frame}>
      {inside}
    </div>
  );
}
