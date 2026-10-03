"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { recentOpens } from "@/lib/guests/list";
import type { DashboardView } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { timeAgo } from "@/i18n/dates";
import { dashboardText } from "@/i18n/copy/dashboard";

/**
 * Who opened their personal link lately, newest first. Coming back to the page (after
 * sending links on WhatsApp, usually) fetches the latest opens.
 */
export function Opens({ view }: { view: DashboardView }) {
  const locale = useLocale();
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.opens;
  const router = useRouter();
  const recent = recentOpens(view.guests);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, [router]);

  return (
    <Card role="region" aria-labelledby="opens-heading" className="gap-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold/15 text-accent-text">
          <Eye aria-hidden className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="opens-heading" className="font-semibold">
            {copy.heading}
          </h2>
          <p className="text-sm text-ink-muted">
            {view.guests.length === 0 ? copy.noGuests : recent.length ? copy.body : copy.none}
          </p>
        </div>
      </div>
      {recent.length > 0 && (
        <ul className="flex flex-col divide-y divide-line" data-testid="recent-opens">
          {recent.map((guest) => {
            const replied = guest.replies.length > 0;
            return (
              <li key={guest.id} className="flex items-start justify-between gap-3 py-2.5">
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold break-words">{guest.name}</span>
                  <span className="text-sm text-ink-muted">
                    {timeAgo(guest.lastOpenedAt!, locale)}
                    {dashboardCopy.guest.visits(guest.openCount)}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    replied
                      ? "border-success/35 bg-success/10 text-success"
                      : "border-dashed border-line-strong text-ink-muted",
                  )}
                >
                  {replied ? copy.replied : copy.noReply}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
