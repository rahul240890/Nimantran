import { Activity, Globe2, MonitorSmartphone, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading } from "@/components/admin/admin-shell";
import { FunnelCard } from "@/components/admin/funnel-card";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAdmin } from "@/lib/admin/access";
import {
  VISIT_RANGES,
  type VisitCount,
  type VisitSummary,
  funnelSummary,
  visitRange,
  visitSummary,
} from "@/lib/admin/visits";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Visitors" };

const number = new Intl.NumberFormat("en-IN");
const dayLabel = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const countries = new Intl.DisplayNames(["en"], { type: "region" });
const percent = (part: number, whole: number) =>
  whole ? `${Math.round((part / whole) * 100)}%` : "–";

const DEVICES: Record<string, string> = { mobile: "Phone", tablet: "Tablet", desktop: "Computer" };

function countryName(code: string) {
  if (!code) return "Unknown";
  try {
    return countries.of(code) ?? code;
  } catch {
    return code;
  }
}

/** How many people visit the site, signed in or not, where from and what they open. */
export default async function VisitorsPage({ searchParams }: PageProps<"/admin/visitors">) {
  await requireAdmin("/admin/visitors");
  const days = visitRange((await searchParams).days);
  const [summary, funnel] = await Promise.all([visitSummary(days), funnelSummary(days)]);

  return (
    <>
      <AdminHeading
        eyebrow="People"
        title="Visitors"
        intro="Counted by the site itself on the live site, with no cookies. A visitor counts once a day; signed-in visitors are hosts with an account, everyone else is a guest or someone looking around. Your own visits as an admin aren't counted."
      />
      <div className="flex flex-col gap-6">
        <nav aria-label="Time range" className="flex flex-wrap gap-2">
          {VISIT_RANGES.map((range) => (
            <Link
              key={range}
              href={`/admin/visitors?days=${range}`}
              aria-current={range === days ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                range === days
                  ? "border-marigold bg-marigold text-on-marigold"
                  : "border-line bg-surface hover:border-line-strong",
              )}
            >
              Last {range} days
            </Link>
          ))}
        </nav>
        {summary && <FunnelCard funnel={funnel} />}
        {summary ? (
          <Summary summary={summary} />
        ) : (
          <EmptyState
            icon={<Users aria-hidden />}
            title="Counting hasn't started"
            description="Run nimantran/supabase-update-visitor-counts.sql in Supabase's SQL Editor once. Visits are counted from then on, on the live site only."
          />
        )}
      </div>
    </>
  );
}

function Summary({ summary }: { summary: VisitSummary }) {
  const { totals } = summary;
  const anonymous = totals.visitors - totals.signedIn;
  const tiles = [
    { label: "Visitors", value: totals.visitors, note: `${number.format(summary.now)} right now` },
    {
      label: "Signed in",
      value: totals.signedIn,
      note: `${number.format(totals.accounts)} different accounts`,
    },
    { label: "Not signed in", value: anonymous, note: percent(anonymous, totals.visitors) },
    {
      label: "Page views",
      value: totals.views,
      note: totals.visitors
        ? `${(totals.views / totals.visitors).toFixed(1)} per visitor`
        : undefined,
    },
    {
      label: "Left after one page",
      value: totals.onePage,
      note: percent(totals.onePage, totals.visitors),
    },
  ];
  const lists = summary.lists;

  return (
    <>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex min-w-0 flex-col gap-1 rounded-lg border border-line bg-surface px-4 py-4 shadow-raised"
          >
            <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
              {tile.label}
            </dt>
            <dd className="font-display text-3xl leading-none tabular-nums">
              {number.format(tile.value)}
            </dd>
            {tile.note && <dd className="text-xs text-ink-muted">{tile.note}</dd>}
          </div>
        ))}
      </dl>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity aria-hidden className="size-5 text-accent-text" />
            Visitors each day
          </CardTitle>
          <CardDescription>Days run midnight to midnight in India.</CardDescription>
        </CardHeader>
        <CardBody>
          <DailyChart daily={summary.daily} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pages opened most</CardTitle>
          <CardDescription>
            Invitations and guest links show as one line each, never whose invitation it was.
          </CardDescription>
        </CardHeader>
        <CardBody>
          <BarList
            items={summary.pages.map((page) => ({ label: page.label, visitors: page.visitors }))}
            extra={summary.pages.map((page) => `${number.format(page.views)} views`)}
            mono
            empty="No page views yet."
          />
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe2 aria-hidden className="size-5 text-accent-text" />
              Where they came from
            </CardTitle>
            <CardDescription>
              WhatsApp and most apps don&apos;t say where a link was opened, so they count as
              direct.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <BarList
              items={(lists.referrers ?? []).map((item) => ({
                ...item,
                label: item.label || "Direct, WhatsApp and apps",
              }))}
              empty="Nobody yet."
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
          </CardHeader>
          <CardBody>
            <BarList
              items={(lists.countries ?? []).map((item) => ({
                ...item,
                label: countryName(item.label),
              }))}
              empty="Nobody yet."
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorSmartphone aria-hidden className="size-5 text-accent-text" />
              Devices
            </CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <BarList
              items={(lists.devices ?? []).map((item) => ({
                ...item,
                label: DEVICES[item.label] ?? item.label,
              }))}
              empty="Nobody yet."
            />
            <ListLabel>Phone and computer systems</ListLabel>
            <BarList
              items={(lists.systems ?? []).map((item) => ({
                ...item,
                label: item.label || "Other",
              }))}
              empty=""
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Browsers and campaigns</CardTitle>
            <CardDescription>
              Campaigns are links with ?utm_source= on them, such as ?utm_source=instagram.
            </CardDescription>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <BarList
              items={(lists.browsers ?? []).map((item) => ({
                ...item,
                label: item.label || "Other",
              }))}
              empty="Nobody yet."
            />
            {(lists.sources ?? []).length > 0 && (
              <>
                <ListLabel>Campaigns</ListLabel>
                <BarList items={lists.sources ?? []} mono empty="" />
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function ListLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="-mb-4 font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
      {children}
    </p>
  );
}

