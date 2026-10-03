"use client";

import { Navigation, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { cn } from "@/lib/cn";
import { eventDayStatus } from "@/lib/publish/event-day";
import type { GuestFunction } from "./guest-view";

const TICK_MS = 30_000;

function subscribe(callback: () => void) {
  const timer = window.setInterval(callback, TICK_MS / 2);
  return () => window.clearInterval(timer);
}
// Rounded, so the snapshot holds still between ticks
const clock = () => Math.floor(Date.now() / TICK_MS) * TICK_MS;
const noClock = () => null;

/**
 * On the day, a strip at the top of the guest's page: the function on now, or the next one
 * later today, with one tap to directions. Shown only in the browser, where the time is
 * known; the guest can hide it until the next function begins.
 */
export function EventDayBanner({
  functions,
  previewNow,
}: {
  functions: readonly GuestFunction[];
  /** A fixed moment, for review pages. */
  previewNow?: number;
}) {
  const { guestCopy } = useText(publishText);
  const words = guestCopy.eventDay;
  const live = useSyncExternalStore(subscribe, clock, noClock);
  const now = previewNow ?? live;
  const [hidden, setHidden] = useState<string | null>(null);
  if (now === null) return null;
  const status = eventDayStatus(functions, now);
  if (!status) return null;
  const key = `${status.kind}-${status.state}`;
  if (hidden === key) return null;
  const fn = functions.find((item) => item.kind === status.kind)!;
  const isLive = status.state === "now";

  return (
    <section
      aria-labelledby="event-day-heading"
      className="border-b border-marigold/50 bg-surface pt-[env(safe-area-inset-top)]"
    >
      <div className="bg-marigold/10">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 py-2 ps-4 pe-2 sm:ps-6 sm:pe-4">
          <div className="flex min-w-0 flex-1 basis-56 items-center gap-3">
            <span aria-hidden className="relative flex size-3 shrink-0">
              {isLive && (
                <span className="absolute inset-0 rounded-full bg-rose opacity-60 motion-safe:animate-ping" />
              )}
              <span
                className={cn("relative size-3 rounded-full", isLive ? "bg-rose" : "bg-marigold")}
              />
            </span>
            <p id="event-day-heading" className="min-w-0 leading-snug">
              <span className="block font-label text-xs tracking-[0.2em] text-accent-text uppercase">
                {isLive ? words.now : words.later}
              </span>
              <span className="block font-semibold break-words text-ink">
                {words.at(fn.name, isLive ? "" : fn.time)}
                {fn.venue && <span className="font-normal text-ink-muted"> · {fn.venue}</span>}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {fn.mapsUrl && (
              <Button asChild size="sm">
                <a href={fn.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation aria-hidden />
                  {guestCopy.directions}
                </a>
              </Button>
            )}
            <Button asChild variant="ghost" size="sm">
              <a href={`#fn-${fn.kind}`}>{words.details}</a>
            </Button>
            <IconButton
              label={words.dismiss}
              variant="ghost"
              size="sm"
              icon={<X aria-hidden />}
              onClick={() => setHidden(key)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
