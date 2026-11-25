import type { MetadataRoute } from "next";
import { videoText } from "@/components/videos/video-pages";
import { SAMPLE_VIDEOS } from "@/lib/videos/catalog";
import { VIDEOS_INDEX, VIDEOS_PUBLISHED, videoFileUrls, videoPath } from "@/lib/videos/pages";
import { UI_LOCALES } from "@/i18n/locales";
import { blogPostPath, translatedPost } from "@/lib/blog/posts";
import { allPostsIn } from "@/lib/blog/store";
import { allDesigns, kindDesigns, occasionDesigns } from "@/lib/gallery/catalog";
import { designPicture } from "@/lib/gallery/pictures";
import { indexedLocales, pagePath, publicPages, type PublicPage } from "@/lib/seo/paths";
import { absolute } from "@/lib/seo/structured-data";

/*
 * Every public page in every site language, each listing its other language versions and
 * the design pictures it shows (for Google Images), and every blog post in the language it
 * was written in.
 */

/* Refreshed every hour, so posts published from Admin, Blog are listed. */
export const revalidate = 3600;

/** The painted designs a page lists, each by the picture its card shows. */
function pagePictures(page: PublicPage): string[] {
  const designs =
    page.kind === "designs"
      ? allDesigns()
      : page.kind === "occasion"
        ? occasionDesigns(page.id)
        : page.kind === "wedding-kind"
          ? kindDesigns(page.id)
          : [];
  return [...new Set(designs.flatMap((design) => designPicture(design) ?? []))].map(absolute);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const byLocale = await Promise.all(UI_LOCALES.map(allPostsIn));
  // A language's blog is listed once it has a post of its own, never as an empty page
  const blogs = UI_LOCALES.filter((locale, i) => locale === "en" || byLocale[i]!.length > 0);
  const pages = publicPages().flatMap((page) => {
    const locales = page.kind === "blog" ? blogs : indexedLocales(page);
    const legal = page.kind === "privacy" || page.kind === "terms" || page.kind === "refunds";
    const languages = {
      ...Object.fromEntries(locales.map((code) => [`${code}-IN`, absolute(pagePath(page, code))])),
      "x-default": absolute(pagePath(page, "en")),
    };
    const images = pagePictures(page);
    return locales.map((locale) => ({
      url: absolute(pagePath(page, locale)),
      changeFrequency: legal ? ("yearly" as const) : ("weekly" as const),
      priority: page.kind === "home" ? 1 : page.kind === "designs" ? 0.8 : legal ? 0.2 : 0.7,
      alternates: { languages },
      ...(images.length > 0 && { images }),
    }));
  });
  const all = byLocale.flat();
  const posts = all.map((post) => {
    const languages = Object.fromEntries(
      UI_LOCALES.flatMap((locale) => {
        const slug = translatedPost(post.slug, locale);
        return slug ? [[`${locale}-IN`, absolute(blogPostPath(slug, locale))]] : [];
      }),
    );
    return {
      url: absolute(blogPostPath(post.slug, post.locale)),
      lastModified: post.updated,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    };
  });
  // Each sample video's page, with the video itself, so search can show it (src/lib/videos)
  const videos = SAMPLE_VIDEOS.map((video) => {
    const { title, description } = videoText(video);
    const { src, poster } = videoFileUrls(video);
    return {
      url: absolute(videoPath(video)),
      lastModified: VIDEOS_PUBLISHED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      videos: [
        {
          title,
          description,
          thumbnail_loc: poster,
          content_loc: src,
          duration: Math.round(video.seconds),
          publication_date: VIDEOS_PUBLISHED,
          family_friendly: "yes" as const,
          requires_subscription: "no" as const,
        },
      ],
    };
  });
  const videoIndex = {
    url: absolute(VIDEOS_INDEX),
    lastModified: VIDEOS_PUBLISHED,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  };
  return [...pages, ...posts, videoIndex, ...videos];
}
