import { format } from "date-fns";
import { legalText } from "@/i18n/copy/legal";
import { seoText } from "@/i18n/copy/seo";
import { dateLocale } from "@/i18n/dates";
import type { UiLocale } from "@/i18n/locales";
import type { Block } from "@/content/legal";
import { LEGAL_UPDATED } from "@/lib/legal";
import { contactEmail } from "@/lib/payments/business";
import { pagePath } from "@/lib/seo/paths";
import { PublicShell } from "./public-page";

function Paragraphs({ blocks }: { blocks: readonly Block[] }) {
  return blocks.map((block, index) =>
    typeof block === "string" ? (
      <p key={index}>{block}</p>
    ) : (
      <ul key={index} className="flex list-disc flex-col gap-2 ps-6 marker:text-marigold">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  );
}

/** The privacy policy, the terms or the refund policy: plain reading, a list of sections, and who to write to. */
export async function LegalPage({
  locale,
  kind,
}: {
  locale: UiLocale;
  kind: "privacy" | "terms" | "refunds";
}) {
  const { legalCopy, [kind]: doc } = legalText[locale];
  // A language whose policies aren't translated yet shows the English ones, marked as such
  const english = locale !== "en" && doc === legalText.en[kind];
  const { seoCopy } = seoText[locale];
  const email = await contactEmail();
  const updated = format(new Date(`${LEGAL_UPDATED}T00:00:00`), "d MMMM yyyy", {
    locale: dateLocale[locale],
  });
  return (
    <PublicShell
      locale={locale}
      crumbs={[
        { name: seoCopy.home, path: pagePath({ kind: "home" }, locale) },
        { name: doc.title, path: pagePath({ kind }, locale) },
      ]}
    >
      <article
        aria-labelledby="page-title"
        lang={english ? "en" : undefined}
        className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pt-6 pb-20 sm:px-6 lg:px-8"
      >
        {english && legalCopy.inEnglish && (
          <p
            role="note"
            lang={locale}
            className="rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-ink-muted"
          >
            {legalCopy.inEnglish}
          </p>
        )}
        <header className="flex flex-col gap-4">
          <h1
            id="page-title"
            className="font-display text-[2.3rem] leading-[1.06] break-words sm:text-[3.2rem]"
          >
            {doc.title}
          </h1>
          <p className="text-sm text-ink-muted">
            {legalCopy.updated}: <time dateTime={LEGAL_UPDATED}>{updated}</time>
          </p>
          <p className="text-lg text-ink-muted">{doc.intro}</p>
        </header>

        <nav
          aria-labelledby="legal-contents"
          className="rounded-lg border border-line bg-surface p-5 shadow-raised"
        >
          <h2
            id="legal-contents"
            className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
          >
            {legalCopy.onThisPage}
          </h2>
          <ol className="-ms-2 mt-2 grid gap-x-6 sm:grid-cols-2">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-11 items-center rounded-md px-2 text-ink underline-offset-4 transition-colors hover:text-accent-text hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="flex scroll-mt-24 flex-col gap-4 leading-relaxed"
          >
            <h2 id={`${section.id}-heading`} className="font-display text-2xl sm:text-3xl">
              {section.heading}
            </h2>
            <Paragraphs blocks={section.body} />
          </section>
        ))}

        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="flex scroll-mt-24 flex-col gap-3 border-t border-line pt-8"
        >
          <h2 id="contact-heading" className="font-display text-2xl sm:text-3xl">
            {legalCopy.contactHeading}
          </h2>
          {email ? (
            <p>
              {legalCopy.contactEmail(email).split(email)[0]}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-accent-text underline underline-offset-4"
              >
                {email}
              </a>
              {legalCopy.contactEmail(email).split(email)[1]}
            </p>
          ) : (
            <p>{legalCopy.contactPending}</p>
          )}
        </section>
      </article>
    </PublicShell>
  );
}
