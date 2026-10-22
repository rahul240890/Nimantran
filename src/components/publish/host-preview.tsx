"use client";

import { ArrowLeft, DoorOpen, Eye, Globe, Maximize2, Send } from "lucide-react";
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
};

/**
 * The host's look at the invite, as guests will get it. On a phone (or when asked for full
 * screen) it is the guest page itself, edge to edge, with one small round button in the
 * corner for the way back. On a wide screen the guest page plays inside a phone-sized
 * frame of its own, so the host sees exactly the phone a guest holds, with the notes and
 * the next step beside it. `frame` is that inner page, with nothing of the host's.
 */
export function HostPreview({
  frame,
  full,
  frameSrc,
  fullHref,
  back,
  next,
  gateHref,
  published,
  copy,
  children,
}: {
  frame: boolean;
  full: boolean;
  frameSrc: string;
  fullHref: string;
  back: Action;
  next: Action;
  /** The editor's summary with the opening gate's dialog open, to change it. */
  gateHref: string;
  /** The invite is live: the next step is sharing it rather than publishing. */
  published: boolean;
  copy: HostPreviewCopy;
  /** The guest page. */
  children: ReactNode;
}) {
  const wide = useWide();
  // Start at the page's top, as a guest's tap on the link would: coming from the editor part
  // way down would otherwise keep its scroll, as the page only comes in once its width is known
  useEffect(() => {
    if (wide === null) return;
    let tick = requestAnimationFrame(() => {
      tick = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    });
    return () => cancelAnimationFrame(tick);
  }, [wide]);
  if (frame) return children;
  const NextIcon = published ? Send : Globe;

  // Until the browser says how wide it is, a plain page rather than the wrong layout
  if (wide === null) return <div className="min-h-dvh bg-paper" />;

  if (wide && !full) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-12 bg-paper px-8 py-6">
        <div className="shrink-0 rounded-[2.6rem] bg-night p-2.5 shadow-overlay ring-1 ring-line">
          <iframe
            src={frameSrc}
            title={copy.phone}
            allow="autoplay; fullscreen"
            data-testid="host-preview-phone"
            className="block w-[390px] rounded-[2rem] bg-night"
            style={{ height: "min(844px, calc(100dvh - 4rem))" }}
          />
        </div>
        <div className="flex max-w-sm flex-col gap-5">
          <h1 className="font-display text-[2.2rem] leading-tight">{copy.heading}</h1>
          <p className="text-ink-muted">{copy.body}</p>
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
            <Eye aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-[90] w-72">
            <DropdownMenuLabel className="font-sans text-sm leading-snug tracking-normal normal-case">
              {copy.label}
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
