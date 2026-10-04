import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/templates/catalog";
import { parseDraft } from "./draft-checks";
import { newDraft } from "./draft";
import { clipName, clipPath, clipSchema, clipWindow, waveformPeaks, withClip } from "./music-clip";

const clip = { id: "c1", type: "audio/mp4", seconds: 20, name: "Din Shagna Da", rights: true };

describe("music clips", () => {
  it("keeps the asked length, never running past the end of the song", () => {
    expect(clipWindow(180, 42, 20)).toEqual({ start: 42, seconds: 20 });
    expect(clipWindow(180, 175, 20)).toEqual({ start: 160, seconds: 20 });
    expect(clipWindow(180, -5, 30)).toEqual({ start: 0, seconds: 30 });
  });

  it("keeps the whole song when it is shorter than the length", () => {
    expect(clipWindow(12, 4, 20)).toEqual({ start: 0, seconds: 12 });
  });

  it("draws a song's shape, its loudest slice full height", () => {
    const samples = new Float32Array(64 * 32);
    samples.fill(0.25, 0, 32);
    samples.fill(-0.5, 32 * 3, 32 * 4);
    const peaks = waveformPeaks(samples, 64);
    expect(peaks).toHaveLength(64);
    expect(peaks[3]).toBe(1);
    expect(peaks[0]).toBe(0.5);
    expect(peaks[10]).toBe(0);
    expect(waveformPeaks(new Float32Array(0), 64)).toEqual([]);
  });

  it("files clips beside the photos with the right extension", () => {
    expect(clipPath("e1", { id: "c1", type: "audio/mp4" })).toBe("e1/c1.m4a");
    expect(clipPath("e1", { id: "c1", type: "audio/wav" })).toBe("e1/c1.wav");
  });

  it("plays the clip only once it has a link", () => {
    const template = TEMPLATES.marigold;
    expect(withClip(template, null)).toBe(template);
    expect(withClip(template, "blob:x").music).toEqual({ ...template.music, clip: "blob:x" });
  });

  it("names the clip after the file", () => {
    expect(clipName("Din Shagna Da (Phillauri).mp3")).toBe("Din Shagna Da (Phillauri)");
    expect(clipName(".m4a")).toBe("Music");
  });

  it("needs the host's word that they may use the music", () => {
    expect(clipSchema.safeParse(clip).success).toBe(true);
    expect(clipSchema.safeParse({ ...clip, rights: false }).success).toBe(false);
    expect(clipSchema.safeParse({ ...clip, seconds: 45 }).success).toBe(false);
  });

  it("reads drafts saved before clips as playing the raga", () => {
    const old = { ...newDraft(), music: { raga: "yaman", playOnOpen: true } };
    expect(parseDraft(old)?.music.clip).toBeNull();
    const broken = { ...newDraft(), music: { raga: null, playOnOpen: true, clip: { id: 1 } } };
    expect(parseDraft(broken)?.music).toEqual({ raga: null, playOnOpen: true, clip: null });
    const withOne = { ...newDraft(), music: { raga: null, playOnOpen: true, clip } };
    expect(parseDraft(withOne)?.music.clip).toEqual(clip);
  });
});
