import { notFound } from "next/navigation";
import { VideoPage, videoMetadata } from "@/components/videos/video-pages";
import { isPrefixedLocale } from "@/i18n/locales";
import { findVideo, videosIn } from "@/lib/videos/pages";
import { routeLocale } from "../../locale";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isPrefixedLocale(params.locale)) return [];
  return videosIn(params.locale).map((video) => ({ id: video.id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/videos/[id]">) {
  const video = findVideo((await params).id, await routeLocale(params));
  return video ? videoMetadata(video) : {};
}

export default async function Page({ params }: PageProps<"/[locale]/videos/[id]">) {
  const video = findVideo((await params).id, await routeLocale(params));
  if (!video) notFound();
  return <VideoPage video={video} />;
}
