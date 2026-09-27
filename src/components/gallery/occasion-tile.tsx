import {
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
 * A tile that is a painting with its name printed at the foot, leading somewhere, or, with
 * no link yet, marked as coming soon.
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
    "group relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-night shadow-float outline-offset-3 focus-visible:outline-2 focus-visible:outline-ring",
    feature ? "h-full min-h-80 sm:min-h-[26rem]" : "aspect-[4/5]",
    className,
  );
  const inside = (
    <>
      {soonLabel && (
        <span className="absolute end-2.5 top-2.5 rounded-full bg-night/70 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.14em] text-card-ivory uppercase backdrop-blur-sm">
          {soonLabel}
        </span>
      )}
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        sizes={
          feature
            ? "(min-width: 64rem) 40vw, 100vw"
            : compact
              ? "(min-width: 64rem) 12vw, (min-width: 40rem) 30vw, 50vw"
              : "(min-width: 64rem) 20vw, 50vw"
        }
        className="-z-10 object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100"
      />
      {/* The painting darkens towards the words, whatever the site's theme */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/35 to-transparent"
      />
      <span
        className={cn(
          "flex flex-col gap-0.5 text-card-ivory",
          compact ? "p-3 sm:p-3.5" : "p-4 sm:p-5",
        )}
      >
        {otherName && (
          <span lang={otherName.lang} className="text-sm text-card-ivory/85">
            {otherName.text}
          </span>
        )}
        <span
          className={cn(
            "font-display leading-[1.05]",
            feature
              ? "text-[2rem] break-words sm:text-[2.6rem]"
              : compact
                ? "text-base sm:text-xl lg:text-base"
                : "text-[1.35rem] break-words sm:text-2xl",
          )}
        >
          {name}
        </span>
        {tagline && <span className="text-sm text-card-ivory/85">{tagline}</span>}
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
