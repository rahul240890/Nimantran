"use client";

import {
  BadgeIndianRupee,
  CalendarPlus,
  Check,
  Clapperboard,
  ContactRound,
  Images,
  Languages,
  Link2,
  MapPin,
  Music2,
  Pause,
  Play,
  Plus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { SocialIcon } from "@/components/brand/social-links";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import "./home-features.css";

/**
 * The chosen design's painting is on several of the phone's screens at different sizes; all
 * of them ask for it at the phone's width, so it comes once rather than as three sizes.
 * The Why Shubh phone (home-why.tsx) asks the same, for the same reason.
 */
const PHONE_SIZES = "17rem";

/** How long each feature's screen shows while they play. */
const FEATURE_MS = 3600;

type FeatureId = "free" | "link" | "video" | "language" | "music" | "contacts" | "photos";

/** The words the phone and the row of features use, worked out on the server. */
export type FeaturesCopy = {
  heading: string;
  pause: string;
  play: string;
  features: readonly { id: FeatureId; title: string; body: string; label: string }[];
  phone: {
    names: string;
    dateValue: string;
    free: string;
    included: readonly string[];
    zero: string;
    payLater: string;
    link: string;
    events: readonly string[];
    share: string;
    hd: string;
    status: string;
    cardLanguage: string;
    twoLanguages: string;
    music: string;
    upload: string;
    song: string;
    inInvite: string;
    inVideo: string;
    addGuests: string;
    reading: string;
    guests: readonly { name: string; people: string }[];
    added: string;
    photos: string;
  };
};

/** Each feature's sign in the row. */
const ICONS: Record<FeatureId, LucideIcon> = {
  free: BadgeIndianRupee,
  link: Link2,
  video: Clapperboard,
  language: Languages,
  music: Music2,
  contacts: ContactRound,
  photos: Images,
};

/**
 * The couple's names in each language a card can be in, shown in turn on the language screen.
 * The same on every page: they are pictures of cards, not the page's words.
 */
const SCRIPTS = [
  { lang: "en", names: "Meera & Aarav", language: "English" },
  { lang: "hi", names: "मीरा संग आरव", language: "हिंदी" },
  { lang: "mr", names: "मीरा व आरव", language: "मराठी" },
  { lang: "gu", names: "મીરા સંગ આરવ", language: "ગુજરાતી" },
  { lang: "bn", names: "মীরা ও আরভ", language: "বাংলা" },
  { lang: "ta", names: "மீரா & ஆரவ்", language: "தமிழ்" },
] as const;

/** Stand-ins for the couple's own photos, sized for small frames (as the samples use). */
const PHOTOS = ["/occasions/stand-in/engagement.webp", "/occasions/stand-in/mehendi.webp"];

const noSubscribe = () => () => {};

/** A delay for one of the screen's animations (home-features.css). */
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** A finger's tap over whatever it sits in. */
function Tap({ delay }: { delay: number }) {
  return (
    <span
      data-flow="tap"
      style={at(delay)}
      className="pointer-events-none absolute top-1/2 left-1/2 -mt-5 -ml-5 size-10 rounded-full border-2 border-marigold bg-marigold/30 opacity-0"
    />
  );
}

function Picture({
  src,
  className,
  sizes = PHONE_SIZES,
}: {
  src: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      // Small, and every screen's pictures are ready before the screen comes round
      loading="eager"
      fetchPriority="low"
      className={cn("object-cover object-top", className)}
    />
  );
}

/** A screen's title bar. */
function Bar({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center justify-between gap-2 px-3.5 pt-2 pb-2 font-display text-[0.95rem] leading-tight text-ink">
      {children}
    </p>
  );
}

/** A marigold button along the screen's foot. */
function Action({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <div data-flow="rise" style={at(delay)} className="mt-auto p-3">
      <span className="relative flex items-center justify-center gap-1.5 rounded-full bg-marigold py-2.5 text-xs font-semibold text-on-marigold shadow-raised">
        {children}
      </span>
    </div>
  );
}

/** A switch that turns on as the screen plays (resting on). */
function Toggle({ label, delay }: { label: string; delay: number }) {
  return (
    <span className="flex items-center justify-between gap-2 rounded-lg bg-surface px-2.5 py-2 text-xs font-semibold text-ink ring-1 ring-line">
      {label}
      <span
        data-flow="switch"
        style={at(delay)}
        className="relative h-4 w-7 shrink-0 rounded-full bg-success"
      >
        <span
          data-flow="knob"
          style={at(delay)}
          className="absolute end-0.5 top-0.5 size-3 rounded-full bg-paper"
        />
      </span>
    </span>
  );
}

/** The design's painting with the couple's names over it. */
function Cover({
  copy,
  picture,
  className,
}: {
  copy: FeaturesCopy["phone"];
  picture: string;
  className?: string;
}) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-xl bg-night", className)}>
      <Picture src={picture} />
      <span className="absolute inset-0 bg-linear-to-t from-night/85 via-night/15 to-transparent" />
      <span
        data-invitation
        className="absolute inset-x-2 bottom-2.5 flex flex-col items-center text-center text-card-ivory"
      >
        <span className="font-display text-lg leading-tight">{copy.names}</span>
        <span className="font-label text-[0.6rem] tracking-[0.18em] uppercase">
          {copy.dateValue}
        </span>
      </span>
    </div>
  );
}

