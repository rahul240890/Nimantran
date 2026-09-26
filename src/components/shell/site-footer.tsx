import { Logo } from "@/components/brand/logo";
import { Mandala } from "@/components/brand/mandala";
import { languages, nav, shell } from "@/content/landing";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-surface-2/60">
      <Mandala className="pointer-events-none absolute -end-24 -bottom-32 -z-10 size-96 text-line-strong opacity-40" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1.4fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <Logo className="self-start" />
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
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center rounded-md px-2 text-ink transition-colors hover:text-accent-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#waitlist"
                className="inline-flex min-h-11 items-center rounded-md px-2 text-ink transition-colors hover:text-accent-text"
              >
                {shell.joinWaitlist}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
            {shell.footer.languages}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {languages.map((language) => (
              <li
                key={language.code}
                lang={language.code}
                className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-muted"
              >
                {language.native}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-sm text-ink-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            © 2026 {site.name}. {shell.footer.rights}
          </p>
          <p>{shell.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
