import { homePath, type UiLocale } from "@/i18n/locales";
import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { designById, type GalleryDesign } from "@/lib/gallery/catalog";
import { mediaUrl } from "@/lib/media";
import { absolute } from "@/lib/seo/structured-data";
import { SAMPLE_VIDEOS, type SampleVideo } from "./catalog";

/* Addresses and words for the sample video pages (catalog.ts). */

/** When the sample videos were first published, for search engines' upload date. */
export const VIDEOS_PUBLISHED = "2026-11-25";

/** The videos' index, in English: every language's videos on one page. */
export const VIDEOS_INDEX = "/videos";

export function videoPath(video: SampleVideo): string {
  return video.lang === "en" ? `/videos/${video.id}` : `${homePath(video.lang)}/videos/${video.id}`;
}

/** The MP4 and its poster: on R2 once it is set up (src/lib/media.ts), else from public/. */
export function videoFile(video: SampleVideo): { src: string; poster: string } {
  return { src: mediaUrl(`/videos/${video.id}.mp4`), poster: mediaUrl(`/videos/${video.id}.jpg`) };
}

/** The same, as full addresses for search engines. */
export function videoFileUrls(video: SampleVideo): { src: string; poster: string } {
  const { src, poster } = videoFile(video);
  const full = (path: string) => (path.startsWith("http") ? path : absolute(path));
  return { src: full(src), poster: full(poster) };
}

export function videosIn(locale: UiLocale): SampleVideo[] {
  return SAMPLE_VIDEOS.filter((video) => video.lang === locale);
}

export function findVideo(id: string, locale: UiLocale): SampleVideo | null {
  return SAMPLE_VIDEOS.find((video) => video.id === id && video.lang === locale) ?? null;
}

export function videoDesign(video: SampleVideo): GalleryDesign {
  const design = designById(video.design);
  if (!design) throw new Error(`Sample video ${video.id} names a design that doesn't exist`);
  return design;
}

export function occasionName(video: SampleVideo): string {
  return CATEGORIES[video.occasion].names[video.lang];
}

/** The sample video a page about an occasion shows: one in its own language first, then any. */
export function videoFor(occasion: CategoryId, locale: UiLocale): SampleVideo | null {
  const matching = SAMPLE_VIDEOS.filter((video) => video.occasion === occasion);
  return matching.find((video) => video.lang === locale) ?? matching[0] ?? null;
}
