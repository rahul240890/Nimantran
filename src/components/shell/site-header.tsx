"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/brand/social-links";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { useLocale, useText } from "@/i18n/client";
import { homePath } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";
import { shellText } from "@/i18n/copy/shell";
import { uiText } from "@/i18n/copy/ui";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AccountMenu } from "@/components/account/account-menu";
import { LanguageSwitcher } from "./language-switcher";
import { isHelpLink, isPageLink, navHref } from "./nav-links";
import { useActiveSection } from "./use-active-section";

/**
 * Moves to a section and puts keyboard focus on it, so screen readers continue from there.
 * From another page, goes to that section of the home page.
 */
function goToSection(id: string, still: boolean, elsewhere: () => void) {
  const target = document.getElementById(id);
  if (!target) {
    elsewhere();
    return;
  }
  target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}

type NavItem = { id: string; label: string };

/** One header link: a page, a home page section, or WhatsApp in a new tab. */
function NavLink({
  item,
  className,
  current,
  onSection,
  onPick,
  children,
}: {
  item: NavItem;
  className: string;
  current?: boolean;
  /** A home page section link, from the phone menu: close it first, then move there. */
  onSection?: () => void;
  onPick?: () => void;
  children?: ReactNode;
}) {
  const locale = useLocale();
  const href = navHref(item.id, locale);
  const body = (
    <>
      {isHelpLink(item.id) && <SocialIcon channel="whatsapp" className="size-[1.1em] shrink-0" />}
      {item.label}
      {children}
    </>
  );
  if (isHelpLink(item.id)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onPick}
        className={className}
      >
        {body}
      </a>
    );
  }
  if (isPageLink(item.id)) {
    return (
      <Link
        href={href}
        // The live invitation is a different design each time, so it isn't fetched ahead
        prefetch={item.id === "sample" ? false : undefined}
        aria-current={current ? "true" : undefined}
        onClick={onPick}
        className={className}
      >
        {body}
      </Link>
    );
  }
  if (onSection) {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onSection();
        }}
        className={className}
      >
        {body}
      </a>
    );
  }
  return (
    <Link href={href} aria-current={current ? "true" : undefined} className={className}>
      {body}
    </Link>
  );
}

const mobileLink =
  "flex min-h-12 items-center gap-3 rounded-md px-2 font-display text-xl text-ink transition-colors hover:bg-surface-2 hover:text-accent-text";

function MobileMenu() {
  const { nav, shell } = useText(shellText);
  const { uiStrings } = useText(uiText);
  const [open, setOpen] = useState(false);
  const pending = useRef<string | null>(null);
  const still = useReducedMotion();
  const locale = useLocale();
  const home = homePath(locale);
  const router = useRouter();

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
          // After tapping a section link, focus goes to that section instead of back to the menu button
          const id = pending.current;
          if (!id) return;
          event.preventDefault();
          pending.current = null;
          goToSection(id, still, () => router.push(`${home}#${id}`));
        }}
      >
        <nav aria-label={shell.primaryNav}>
          <ul className="-mx-2 flex flex-col">
            {nav.map((item) => (
              <li key={item.id}>
                <NavLink
                  item={item}
                  className={mobileLink}
                  onPick={() => setOpen(false)}
                  onSection={() => {
                    pending.current = item.id;
                    setOpen(false);
                  }}
                />
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
          <Button asChild fullWidth>
            <Link href={pagePath({ kind: "gallery" }, locale)} onClick={() => setOpen(false)}>
              {shell.createInvite}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const navItem =
  "relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-ui font-semibold whitespace-nowrap text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=true]:text-ink";

/**
 * The sticky bar on every marketing page: the logo, five plain links (wedding designs, all
 * designs, a live invitation, pricing and help on WhatsApp), language, sign in and the main
 * action. A phone gets the same links in its menu (owner, 2026-10-24: simple to find one's
 * way, no long lists).
 */
export function SiteHeader() {
  const { nav, shell } = useText(shellText);
  const active = useActiveSection(useMemo(() => nav.map((item) => item.id), [nav]));
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();

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

        {/* Tamil's words are too long for one line beside the logo and buttons, so a Tamil page
            keeps its links in the menu at every width */}
        <nav
          aria-label={shell.primaryNav}
          className="ms-4 hidden min-w-0 xl:block xl:[&:lang(ta)]:hidden"
        >
          <ul className="flex items-center">
            {nav.map((item) => {
              const current =
                active === item.id ||
                (isPageLink(item.id) && pathname === navHref(item.id, locale));
              return (
                <li key={item.id}>
                  <NavLink item={item} className={navItem} current={current}>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3 bottom-1.5 h-0.5 origin-center rounded-full bg-marigold transition-transform duration-300 ease-out-expo",
                        current ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="hidden xl:inline-flex xl:[&:lang(ta)]:hidden" />
          <AccountMenu compact />
          <Button asChild size="sm" className="hidden whitespace-nowrap sm:inline-flex xl:ms-1">
            <Link href={pagePath({ kind: "gallery" }, locale)}>{shell.createInviteShort}</Link>
          </Button>
          <div className="xl:hidden xl:[&:lang(ta)]:block">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
