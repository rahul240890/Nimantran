"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MusicPlayer } from "@/lib/engine/music-player";
import type { Template } from "@/lib/templates/schema";

const MUTED_KEY = "nimantran-music-muted";

/** Whether the guest turned the music off earlier in this visit. */
export function musicMuted(): boolean {
  try {
    return sessionStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean) {
  try {
    if (muted) sessionStorage.setItem(MUTED_KEY, "1");
    else sessionStorage.removeItem(MUTED_KEY);
  } catch {
    // Storage blocked: the choice still holds for this page
  }
}

/**
 * How long (seconds) the raga's first notes wait after the tap that starts them: composing
 * them takes a phone's attention, so the opening's first moves get it to themselves
 * (music-player.ts).
 */
export const OPEN_LEAD_S = 1;

/** How loud the music plays on under the page below the pages, of its full volume. */
const SOFT_LEVEL = 0.4;

/**
 * The card's raga, composed live so it costs no data (or the host's own clip, streamed).
 * The player and the host's song are fetched as soon as the page is shown, so the guest's
 * first tap starts the music at once. The song plays once through and stops at its end;
 * the raga plays on until the page brings it to rest.
 * Quiet in a background tab, carrying on when the guest comes back; a guest who turns it
 * off keeps it off for the rest of the visit.
 */
export function useRagaMusic(template: Template) {
  const { raga, tempo, clip } = template.music;
  const music = useMemo(() => ({ raga, tempo, clip }), [raga, tempo, clip]);
  const player = useRef<MusicPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const latestMusic = useRef(music);
  useEffect(() => {
    latestMusic.current = music;
  });

  const ready = useCallback((made: MusicPlayer) => {
    made.onEnded = () => setPlaying(false);
    made.preload();
    player.current = made;
    return made;
  }, []);

  // Ready before the guest's first tap: a play that has to wait for the player to download
  // first comes too late for a phone to allow it, and the song starts late
  useEffect(() => {
    let live = true;
    void import("@/lib/engine/music-player")
      .then(({ MusicPlayer }) => {
        if (live && !player.current) ready(new MusicPlayer(latestMusic.current));
      })
      .catch(() => {
        // Loaded again on the first tap
      });
    return () => {
      live = false;
    };
  }, [ready]);

  const play = useCallback(
    async (lead = 0) => {
      try {
        if (!player.current) {
          const { MusicPlayer } = await import("@/lib/engine/music-player");
          if (!player.current) ready(new MusicPlayer(music));
        }
        await player.current!.play(lead);
        // The whole page redraws for the music's buttons: never ahead of the screen itself
        startTransition(() => setPlaying(true));
      } catch {
        // No Web Audio, or the phone wouldn't allow it yet: the button simply stays off
        setPlaying(false);
      }
    },
    [music, ready],
  );

  useEffect(() => {
    player.current?.setTrack(music);
    player.current?.preload();
  }, [music]);
  useEffect(() => () => player.current?.dispose(), []);

  const resumeOnShow = useRef(false);
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && player.current?.isPlaying) {
        resumeOnShow.current = true;
        player.current.pause(0);
      } else if (document.visibilityState === "visible" && resumeOnShow.current) {
        resumeOnShow.current = false;
        void player.current?.play();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      writeMuted(true);
      player.current?.pause();
      setPlaying(false);
    } else {
      writeMuted(false);
      void play();
    }
  }, [playing, play]);

  // The story has run its time: the raga fades away, still on for the next play. The
  // host's song plays on softly to its own end, which it was chosen to reach
  const rest = useCallback(() => {
    if (latestMusic.current.clip) {
      player.current?.setLevel(SOFT_LEVEL);
      return;
    }
    player.current?.pause(2.5);
    setPlaying(false);
  }, []);

  // The pages are over and the page below carries on: the music plays on, softer
  const soften = useCallback(() => player.current?.setLevel(SOFT_LEVEL), []);

  // The guest opens the invitation again: the music starts again from the top, at full
  // volume, unless they turned it off. Called from their tap
  const replay = useCallback(() => {
    player.current?.setLevel(1, 0.6);
    if (musicMuted()) return;
    player.current?.rewind();
    void play(OPEN_LEAD_S);
  }, [play]);

  return { playing, play, toggle, rest, soften, replay };
}

/** The music controls a page shares between its parts (the doorway and the details below). */
export type RagaMusic = ReturnType<typeof useRagaMusic>;