function FreeScreen({ copy, picture }: { copy: FeaturesCopy["phone"]; picture: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative px-3 pt-2">
        <Cover copy={copy} picture={picture} className="h-52" />
        <span
          data-flow="pop"
          style={at(0.3)}
          className="absolute end-5 top-4 rounded-full bg-marigold px-2.5 py-1 font-label text-[0.62rem] tracking-[0.14em] text-on-marigold uppercase shadow-raised"
        >
          {copy.free}
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 px-3">
        {copy.included.map((item, index) => (
          <li
            key={item}
            data-flow="rise"
            style={at(0.6 + index * 0.25)}
            className="flex items-center gap-2 rounded-lg bg-surface px-2.5 py-2 text-xs font-semibold text-ink ring-1 ring-line"
          >
            <Check aria-hidden className="size-4 shrink-0 text-success" strokeWidth={3} />
            <span className="min-w-0 flex-1 truncate">{item}</span>
            <span className="text-success">{copy.zero}</span>
          </li>
        ))}
      </ul>
      <Action delay={1.6}>
        {copy.payLater}
        <Tap delay={2.3} />
      </Action>
    </div>
  );
}

function LinkScreen({ copy, picture }: { copy: FeaturesCopy["phone"]; picture: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 pt-2">
        <span className="flex h-8 items-center gap-1.5 overflow-hidden rounded-full border border-line-control bg-surface px-2.5 text-[0.62rem] text-ink">
          <Link2 aria-hidden className="size-3.5 shrink-0 text-accent-text" />
          <span data-flow="type" className="truncate" dir="ltr">
            {copy.link}
          </span>
        </span>
      </div>
      <div className="mx-3 mt-2.5 overflow-hidden rounded-xl bg-surface ring-1 ring-line">
        <Cover copy={copy} picture={picture} className="h-24 rounded-none" />
        <ul className="flex flex-col divide-y divide-line">
          {copy.events.map((event, index) => (
            <li
              key={event}
              data-flow="rise"
              style={at(0.8 + index * 0.25)}
              className="flex items-center gap-2 px-2.5 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-[0.68rem] font-semibold text-ink">
                {event}
              </span>
              <MapPin aria-hidden className="size-3.5 shrink-0 text-accent-text" />
              <CalendarPlus aria-hidden className="size-3.5 shrink-0 text-accent-text" />
            </li>
          ))}
        </ul>
      </div>
      <Action delay={1.7}>
        <SocialIcon channel="whatsapp" className="size-4" />
        {copy.share}
        <Tap delay={2.4} />
      </Action>
    </div>
  );
}

