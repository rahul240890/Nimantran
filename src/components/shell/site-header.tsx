"use client";

import { ArrowRight, ChevronDown, Menu, Play, Star } from "lucide-react";
import Link from "next/link";
import { Accordion as AccordionPrimitive, NavigationMenu } from "radix-ui";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactElement } from "react";
import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/brand/social-links";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { useLocale, useText } from "@/i18n/client";
import { pagePath } from "@/lib/seo/paths";
import { shellText } from "@/i18n/copy/shell";
import { uiText } from "@/i18n/copy/ui";
import { cn } from "@/lib/cn";
import { AccountMenu } from "@/components/account/account-menu";
import { LanguageSwitcher } from "./language-switcher";
import type { MenuLink, MenuTab, SiteMenu } from "./menu";

/** A tab's links: one short list, its row of small links, and its way on to everything. */
function TabLinks({
  tab,
  onPick,
  wrap = (link) => link,
}: {
  tab: MenuTab;
  onPick?: () => void;
  /** Wraps each link (the wide menu marks its links for keyboard moves between them). */
  wrap?: (link: ReactElement) => ReactElement;
}) {
  const row = (link: MenuLink) =>
    wrap(
      <Link
        href={link.href}
        onClick={onPick}
        className={cn(
          "flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 text-ink transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring",
          link.star && "border border-marigold-edge/50 bg-marigold/10 hover:bg-marigold/20",
        )}
      >
        <span className="flex flex-wrap items-baseline gap-x-2 font-semibold">
          {link.star && (
            <Star aria-hidden className="size-4 shrink-0 self-center fill-marigold text-marigold" />
          )}
          {link.label}
          {link.native && (
            <span lang={link.native.lang} className="text-sm font-normal text-ink-muted">
              {link.native.text}
            </span>
          )}
        </span>
        {link.note && <span className="text-sm text-ink-muted">{link.note}</span>}
      </Link>,
    );
  return (
    <div className="flex flex-col gap-1">
      <ul className={cn("grid gap-0.5", tab.wide && "sm:grid-cols-2 sm:gap-x-2")}>
        {tab.links.map((link) => (
          <li key={`${link.href}-${link.label}`}>{row(link)}</li>
        ))}
      </ul>
      {tab.more && (
        <div className="mt-2 flex flex-col gap-2 border-t border-line px-3 pt-3">
          <p className="font-label text-xs tracking-[0.18em] text-ink-muted uppercase">
            {tab.more.title}
          </p>
          <ul className="flex flex-wrap gap-2">
            {tab.more.links.map((link) => (
              <li key={link.href}>
                {wrap(
                  <Link
                    href={link.href}
                    onClick={onPick}
                    className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-marigold-edge hover:text-accent-text focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {link.label}
                  </Link>,
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab.all &&
        wrap(
          <Link
            href={tab.all.href}
            onClick={onPick}
            className="mt-1 inline-flex min-h-11 items-center gap-2 self-start rounded-full px-3 font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {tab.all.label}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </Link>,
        )}
    </div>
  );
}

const quietLink =
  "flex min-h-11 items-center gap-2.5 rounded-md px-2 font-semibold text-ink transition-colors hover:text-accent-text focus-visible:outline-2 focus-visible:outline-ring";

function MobileMenu({ menu }: { menu: SiteMenu }) {
  const { shell } = useText(shellText);
  const { uiStrings } = useText(uiText);
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const close = () => setOpen(false);

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
      <SheetContent side="end" title={shell.menuTitle} closeLabel={uiStrings.close}>
        <nav aria-label={shell.primaryNav}>
          <AccordionPrimitive.Root type="single" collapsible asChild>
            <ul className="-mx-2 flex flex-col">
              {menu.tabs.map((tab) => (
                <li key={tab.id}>
                  <AccordionPrimitive.Item value={tab.id} className="border-b border-line">
                    <AccordionPrimitive.Header asChild>
                      <div>
                        <AccordionPrimitive.Trigger className="group flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2 text-start font-display text-xl text-ink transition-colors hover:text-accent-text focus-visible:outline-2 focus-visible:outline-ring">
                          {tab.label}
                          <ChevronDown
                            aria-hidden
                            className="size-5 text-ink-muted transition-transform duration-300 group-data-[state=open]:rotate-180"
                          />
                        </AccordionPrimitive.Trigger>
                      </div>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <div className="pb-3">
                        <TabLinks tab={tab} onPick={close} />
                      </div>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                </li>
              ))}
            </ul>
          </AccordionPrimitive.Root>
        </nav>
        <div className="mt-4 flex flex-col">
          <Link href={menu.sample.href} prefetch={false} onClick={close} className={quietLink}>
            <Play aria-hidden className="size-4 fill-current text-accent-text" />
            {menu.sample.label}
          </Link>
          <a
            href={menu.help.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={quietLink}
          >
            <SocialIcon channel="whatsapp" className="size-4 text-success" />
            {menu.help.label}
          </a>
        </div>
        <div className="mt-6 flex flex-col gap-6 border-t border-line pt-6">
          <div className="flex flex-col gap-2.5">
            <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {shell.language.label}
            </p>
            <LanguageSwitcher variant="full" />
          </div>
          <Button asChild fullWidth>
            <Link href={pagePath({ kind: "gallery" }, locale)} onClick={close}>
              {shell.createInvite}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const tabTrigger =
  "group relative inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-3 text-ui font-semibold whitespace-nowrap text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=open]:bg-surface-2 data-[state=open]:text-ink data-current:text-ink";

/**
 * The sticky bar on every marketing page: the logo, five tabs (Wedding, Engagement,
 * Birthday, More occasions, Traditions), each opening one short list, then language,
 * sign in and the main action. A phone gets the same tabs in its menu, each opening in
 * place (owner, 2026-10-24: simple, clean, straight to what the family wants).
 */
export function SiteHeader({ menu }: { menu: SiteMenu }) {
  const { shell } = useText(shellText);
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
      <div className="mx-auto flex h-16 w-full max-w-site items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Below 360px only the mandala shows, so the actions fit beside it */}
        <Logo className="shrink-0 max-[359px]:[&>span]:sr-only" />

        {/* Tamil's words are too long for one line beside the logo and buttons, so a Tamil
            page keeps its tabs in the menu at every width */}
        <NavigationMenu.Root
          aria-label={shell.primaryNav}
          delayDuration={120}
          className="ms-4 hidden min-w-0 xl:block xl:[&:lang(ta)]:hidden"
        >
          <NavigationMenu.List className="flex items-center">
            {menu.tabs.map((tab) => {
              const current = tab.links.some((link) => link.href === pathname);
              return (
                <NavigationMenu.Item key={tab.id} value={tab.id} className="relative">
                  <NavigationMenu.Trigger
                    data-current={current || undefined}
                    className={tabTrigger}
                  >
                    {tab.label}
                    <ChevronDown
                      aria-hidden
                      className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
                    />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    className={cn(
                      "absolute start-0 top-full z-50 mt-2 rounded-xl border border-line bg-surface p-2 shadow-float data-[motion^=from-]:animate-fade-in data-[motion^=to-]:animate-fade-out",
                      tab.wide ? "w-[34rem]" : "w-80",
                    )}
                  >
                    <TabLinks
                      tab={tab}
                      wrap={(link) => <NavigationMenu.Link asChild>{link}</NavigationMenu.Link>}
                    />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              );
            })}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="hidden xl:inline-flex xl:[&:lang(ta)]:hidden" />
          <AccountMenu compact />
          <Button asChild size="sm" className="hidden whitespace-nowrap sm:inline-flex xl:ms-1">
            <Link href={pagePath({ kind: "gallery" }, locale)}>{shell.createInviteShort}</Link>
          </Button>
          <div className="xl:hidden xl:[&:lang(ta)]:block">
            <MobileMenu menu={menu} />
          </div>
        </div>
      </div>
    </header>
  );
}
