"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { diyaCountdown, todayInIndia } from "@/lib/publish/countdown";

const noSubscribe = () => () => {};

/** One clay diya, lit or waiting. */
function Diya({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 24 28" className="h-7 w-6" aria-hidden>
      {lit && (
        <>
          <ellipse cx="12" cy="11" rx="7" ry="8" className="fill-motion-flame/25" />
          <path
            d="M12 3c2.6 3.4 3.4 5.8 3.4 7.6A3.4 3.4 0 0 1 12 14a3.4 3.4 0 0 1-3.4-3.4C8.6 8.8 9.4 6.4 12 3Z"
            className="origin-[12px_14px] fill-motion-flame motion-safe:animate-flicker"
          />
        </>
      )}
      <path
        d="M2 17h20c-.8 4.6-4.8 7-10 7S2.8 21.6 2 17Z"
        className={cn("fill-motion-clay", !lit && "opacity-45")}
      />
      <path d="M2 17h20" className="stroke-motion-clay" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A row of seven lamps under the couple's names: one more lights each day of the last
 * week, and all of them on the day. Reads today's date in India, so it draws only in the
 * browser (the page itself is cached).
 */
export function DiyaCountdown({
  dates,
  labels,
}: {
  /** The included functions' dates, YYYY-MM-DD. */
  dates: readonly string[];
  labels: { days: (n: number) => string; tomorrow: string; today: string };
}) {
  const today = useSyncExternalStore(noSubscribe, todayInIndia, () => null);
  const countdown = today ? diyaCountdown(dates, today) : null;
  if (!countdown) return null;
  const { daysLeft, lit, lamps } = countdown;
  const text =
    daysLeft === 0 ? labels.today : daysLeft === 1 ? labels.tomorrow : labels.days(daysLeft);

  return (
    <div
      data-testid="diya-countdown"
      className="flex flex-col items-center gap-1.5 motion-safe:animate-fade-in"
    >
      <div className="flex items-end gap-1" aria-hidden>
        {Array.from({ length: lamps }, (_, i) => (
          <Diya key={i} lit={i < lit} />
        ))}
      </div>
      <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">{text}</p>
    </div>
  );
}
