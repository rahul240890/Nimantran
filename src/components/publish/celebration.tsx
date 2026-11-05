"use client";

import {
  ArrowRight,
  Check,
  Clapperboard,
  Copy,
  Gift,
  Lock,
  MessageCircle,
  PartyPopper,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/ui/toast";
import type { PerkFacts } from "@/content/celebrate";
import { useText } from "@/i18n/client";
import { celebrateText } from "@/i18n/copy/celebrate";
import { editionsText } from "@/i18n/copy/editions";
import { cn } from "@/lib/cn";
import {
  CELEBRATE_PARAM,
  CELEBRATED_KEY,
  CELEBRATION_LOOKS,
  celebrationImage,
  type CelebrationFamily,
  type CelebrationParticles,
  type PerkId,
  type Suggestion,
} from "@/lib/publish/celebrate";
import { whatsappShareUrl } from "@/lib/publish/links";
import type { PlanId, PaidPlanId } from "@/lib/plans/catalog";
import type { Faith } from "@/lib/traditions/faith";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type CelebrationPerk = {
  id: PerkId;
  included: boolean;
  from: PaidPlanId | null;
  facts: PerkFacts;
};

type CelebrationProps = {
  inviteId: string;
  url: string;
  names: string;
  /** The share message with the link, as WhatsApp gets it. */
  message: string;
  family: CelebrationFamily;
  blessing: Exclude<Faith, "none"> | null;
  /** The package on the live design; null while payments are off and everything is free. */
  plan: PlanId | null;
  perks: CelebrationPerk[];
  suggestion: (Suggestion & { price: string | null }) | null;
  /** Just published: play the celebration once, as the page arrives. */
  arrived: boolean;
};

/** Invites whose celebration has played on this device. */
function celebrated(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem(CELEBRATED_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function markCelebrated(inviteId: string) {
  try {
    const ids = celebrated().filter((id) => id !== inviteId);
    localStorage.setItem(CELEBRATED_KEY, JSON.stringify([...ids, inviteId].slice(-50)));
  } catch {
    // Private windows can refuse storage; the address losing ?celebrate= still stops a replay
  }
}

/**
 * The moment an invitation goes live (owner, 2026-11-04): the occasion's painting and wishes,
 * what the package lets the host do now and what it leaves out, and one next package. It
 * opens once over the share page after publishing and lifts away to it; the button it
 * renders opens it again later, still.
 */
export function Celebration(props: CelebrationProps) {
  const { celebrateCopy } = useText(celebrateText);
  const [open, setOpen] = useState(false);
  const [play, setPlay] = useState(false);

  // Once per invite, on the visit that follows publishing; the address drops the flag so
  // a refresh or the back button never plays it again
  useEffect(() => {
    if (!props.arrived) return;
    const url = new URL(window.location.href);
    url.searchParams.delete(CELEBRATE_PARAM);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    if (celebrated().includes(props.inviteId)) return;
    markCelebrated(props.inviteId);
    // Opening as the page wakes, in the effect that reads the device's storage
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlay(true);
    setOpen(true);
  }, [props.arrived, props.inviteId]);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setPlay(false);
      }}
    >
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="self-start"
          leadingIcon={<Gift aria-hidden />}
          data-testid="celebration-reopen"
        >
          {celebrateCopy.reopen}
        </Button>
      </DialogPrimitive.Trigger>
      {open && <CelebrationSheet {...props} play={play} onClose={() => setOpen(false)} />}
    </DialogPrimitive.Root>
  );
}

