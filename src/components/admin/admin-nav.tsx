"use client";

import {
  Building2,
  LayoutDashboard,
  Mails,
  ReceiptText,
  TicketPercent,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_PAGES, activeAdminPage, type AdminPageIcon } from "@/lib/admin/pages";
import { cn } from "@/lib/cn";

const ICONS: Record<AdminPageIcon, LucideIcon> = {
  overview: LayoutDashboard,
  payments: WalletCards,
  orders: ReceiptText,
  coupons: TicketPercent,
  invites: Mails,
  business: Building2,
};

/** The admin's menu: a column beside the page on wide screens, a scrolling row on phones. */
export function AdminNav() {
  const active = activeAdminPage(usePathname())?.href;
  return (
    <nav aria-label="Admin" className="min-w-0">
      <ul className="-mx-4 flex [scrollbar-width:none] gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {ADMIN_PAGES.map((page) => {
          const Icon = ICONS[page.icon];
          const current = page.href === active;
          return (
            <li key={page.href} className="shrink-0">
              <Link
                href={page.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-md px-3.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  current
                    ? "bg-marigold/15 text-ink shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--marigold)_45%,transparent)]"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon
                  aria-hidden
                  className={cn("size-[1.1rem] shrink-0", current && "text-accent-text")}
                />
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
