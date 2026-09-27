import { CircleCheck, CircleHelp, CircleX, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { getText } from "@/i18n/server";
import type { ReplySummary } from "@/lib/invites/rsvp";

const LATEST = 8;

const statusIcons = {
  attending: CircleCheck,
  maybe: CircleHelp,
  declined: CircleX,
} as const;

/** The host's first look at replies: head counts per function and the latest guests. */
export async function RepliesCard({
  summary,
  inviteId,
}: {
  summary: ReplySummary;
  inviteId: string;
}) {
  const { repliesCopy, rsvpCopy } = await getText(publishText);
  const { functionCopy } = await getText(editorText);
  const latest = summary.guests.slice(0, LATEST);
  const rest = summary.guests.length - latest.length;
  return (
    <Card role="region" aria-labelledby="share-replies" className="gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="share-replies" className="font-semibold">
          {repliesCopy.heading}
        </h2>
        <p className="text-sm text-ink-muted">{repliesCopy.intro}</p>
      </div>
      {summary.guests.length === 0 ? (
        <p className="rounded-md border border-dashed border-line px-4 py-5 text-center text-sm text-ink-muted">
          {repliesCopy.none}
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
            {summary.totals.map((total) => (
              <li
                key={total.kind}
                className="flex flex-col gap-1 rounded-md border border-line bg-surface-2/60 px-4 py-3"
              >
                <span className="font-display text-lg leading-tight">
                  {functionCopy[total.kind].name}
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-success">
                    {repliesCopy.coming(total.attending)}
                  </span>
                  <span className="text-ink-muted">
                    {" · "}
                    {repliesCopy.maybe(total.maybe)}
                    {" · "}
                    {repliesCopy.declined(total.declined)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <h3 className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {repliesCopy.latest}
            </h3>
            <ul className="flex flex-col divide-y divide-line">
              {latest.map((guest, index) => (
                <li key={`${guest.name}-${index}`} className="flex flex-col gap-1 py-3">
                  <span className="font-semibold break-words">{guest.name}</span>
                  <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                    {guest.statuses.map((item) => {
                      const Icon = statusIcons[item.status];
                      return (
                        <span key={item.kind} className="inline-flex items-center gap-1.5">
                          <Icon aria-hidden className="size-4 text-accent-text" />
                          {functionCopy[item.kind].name}: {rsvpCopy.statuses[item.status].short}
                          {item.status !== "declined" && ` (${item.people})`}
                        </span>
                      );
                    })}
                  </span>
                  {guest.message && (
                    <q className="text-sm break-words text-ink-muted italic">{guest.message}</q>
                  )}
                </li>
              ))}
            </ul>
            {rest > 0 && <p className="text-sm text-ink-muted">{repliesCopy.more(rest)}</p>}
          </div>
        </>
      )}
      <Button asChild variant="secondary" className="self-start">
        <Link href={`/invites/${inviteId}`}>
          <Users aria-hidden />
          {repliesCopy.all}
        </Link>
      </Button>
    </Card>
  );
}
