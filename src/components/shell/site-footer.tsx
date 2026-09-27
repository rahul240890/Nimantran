import { Logo } from "@/components/brand/logo";
import { Mandala } from "@/components/brand/mandala";
import Link from "next/link";
import { editorText } from "@/i18n/copy/editor";
import { landingText } from "@/i18n/copy/landing";
import { legalText } from "@/i18n/copy/legal";
import { seoText } from "@/i18n/copy/seo";
import { homePath, languages, type UiLocale } from "@/i18n/locales";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/categories/catalog";
import { pagePath } from "@/lib/seo/paths";
import { TRADITION_IDS } from "@/lib/traditions/schema";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function SiteFooter({ locale }: { locale: UiLocale }) {
  const { nav, shell } = landingText[locale];
  const { seoCopy } = seoText[locale];
  const { legalCopy } = legalText[locale];
  const { traditionCopy } = editorText[locale];
  const home = homePath(locale);
  const linkClass =
    "inline-flex min-h-11 items-center rounded-md px-2 text-ink transition-colors hover:text-accent-text";
  const pageLinks = [
    {
      id: "footer-invitations",
      heading: seoCopy.footerInvitations,
      links: CATEGORY_IDS.map((id) => ({
        label: CATEGORIES[id].names[locale],
        href: pagePath({ kind: "occasion", id }, locale),
      })),
    },
    {
      id: "footer-more",
      heading: seoCopy.footerMore,
      links: [
        { label: seoCopy.allDesigns, href: pagePath({ kind: "designs" }, locale) },
        ...TRADITION_IDS.map((id) => ({
          label: traditionCopy.names[id],
          href: pagePath({ kind: "tradition", id }, locale),
        })),
      ],
    },
  ];
  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-surface-2/60">
      <Mandala className="pointer-events-none absolute -end-24 -bottom-32 -z-10 size-96 text-line-strong opacity-40" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-14 pb-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr_1.3fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <Logo className="self-start" />
          <p className="font-display text-lg text-ink-muted">
            {locale === "hi" ? (
              shell.footer.meaning
            ) : (
              <>
                <span lang="hi" className="font-system">
                  {site.nameDevanagari}
                </span>{" "}
                · {shell.footer.meaning}
              </>
            )}
          </p>
          <p className="max-w-xs text-ink-muted">{shell.footer.tagline}</p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2
            id="footer-explore"
            className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
          >
            {shell.footer.explore}
          </h2>
          <ul className="-ms-2 mt-3 flex flex-col">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`${home}#${item.id}`} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`${home}#waitlist`} className={linkClass}>
                {shell.joinWaitlist}
              </a>
            </li>
          </ul>
        </nav>

        {pageLinks.map((group) => (
          <nav key={group.id} aria-labelledby={group.id}>
            <h2
              id={group.id}
              className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
            >
              {group.heading}
            </h2>
            <ul className="-ms-2 mt-3 grid grid-cols-2 gap-x-4 sm:flex sm:flex-col">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
            {shell.footer.languages}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {languages.map((language) => (
              <li
                key={language.code}
                lang={language.code}
                className={cn(
                  "rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-muted",
                  locale !== "hi" && "font-system",
                )}
              >
                {language.native}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © 2026 {locale === "hi" ? site.nameDevanagari : site.name}. {shell.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-4">
            <nav aria-label={legalCopy.footer.heading} className="-ms-2 flex">
              {(["privacy", "terms"] as const).map((kind) => (
                <Link
                  key={kind}
                  href={pagePath({ kind }, locale)}
                  className="inline-flex min-h-11 items-center rounded-md px-2 underline-offset-4 transition-colors hover:text-accent-text hover:underline"
                >
                  {legalCopy.footer[kind]}
                </Link>
              ))}
            </nav>
            <p>{shell.footer.madeIn}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
