import type { Metadata } from "next";
import { TemplateCover } from "@/components/brand/template-cover";
import { TiltCard } from "@/components/motion/tilt-card";
import { DesignCatalog } from "@/components/gallery/design-catalog";
import { GalleryHero } from "@/components/gallery/gallery-pages";
import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import { legalText } from "@/i18n/copy/legal";
import { seoText } from "@/i18n/copy/seo";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/categories/catalog";
import { pageAlternates, pagePath, type PublicPage } from "@/lib/seo/paths";
import { itemList } from "@/lib/seo/structured-data";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/templates/ids";
import { TRADITIONS, TRADITION_LIST } from "@/lib/traditions/catalog";
import { WORDING_IDS, type TraditionId } from "@/lib/traditions/schema";
import { site } from "@/lib/site";
import {
  Block,
  DesignGrid,
  FeatureRow,
  LinkPills,
  PageHero,
  PublicShell,
  type Crumb,
} from "./public-page";

/* The public pages, in any site language: /… in English and /hi/… in Hindi. */

type Words = { title: string; description: string };

function wordsFor(page: PublicPage, locale: UiLocale): Words {
  const { seoCopy } = seoText[locale];
  switch (page.kind) {
    case "home":
      return landingText[locale].homeMeta;
    case "designs":
      return seoCopy.gallery;
    case "design": {
      const design = editorText[locale].designCopy[page.id];
      return {
        title: seoCopy.design.title(design.name),
        description: seoCopy.design.description(design.description),
      };
    }
    case "gallery": {
      const { galleryCopy } = galleryText[locale];
      return { title: galleryCopy.metaTitle, description: galleryCopy.metaDescription };
    }
    case "occasion":
      return seoCopy.occasions[page.id];
    case "wedding-kind": {
      const { galleryCopy, weddingKindCopy } = galleryText[locale];
      return galleryCopy.kindMeta(weddingKindCopy[page.id].name);
    }
    case "tradition":
      return seoCopy.traditionPages[page.id];
    case "privacy":
    case "terms": {
      const { title, description } = legalText[locale][page.kind];
      return { title, description };
    }
  }
}

