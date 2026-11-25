import { notFound } from "next/navigation";
import { VideoPage, videoMetadata } from "@/components/videos/video-pages";
import { findVideo, videosIn } from "@/lib/videos/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return videosIn("en").map((video) => ({ id: video.id }));
}

export async function generateMetadata({ params }: PageProps<"/videos/[id]">) {
  const video = findVideo((await params).id, "en");
  return video ? videoMetadata(video) : {};
}

export default async function Page({ params }: PageProps<"/videos/[id]">) {
  const video = findVideo((await params).id, "en");
  if (!video) notFound();
  return <VideoPage video={video} />;
}
