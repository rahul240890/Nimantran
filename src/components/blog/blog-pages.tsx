import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Block, PublicShell, type Crumb } from "@/components/seo/public-page";
import { Button } from "@/components/ui/button";
import type { BlogPost, PostBlock } from "@/content/blog/types";
import { pagesText } from "@/i18n/copy/pages";
import { seoText } from "@/i18n/copy/seo";
import { dateLocale } from "@/i18n/dates";
import type { UiLocale } from "@/i18n/locales";
import { blogPostPath, postsIn, readingMinutes } from "@/lib/blog/posts";
import { CATEGORIES } from "@/lib/categories/catalog";
import { pagePath } from "@/lib/seo/paths";
import { blogPosting, faqPage, itemList } from "@/lib/seo/structured-data";
import { cn } from "@/lib/cn";
import { CopyButton } from "./copy-button";
import { Inline } from "./inline";

/*
 * The blog (docs/BLOG.md): its front page in each language, and each post. Static, so
 * every word is in the HTML; posts are data in src/content/blog.
 */

function blogCrumbs(locale: UiLocale): Crumb[] {
  const { seoCopy } = seoText[locale];
  return [
    { name: seoCopy.home, path: pagePath({ kind: "home" }, locale) },
    { name: pagesText[locale].blogCopy.crumb, path: pagePath({ kind: "blog" }, locale) },
  ];
}

function PostMeta({ post }: { post: BlogPost }) {
  const { blogCopy } = pagesText[post.locale];
  const date = format(new Date(`${post.published}T00:00:00`), "d MMMM yyyy", {
    locale: dateLocale[post.locale],
  });
  return (
    <p className="text-sm text-ink-muted">
      <time dateTime={post.published}>{date}</time> · {blogCopy.minutes(readingMinutes(post))}
    </p>
  );
}