function VideoScreen({ copy, picture }: { copy: FeaturesCopy["phone"]; picture: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-night">
      <div data-flow="zoom" className="absolute inset-0">
        <Picture src={picture} />
      </div>
      <span className="absolute inset-0 bg-linear-to-t from-night/90 via-night/10 to-night/40" />
      {/* How far the video has played, as on a Status */}
      <span className="absolute inset-x-3 top-8 h-0.5 overflow-hidden rounded-full bg-card-ivory/30">
        <span
          data-flow="played"
          className="absolute inset-0 origin-left bg-card-ivory rtl:origin-right"
        />
      </span>
      <span
        data-flow="pop"
        style={at(0.4)}
        className="absolute end-3 top-11 rounded-md bg-night/70 px-1.5 py-0.5 font-label text-[0.6rem] tracking-[0.12em] text-card-ivory"
      >
        {copy.hd}
      </span>
      <span
        data-invitation
        data-flow="rise"
        style={at(0.7)}
        className="absolute inset-x-3 bottom-20 flex flex-col items-center gap-1 text-center text-card-ivory"
      >
        <span className="font-display text-2xl leading-tight">{copy.names}</span>
        <span className="font-label text-[0.65rem] tracking-[0.2em] uppercase">
          {copy.dateValue}
        </span>
      </span>
      <span
        data-flow="rise"
        style={at(1.4)}
        className="absolute inset-x-6 bottom-8 flex items-center justify-center gap-1.5 rounded-full bg-card-ivory/90 py-2 text-[0.68rem] font-semibold text-card-ink"
      >
        <Play aria-hidden className="size-3.5 fill-current" />
        {copy.status}
      </span>
    </div>
  );
}

function LanguageScreen({
  copy,
  picture,
  own,
}: {
  copy: FeaturesCopy["phone"];
  picture: string;
  own: number;
}) {
  // The page's own language comes round last and stays (English pages end on Hindi)
  const order = [...SCRIPTS.slice(own + 1), ...SCRIPTS.slice(0, own + 1)];
  const last = order.length - 1;
  return (
    <div className="flex h-full flex-col">
      <Bar>
        {copy.cardLanguage}
        <Languages aria-hidden className="size-4 text-ink-muted" />
      </Bar>
      <div className="relative mx-3 h-44 shrink-0 overflow-hidden rounded-xl bg-night">
        <Picture src={picture} />
        <span className="absolute inset-0 bg-linear-to-t from-night/85 via-night/15 to-transparent" />
        <span className="absolute inset-x-2 bottom-3 grid text-center font-system text-xl font-semibold text-card-ivory">
          {order.map((script, index) => (
            <span
              key={script.lang}
              lang={script.lang}
              data-flow={index === last ? "rise" : "word"}
              style={at(index * 0.5)}
              className={cn("col-start-1 row-start-1 leading-tight", index !== last && "opacity-0")}
            >
              {script.names}
            </span>
          ))}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 px-3">
        {SCRIPTS.map((script) => {
          const chosen = script.lang === order[last]!.lang;
          return (
            <span
              key={script.lang}
              lang={script.lang}
              data-flow={chosen ? "chip" : undefined}
              style={chosen ? at(last * 0.5) : undefined}
              className={cn(
                "truncate rounded-full border px-1 py-1 text-center font-system text-[0.68rem] font-semibold",
                chosen
                  ? "border-marigold-edge bg-marigold text-on-marigold"
                  : "border-line text-ink-muted",
              )}
            >
              {script.language}
            </span>
          );
        })}
      </div>
      <div className="mt-2.5 px-3">
        <Toggle label={copy.twoLanguages} delay={2.9} />
      </div>
    </div>
  );
}

