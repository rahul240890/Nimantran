"use client";

import { ArrowLeft, DoorOpen, Globe, LockKeyhole, Maximize2, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";

/** Wide enough to show the phone beside its notes. */
const WIDE = "(min-width: 64rem)";

/** True on a wide screen, false on a narrow one, null until the browser says. */
function useWide(): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(WIDE);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE).matches,
    () => null,
  );
}

type Action = { href: string; label: string };

export type HostPreviewCopy = {
  label: string;
  heading: string;
  body: string;
  phone: string;
  fullScreen: string;
  menu: string;
  changeGate: string;
  linkLabel: string;
  markNote: string;
};

const noSubscribe = () => () => {};

/** This site's address as the browser has it, for the link the invitation gets. */
function useHost(): string {
  return useSyncExternalStore(
    noSubscribe,
    () => window.location.host,
    () => "",
  );
}

/**
 * The invitation's web address, as a browser's address bar shows it (owner, 2026-11-03: the
 * host should feel they get a website, a real link, not a "preview").
 */
function AddressBar({ path, label }: { path: string; label: string }) {
  const host = useHost();
  return (
    <p
      data-testid="host-preview-address"
      className="flex min-h-9 w-full min-w-0 items-center gap-2 rounded-full bg-surface px-3.5 text-sm text-ink-muted ring-1 ring-line"
    >
      <LockKeyhole aria-hidden className="size-3.5 shrink-0 text-success" />
      <span className="sr-only">{label}: </span>
      <span className="min-w-0 truncate">
        {host}
        <span className="font-semibold text-ink">{path}</span>
      </span>
    </p>
  );
}

/**
 * The host's look at the invite, as guests will get it: the guest page itself, edge to edge
 * on every screen (owner, 2026-11-03: Website opens full screen, on a laptop's demo too),
 * with one small round button in the corner for the way back. Asked for the phone
 * (`phone`), a wide screen plays the guest page inside a phone-sized frame of its own, with
 * the notes and the next step beside it. `frame` is that inner page, with nothing of the
 * host's.
 */
export function HostPreview({
  frame,
  phone,
  frameSrc,
  fullHref,
  back,
  next,
  gateHref,
  published,
  link,
  marked = false,
  nextIcon,
  copy,
  children,
}: {
  frame: boolean;
  /** On a wide screen, inside a phone with the notes beside it rather than full screen. */
  phone: boolean;
  frameSrc: string;
  fullHref: string;
  back: Action;
  next: Action;
  /** The editor's summary with the opening gate's dialog open, to change it. */
  gateHref: string;
  /** The invite is live: the next step is sharing it rather than publishing. */
  published: boolean;
  /** The invitation's own web address on this site ("/i/aarav-weds-meera"), as guests get it. */
  link?: string;
  /** Tried before signing in: it carries the mark until it is published. */
  marked?: boolean;
  /** The next step's icon, in place of Publish's or Share's. */
  nextIcon?: typeof Globe;
  copy: HostPreviewCopy;
  /** The guest page. */
  children: ReactNode;
}) {
  const wide = useWide();
  // Start at the page's top, as a guest's tap on the link would: coming from the editor part
  // way down would otherwise keep its scroll
  const known = !phone || wide !== null;
  useEffect(() => {
    if (!known) return;
    let tick = requestAnimationFrame(() => {
      tick = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    });
    return () => cancelAnimationFrame(tick);
  }, [known]);
  if (frame) return children;
  const NextIcon = nextIcon ?? (published ? Send : Globe);

  // Asked for the phone, until the browser says how wide it is: the opening's dark stage
  // rather than the wrong layout or an empty page. Full screen needs no width, so it
  // comes at once
  if (phone && wide === null) return <div className="min-h-dvh bg-night" />;

  if (phone && wide) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-12 bg-paper px-8 py-6">
        <div className="flex w-[410px] shrink-0 flex-col gap-3">
          {link && <AddressBar path={link} label={copy.linkLabel} />}
          <div className="rounded-[2.6rem] bg-night p-2.5 shadow-overlay ring-1 ring-line">
            <iframe
              src={frameSrc}
              title={copy.phone}
              allow="autoplay; fullscreen"
              data-testid="host-preview-phone"
              className="block w-[390px] rounded-[2rem] bg-night"
              style={{
                height: link
                  ? "min(844px, calc(100dvh - 7rem))"
                  : "min(844px, calc(100dvh - 4rem))",
              }}
            />
          </div>
        </div>
        <div className="flex max-w-sm flex-col gap-5">
          <h1 className="font-display text-[1.9rem] leading-tight">{copy.heading}</h1>
          <p className="text-ink-muted">{copy.body}</p>
          {marked && <p className="text-sm text-ink-muted">{copy.markNote}.</p>}
          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <Link href={next.href}>
                <NextIcon aria-hidden className="rtl:-scale-x-100" />
                {next.label}
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={back.href}>
                <ArrowLeft aria-hidden className="rtl:rotate-180" />
                {back.label}
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={gateHref}>
                <DoorOpen aria-hidden />
                {copy.changeGate}
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={fullHref}>
                <Maximize2 aria-hidden />
                {copy.fullScreen}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* The host's only mark on the page: one small button, above even the playing pages */}
      <div className="fixed start-3 top-[calc(max(0.75rem,env(safe-area-inset-top))+0.75rem)] z-[80] print:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            aria-label={copy.menu}
            data-testid="host-preview-menu"
            className={cn(
              buttonClasses({ variant: "secondary", size: "sm" }),
              "size-11 rounded-full border-transparent bg-night/45 px-0 text-card-ivory shadow-none backdrop-blur-sm hover:bg-night/65 hover:text-card-ivory data-[state=open]:bg-night/65",
            )}
          >
            <Globe aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-[90] w-72">
            <DropdownMenuLabel className="flex flex-col gap-2 font-sans text-sm leading-snug tracking-normal normal-case">
              {copy.label}
              {link && <AddressBar path={link} label={copy.linkLabel} />}
              {marked && <span className="text-xs text-ink-muted">{copy.markNote}</span>}
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className="ps-3">
              <Link href={next.href}>
                <NextIcon aria-hidden className="size-4.5 text-accent-text rtl:-scale-x-100" />
                {next.label}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="ps-3">
              <Link href={back.href}>
                <ArrowLeft aria-hidden className="size-4.5 text-ink-muted rtl:rotate-180" />
                {back.label}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="ps-3">
              <Link href={gateHref}>
                <DoorOpen aria-hidden className="size-4.5 text-ink-muted" />
                {copy.changeGate}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
