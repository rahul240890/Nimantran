import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { AccountMenu } from "@/components/account/account-menu";
import { ThemeMenu } from "@/components/ui/theme-toggle";
import { uiText } from "@/i18n/copy/ui";
import { getText } from "@/i18n/server";
import { AdminNav } from "./admin-nav";

/** The master admin's frame: a slim header, the menu, and the page beside it. */
export async function AdminShell({ children }: { children: ReactNode }) {
  const { uiStrings } = await getText(uiText);
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="max-[399px]:[&>span]:sr-only" />
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-marigold/50 bg-marigold/15 px-2.5 font-label text-[0.68rem] tracking-[0.2em] text-accent-text uppercase">
              <ShieldCheck aria-hidden className="size-3.5" />
              Admin
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeMenu labels={uiStrings.theme} />
            <AccountMenu />
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-10 lg:px-8 lg:py-10">
        <aside className="lg:sticky lg:top-26 lg:w-56 lg:shrink-0 lg:self-start">
          <AdminNav />
        </aside>
        <main id="main" tabIndex={-1} className="flex min-w-0 flex-1 flex-col outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}

/** The top of every admin page. */
export function AdminHeading({
  eyebrow,
  title,
  intro,
  action,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex max-w-2xl min-w-0 flex-col gap-2">
        <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">{eyebrow}</p>
        <h1 className="font-display text-[2rem] leading-[1.08] sm:text-[2.5rem]">{title}</h1>
        {intro && <p className="text-ink-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
