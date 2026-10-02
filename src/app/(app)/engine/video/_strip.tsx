"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoFilm } from "@/components/publish/video-card";
import type { InviteDraft } from "@/lib/editor/draft";
import type { StoryFunction } from "@/lib/engine/story";
import type { PublicPhoto } from "@/lib/invites/public";

/** Frames every `step` seconds from `from`, after the poster and up to the last frame. */
export function FilmStrip(props: {
  draft: InviteDraft;
  functions: StoryFunction[];
  photos: PublicPhoto[];
  from: number;
  step: number;
}) {
  const { prepare, look } = useVideoFilm(
    props.draft,
    props.functions,
    props.photos,
    "https://shubhinvitation.com/i/sample",
  );
  const [moments, setMoments] = useState<number[]>([]);
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const [film, setFilm] = useState<Awaited<ReturnType<typeof prepare>> | null>(null);

  useEffect(() => {
    let live = true;
    void prepare().then((ready) => {
      if (!live) return;
      const times = [ready.poster];
      for (let at = props.from; at < ready.film.total; at += props.step)
        times.push(Number(at.toFixed(2)));
      times.push(ready.film.total - 0.05);
      setFilm(ready);
      setMoments(times);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [look]);

  useEffect(() => {
    if (!film) return;
    moments.forEach((at, index) => {
      const ctx = canvases.current[index]?.getContext("2d");
      if (ctx) film.film.draw(ctx, at);
    });
  }, [film, moments]);

  return (
    <div
      data-film-ready={film ? film.film.total : undefined}
      className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6"
    >
      {moments.map((at, index) => (
        <figure key={`${index}-${at}`} className="flex flex-col gap-1">
          <canvas
            ref={(element) => {
              canvases.current[index] = element;
            }}
            width={1080}
            height={1920}
            role="img"
            aria-label={`The video at ${at.toFixed(1)} seconds`}
            className="w-full rounded-md border border-line bg-night"
          />
          <figcaption className="font-label text-xs text-ink-muted tabular-nums">
            {index === 0 ? "Poster" : `${at.toFixed(1)} s`}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