function MusicScreen({ copy, picture }: { copy: FeaturesCopy["phone"]; picture: string }) {
  return (
    <div className="flex h-full flex-col">
      <Bar>
        {copy.music}
        <Music2 aria-hidden className="size-4 text-ink-muted" />
      </Bar>
      <div className="px-3">
        <span className="relative flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-marigold-edge bg-marigold/10 py-2.5 text-xs font-semibold text-accent-text">
          <Plus aria-hidden className="size-4" />
          {copy.upload}
          <Tap delay={0.2} />
        </span>
      </div>
      <div
        data-flow="rise"
        style={at(0.7)}
        className="mx-3 mt-3 flex items-center gap-3 rounded-xl bg-night p-3 text-card-ivory shadow-raised"
      >
        <span className="relative size-12 shrink-0 animate-spin overflow-hidden rounded-full ring-2 ring-card-ivory/30 [animation-duration:6s] motion-still:animate-none">
          <Picture src={picture} sizes="3rem" />
          <span className="absolute inset-0 m-auto size-2.5 rounded-full bg-night" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate text-xs font-semibold">{copy.song}</span>
          <span className="flex h-4 items-end gap-0.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((bar) => (
              <span
                key={bar}
                className="h-full w-1 origin-bottom animate-sound-bar rounded-full bg-marigold motion-still:animate-none"
                style={{ animationDelay: `${(bar % 4) * 0.18}s` }}
              />
            ))}
          </span>
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-1.5 px-3">
        <Toggle label={copy.inInvite} delay={1.4} />
        <Toggle label={copy.inVideo} delay={1.9} />
      </div>
    </div>
  );
}

function ContactsScreen({ copy }: { copy: FeaturesCopy["phone"] }) {
  return (
    <div className="flex h-full flex-col">
      <Bar>
        {copy.addGuests}
        <Sparkles aria-hidden className="size-4 text-accent-text" />
      </Bar>
      {/* A photo of a handwritten list, read line by line */}
      <div className="relative mx-3 h-24 shrink-0 overflow-hidden rounded-lg bg-card-ivory px-4 py-3 shadow-raised ring-1 ring-line">
        {["w-4/5", "w-3/5", "w-2/3"].map((width) => (
          <span key={width} className={cn("mb-3 block h-1.5 rounded-full bg-card-ink/40", width)} />
        ))}
        <span
          data-flow="scan"
          className="absolute inset-x-0 top-0 h-6 border-b-2 border-marigold bg-linear-to-b from-transparent to-marigold/30"
        />
      </div>
      <p
        data-flow="pop"
        style={at(0.3)}
        className="mx-3 mt-2 inline-flex items-center gap-1.5 self-start rounded-full bg-marigold/15 px-2 py-0.5 text-[0.62rem] font-semibold text-accent-text"
      >
        <Sparkles aria-hidden className="size-3" />
        {copy.reading}
      </p>
      <ul className="mt-2 flex flex-col gap-1.5 px-3">
        {copy.guests.map((guest, index) => (
          <li
            key={guest.name}
            data-flow="rise"
            style={at(1 + index * 0.3)}
            className="flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5 ring-1 ring-line"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-marigold/20 text-[0.7rem] font-semibold text-accent-text">
              {Array.from(guest.name)[0]}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-ink">{guest.name}</span>
              <span className="text-[0.62rem] text-ink-muted">{guest.people}</span>
            </span>
            <Check aria-hidden className="size-4 text-success" strokeWidth={3} />
          </li>
        ))}
      </ul>
      <p
        data-flow="pop"
        style={at(2.1)}
        className="mx-3 mt-2.5 self-center rounded-full bg-success/15 px-2.5 py-1 text-[0.68rem] font-semibold text-success"
      >
        {copy.added}
      </p>
    </div>
  );
}

