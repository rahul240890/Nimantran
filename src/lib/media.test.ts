import { describe, expect, it } from "vitest";
import { mediaBase, mediaUrl } from "./media";

describe("mediaUrl", () => {
  it("leaves every path alone while no media host is set", () => {
    expect(mediaBase(undefined)).toBeNull();
    expect(mediaBase("  ")).toBeNull();
    expect(mediaUrl("/suites/kayal/cover.webp", null)).toBe("/suites/kayal/cover.webp");
  });

  it("sends the theme paintings to the media host", () => {
    const base = mediaBase("https://media.example.com/");
    expect(base).toBe("https://media.example.com");
    expect(mediaUrl("/suites/kayal/cover.webp", base)).toBe(
      "https://media.example.com/suites/kayal/cover.webp",
    );
    expect(mediaUrl("/openings/gates/neel/left.webp", base)).toBe(
      "https://media.example.com/openings/gates/neel/left.webp",
    );
    expect(mediaUrl("/cards/kayal-wedding.webp", base)).toBe(
      "https://media.example.com/cards/kayal-wedding.webp",
    );
  });

  it("keeps everything else on the site", () => {
    const base = "https://media.example.com";
    for (const path of [
      "/brand/shubh-icon.png",
      "/occasions/birthday.webp",
      "/suitesx/a.webp",
      "https://project.supabase.co/storage/v1/object/public/event-media/a.jpg",
      "blob:https://shubhinvitations.com/123",
    ]) {
      expect(mediaUrl(path, base)).toBe(path);
    }
  });
});