function CelebrationSheet({
  inviteId,
  url,
  names,
  message,
  family,
  blessing,
  plan,
  perks,
  suggestion,
  play,
  onClose,
}: CelebrationProps & { play: boolean; onClose: () => void }) {
  const { celebrateCopy } = useText(celebrateText);
  const { planCopy } = useText(editionsText);
  const still = useReducedMotion();
  const look = CELEBRATION_LOOKS[family];
  const wish = celebrateCopy.wishes[family];
  const moving = play && !still;
  const included = perks.filter((perk) => perk.included);
  const missing = perks.filter((perk) => !perk.included);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: celebrateCopy.copied, tone: "success" });
    } catch {
      toast({ title: celebrateCopy.copyFailed, tone: "error" });
    }
  };

  // Each part rises in after the painting when it plays; still, everything is simply there
  const rise = (delay: number): { className: string; style?: CSSProperties } =>
    moving
      ? {
          className: "animate-[celebrate-rise-in_700ms_var(--ease-out-expo)_both]",
          style: { animationDelay: `${delay}ms` },
        }
      : { className: "" };

  const perkHref = (id: PerkId): string | null => {
    switch (id) {
      case "share":
        return null;
      case "guests":
      case "aiList":
        return `/invites/${inviteId}`;
      case "noMark":
        return url;
      case "video":
        return `/invites/${inviteId}/video`;
      case "photoWall":
        return `/invites/${inviteId}/photos`;
      case "cohosts":
        return `/invites/${inviteId}#cohosts-heading`;
      case "cards":
        return `/invites/${inviteId}/cards`;
      case "priority":
        return "/contact";
    }
  };

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        data-testid="celebration"
        data-family={family}
        className="fixed inset-0 z-50 flex flex-col bg-paper text-ink outline-none data-[state=open]:animate-fade-in"
      >
        <DialogPrimitive.Title className="sr-only">{celebrateCopy.title}</DialogPrimitive.Title>

        {moving && look.particles !== "none" && <Particles kind={look.particles} />}

        <div className="relative z-[2] min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {look.toran && (
            <div
              aria-hidden
              className={cn(
                "pointer-events-none h-14 w-full bg-[url(/celebrate/toran.webp)] bg-[length:auto_100%] bg-repeat-x sm:h-20",
                moving && "animate-[celebrate-drop_900ms_var(--ease-out-expo)_both]",
              )}
            />
          )}

          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-6 pb-10 sm:px-6 sm:pt-8 lg:px-8">
            {/* The moment: the occasion's painting, the names and the wish */}
            <section
              aria-labelledby="celebration-wish"
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="relative grid w-[min(62vw,17rem)] place-items-center sm:w-72 lg:w-80">
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-[-12%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--marigold)_42%,transparent),transparent)]",
                    moving && "animate-[celebrate-halo_3.6s_ease-in-out_900ms_infinite]",
                  )}
                />
                <div
                  className={cn(
                    "relative w-full",
                    moving && "animate-[celebrate-bloom_1100ms_var(--ease-out-expo)_both]",
                  )}
                >
                  <Image
                    src={celebrationImage(family)}
                    alt=""
                    width={720}
                    height={720}
                    priority
                    unoptimized
                    className={cn(
                      "h-auto w-full drop-shadow-[0_18px_28px_color-mix(in_srgb,var(--ink)_22%,transparent)]",
                      moving &&
                        "origin-bottom animate-[celebrate-sway_5s_ease-in-out_1200ms_infinite]",
                    )}
                  />
                </div>
              </div>
              {names && (
                <p
                  style={rise(350).style}
                  className={cn(
                    "font-card-display text-3xl leading-tight break-words text-accent-text sm:text-4xl",
                    rise(350).className,
                  )}
                >
                  {names}
                </p>
              )}
              <h2
                id="celebration-wish"
                style={rise(550).style}
                className={cn(
                  "max-w-2xl font-display text-2xl leading-snug text-balance sm:text-4xl",
                  rise(550).className,
                )}
              >
                {wish.wish}
              </h2>
              <p
                style={rise(750).style}
                className={cn("max-w-xl text-ink-muted", rise(750).className)}
              >
                {wish.note}
              </p>
              {blessing && (
                <p
                  style={rise(950).style}
                  className={cn(
                    "flex items-center gap-3 font-label text-xs tracking-[0.24em] text-accent-text uppercase",
                    rise(950).className,
                  )}
                >
                  <span aria-hidden className="h-px w-8 bg-card-gold" />
                  {celebrateCopy.blessing[blessing]}
                  <span aria-hidden className="h-px w-8 bg-card-gold" />
                </p>
              )}
            </section>

            <div
              style={rise(1150).style}
              className={cn(
                "grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
                rise(1150).className,
              )}
            >
              {/* What the package gives, and what it leaves out */}
              <section
                aria-labelledby="celebration-package"
                className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5 shadow-raised sm:p-6"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-label text-xs tracking-[0.2em] text-accent-text uppercase">
                    {celebrateCopy.packageEyebrow}
                  </p>
                  <h2 id="celebration-package" className="font-display text-2xl leading-tight">
                    {plan
                      ? celebrateCopy.packageName(planCopy[plan].name)
                      : celebrateCopy.everything}
                  </h2>
                  {!plan && (
                    <p className="text-sm text-ink-muted">{celebrateCopy.everythingBody}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold">{celebrateCopy.canNow}</h3>
                  <ul
                    className="flex flex-col divide-y divide-line"
                    data-testid="celebration-perks"
                  >
                    {included.map((perk) => {
                      const words = celebrateCopy.perks[perk.id];
                      const href = perkHref(perk.id);
                      return (
                        <li
                          key={perk.id}
                          data-perk={perk.id}
                          className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-3"
                        >
                          <span className="flex min-w-0 flex-1 items-start gap-2.5">
                            <span
                              aria-hidden
                              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success"
                            >
                              <Check className="size-3.5" strokeWidth={3} />
                            </span>
                            <span className="min-w-0 break-words">{words.title(perk.facts)}</span>
                          </span>
                          {href ? (
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="-ms-2 self-start ps-9 sm:ms-0 sm:self-auto sm:ps-4"
                            >
                              <Link
                                href={href}
                                {...(perk.id === "noMark"
                                  ? { target: "_blank", rel: "noopener noreferrer" }
                                  : {})}
                              >
                                {words.action}
                                <ArrowRight aria-hidden className="rtl:rotate-180" />
                              </Link>
                            </Button>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {missing.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-ink-muted">
                      {celebrateCopy.notIncluded}
                    </h3>
                    <ul
                      className="flex flex-col divide-y divide-line"
                      data-testid="celebration-missing"
                    >
                      {missing.map((perk) => (
                        <li
                          key={perk.id}
                          data-perk={perk.id}
                          className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-3"
                        >
                          <span className="flex min-w-0 flex-1 items-start gap-2.5 text-ink-muted">
                            <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
                            <span className="min-w-0 break-words">
                              {celebrateCopy.perks[perk.id].title(perk.facts)}
                            </span>
                          </span>
                          {perk.from && (
                            <Link
                              href={`/invites/${inviteId}/edition?plan=${perk.from}`}
                              className="inline-flex min-h-11 items-center self-start rounded-md ps-6.5 text-sm font-semibold text-accent-text underline-offset-4 hover:underline sm:self-auto sm:ps-0"
                            >
                              {celebrateCopy.inPlan(planCopy[perk.from].name)}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              <div className="flex min-w-0 flex-col gap-6">
                {/* Send it straight from here */}
                <section
                  aria-labelledby="celebration-live"
                  className="flex flex-col gap-4 rounded-xl border border-success/35 bg-success/5 p-5 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <PartyPopper aria-hidden className="mt-0.5 size-6 shrink-0 text-success" />
                    <div className="flex min-w-0 flex-col gap-1">
                      <h2 id="celebration-live" className="font-display text-xl leading-tight">
                        {celebrateCopy.liveHeading}
                      </h2>
                      <p className="text-sm text-ink-muted">{celebrateCopy.liveBody}</p>
                    </div>
                  </div>
                  <p className="rounded-md border border-line bg-surface px-3.5 py-3 text-sm font-medium break-all select-all">
                    {url}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild>
                      <a href={whatsappShareUrl(message)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle aria-hidden />
                        {celebrateCopy.whatsapp}
                      </a>
                    </Button>
                    <Button
                      variant="secondary"
                      leadingIcon={<Copy aria-hidden />}
                      onClick={() => void copy()}
                    >
                      {celebrateCopy.copy}
                    </Button>
                  </div>
                </section>

                {/* One next package, the most useful thing it adds */}
                {suggestion && (
                  <section
                    aria-labelledby="celebration-suggestion"
                    data-testid="celebration-suggestion"
                    data-plan={suggestion.plan}
                    className="flex flex-col gap-4 rounded-xl border border-marigold/50 bg-marigold/10 p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="flex items-center gap-1.5 font-label text-xs tracking-[0.2em] text-accent-text uppercase">
                        <Sparkles aria-hidden className="size-4" />
                        {celebrateCopy.suggestion.eyebrow}
                      </p>
                      <h2
                        id="celebration-suggestion"
                        className="font-display text-xl leading-tight"
                      >
                        {celebrateCopy.suggestion.titles[suggestion.reason]}
                      </h2>
                      <p className="text-sm text-ink-muted">
                        {celebrateCopy.suggestion.bodies[suggestion.reason]}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Button asChild>
                        <Link href={`/invites/${inviteId}/edition?plan=${suggestion.plan}`}>
                          <Sparkles aria-hidden />
                          {celebrateCopy.suggestion.upgrade(
                            planCopy[suggestion.plan].name,
                            suggestion.price,
                          )}
                        </Link>
                      </Button>
                      {suggestion.reason === "video" && (
                        <Button asChild variant="secondary">
                          <Link href={`/invites/${inviteId}/video`}>
                            <Clapperboard aria-hidden />
                            {celebrateCopy.suggestion.watch}
                          </Link>
                        </Button>
                      )}
                    </div>
                    {suggestion.price && plan !== "free" && (
                      <p className="text-xs text-ink-muted">
                        {celebrateCopy.suggestion.difference}
                      </p>
                    )}
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-[2] border-t border-line bg-paper/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl justify-end">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={onClose}
              data-testid="celebration-start"
            >
              {celebrateCopy.startSharing}
              <ArrowRight aria-hidden className="rtl:rotate-180" />
            </Button>
          </div>
        </div>

        <DialogPrimitive.Close
          aria-label={celebrateCopy.close}
          className="absolute end-2 top-2 z-[3] grid size-11 cursor-pointer place-items-center rounded-full bg-surface/85 text-ink shadow-raised backdrop-blur transition-colors hover:bg-surface"
        >
          <X aria-hidden className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

const PIECES: Record<Exclude<CelebrationParticles, "none">, { prefix: string; kinds: number }> = {
  petals: { prefix: "petal", kinds: 12 },
  confetti: { prefix: "confetti", kinds: 16 },
  balloons: { prefix: "balloon", kinds: 6 },
};

/** A steady scatter, the same on every visit: no random numbers between renders. */
const scatter = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

/** Petals and confetti fall, balloons rise; a few times over, then the page is calm. */
function Particles({ kind }: { kind: Exclude<CelebrationParticles, "none"> }) {
  const { prefix, kinds } = PIECES[kind];
  const count = kind === "balloons" ? 14 : 30;
  const rising = kind === "balloons";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {Array.from({ length: count }, (_, index) => {
        const size = rising ? 44 + scatter(index, 1) * 30 : 18 + scatter(index, 1) * 22;
        const duration = rising ? 6 + scatter(index, 2) * 3 : 4.5 + scatter(index, 2) * 3.5;
        const style = {
          left: `${scatter(index, 3) * 96}%`,
          width: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${scatter(index, 4) * (rising ? 2.5 : 3.5)}s`,
          "--drift": `${(scatter(index, 5) - 0.5) * 16}vw`,
          "--spin": `${(scatter(index, 6) > 0.5 ? 1 : -1) * (240 + scatter(index, 7) * 360)}deg`,
        } as CSSProperties;
        return (
          // eslint-disable-next-line @next/next/no-img-element -- tiny pieces, already sized
          <img
            key={index}
            src={`/celebrate/${prefix}-${index % kinds}.webp`}
            alt=""
            decoding="async"
            style={style}
            className={cn(
              "absolute h-auto opacity-0 will-change-transform max-sm:[&:nth-child(3n)]:hidden",
              rising
                ? "top-0 animate-[celebrate-rise_7s_ease-out_both_2]"
                : "top-0 animate-[celebrate-fall_6s_linear_both_3]",
            )}
          />
        );
      })}
    </div>
  );
}