function PhotosScreen({ copy }: { copy: FeaturesCopy["phone"] }) {
  return (
    <div className="flex h-full flex-col">
      <Bar>
        {copy.photos}
        <Images aria-hidden className="size-4 text-ink-muted" />
      </Bar>
      {/* An arched, painted frame, its photo coming up as the frame settles */}
      <div
        data-flow="frame"
        className="relative mx-auto mt-1 h-52 w-36 shrink-0 rounded-t-full border-4 border-card-gold bg-card-ivory p-1.5 shadow-float ring-1 ring-card-gold/50"
      >
        <span className="relative block h-full overflow-hidden rounded-t-full border border-card-gold/70">
          <span data-flow="develop" style={at(0.3)} className="absolute inset-0">
            <Picture src={PHOTOS[0]!} sizes="9rem" className="object-center" />
          </span>
        </span>
        <span className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-2 border-card-gold bg-card-ivory" />
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        <span
          data-flow="rise"
          style={at(1)}
          className="relative size-16 overflow-hidden rounded-full border-[3px] border-card-gold shadow-raised"
        >
          <Picture src={PHOTOS[1]!} sizes="4rem" className="object-center" />
        </span>
        <span
          data-flow="rise"
          style={at(1.3)}
          className="relative size-16 rotate-3 overflow-hidden rounded-md border-4 border-card-ivory shadow-raised ring-1 ring-card-gold"
        >
          <Picture src={PHOTOS[0]!} sizes="4rem" className="object-center" />
        </span>
      </div>
    </div>
  );
}

/**
 * What Shubh gives a family, played on a phone, one feature at a time: free to make, one link,
 * ready-made videos, every language, your music, AI contacts and framed photos. Every feature
 * sits in one row under the phone; the one on screen is lit, with a bar filling until the
 * next, and the features loop while the phone is in view. Pause holds them, and any feature
 * can be chosen. In still mode nothing plays by itself and each screen shows complete.
 * The phone is a picture (hidden from screen readers): the row says it in words.
 *
 * Renders as two parts of the hero's grid: the phone with its words, then the row.
 */
