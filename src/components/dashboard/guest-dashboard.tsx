import { ArrowLeft, ExternalLink, Pencil, Send, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardText } from "@/i18n/copy/dashboard";
import { editionsText } from "@/i18n/copy/editions";
import { editorText } from "@/i18n/copy/editor";
import { getText } from "@/i18n/server";
import { dashboardCounts } from "@/lib/guests/list";
import { Cohosts } from "./cohosts";
import { GuestList } from "./guest-list";
import { Reminders } from "./reminders";
import type { DashboardView } from "./types";

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-line bg-surface px-4 py-4 shadow-raised sm:px-5">
      <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
        {label}
      </dt>
      <dd className="font-display text-3xl leading-none tabular-nums sm:text-4xl">{value}</dd>
      <dd className="text-sm text-ink-muted">{note}</dd>
    </div>
  );
}

/** The host's home for one invite: counts, the guest list, reminders and co-hosts. */
export async function GuestDashboard({ view }: { view: DashboardView }) {
  const copy = (await getText(dashboardText)).dashboardCopy;
  const { functionCopy } = await getText(editorText);
  const { limitCopy, planCopy } = await getText(editionsText);
  const counts = dashboardCounts(view.guests, view.functions);
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/invites"
          className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
          {copy.back}
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="flex flex-wrap items-center gap-2 font-label text-xs tracking-[0.28em] text-accent-text uppercase">
              {copy.eyebrow}
              {view.live ? (
                <Badge tone="success" dot>
                  {copy.liveBadge}
                </Badge>
              ) : (
                <Badge tone="neutral">{copy.draftBadge}</Badge>
              )}
              {view.role === "cohost" && <Badge tone="gold">{copy.cohostBadge}</Badge>}
              {view.plan && (
                <Badge tone={view.plan === "free" ? "neutral" : "gold"}>
                  {limitCopy.edition(planCopy[view.plan].name)}
                </Badge>
              )}
            </p>
            <h1 className="font-display text-[2rem] leading-[1.08] break-words sm:text-[2.6rem]">
              {view.names}
            </h1>
            <p className="text-ink-muted">
              {[view.occasion, view.when].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {view.live && (
              <Button asChild size="sm">
                <Link href={`/invites/${view.id}/share`}>
                  <Send aria-hidden className="rtl:-scale-x-100" />
                  {copy.share}
                </Link>
              </Button>
            )}
            {view.plan && view.plan !== "bundle" && view.role === "owner" && (
              <Button asChild size="sm" variant="secondary">
                <Link href={`/invites/${view.id}/edition`}>
                  <Sparkles aria-hidden />
                  {limitCopy.upgrade}
                </Link>
              </Button>
            )}
            {view.canEdit && (
              <Button asChild size="sm" variant="secondary">
                <Link href={`/create?invite=${view.id}`}>
                  <Pencil aria-hidden />
                  {copy.edit}
                </Link>
              </Button>
            )}
            {view.url && (
              <Button asChild size="sm" variant="ghost">
                <a href={view.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden />
                  {copy.open}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {!view.canEdit && (
        <div
          role="note"
          className="flex items-start gap-3 rounded-lg border border-line bg-surface-2/60 p-5"
        >
          <Users aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold">{copy.guestsOnly.title}</p>
            <p className="text-sm text-ink-muted">{copy.guestsOnly.body}</p>
          </div>
        </div>
      )}

      {!view.live && view.canEdit && (
        <div className="flex flex-col gap-3 rounded-lg border border-marigold/45 bg-marigold/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">{copy.notLive.title}</p>
              <p className="text-sm text-ink-muted">{copy.notLive.body}</p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href={`/create?invite=${view.id}`}>{copy.notLive.action}</Link>
          </Button>
        </div>
      )}

      <section aria-label={copy.stats.label} className="flex flex-col gap-4">
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Stat
            label={copy.stats.guests}
            value={counts.guests.toLocaleString("en-IN")}
            note={copy.stats.guestsNote(counts.invitedPeople)}
          />
          <Stat
            label={copy.stats.opened}
            value={copy.stats.percent(counts.opened, counts.guests)}
            note={copy.stats.openedNote(counts.opened, counts.guests)}
          />
          <Stat
            label={copy.stats.replied}
            value={counts.replied.toLocaleString("en-IN")}
            note={copy.stats.percent(counts.replied, counts.guests)}
          />
          <Stat
            label={copy.stats.waiting}
            value={counts.waiting.toLocaleString("en-IN")}
            note={copy.stats.waitingNote}
          />
        </dl>
        {counts.functions.length > 0 && counts.guests > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {copy.functionsHeading}
            </h2>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {counts.functions.map((fn) => (
                <li
                  key={fn.id}
                  className="flex flex-col gap-1 rounded-md border border-line bg-surface-2/60 px-4 py-3"
                >
                  <span className="font-display text-lg leading-tight">
                    {functionCopy[fn.kind].name}
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold text-success">
                      {copy.coming(fn.coming)}
                      {copy.children(fn.children)}
                    </span>
                    <span className="text-ink-muted">
                      {" · "}
                      {copy.maybe(fn.maybe)}
                      {" · "}
                      {copy.declined(fn.declined)}
                      {" · "}
                      {copy.waitingFor(fn.waiting)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
        <GuestList view={view} />
        <div className="flex min-w-0 flex-col gap-6">
          <Reminders view={view} />
          <Cohosts view={view} />
        </div>
      </div>
    </div>
  );
}
