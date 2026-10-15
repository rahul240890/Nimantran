import { ReceiptText, UserRound } from "lucide-react";
import Link from "next/link";
import { accountText } from "@/i18n/copy/account";
import { getText } from "@/i18n/server";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "profile", href: "/account", icon: UserRound },
  { id: "payments", href: "/account/payments", icon: ReceiptText },
] as const;

/** Profile and Payments, side by side at the top of each account page. */
export async function AccountTabs({ current }: { current: (typeof TABS)[number]["id"] }) {
  const { accountTabs } = await getText(accountText);
  return (
    <nav aria-label={accountTabs.label} className="border-b border-line">
      <ul className="-mb-px flex gap-1">
        {TABS.map(({ id, href, icon: Icon }) => (
          <li key={id}>
            <Link
              href={href}
              aria-current={id === current ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-t-md border-b-2 px-3 text-sm font-semibold transition-colors",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                id === current
                  ? "border-marigold text-ink"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {accountTabs[id]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