export function HomeFeatures({
  copy,
  picture,
  locale,
}: {
  copy: FeaturesCopy;
  /** The design's painting most screens show. */
  picture: string;
  /** The page's language, which the language screen ends on. */
  locale: string;
}) {
  const still = useReducedMotion();
  // Marks when the features answer taps, for tests that wait for the page to come alive
  const live = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const [index, setIndex] = useState(0);
  // The visitor's own choice; still mode starts paused
  const [paused, setPaused] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  // Starts the screen and its bar over when the features play again
  const [run, setRun] = useState(0);
  const phone = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLOListElement>(null);
  const total = copy.features.length;
  const holding = paused ?? still;
  const playing = !holding && inView;

  useEffect(() => {
    const node = phone.current;
    if (!node) return;
    let visible = true;
    let shown = document.visibilityState === "visible";
    let was = true;
    const update = () => {
      const now = visible && shown;
      setInView(now);
      // Back in view: the feature starts over, so its bar and its timer agree
      if (now && !was) setRun((count) => count + 1);
      was = now;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      update();
    });
    const onVisibility = () => {
      shown = document.visibilityState === "visible";
      update();
    };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % total), FEATURE_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, run, total]);

  // On a narrow screen the row scrolls: keep the lit feature in its middle, sideways only
  useEffect(() => {
    const list = row.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    const box = list.getBoundingClientRect();
    const place = item.getBoundingClientRect();
    list.scrollBy({
      left: place.left + place.width / 2 - (box.left + box.width / 2),
      behavior: still ? "auto" : "smooth",
    });
  }, [index, still]);

  const choose = (next: number) => {
    setIndex(next);
    setRun((count) => count + 1);
  };
  const toggle = () => {
    if (holding) setRun((count) => count + 1);
    setPaused(!holding);
  };
  const current = copy.features[index]!;
  const own = Math.max(
    0,
    SCRIPTS.findIndex((script) => script.lang === (locale === "en" ? "hi" : locale)),
  );
  const screens: Record<FeatureId, ReactNode> = {
    free: <FreeScreen copy={copy.phone} picture={picture} />,
    link: <LinkScreen copy={copy.phone} picture={picture} />,
    video: <VideoScreen copy={copy.phone} picture={picture} />,
    language: <LanguageScreen copy={copy.phone} picture={picture} own={own} />,
    music: <MusicScreen copy={copy.phone} picture={picture} />,
    contacts: <ContactsScreen copy={copy.phone} />,
    photos: <PhotosScreen copy={copy.phone} />,
  };

  return (
    <div
      data-flow-live={live}
      data-flow-step={index}
      data-flow-paused={playing ? undefined : ""}
      style={{ "--flow-step": `${FEATURE_MS}ms` } as CSSProperties}
      className="contents"
    >
      <div className="flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-8">
        {/* The phone */}
        <div
          ref={phone}
          aria-hidden
          className="relative h-[29rem] w-[14.5rem] shrink-0 rounded-[2.4rem] bg-night p-2 shadow-overlay ring-1 ring-line-strong sm:h-[32rem] sm:w-[16rem] dark:bg-line"
        >
          <span className="absolute top-3.5 left-1/2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-night dark:bg-line" />
          <div
            key={run}
            className="flow-screen relative h-full overflow-hidden rounded-[1.9rem] bg-paper pt-7"
          >
            {copy.features.map((feature, place) => (
              <div
                key={feature.id}
                className={cn(
                  "absolute inset-x-0 top-7 bottom-0",
                  // The video fills the whole screen, under the camera
                  feature.id === "video" && "top-0",
                  place !== index && "hidden",
                )}
              >
                {screens[feature.id]}
              </div>
            ))}
          </div>
        </div>

        {/* The feature on screen, in words */}
        <div className="flex w-full max-w-[19rem] flex-col items-center gap-3 text-center md:items-start md:rounded-2xl md:bg-surface/90 md:p-6 md:text-start md:shadow-raised md:ring-1 md:ring-line md:backdrop-blur-sm">
          <p
            aria-hidden
            className="font-label text-xs tracking-[0.18em] text-accent-text uppercase"
          >
            {current.label}
          </p>
          <p
            aria-hidden
            key={`title-${index}`}
            className="animate-rise font-display text-2xl leading-tight text-ink sm:text-3xl motion-still:animate-none"
          >
            {current.title}
          </p>
          <p aria-hidden className="min-h-[4.5rem] text-ink-muted">
            {current.body}
          </p>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:-ms-4"
          >
            {holding ? (
              <Play aria-hidden className="size-4 rtl:rotate-180" />
            ) : (
              <Pause aria-hidden className="size-4" />
            )}
            {holding ? copy.play : copy.pause}
          </button>
        </div>
      </div>

      {/* Every feature in one row: scrolls sideways on a phone, seven across on a wide screen */}
      <div className="min-w-0 xl:col-span-2">
        <h2 className="sr-only">{copy.heading}</h2>
        <ol
          ref={row}
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 xl:mx-0 xl:grid xl:grid-cols-7 xl:overflow-visible xl:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {copy.features.map((feature, place) => {
            const Icon = ICONS[feature.id];
            const active = place === index;
            return (
              <li
                key={feature.id}
                className="w-[8.75rem] shrink-0 snap-start sm:w-[10rem] xl:w-auto"
              >
                <button
                  type="button"
                  onClick={() => choose(place)}
                  aria-current={active ? "true" : undefined}
                  data-feature={feature.id}
                  className={cn(
                    "group flex h-full min-h-11 w-full cursor-pointer flex-col items-start gap-2 rounded-2xl border p-2.5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-3 motion-still:transition-none",
                    active
                      ? "border-marigold-edge bg-surface shadow-raised"
                      : "border-line bg-surface/70 hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full transition-colors motion-still:transition-none",
                      active ? "bg-marigold text-on-marigold" : "bg-marigold/15 text-accent-text",
                    )}
                  >
                    <Icon aria-hidden className="size-[1.1rem]" />
                  </span>
                  <span
                    className={cn(
                      "text-ui leading-snug font-semibold",
                      active ? "text-ink" : "text-ink-muted group-hover:text-ink",
                    )}
                  >
                    {feature.title}
                  </span>
                  {/* How long until the next feature */}
                  <span
                    aria-hidden
                    className="relative mt-auto block h-1 w-full overflow-hidden rounded-full bg-line"
                  >
                    {active && (
                      <span
                        key={`${index}-${run}`}
                        className={cn(
                          "absolute inset-0 rounded-full bg-marigold",
                          !holding && "flow-progress",
                        )}
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
