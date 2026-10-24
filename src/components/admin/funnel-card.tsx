import { Filter, TrendingDown } from "lucide-react";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { biggestDrop, funnelRows } from "@/lib/admin/funnel-rows";
import type { FunnelSummary } from "@/lib/admin/visits";
import { cn } from "@/lib/cn";

const number = new Intl.NumberFormat("en-IN");
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const share = (part: number, whole: number) =>
  whole ? `${Math.round((part / whole) * 100)}%` : "–";

/** Where visitors came from, in words: campaigns as typed, our own links by what they are. */
const SOURCES: Record<string, string> = {
  "": "Direct, WhatsApp and apps",
  guest: "Guests of an invitation",
  family: "Family preview links",
};

/**
 * Where visitors stop on the way to a paid invitation (Admin, Visitors): what happened in
 * the tables, each step's count with the step most people stop at, where visitors came
 * from and how far each source got, and the designs opened most.
 */
export function FunnelCard({ funnel }: { funnel: FunnelSummary | null }) {
  if (!funnel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter aria-hidden className="size-5 text-accent-text" />
            Where visitors stop
          </CardTitle>
          <CardDescription>
            Run supabase/migrations/20261024160000_funnel_and_reviews.sql in Supabase&apos;s SQL
            Editor once. Each step is counted from then on, on the live site only.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const rows = funnelRows(funnel.steps);
  const drop = biggestDrop(rows);
  const { outcomes } = funnel;
  const tiles = [
    { label: "New accounts", value: number.format(outcomes.accounts) },
    { label: "Invites made", value: number.format(outcomes.invites) },
    { label: "Payments", value: number.format(outcomes.payments) },
    { label: "Money received", value: rupees.format(outcomes.revenuePaise / 100) },
    { label: "Invites published", value: number.format(outcomes.published) },
  ];

  return (
    <Card data-funnel>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter aria-hidden className="size-5 text-accent-text" />
          Where visitors stop
        </CardTitle>
        <CardDescription>
          Each step counts a visitor once a day. The totals at the top come straight from
          accounts, invites and payments, so they are exact; the steps are what the site saw.
        </CardDescription>
      </CardHeader>
      <CardBody className="flex flex-col gap-6">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="flex min-w-0 flex-col gap-1 rounded-md border border-line bg-surface-2 px-4 py-3"
            >
              <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
                {tile.label}
              </dt>
              <dd className="font-display text-2xl leading-none tabular-nums">{tile.value}</dd>
            </div>
          ))}
        </dl>

        {drop && (
          <p
            data-funnel-drop
            className="flex items-start gap-3 rounded-md border border-marigold/60 bg-marigold/10 px-4 py-3 text-sm"
          >
            <TrendingDown aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
            <span>
              Most people stop after <strong>{drop.from.label.toLowerCase()}</strong>:{" "}
              {Math.round(drop.lost * 100)}% of them don&apos;t go on to{" "}
              <strong>{drop.to.label.toLowerCase()}</strong>.
            </span>
          </p>
        )}

        <ol className="flex flex-col gap-1.5" aria-label="Steps to a paid invitation">
          {rows.map((row, index) => {
            const previous = rows[index - 1];
            return (
              <li key={row.key} className="relative isolate" data-step={row.key}>
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 -z-10 rounded-sm rtl:right-0 rtl:left-auto",
                    drop?.to.key === row.key ? "bg-danger/15" : "bg-marigold/20",
                  )}
                  style={{ width: `${Math.max(row.ofVisitors * 100, row.count ? 1 : 0)}%` }}
                />
                <span className="flex min-h-10 items-center justify-between gap-3 px-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="me-2 text-ink-muted tabular-nums">{index + 1}.</span>
                    {row.label}
                  </span>
                  <span className="flex shrink-0 items-baseline gap-3 tabular-nums">
                    {previous && (
                      <span className="hidden text-xs text-ink-muted sm:inline">
                        {share(row.count, previous.count)} of the step before
                      </span>
                    )}
                    <span className="font-semibold">{number.format(row.count)}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="-mt-3 text-sm text-ink-muted">
          Watched a design open live: {number.format(funnel.steps.sample)}.
        </p>

        {funnel.sources.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm tabular-nums">
              <caption className="pb-2 text-start font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
                How far each source got
              </caption>
              <thead className="text-ink-muted">
                <tr>
                  <th scope="col" className="py-1.5 text-start font-normal">
                    Came from
                  </th>
                  <th scope="col" className="py-1.5 text-end font-normal">
                    Visitors
                  </th>
                  <th scope="col" className="py-1.5 text-end font-normal">
                    Opened a design
                  </th>
                  <th scope="col" className="py-1.5 text-end font-normal">
                    Preview
                  </th>
                  <th scope="col" className="py-1.5 text-end font-normal">
                    Started paying
                  </th>
                  <th scope="col" className="py-1.5 text-end font-normal">
                    Paid
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {funnel.sources.map((source) => (
                  <tr key={source.label}>
                    <th scope="row" className="py-1.5 text-start font-normal break-all">
                      {SOURCES[source.label] ?? source.label}
                    </th>
                    <td className="py-1.5 text-end">{number.format(source.visitors)}</td>
                    <td className="py-1.5 text-end">{number.format(source.designs)}</td>
                    <td className="py-1.5 text-end">{number.format(source.preview)}</td>
                    <td className="py-1.5 text-end">{number.format(source.checkout)}</td>
                    <td className="py-1.5 text-end font-semibold">
                      {number.format(source.paid)}{" "}
                      <span className="font-normal text-ink-muted">
                        ({share(source.paid, source.visitors)})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {funnel.designs.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
              Designs opened most
            </p>
            <ul className="flex flex-wrap gap-2">
              {funnel.designs.map((design) => (
                <li
                  key={design.label}
                  className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.8rem]"
                >
                  {design.label} · {number.format(design.visitors)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
