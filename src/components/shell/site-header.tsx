"use client";

import { ArrowRight, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Accordion as AccordionPrimitive, NavigationMenu } from "radix-ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { ThemeMenu, ThemeToggle } from "@/components/ui/theme-toggle";
import { useLocale, useText } from "@/i18n/client";
import { homePath } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";
import { landingText } from "@/i18n/copy/landing";
import { uiText } from "@/i18n/copy/ui";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AccountMenu } from "@/components/account/account-menu";
import { LanguageSwitcher } from "./language-switcher";
import { isPageLink, navHref } from "./nav-links";
import { isMenuId, type MenuPanel, type SiteMenu } from "./site-menu";
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

const mobileLink =
  "flex min-h-12 items-center rounded-md px-2 font-display text-2xl text-ink transition-colors hover:bg-surface-2 hover:text-accent-text";

/** A menu's links in the phone menu: its groups, one under another, and its All link. */
function MobilePanel({ panel, onPick }: { panel: MenuPanel; onPick: () => void }) {
  return (
    <div className="flex flex-col gap-5 px-2 pt-1 pb-5">
      {panel.groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
            {group.title}
          </p>
          <ul className="grid grid-cols-1 min-[400px]:grid-cols-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onPick}
                  className="flex min-h-11 flex-col justify-center rounded-md py-1.5 text-ink transition-colors hover:text-accent-text"
                >
                  <span className="font-semibold">{link.label}</span>
                  {link.note && <span className="text-xs text-ink-muted">{link.note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link
        href={panel.all.href}
        onClick={onPick}
        className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-accent-text hover:underline"
      >
        {panel.all.label}
        <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
      </Link>
    </div>
  );
}

function MobileMenu({ menu }: { menu: SiteMenu }) {
  const { nav, shell } = useText(landingText);
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
          // After tapping a link, focus goes to that section instead of back to the menu button
          const id = pending.current;
          if (!id) return;
          event.preventDefault();
          pending.current = null;
          goToSection(id, still, () => router.push(`${home}#${id}`));
        }}
      >
        <nav aria-label={shell.primaryNav}>
          <AccordionPrimitive.Root type="single" collapsible asChild>
            <ul className="-mx-2 flex flex-col">
              {nav.map((item) => (
                <li key={item.id}>
                  {isMenuId(item.id) ? (
                    <AccordionPrimitive.Item value={item.id}>
                      <AccordionPrimitive.Header asChild>
                        <div>
                          <AccordionPrimitive.Trigger
                            className={cn(
                              mobileLink,
                              "group w-full cursor-pointer justify-between gap-3 text-start",
                            )}
                          >
                            {item.label}
                            <ChevronDown
                              aria-hidden
                              className="size-5 text-ink-muted transition-transform duration-300 group-data-[state=open]:rotate-180"
                            />
                          </AccordionPrimitive.Trigger>
                        </div>
                      </AccordionPrimitive.Header>
                      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <MobilePanel panel={menu[item.id]} onPick={() => setOpen(false)} />
                      </AccordionPrimitive.Content>
                    </AccordionPrimitive.Item>
                  ) : isPageLink(item.id) ? (
                    <Link
                      href={navHref(item.id, locale)}
                      onClick={() => setOpen(false)}
                      className={mobileLink}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={navHref(item.id, locale)}
                      onClick={(event) => {
                        event.preventDefault();
                        pending.current = item.id;
                        setOpen(false);
                      }}
                      className={mobileLink}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </AccordionPrimitive.Root>
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
              <Link href={pagePath({ kind: "gallery" }, locale)}>{shell.createInvite}</Link>
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

const navItem =
  "relative inline-flex min-h-11 cursor-pointer items-center rounded-full px-3 text-[0.95rem] font-semibold whitespace-nowrap text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=true]:text-ink data-current:text-ink";

const wide = (group: MenuPanel["groups"][number]) => group.links.length > 8;

/** An open menu on a wide screen: its groups in columns, a painted card, and its All link. */
function DesktopPanel({ panel }: { panel: MenuPanel }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_15rem] items-start gap-8 p-6">
      <div className="flex min-w-0 flex-col gap-5">
        <div
          className="grid gap-x-8 gap-y-6"
          style={{
            // A long group takes two columns of links, and twice the room
            gridTemplateColumns: panel.groups
              .map((group) => `minmax(0, ${wide(group) ? 2 : 1}fr)`)
              .join(" "),
          }}
        >
          {panel.groups.map((group) => (
            <div key={group.title} className="flex min-w-0 flex-col gap-2">
              <p className="font-label text-xs tracking-[0.2em] text-accent-text uppercase">
                {group.title}
              </p>
              <ul className={cn("grid gap-x-6", wide(group) ? "grid-cols-2" : "grid-cols-1")}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={link.href}
                        className="-mx-2 flex min-h-11 flex-col justify-center rounded-md px-2 py-1 text-ink transition-colors hover:bg-surface-2 hover:text-accent-text focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="flex items-baseline gap-2 font-semibold">
                          {link.label}
                          {link.native && (
                            <span
                              lang={link.native.lang}
                              className="text-sm font-normal text-ink-muted"
                            >
                              {link.native.text}
                            </span>
                          )}
                        </span>
                        {link.note && <span className="text-xs text-ink-muted">{link.note}</span>}
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <NavigationMenu.Link asChild>
          <Link
            href={panel.all.href}
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-line px-4 font-semibold text-accent-text transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring"
          >
            {panel.all.label}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </Link>
        </NavigationMenu.Link>
      </div>
      <NavigationMenu.Link asChild>
        <Link
          href={panel.feature.href}
          className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="relative block aspect-[4/3] overflow-hidden bg-night">
            <Image
              src={panel.feature.image}
              alt=""
              fill
              sizes="16rem"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100"
            />
          </span>
          <span className="flex flex-col gap-1 p-4">
            <span className="font-display text-lg leading-tight text-ink">
              {panel.feature.title}
            </span>
            <span className="text-sm text-ink-muted">{panel.feature.text}</span>
          </span>
        </Link>
      </NavigationMenu.Link>
    </div>
  );
}

/**
 * The sticky bar on every marketing page: logo, the menus and section links, language,
 * theme and the main action. Designs, Weddings and Occasions open rich menus on a wide
 * screen, and expand in place in the phone menu.
 */
export function SiteHeader({ menu }: { menu: SiteMenu }) {
  const { nav, shell } = useText(landingText);
  const { uiStrings } = useText(uiText);
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

        <NavigationMenu.Root
          aria-label={shell.primaryNav}
          delayDuration={120}
          className="ms-4 hidden min-w-0 xl:block"
        >
          <NavigationMenu.List className="flex items-center">
            {nav.map((item) => {
              const current =
                active === item.id ||
                (isPageLink(item.id) && pathname === navHref(item.id, locale));
              const underline = (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 bottom-1.5 h-0.5 origin-center rounded-full bg-marigold transition-transform duration-300 ease-out-expo",
                    current ? "scale-x-100" : "scale-x-0",
                  )}
                />
              );
              return (
                <NavigationMenu.Item key={item.id} value={item.id}>
                  {isMenuId(item.id) ? (
                    <>
                      <NavigationMenu.Trigger
                        data-current={current || undefined}
                        className={cn(navItem, "group gap-1 data-[state=open]:text-ink")}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden
                          className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
                        />
                        {underline}
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="data-[motion^=from-]:animate-fade-in data-[motion^=to-]:animate-fade-out">
                        <DesktopPanel panel={menu[item.id]} />
                      </NavigationMenu.Content>
                    </>
                  ) : (
                    <NavigationMenu.Link asChild active={current}>
                      <Link
                        href={navHref(item.id, locale)}
                        aria-current={current ? "true" : undefined}
                        className={navItem}
                      >
                        {item.label}
                        {underline}
                      </Link>
                    </NavigationMenu.Link>
                  )}
                </NavigationMenu.Item>
              );
            })}
          </NavigationMenu.List>
          {/* The open menu spans the page under the bar (the header is its positioned parent) */}
          <div className="absolute inset-x-0 top-full flex justify-center px-4 sm:px-6 lg:px-8">
            <NavigationMenu.Viewport className="mt-2 h-(--radix-navigation-menu-viewport-height) w-full max-w-6xl origin-top overflow-hidden rounded-xl border border-line bg-surface shadow-float transition-[height] duration-300 ease-out-expo data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
          </div>
        </NavigationMenu.Root>

        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="hidden xl:inline-flex" />
          <ThemeMenu labels={uiStrings.theme} className="hidden xl:inline-flex" />
          <AccountMenu compact />
          <Button asChild size="sm" className="hidden whitespace-nowrap sm:inline-flex xl:ms-1">
            <Link href={pagePath({ kind: "gallery" }, locale)}>{shell.createInviteShort}</Link>
          </Button>
          <div className="xl:hidden">
            <MobileMenu menu={menu} />
          </div>
        </div>
      </div>
    </header>
  );
}
