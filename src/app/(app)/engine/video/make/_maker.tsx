"use client";

import { useState } from "react";
import { useVideoFilm } from "@/components/publish/video-card";
import { withClip } from "@/lib/editor/music-clip";
import type { InviteDraft } from "@/lib/editor/draft";
import type { StoryFunction } from "@/lib/engine/story";
import type { PublicPhoto } from "@/lib/invites/public";

/**
 * Makes the sample's whole video with its own raga, in VP9 and Opus, which the open-source
 * Chromium the script drives can encode; the script re-encodes it as H.264 for the site.
 */
export function FilmMaker(props: {
  draft: InviteDraft;
  functions: StoryFunction[];
  photos: PublicPhoto[];
}) {
  const { template, prepare } = useVideoFilm(
    props.draft,
    props.functions,
    props.photos,
    "https://www.shubhinvitations.com",
  );
  const [state, setState] = useState<{
    done: number;
    url?: string;
    poster?: number;
    total?: number;
  }>({ done: 0 });

  const make = async () => {
    const [{ makeVideo }, ready] = await Promise.all([import("@/lib/video/encode"), prepare()]);
    const blob = await makeVideo(
      ready.film,
      withClip(template, null).music,
      (done) => setState((now) => ({ ...now, done })),
      new AbortController().signal,
      { video: "vp9", audio: "opus" },
    );
    setState({
      done: 1,
      url: URL.createObjectURL(blob),
      poster: ready.poster,
      total: ready.film.total,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        data-make
        onClick={() => void make()}
        className="min-h-11 rounded-md bg-marigold px-4 font-semibold text-ink"
      >
        Make video
      </button>
      <p data-progress={state.done}>{Math.round(state.done * 100)}%</p>
      {state.url && (
        <a
          data-video
          data-poster={state.poster}
          data-total={state.total}
          href={state.url}
          download="sample.webm"
          className="min-h-11 underline"
        >
          Download
        </a>
      )}
    </div>
  );
}
