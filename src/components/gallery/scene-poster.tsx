"use client";

import Image from "next/image";
import { OneScene } from "@/components/invitation/scene/one-scene";
import { cn } from "@/lib/cn";
import type { StoryPhoto } from "@/lib/engine/story";
import type { SuiteId } from "@/lib/suites/catalog";
import { PAINTING_ASPECT } from "@/lib/suites/photo-frames";
import { scenePage } from "@/lib/suites/scene";
import { useSampleInvite } from "./sample";

/*
 * A Scene design in the gallery: its painting with sample photos in the couple's frames,
 * and, in the preview, the scene itself playing with sample names and days.
 */

/** Pictures standing in for the couple's photos, so the frames show how a photo sits. */
const SAMPLE_PHOTOS: StoryPhoto[] = [
  { src: "/occasions/engagement.webp", alt: "" },
  { src: "/occasions/mehendi.webp", alt: "" },
];

export function ScenePoster({
  suite,
  priority,
  className,
}: {
  suite: SuiteId;
  priority?: boolean;
  className?: string;
}) {
  const page = scenePage(suite, 2);
  if (!page) return null;
  return (
    <span
      className={cn("absolute inset-x-0 top-0 block", className)}
      style={{ aspectRatio: String(PAINTING_ASPECT) }}
    >
      {/* The sample photos show through the frames, as the couple's own will */}
      {page.frames.map(([x, y, width, height], i) => (
        // eslint-disable-next-line @next/next/no-img-element -- a small stand-in under the painting
        <img
          key={i}
          src={SAMPLE_PHOTOS[i]!.src}
          alt=""
          aria-hidden
          loading={priority ? undefined : "lazy"}
          className="absolute bg-card-ivory object-cover"
          style={{
            left: `${x - 0.8}%`,
            top: `${y - 0.5}%`,
            width: `${width + 1.6}%`,
            height: `${height + 1}%`,
          }}
        />
      ))}
      <Image
        src={page.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 80rem) 22vw, (min-width: 40rem) 33vw, 50vw"
        className="object-cover"
      />
    </span>
  );
}

const SCENE_DAYS = ["haldi", "mehendi", "sangeet", "wedding"] as const;

/** The scene itself, playing in the preview with sample names, photos and celebrations. */
export function SceneSample({ suite }: { suite: SuiteId }) {
  const { copy, functions, lang } = useSampleInvite(SCENE_DAYS);
  const page = scenePage(suite, SAMPLE_PHOTOS.length);
  if (!page) return null;
  return (
    <OneScene
      suite={suite}
      page={page}
      copy={copy}
      lang={lang}
      functions={functions}
      photos={SAMPLE_PHOTOS}
      reply={null}
      framed
    />
  );
}
