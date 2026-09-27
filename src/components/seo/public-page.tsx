import { ArrowRight, ChevronRight, MailCheck, Rotate3d, Send } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { TiltCard } from "@/components/motion/tilt-card";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { Button } from "@/components/ui/button";
import { editorText, landingText, seoText } from "@/i18n/copy";
import type { UiLocale } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";
import { breadcrumbList } from "@/lib/seo/structured-data";
import type { TemplateId } from "@/lib/templates/schema";
import { cn } from "@/lib/cn";

/*
 * The frame and building blocks of the public pages search engines index: occasions,
 * traditions, designs and the gallery. Server-rendered and static, so every word is in
 * the HTML; the 3D card waits for the editor.
 */

export type Crumb = { name: string; path: string };

export function PublicShell({
  locale,
  crumbs,
  jsonLd = [],
  children,
}: {
  locale: UiLocale;
  /** From the home page to this one; the last is the current page. */
  crumbs: Crumb[];
  jsonLd?: Record<string, unknown>[];
  children: ReactNode;
}) {
  const { seoCopy } = seoText[locale];
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <nav
          aria-label={seoCopy.breadcrumbs}
          className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-ink-muted">
            {crumbs.map((crumb, index) => {
              const current = index === crumbs.length - 1;
              return (
                <li key={crumb.path} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight aria-hidden className="size-4 rtl:rotate-180" />}
                  {current ? (
                    <span aria-current="page" className="py-3 text-ink">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="inline-flex min-h-11 items-center rounded-md px-1 underline-offset-4 transition-colors hover:text-accent-text hover:underline"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {children}
      </main>
      <SiteFooter locale={locale} />
      <JsonLd data={[breadcrumbList(crumbs), ...jsonLd]} />
    </div>
  );
}

/** The page's heading, what it offers, and the way into the editor. */
export function PageHero({
  locale,
  eyebrow,
  heading,
  intro,
  createHref,
  createLabel,
  aside,
  children,
}: {
  locale: UiLocale;
  eyebrow: string;
  heading: string;
  intro: string;
  createHref: string;
  createLabel?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const { seoCopy } = seoText[locale];
  return (
    <section
      aria-labelledby="page-title"
      className="relative isolate mx-auto grid w-full max-w-6xl gap-10 px-4 pt-6 pb-14 sm:px-6 sm:pb-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 aspect-square w-[min(120%,56rem)] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 22%, transparent), color-mix(in srgb, var(--rose) 6%, transparent) 60%, transparent)",
        }}
      />
      <div className={cn("flex flex-col gap-5", !aside && "lg:col-span-2 lg:max-w-3xl")}>
        <p className="flex items-center gap-3 font-label text-xs tracking-[0.28em] text-accent-text uppercase">
          <span aria-hidden className="h-px w-6 bg-marigold" />
          {eyebrow}
        </p>
        <h1
          id="page-title"
          className="font-display text-[2.3rem] leading-[1.06] break-words sm:text-[3.4rem] lg:text-[3.9rem]"
        >
          {heading}
        </h1>
        <p className="max-w-2xl text-lg text-ink-muted">{intro}</p>
        {children}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={createHref}>
                {createLabel ?? seoCopy.create}
                <ArrowRight aria-hidden className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-ink-muted">{seoCopy.freeNote}</p>
        </div>
      </div>
      {aside}
    </section>
  );
}

const FEATURE_ICONS = [Rotate3d, Send, MailCheck];

export function FeatureRow({ locale }: { locale: UiLocale }) {
  const { seoCopy } = seoText[locale];
  return (
    <section className="border-y border-line bg-surface-2/50">
      <ul className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {seoCopy.features.map((feature, index) => {
          const Icon = FEATURE_ICONS[index]!;
          return (
            <li key={feature.title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent-text shadow-raised">
                <Icon aria-hidden className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">{feature.title}</h2>
                <p className="text-sm text-ink-muted">{feature.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** A heading and intro above a block of the page. */
export function Block({
  id,
  heading,
  intro,
  children,
  className,
}: {
  id: string;
  heading: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn("mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8", className)}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2
          id={`${id}-title`}
          className="font-display text-[1.9rem] leading-tight sm:text-[2.5rem]"
        >
          {heading}
        </h2>
        {intro && <p className="text-lg text-ink-muted">{intro}</p>}
      </div>
      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  );
}

/** Designs as covers, each linking to its own page. */
export function DesignGrid({ locale, ids }: { locale: UiLocale; ids: readonly TemplateId[] }) {
  const { designCopy } = editorText[locale];
  const { templates } = landingText[locale];
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
      {ids.map((id) => {
        const raga = templates.items.find((item) => item.id === id)?.kind;
        return (
          <li key={id}>
            <Link
              href={pagePath({ kind: "design", id }, locale)}
              className="group flex flex-col gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <TiltCard className="rounded-md" maxTilt={6}>
                <TemplateCover id={id} />
              </TiltCard>
              <span className="flex flex-col">
                <span className="font-display text-lg leading-tight transition-colors group-hover:text-accent-text sm:text-xl">
                  {designCopy[id].name}
                </span>
                {raga && <span className="text-sm text-ink-muted">{raga}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Links to related pages, as pills. */
export function LinkPills({
  links,
}: {
  links: { label: ReactNode; href: string; lang?: string }[];
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            lang={link.lang}
            className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink shadow-raised transition-[border-color,color,transform] duration-150 hover:border-marigold hover:text-accent-text active:scale-95"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
