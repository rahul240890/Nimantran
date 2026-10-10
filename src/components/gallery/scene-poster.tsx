"use client";

import Image from "next/image";
import { OneScene } from "@/components/invitation/scene/one-scene";
import type { CategoryId } from "@/lib/categories/catalog";
import { cn } from "@/lib/cn";
import type { StoryPhoto } from "@/lib/engine/story";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import { PAINTING_ASPECT } from "@/lib/suites/photo-frames";
import { sceneLine } from "@/lib/suites/scene-type";
import { scenePage, type ScenePage } from "@/lib/suites/scene";
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

/**
 * A design painted for another occasion shows a picture of that occasion in its frames:
 * a birthday a cake, not a wedding's rings. A prayer meet's frames stay plain.
 */
const OCCASION_PHOTO: Partial<Record<CategoryId, string>> = {
  birthday: "birthday",
  anniversary: "anniversary",
  "baby-shower": "baby",
  annaprashan: "baby",
  christening: "baby",
  "naming-ceremony": "baby",
  party: "party",
  "farewell-party": "party",
  retirement: "party",
  reunion: "party",
  graduation: "party",
  housewarming: "housewarming",
  "shop-opening": "business",
  launch: "business",
};

function samplePhotos(suite: SuiteId): StoryPhoto[] {
  const occasion = SUITES[suite].occasions?.[0];
  if (!occasion) return SAMPLE_PHOTOS;
  if (occasion === "prayer-meet") return [];
  const picture = OCCASION_PHOTO[occasion] ?? "festival";
  return SAMPLE_PHOTOS.map(() => ({ src: `/occasions/${picture}.webp`, alt: "" }));
}

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
  const photos = samplePhotos(suite);
  return (
    <span
      className={cn("absolute inset-x-0 top-0 block", className)}
      style={{ aspectRatio: String(PAINTING_ASPECT) }}
    >
      {/* The sample photos show through the frames, as the couple's own will */}
      {page.frames.map(([x, y, width, height], i) =>
        photos[i] ? (
          // eslint-disable-next-line @next/next/no-img-element -- a small stand-in under the painting
          <img
            key={i}
            src={photos[i].src}
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
        ) : null,
      )}
      {/* A Scene theme shows its painting with the card in place */}
      <Image
        src={(page.card && SUITES[suite].images.cover) || page.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 80rem) 22vw, (min-width: 40rem) 33vw, 50vw"
        className="object-cover"
      />
      {/* An illustrated card's empty space carries sample names, so it reads as a card */}
      {page.style === "bare" && !SUITES[suite].occasions && (
        <PosterNames suite={suite} page={page} />
      )}
    </span>
  );
}

/** The sample couple's names where an illustrated wedding card prints them. */
function PosterNames({ suite, page }: { suite: SuiteId; page: ScenePage }) {
  const { copy, lang } = useSampleInvite([]);
  const voice = SUITES[suite].voice ?? "regal";
  const [x, y, width, height] = page.names;
  return (
    <span
      aria-hidden
      data-suite={suite}
      data-tone={page.dark ? "dark" : "light"}
      lang={lang}
      className="story-print [container-type:size] absolute inset-0 block"
    >
      <span
        className="absolute flex items-center justify-center text-center text-card-ink"
        style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }}
      >
        <span
          className="text-balance"
          style={{ ...sceneLine(voice, "names", lang), fontSize: "8.5cqw" }}
        >
          {copy.first}{" "}
          <span className="text-card-accent-text" style={{ fontSize: "0.6em" }}>
            {copy.joiner}
          </span>{" "}
          {copy.second}
        </span>
      </span>
    </span>
  );
}

const SCENE_DAYS = ["haldi", "mehendi", "sangeet", "wedding"] as const;

/** The scene itself, playing in the preview with sample names, photos and celebrations. */
export function SceneSample({ suite }: { suite: SuiteId }) {
  const { copy, functions, lang } = useSampleInvite(SCENE_DAYS, SUITES[suite].occasions?.[0]);
  const photos = samplePhotos(suite);
  const page = scenePage(suite, photos.length);
  if (!page) return null;
  return (
    <OneScene
      suite={suite}
      page={page}
      copy={copy}
      lang={lang}
      functions={functions}
      photos={photos}
      reply={null}
      framed
      miniature
    />
  );
}