/** Title, description, canonical address, language versions and link preview for a page. */
export function publicMetadata(page: PublicPage, locale: UiLocale): Metadata {
  const { title, description } = wordsFor(page, locale);
  const url = pagePath(page, locale);
  return {
    title,
    description,
    alternates: pageAlternates(page, locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
      locale: locale === "hi" ? "hi_IN" : "en_IN",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function homeCrumb(locale: UiLocale): Crumb {
  return { name: seoText[locale].seoCopy.home, path: pagePath({ kind: "home" }, locale) };
}

function Cover({ id, locale }: { id: TemplateId; locale: UiLocale }) {
  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-md">
      <TiltCard className="rounded-md" maxTilt={8}>
        <TemplateCover id={id} locale={locale} />
      </TiltCard>
    </div>
  );
}

function traditionLinks(locale: UiLocale, ids: readonly TraditionId[]) {
  const { traditionCopy } = editorText[locale];
  return ids.map((id) => ({
    label: traditionCopy.names[id],
    href: pagePath({ kind: "tradition", id }, locale),
  }));
}

export function TraditionPage({ id, locale }: { id: TraditionId; locale: UiLocale }) {
  const { seoCopy } = seoText[locale];
  const { functionCopy, traditionCopy } = editorText[locale];
  const pack = TRADITIONS[id];
  const words = seoCopy.traditionPages[id];
  const ceremonies = Object.entries(pack.ceremonies);
  const wording = WORDING_IDS.flatMap((block) => {
    const entry = pack.wording[block];
    return entry ? [{ id: block, ...entry }] : [];
  });
  return (
    <PublicShell
      locale={locale}
      crumbs={[
        homeCrumb(locale),
        { name: traditionCopy.names[id], path: pagePath({ kind: "tradition", id }, locale) },
      ]}
    >
      <PageHero
        locale={locale}
        eyebrow={seoCopy.traditions}
        heading={words.heading}
        intro={words.intro}
        createHref={`/create?category=wedding&tradition=${id}`}
        aside={<Cover id={pack.templates[0]!} locale={locale} />}
      >
        {pack.invocation && (
          <p
            lang={pack.language}
            className="self-start rounded-lg border border-line bg-surface px-5 py-3 font-display text-2xl text-accent-text shadow-raised"
          >
            {pack.invocation.script}
          </p>
        )}
      </PageHero>
      <FeatureRow locale={locale} />
      {ceremonies.length > 0 && (
        <Block id="ceremonies" heading={seoCopy.ceremoniesHeading} intro={seoCopy.ceremoniesIntro}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ceremonies.map(([fn, local]) => (
              <li
                key={fn}
                className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-5 shadow-raised"
              >
                <h3 lang={pack.language} className="font-display text-xl">
                  {local.native}
                </h3>
                <p className="text-sm text-ink-muted">
                  {local.latin} · {functionCopy[fn as keyof typeof functionCopy].name}
                </p>
              </li>
            ))}
          </ul>
        </Block>
      )}
      {wording.length > 0 && (
        <Block
          id="wording"
          heading={seoCopy.wordingHeading}
          intro={seoCopy.wordingIntro}
          className="pt-0 sm:pt-0"
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            {wording.map((block) => (
              <div
                key={block.id}
                className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-5 shadow-raised"
              >
                <dt className="text-sm text-ink-muted">
                  {traditionCopy.wordingLabels[block.id]} ·{" "}
                  <span lang={pack.language} className="text-accent-text">
                    {block.title}
                  </span>
                </dt>
                <dd lang={pack.language} className="text-lg">
                  {block.example}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-ink-muted">{seoCopy.draftNote}</p>
        </Block>
      )}
      <Block
        id="designs"
        heading={seoCopy.designsHeading}
        intro={seoCopy.designsIntro}
        className={ceremonies.length > 0 || wording.length > 0 ? "pt-0 sm:pt-0" : undefined}
      >
        <DesignGrid locale={locale} ids={pack.templates} />
      </Block>
      <Block id="more" heading={seoCopy.moreTraditions} className="pt-0 sm:pt-0">
        <LinkPills
          links={traditionLinks(
            locale,
            TRADITION_LIST.map((other) => other.id).filter((other) => other !== id),
          )}
        />
      </Block>
    </PublicShell>
  );
}

export function DesignPage({ id, locale }: { id: TemplateId; locale: UiLocale }) {
  const { seoCopy } = seoText[locale];
  const { designCopy } = editorText[locale];
  const { templates } = landingText[locale];
  const design = designCopy[id];
  const raga = templates.items.find((item) => item.id === id)?.kind;
  const occasions = CATEGORY_IDS.filter((category) =>
    (CATEGORIES[category].templates as readonly TemplateId[]).includes(id),
  );
  const traditions = TRADITION_LIST.filter((pack) => pack.templates.includes(id)).map(
    (pack) => pack.id,
  );
  return (
    <PublicShell
      locale={locale}
      crumbs={[
        homeCrumb(locale),
        { name: seoCopy.designs, path: pagePath({ kind: "designs" }, locale) },
        { name: design.name, path: pagePath({ kind: "design", id }, locale) },
      ]}
    >
      <PageHero
        locale={locale}
        eyebrow={seoCopy.design.eyebrow}
        heading={design.name}
        intro={design.description}
        createHref={`/create?template=${id}`}
        createLabel={seoCopy.useDesign}
        aside={<Cover id={id} locale={locale} />}
      >
        {raga && (
          <p className="text-ink-muted">
            <span className="font-semibold text-ink">{seoCopy.raga}:</span> {raga}
          </p>
        )}
      </PageHero>
      <FeatureRow locale={locale} />
      <Block id="suits" heading={seoCopy.suitsHeading}>
        <LinkPills
          links={[
            ...occasions.map((category) => ({
              label: CATEGORIES[category].names[locale],
              href: pagePath({ kind: "occasion", id: category }, locale),
            })),
            ...traditionLinks(locale, traditions),
          ]}
        />
      </Block>
      <Block id="designs" heading={seoCopy.allDesigns} className="pt-0 sm:pt-0">
        <DesignGrid locale={locale} ids={TEMPLATE_IDS.filter((other) => other !== id)} />
      </Block>
    </PublicShell>
  );
}

export function DesignsPage({ locale }: { locale: UiLocale }) {
  const { seoCopy } = seoText[locale];
  const { designCopy } = editorText[locale];
  return (
    <PublicShell
      locale={locale}
      crumbs={[
        homeCrumb(locale),
        { name: seoCopy.designs, path: pagePath({ kind: "designs" }, locale) },
      ]}
      jsonLd={[
        itemList(
          TEMPLATE_IDS.map((id) => ({
            name: designCopy[id].name,
            path: pagePath({ kind: "design", id }, locale),
          })),
        ),
      ]}
    >
      <GalleryHero
        eyebrow={seoCopy.designs}
        heading={seoCopy.gallery.heading}
        intro={seoCopy.gallery.intro}
      />
      <DesignCatalog
        covers={Object.fromEntries(
          TEMPLATE_IDS.map((id) => [
            id,
            <TemplateCover key={id} id={id} locale={locale} className="max-w-[16rem]" />,
          ]),
        )}
      />
    </PublicShell>
  );
}
