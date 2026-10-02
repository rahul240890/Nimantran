"use client";

import { UserRound } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { OneScene } from "@/components/invitation/scene/one-scene";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import type { StoryFunction } from "@/lib/engine/story";
import type { FunctionId } from "@/lib/events/functions";
import type { SuiteId } from "@/lib/suites/catalog";
import { PAINTING_ASPECT } from "@/lib/suites/photo-frames";
import { scenePage } from "@/lib/suites/scene";
import { formatCardDate, formatCardTime } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";

/*
 * A Scene design in the gallery: its painting with soft placeholders where the couple's
 * photos go, and, in the preview, the scene itself playing with sample names and days.
 */

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
      {page.frames.map(([x, y, width, height], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute grid place-items-center bg-linear-to-b from-card-ivory to-marigold/40 text-card-gold-text"
          style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }}
        >
          <UserRound className="size-1/3" strokeWidth={1.25} />
        </span>
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

/** Sample days for the preview, one per celebration. */
const SAMPLE: readonly [FunctionId, string, string][] = [
  ["haldi", "2027-02-12", "10:00"],
  ["mehendi", "2027-02-12", "16:00"],
  ["sangeet", "2027-02-12", "20:00"],
  ["wedding", "2027-02-13", "19:30"],
];

/** The scene itself, playing in the preview with sample names and celebrations. */
export function SceneSample({ suite }: { suite: SuiteId }) {
  const locale = useLocale();
  const { galleryCopy } = useText(galleryText);
  const { functionCopy } = useText(editorText);
  const sample = galleryCopy.sceneSample;
  const copy = useMemo<CardCopy>(
    () => ({
      doors: ["", ""],
      blessing: "",
      families: "",
      first: sample.first,
      joiner: locale === "hi" ? "संग" : "&",
      second: sample.second,
      line: sample.line,
      date: "",
      venue: "",
    }),
    [sample, locale],
  );
  const functions = useMemo<StoryFunction[]>(
    () =>
      SAMPLE.map(([kind, date, time], i) => ({
        kind,
        name: functionCopy[kind].name,
        localName: null,
        date: formatCardDate(date, locale),
        time: formatCardTime(time, null, locale),
        muhurat: null,
        venue: sample.venues[i] ?? "",
      })),
    [functionCopy, locale, sample],
  );
  const page = scenePage(suite, 0);
  if (!page) return null;
  return (
    <OneScene
      suite={suite}
      page={page}
      copy={copy}
      lang={locale}
      functions={functions}
      photos={[]}
      reply={null}
      framed
    />
  );
}
