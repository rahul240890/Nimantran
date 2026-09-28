import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading } from "@/components/admin/admin-shell";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/admin/access";
import { ADMIN_PAGES } from "@/lib/admin/pages";
import { authMode } from "@/lib/auth/mode";
import { checkoutProvider, checkoutSwitchedOn, orderTotals } from "@/lib/payments/editions";
import { razorpayStatus } from "@/lib/payments/razorpay";
import { formatRupees } from "@/lib/plans/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Overview" };

type Tile = { label: string; value: string; state: { tone: BadgeTone; label: string } };

/** The admin's home: how the site is set up, then every admin page. */
export default async function AdminOverview() {
  const { account } = await requireAdmin("/admin");
  const razorpay = razorpayStatus();
  const [switchedOn, totals] = await Promise.all([checkoutSwitchedOn(), orderTotals()]);
  const mode = authMode();
  const taking = switchedOn && Boolean(checkoutProvider());

  const tiles: Tile[] = [
    {
      label: "Accounts",
      value: mode === "supabase" ? "Supabase" : mode === "preview" ? "Preview" : "Off",
      state:
        mode === "supabase"
          ? { tone: "success", label: "Connected" }
          : { tone: "warning", label: mode === "preview" ? "Test only" : "Not set up" },
    },
    {
      label: "Razorpay",
      value:
        razorpay.mode === "live" ? "Live keys" : razorpay.mode === "test" ? "Test keys" : "No keys",
      state: razorpay.ready
        ? { tone: razorpay.mode === "live" ? "gold" : "success", label: "Ready" }
        : { tone: "warning", label: "Not set up" },
    },
    {
      label: "Checkout",
      value: taking ? "On" : "Off",
      state: taking
        ? { tone: "success", label: "Taking payments" }
        : { tone: "neutral", label: "Everything free" },
    },
    {
      label: "Paid orders",
      value: String(totals.paid),
      state: { tone: "neutral", label: formatRupees(totals.revenuePaise) },
    },
  ];

  return (
    <>
      <AdminHeading
        eyebrow={site.name}
        title={account.name ? `Namaste, ${account.name.split(" ")[0]}` : "Namaste"}
        intro="Everything that runs the site, in one place. New pages join the menu as they're built."
      />
      <div className="flex flex-col gap-10">
        <dl className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="flex min-w-0 flex-col gap-2 rounded-lg border border-line bg-surface px-5 py-5 shadow-raised"
            >
              <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
                {tile.label}
              </dt>
              <dd className="font-display text-[1.7rem] leading-none">{tile.value}</dd>
              <dd>
                <Badge tone={tile.state.tone} dot>
                  {tile.state.label}
                </Badge>
              </dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="admin-pages" className="flex flex-col gap-4">
          <h2 id="admin-pages" className="font-display text-2xl">
            Pages
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {ADMIN_PAGES.filter((page) => page.href !== "/admin").map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="group flex min-h-11 items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 py-4 shadow-raised transition-[border-color,transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring motion-still:hover:translate-y-0"
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-display text-xl">{page.label}</span>
                    <span className="text-sm text-ink-muted">{page.description}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-accent-text transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
