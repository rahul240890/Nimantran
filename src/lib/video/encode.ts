/*
 * Makes the MP4 in the host's own browser (Step 17c): each frame drawn on a canvas and
 * encoded with the browser's H.264 encoder, the music (the raga, or the host's own clip)
 * rendered offline and encoded as AAC, both written into one file WhatsApp and Instagram
 * accept. Nothing is uploaded and no server does any work. Browser only.
 */

import {
  AudioBufferSource,
  BufferTarget,
  CanvasSource,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  canEncodeAudio,
  canEncodeVideo,
} from "mediabunny";
import { renderMusic } from "@/lib/engine/music-render";
import type { MusicChoice } from "@/lib/engine/music-player";
import { FRAME_RATE, VIDEO_HEIGHT, VIDEO_WIDTH } from "./timeline";

export type VideoSupport = "ok" | "no-video" | "no-audio";

/** A video to make: how long it runs, and how to draw any moment of it. */
export type VideoFilm = {
  total: number;
  draw: (ctx: CanvasRenderingContext2D, seconds: number) => void;
};

/**
 * H.264 and AAC: what WhatsApp and Instagram play everywhere. Tests in preview mode pass
 * VP9 and Opus instead, which the open-source Chromium they run in can encode.
 */
export type VideoCodecs = { video: "avc" | "vp9"; audio: "aac" | "opus" };
export const SHARE_CODECS: VideoCodecs = { video: "avc", audio: "aac" };

/** Whether this browser can make the video: H.264 for the pictures, AAC for the music. */
export async function videoSupport(codecs: VideoCodecs = SHARE_CODECS): Promise<VideoSupport> {
  if (typeof VideoEncoder === "undefined" || typeof OfflineAudioContext === "undefined") {
    return "no-video";
  }
  const video = await canEncodeVideo(codecs.video, {
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    frameRate: FRAME_RATE,
    quality: QUALITY_HIGH,
  }).catch(() => false);
  if (!video) return "no-video";
  const audio = await canEncodeAudio(codecs.audio, {
    numberOfChannels: 2,
    sampleRate: 48_000,
  }).catch(() => false);
  return audio ? "ok" : "no-audio";
}

/**
 * Draws and encodes every frame, reporting progress from 0 to 1. Stops, without a file,
 * when `signal` aborts.
 */
export async function makeVideo(
  film: VideoFilm,
  music: MusicChoice | null,
  onProgress: (done: number) => void,
  signal: AbortSignal,
  codecs: VideoCodecs = SHARE_CODECS,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("No canvas");

  const total = film.total;
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: "in-memory" }),
    target: new BufferTarget(),
  });
  const video = new CanvasSource(canvas, {
    codec: codecs.video,
    quality: QUALITY_HIGH,
    keyFrameInterval: 2,
  });
  output.addVideoTrack(video, { frameRate: FRAME_RATE });
  const audio = music
    ? new AudioBufferSource({ codec: codecs.audio, quality: QUALITY_HIGH })
    : null;
  if (audio) output.addAudioTrack(audio);
  await output.start();

  try {
    if (audio && music) {
      onProgress(0.01);
      await audio.add(await renderMusic(music, total));
    }
    const frames = Math.ceil(total * FRAME_RATE);
    for (let frame = 0; frame < frames; frame++) {
      if (signal.aborted) throw new DOMException("Stopped", "AbortError");
      const at = frame / FRAME_RATE;
      film.draw(ctx, at);
      await video.add(at, 1 / FRAME_RATE);
      if (frame % 6 === 0) {
        onProgress(0.03 + (0.95 * frame) / frames);
        // Let the page repaint the progress bar
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    await output.finalize();
  } catch (error) {
    await output.cancel().catch(() => undefined);
    throw error;
  }
  onProgress(1);
  const buffer = output.target.buffer;
  if (!buffer) throw new Error("Empty video");
  return new Blob([buffer], { type: "video/mp4" });
}
