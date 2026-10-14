import { describe, expect, it } from "vitest";
import { aacBitrate, wavFormat } from "./clip-encode";
import { MAX_CLIP_BYTES, MAX_CLIP_SECONDS } from "./music-clip";
import { belowSeconds, sceneSeconds, songClock, songLengths } from "./song-length";

describe("how long the host's song runs", () => {
  it("covers the opening and every page, and the page below for the full length", () => {
    expect(songLengths(72.4, 30)).toEqual({ need: 83, full: 113 });
    expect(songLengths(0, 0)).toEqual({ need: 10, full: 10 });
  });

  it("times a Scene by its cards", () => {
    // The line, four functions and the welcome
    expect(sceneSeconds(4)).toBe(33);
  });

  it("times the page below by its sections", () => {
    const plain = { themed: false, functions: 4, photos: true, family: true, dated: true };
    expect(belowSeconds(plain)).toBe(21);
    expect(belowSeconds({ ...plain, themed: true })).toBe(8 + 8 + 6 + 32 + 9 + 9 + 7);
    expect(belowSeconds({ ...plain, themed: true, functions: 1, photos: false })).toBe(
      8 + 8 + 8 + 9 + 7,
    );
  });

  it("writes times as a clock", () => {
    expect(songClock(65)).toBe("1:05");
    expect(songClock(9.6)).toBe("0:10");
  });

  it("fits the longest part inside the upload, lowering the quality as it grows", () => {
    expect(aacBitrate(60)).toBe(128_000);
    expect(aacBitrate(MAX_CLIP_SECONDS)).toBeLessThan(128_000);
    expect((aacBitrate(MAX_CLIP_SECONDS) / 8) * MAX_CLIP_SECONDS).toBeLessThan(MAX_CLIP_BYTES);
    expect(wavFormat(30)).toEqual({ rate: 22_050, codec: "pcm-s16" });
    for (const seconds of [60, 120, 200, MAX_CLIP_SECONDS]) {
      const { rate, codec } = wavFormat(seconds);
      expect(rate * (codec === "pcm-s16" ? 2 : 1) * seconds).toBeLessThan(MAX_CLIP_BYTES);
    }
  });
});
