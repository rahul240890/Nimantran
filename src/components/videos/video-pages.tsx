import { ArrowRight, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { designWords } from "@/components/gallery/design-words";
import { GalleryHero, Shelf } from "@/components/gallery/gallery-pages";
import { PublicShell } from "@/components/seo/public-page";
import { Button } from "@/components/ui/button";
import { videoWords } from "@/content/videos";
import { galleryText } from "@/i18n/copy/gallery";
import { seoText } from "@/i18n/copy/seo";
import { ogLocale, type UiLocale } from "@/i18n/locales";
import type { CategoryId } from "@/lib/categories/catalog";
import { site } from "@/lib/site";
import { blogPostPath, postsIn } from "@/lib/blog/posts";
import { designHref } from "@/lib/gallery/catalog";
import { pagePath } from "@/lib/seo/paths";
import { videoObject } from "@/lib/seo/structured-data";
import { SAMPLE_VIDEOS, type SampleVideo } from "@/lib/videos/catalog";
import {
  VIDEOS_INDEX,
  occasionName,
  videoDesign,
  videoFile,
  videoFileUrls,
  videoFor,
  videoPath,
  videosIn,
} from "@/lib/videos/pages";

/*
 * The sample video pages (src/lib/videos): a design's video with made-up names, what it shows,
 * and the way to make one, server-rendered so search engines read the words and show the video.
 */

/** A video's title and description in its own language. */
export function videoText(video: SampleVideo) {
  const words = videoWords[video.lang];
  const design = designWords(videoDesign(video), video.lang).name;
  const occasion = occasionName(video);
  return {
    title: words.title(occasion, design),
    description: words.description(occasion, design, Math.round(video.seconds)),
    occasion,
    design,
  };
}

/** The structured data for one video, for its own page and any page that shows it. */
export function videoJsonLd(video: SampleVideo) {
  const { title, description } = videoText(video);
  const { src, poster } = videoFileUrls(video);
  return videoObject({
    name: title,
    description,
    contentUrl: src,
    thumbnailUrl: poster,
    seconds: video.seconds,
    path: videoPath(video),
    locale: video.lang,
  });
}

/** The player: vertical, with its poster, loading only when played. */
export function SampleVideoPlayer({ video, label }: { video: SampleVideo; label: string }) {
  const { src, poster } = videoFile(video);
  return (
    <video
      controls
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
      className="aspect-[9/16] w-full max-w-sm rounded-xl border border-line bg-night shadow-raised"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/** A small card linking to a video's page. */
export function VideoTile({ video, watch }: { video: SampleVideo; watch: string }) {
  const { poster } = videoFile(video);
  const { title } = videoText(video);
  return (
    <Link
      href={videoPath(video)}
      lang={video.lang}
      className="group flex flex-col gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marigold"
    >
      <span className="relative block aspect-[9/16] overflow-hidden rounded-lg border border-line bg-night shadow-raised">
        {/* eslint-disable-next-line @next/next/no-img-element -- the poster may come from R2 */}
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
        />
        <span className="absolute bottom-2 left-2 flex min-h-11 items-center gap-1.5 rounded-full bg-paper/90 px-3 font-label text-xs text-ink">
          <Play aria-hidden className="size-3.5" />
          {watch}
        </span>
      </span>
      <span className="text-sm font-semibold text-ink group-hover:text-accent-text">{title}</span>
    </Link>
  );
}

export function VideoPage({ video }: { video: SampleVideo }) {
  const locale = video.lang;
  const words = videoWords[locale];
  const { seoCopy } = seoText[locale];
  const { galleryCopy } = galleryText[locale];
  const { title, occasion, design } = videoText(video);
  const path = videoPath(video);
  const occasionPath = pagePath({ kind: "occasion", id: video.occasion }, locale);
  const posts = postsIn(locale)
    .filter((post) => post.occasion === video.occasion)
    .slice(0, 4);
  const more = [
    ...videosIn(locale).filter((other) => other.id !== video.id),
    ...SAMPLE_VIDEOS.filter((other) => other.lang !== locale && other.occasion === video.occasion),
  ].slice(0, 6);
  return (
    <PublicShell
      locale={locale}
      crumbs={[
        { name: seoCopy.home, path: pagePath({ kind: "home" }, locale) },
        { name: galleryCopy.breadcrumb, path: pagePath({ kind: "gallery" }, locale) },
        { name: occasion, path: occasionPath },
        { name: title, path },
      ]}
      jsonLd={[videoJsonLd(video)]}
    >
      <GalleryHero eyebrow={words.videos} heading={title} intro={words.intro(occasion, design)} />
      <section className="mx-auto grid w-full max-w-site gap-8 px-4 pb-14 sm:px-6 md:grid-cols-[minmax(0,24rem)_1fr] lg:px-8">
        <SampleVideoPlayer video={video} label={title} />
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-[1.5rem] leading-tight sm:text-3xl">
            {words.showsHeading}
          </h2>
          <ul className="grid max-w-prose list-disc gap-2 ps-5 text-ink-muted">
            {words.shows.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="max-w-prose text-ink-muted">{words.priceNote}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={designHref(videoDesign(video), { category: video.occasion })}>
                {words.make}
                <ArrowRight aria-hidden className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={occasionPath}>{words.seeDesigns(occasion)}</Link>
            </Button>
          </div>
        </div>
      </section>
      {posts.length > 0 && (
        <Shelf id="wording" heading={words.wordingHeading}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={blogPostPath(post.slug, post.locale)}
                  className="flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 py-3 font-semibold text-ink shadow-raised hover:border-marigold hover:text-accent-text"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </Shelf>
      )}
      {more.length > 0 && (
        <Shelf id="more-videos" heading={words.moreHeading}>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {more.map((other) => (
              <li key={other.id}>
                <VideoTile video={other} watch={words.watch} />
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link
              href={VIDEOS_INDEX}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text underline-offset-4 hover:underline"
            >
              {videoWords.en.indexHeading}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
        </Shelf>
      )}
    </PublicShell>
  );
}

/** /videos: every sample video, the English ones first. */
export function VideosIndexPage() {
  const words = videoWords.en;
  const { seoCopy } = seoText.en;
  const ordered = [...videosIn("en"), ...SAMPLE_VIDEOS.filter((video) => video.lang !== "en")];
  return (
    <PublicShell
      locale="en"
      crumbs={[
        { name: seoCopy.home, path: pagePath({ kind: "home" }, "en") },
        { name: words.indexHeading, path: VIDEOS_INDEX },
      ]}
      jsonLd={ordered.map(videoJsonLd)}
    >
      <GalleryHero eyebrow={words.videos} heading={words.indexHeading} intro={words.indexIntro} />
      <Shelf id="videos" heading={words.videos}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ordered.map((video) => (
            <li key={video.id}>
              <VideoTile video={video} watch={videoWords[video.lang].watch} />
            </li>
          ))}
        </ul>
      </Shelf>
    </PublicShell>
  );
}

/** A video page's title, description, address and link preview, in its one language. */
export function videoMetadata(video: SampleVideo): Metadata {
  const { title, description } = videoText(video);
  const path = videoPath(video);
  const { src, poster } = videoFileUrls(video);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "video.other",
      siteName: site.name,
      title,
      description,
      url: path,
      locale: ogLocale(video.lang),
      images: [{ url: poster, width: 720, height: 1280, alt: title }],
      videos: [{ url: src, type: "video/mp4", width: 720, height: 1280 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function videosIndexMetadata(): Metadata {
  const words = videoWords.en;
  return {
    title: words.indexTitle,
    description: words.indexDescription,
    alternates: { canonical: VIDEOS_INDEX },
    openGraph: {
      siteName: site.name,
      title: words.indexTitle,
      description: words.indexDescription,
      url: VIDEOS_INDEX,
    },
  };
}

/** On an occasion's page or a post: its sample video, and the way to its own page. */
export function OccasionVideo({ occasion, locale }: { occasion: CategoryId; locale: UiLocale }) {
  const video = videoFor(occasion, locale);
  if (!video) return null;
  const words = videoWords[locale];
  const { title } = videoText(video);
  return (
    <section
      aria-labelledby="sample-video-heading"
      className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 shadow-raised sm:flex-row sm:items-center sm:gap-6 sm:p-6"
    >
      <div className="w-full max-w-60 shrink-0">
        <SampleVideoPlayer video={video} label={title} />
      </div>
      <div className="flex flex-col gap-3">
        <h2 id="sample-video-heading" className="font-display text-2xl leading-tight">
          {words.videos}
        </h2>
        <p className="text-ink-muted" lang={video.lang}>
          {title}
        </p>
        <p className="text-ink-muted">{words.priceNote}</p>
        <Link
          href={videoPath(video)}
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          {words.watch}
          <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}