/** Rows with a bar behind each count, longest first. */
function BarList({
  items,
  extra,
  mono,
  empty,
}: {
  items: VisitCount[];
  extra?: string[];
  mono?: boolean;
  empty: string;
}) {
  if (items.length === 0) return empty ? <p className="text-sm text-ink-muted">{empty}</p> : null;
  const most = Math.max(...items.map((item) => item.visitors), 1);
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="relative isolate">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 -z-10 rounded-sm bg-marigold/20 rtl:right-0 rtl:left-auto"
            style={{ width: `${(item.visitors / most) * 100}%` }}
          />
          <span className="flex min-h-9 items-center justify-between gap-3 px-2.5 text-sm">
            <span className={cn("min-w-0 truncate", mono && "font-mono text-[0.8rem]")}>
              {item.label}
            </span>
            <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
              {extra?.[index] && (
                <span className="hidden text-xs text-ink-muted sm:inline">{extra[index]}</span>
              )}
              <span className="font-semibold">{number.format(item.visitors)}</span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Stacked bars, signed-in visitors at the base, with the same numbers as a table. */
function DailyChart({ daily }: { daily: VisitSummary["daily"] }) {
  const most = Math.max(...daily.map((day) => day.visitors), 1);
  const first = daily[0];
  const last = daily.at(-1);
  return (
    <figure className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3 rounded-sm bg-marigold" />
          Signed in
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3 rounded-sm bg-ink-faint" />
          Not signed in
        </span>
        <span className="ms-auto tabular-nums">Most in a day: {number.format(most)}</span>
      </div>
      <div
        aria-hidden
        className={cn(
          "flex h-44 items-end border-b border-line",
          daily.length > 40 ? "gap-px" : "gap-0.5",
        )}
      >
        {daily.map((day) => {
          const anonymous = day.visitors - day.signedIn;
          return (
            <div
              key={day.day}
              title={`${dayLabel.format(new Date(day.day))}: ${day.visitors} visitors, ${day.signedIn} signed in, ${day.views} views`}
              className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-0.5 rounded-t-sm hover:bg-surface-2"
            >
              {anonymous > 0 && (
                <span
                  className="block rounded-t-sm bg-ink-faint group-hover:bg-ink-muted"
                  style={{ height: `${(anonymous / most) * 100}%` }}
                />
              )}
              {day.signedIn > 0 && (
                <span
                  className={cn(
                    "block bg-marigold group-hover:bg-marigold-strong",
                    anonymous === 0 && "rounded-t-sm",
                  )}
                  style={{ height: `${(day.signedIn / most) * 100}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div aria-hidden className="flex justify-between text-xs text-ink-muted">
        <span>{first && dayLabel.format(new Date(first.day))}</span>
        <span>{last && dayLabel.format(new Date(last.day))}</span>
      </div>
      <details className="text-sm">
        <summary className="inline-flex min-h-11 cursor-pointer items-center rounded-sm text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          Show as a table
        </summary>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-start tabular-nums">
            <caption className="sr-only">Visitors each day</caption>
            <thead className="text-ink-muted">
              <tr>
                <th scope="col" className="py-1.5 text-start font-normal">
                  Day
                </th>
                <th scope="col" className="py-1.5 text-end font-normal">
                  Visitors
                </th>
                <th scope="col" className="py-1.5 text-end font-normal">
                  Signed in
                </th>
                <th scope="col" className="py-1.5 text-end font-normal">
                  Views
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...daily].reverse().map((day) => (
                <tr key={day.day}>
                  <th scope="row" className="py-1.5 text-start font-normal">
                    {dayLabel.format(new Date(day.day))}
                  </th>
                  <td className="py-1.5 text-end">{number.format(day.visitors)}</td>
                  <td className="py-1.5 text-end">{number.format(day.signedIn)}</td>
                  <td className="py-1.5 text-end">{number.format(day.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <figcaption className="sr-only">
        Visitors each day; open the table below the chart for the numbers.
      </figcaption>
    </figure>
  );
}
