"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { ThemeMenu, ThemeToggle } from "@/components/ui/theme-toggle";
import { useText } from "@/i18n/client";
import { landingText, uiText } from "@/i18n/copy";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AccountMenu } from "@/components/account/account-menu";
import { LanguageSwitcher } from "./language-switcher";
import { useActiveSection } from "./use-active-section";

/** Moves to a section and puts keyboard focus on it, so screen readers continue from there. */
function goToSection(id: string, still: boolean) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}

function MobileMenu() {
  const { nav, shell } = useText(landingText);
  const { uiStrings } = useText(uiText);
  const [open, setOpen] = useState(false);
  const pending = useRef<string | null>(null);
  const still = useReducedMotion();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <IconButton
          label={shell.openMenu}
          icon={<Menu />}
          variant="ghost"
          size="sm"
          showTooltip={false}
        />
      </SheetTrigger>
      <SheetContent
        side="end"
        title={shell.menuTitle}
        closeLabel={uiStrings.close}
        onCloseAutoFocus={(event) => {
          // After tapping a link, focus goes to that section instead of back to the menu button
          const id = pending.current;
          if (!id) return;
          event.preventDefault();
          pending.current = null;
          goToSection(id, still);
        }}
      >
        <nav aria-label={shell.primaryNav}>
          <ul className="-mx-2 flex flex-col">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    pending.current = item.id;
                    setOpen(false);
                  }}
                  className="flex min-h-12 items-center rounded-md px-2 font-display text-2xl text-ink transition-colors hover:bg-surface-2 hover:text-accent-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col gap-6 border-t border-line pt-6">
          <div className="flex flex-col gap-2.5">
            <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {shell.language.label}
            </p>
            <LanguageSwitcher variant="full" />
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {shell.themeHeading}
            </p>
            <ThemeToggle labels={uiStrings.theme} className="self-start" />
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild fullWidth>
              <Link href="/create">{shell.createInvite}</Link>
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                pending.current = "waitlist";
                setOpen(false);
              }}
            >
              {shell.joinWaitlist}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** The sticky bar on every marketing page: logo, section links, language, theme and the main action. */
export function SiteHeader() {
  const { nav, shell } = useText(landingText);
  const { uiStrings } = useText(uiText);
  const active = useActiveSection(useMemo(() => nav.map((item) => item.id), [nav]));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-line bg-paper/85 shadow-[0_8px_24px_-18px_rgb(42_26_36/0.35)] backdrop-blur-md"
          : "border-transparent bg-paper/0",
      )}
    >
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-surface px-4 py-3 font-semibold text-ink shadow-float focus:not-sr-only focus:absolute focus:start-3 focus:top-3"
      >
        {shell.skipToContent}
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Below 360px only the mandala shows, so the actions fit beside it */}
        <Logo className="shrink-0 max-[359px]:[&>span]:sr-only" />

        <nav aria-label={shell.primaryNav} className="ms-4 hidden min-w-0 xl:block">
          <ul className="flex items-center">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className="relative inline-flex min-h-11 items-center rounded-full px-3 text-[0.95rem] font-semibold whitespace-nowrap text-ink-muted transition-colors hover:text-ink aria-[current=true]:text-ink"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-1.5 h-0.5 origin-center rounded-full bg-marigold transition-transform duration-300 ease-out-expo",
                      active === item.id ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="hidden xl:inline-flex" />
          <ThemeMenu labels={uiStrings.theme} className="hidden xl:inline-flex" />
          <AccountMenu compact />
          <Button asChild size="sm" className="hidden whitespace-nowrap sm:inline-flex xl:ms-1">
            <Link href="/create">{shell.createInviteShort}</Link>
          </Button>
          <div className="xl:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
