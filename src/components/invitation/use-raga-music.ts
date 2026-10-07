"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
 * The card's raga, composed live so it costs no data and loaded only when first played
 * (or the host's own clip, streamed).
 * Quiet in a background tab, carrying on when the guest comes back; a guest who turns it
 * off keeps it off for the rest of the visit.
 */
export function useRagaMusic(template: Template) {
  const { raga, tempo, clip } = template.music;
  const music = useMemo(() => ({ raga, tempo, clip }), [raga, tempo, clip]);
  const player = useRef<MusicPlayer | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(async () => {
    try {
      if (!player.current) {
        const { MusicPlayer } = await import("@/lib/engine/music-player");
        player.current = new MusicPlayer(music);
      }
      await player.current.play();
      setPlaying(true);
    } catch {
      // No Web Audio: the button simply stays off
      setPlaying(false);
    }
  }, [music]);

  useEffect(() => {
    player.current?.setTrack(music);
  }, [music]);
  useEffect(() => () => player.current?.dispose(), []);

  const resumeOnShow = useRef(false);
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && player.current?.isPlaying) {
        resumeOnShow.current = true;
        player.current.pause();
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

  // The story has run its time: the music fades away, still on for the next play
  const rest = useCallback(() => {
    player.current?.pause(2.5);
    setPlaying(false);
  }, []);

  return { playing, play, toggle, rest };
}

/** The music controls a page shares between its parts (the doorway and the details below). */
export type RagaMusic = ReturnType<typeof useRagaMusic>;