function PostCards({ posts, headingLevel }: { posts: BlogPost[]; headingLevel: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug} className="flex">
          <article className="relative flex w-full flex-col gap-3 rounded-lg border border-line bg-surface p-5 shadow-raised transition-[border-color,transform] duration-150 focus-within:border-marigold hover:-translate-y-0.5 hover:border-marigold motion-reduce:hover:translate-y-0 sm:p-6">
            <p className="font-label text-xs tracking-[0.2em] text-accent-text uppercase">
              {CATEGORIES[post.occasion].names[post.locale]}
            </p>
            <Heading className="font-display text-xl leading-tight sm:text-2xl">
              <Link
                href={blogPostPath(post.slug, post.locale)}
                className="rounded-sm after:absolute after:inset-0 after:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {post.heading}
              </Link>
            </Heading>
            <p className="text-ink-muted">{post.description}</p>
            <div className="mt-auto pt-2">
              <PostMeta post={post} />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function BlogIndexPage({ locale }: { locale: UiLocale }) {
  const { blogCopy } = pagesText[locale];
  const posts = postsIn(locale);
  const other = locale === "en" ? "hi" : "en";
  return (
    <PublicShell
      locale={locale}
      crumbs={blogCrumbs(locale)}
      jsonLd={[
        itemList(
          posts.map((post) => ({ name: post.heading, path: blogPostPath(post.slug, locale) })),
        ),
      ]}
    >
      <section
        aria-labelledby="page-title"
        className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-6 pb-4 sm:px-6 lg:px-8"
      >
        <p className="flex items-center gap-3 font-label text-xs tracking-[0.28em] text-accent-text uppercase">
          <span aria-hidden className="h-px w-6 bg-marigold" />
          {blogCopy.eyebrow}
        </p>
        <h1
          id="page-title"
          className="max-w-3xl font-display text-[2.3rem] leading-[1.06] break-words sm:text-[3.4rem]"
        >
          {blogCopy.heading}
        </h1>
        <p className="max-w-2xl text-lg text-ink-muted">{blogCopy.intro}</p>
        {postsIn(other).length > 0 && (
          <p>
            <Link
              href={blogPostPath(null, other)}
              lang={blogCopy.otherLanguageLang}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
            >
              {blogCopy.otherLanguage}
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
            </Link>
          </p>
        )}
      </section>
      <Block id="posts" heading={blogCopy.postsHeading} className="pt-6 sm:pt-8">
        <PostCards posts={posts} headingLevel="h3" />
      </Block>
    </PublicShell>
  );
}

function PostBody({ block, index, locale }: { block: PostBlock; index: number; locale: UiLocale }) {
  const { blogCopy } = pagesText[locale];
  if (typeof block === "string") {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }
  if ("h2" in block) {
    return (
      <h2 id={block.id} className="scroll-mt-24 pt-4 font-display text-2xl sm:text-3xl">
        {block.h2}
      </h2>
    );
  }
  if ("h3" in block) {
    return <h3 className="pt-2 font-display text-xl sm:text-2xl">{block.h3}</h3>;
  }
  if ("list" in block) {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List
        className={cn(
          "flex flex-col gap-2 ps-6 marker:text-marigold",
          block.ordered ? "list-decimal" : "list-disc",
        )}
      >
        {block.list.map((item) => (
          <li key={item}>
            <Inline text={item} />
          </li>
        ))}
      </List>
    );
  }
  if ("tip" in block) {
    return (
      <aside className="rounded-lg border border-marigold/50 bg-surface-2 px-5 py-4">
        <Inline text={block.tip} />
      </aside>
    );
  }
  return (
    <ul className="flex flex-col gap-4">
      {block.wording.map((item, position) => (
        <li
          key={`${index}-${position}`}
          className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5 shadow-raised"
        >
          {item.label && (
            <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {item.label}
            </p>
          )}
          <blockquote lang={item.lang} className="text-lg leading-relaxed">
            {item.text}
          </blockquote>
          <CopyButton
            text={item.text}
            label={blogCopy.copy}
            copied={blogCopy.copied}
            failed={blogCopy.copyFailed}
          />
        </li>
      ))}
    </ul>
  );
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  const { locale } = post;
  const { blogCopy } = pagesText[locale];
  const path = blogPostPath(post.slug, locale);
  const occasion = CATEGORIES[post.occasion].names[locale];
  const contents = post.body.flatMap((block) =>
    typeof block !== "string" && "h2" in block ? [block] : [],
  );
  const more = postsIn(locale)
    .filter((item) => item.slug !== post.slug)
    .slice(0, 4);
  return (
    <PublicShell
      locale={locale}
      crumbs={[...blogCrumbs(locale), { name: post.heading, path }]}
      jsonLd={[
        blogPosting({ ...post, path }),
        ...(post.faq?.length ? [faqPage(post.faq, locale)] : []),
      ]}
    >
      <article
        aria-labelledby="page-title"
        className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-6 pb-16 leading-relaxed sm:px-6 lg:px-8"
      >
        <header className="flex flex-col gap-4">
          <p className="font-label text-xs tracking-[0.2em] text-accent-text uppercase">
            {occasion}
          </p>
          <h1
            id="page-title"
            className="font-display text-[2.2rem] leading-[1.08] break-words sm:text-[3.1rem]"
          >
            {post.heading}
          </h1>
          <PostMeta post={post} />
          <p className="text-lg text-ink-muted">{post.intro}</p>
        </header>

        {contents.length > 2 && (
          <nav
            aria-labelledby="post-contents"
            className="rounded-lg border border-line bg-surface p-5 shadow-raised"
          >
            <h2
              id="post-contents"
              className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
            >
              {blogCopy.onThisPage}
            </h2>
            <ol className="-ms-2 mt-2 grid gap-x-6 sm:grid-cols-2">
              {contents.map((block) => (
                <li key={block.id}>
                  <a
                    href={`#${block.id}`}
                    className="inline-flex min-h-11 items-center rounded-md px-2 text-ink underline-offset-4 transition-colors hover:text-accent-text hover:underline"
                  >
                    {block.h2}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {post.body.map((block, index) => (
          <PostBody key={index} block={block} index={index} locale={locale} />
        ))}

        {post.faq && post.faq.length > 0 && (
          <section aria-labelledby="faq-heading" className="flex flex-col gap-4 pt-4">
            <h2 id="faq-heading" className="font-display text-2xl sm:text-3xl">
              {blogCopy.faqHeading}
            </h2>
            <dl className="flex flex-col gap-5">
              {post.faq.map((item) => (
                <div key={item.q} className="flex flex-col gap-1">
                  <dt className="font-semibold">{item.q}</dt>
                  <dd className="text-ink-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section
          aria-labelledby="cta-heading"
          className="relative isolate mt-4 flex flex-col gap-4 overflow-hidden rounded-xl border border-marigold/50 bg-surface p-6 shadow-float sm:p-8"
        >
          <h2 id="cta-heading" className="font-display text-2xl sm:text-3xl">
            {blogCopy.ctaHeading(occasion)}
          </h2>
          <p className="text-ink-muted">{blogCopy.ctaBody}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/create?category=${post.occasion}`}>
                {blogCopy.ctaCreate}
                <ArrowRight aria-hidden className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={pagePath({ kind: "occasion", id: post.occasion }, locale)}>
                {blogCopy.ctaDesigns(occasion)}
              </Link>
            </Button>
          </div>
        </section>
      </article>

      {more.length > 0 && (
        <Block id="more-posts" heading={blogCopy.morePosts} className="pt-0 sm:pt-0">
          <PostCards posts={more} headingLevel="h3" />
        </Block>
      )}
    </PublicShell>
  );
}
