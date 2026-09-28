import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, writeInvite } from "./invite-helpers";

/* The story as an MP4 for WhatsApp Status and Reels (Step 17c), made in the browser. */

test.describe("video for Status and Reels", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host makes the video from the share page", async ({ page }, info) => {
    // Open-source Chromium encodes in software, far slower than a phone's hardware
    test.setTimeout(480_000);
    await writeInvite(page, numberFor(info), ["Arjun", "Diya"]);
    await publish(page, "arjun-video");
    const card = page.locator("[data-video-card]");
    await expect(
      card.getByRole("heading", { name: "Video for WhatsApp Status and Reels" }),
    ).toBeVisible();
    await expect(card.getByRole("img", { name: "The video's first page" })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Headless Chromium has no H.264 encoder on some machines; then the card says so
    const unsupported = card.getByText("This browser can't make videos.", { exact: false });
    const make = card.getByRole("button", { name: "Make video" });
    await expect(make.or(unsupported)).toBeVisible();
    if (await unsupported.isVisible()) return;

    await make.click();
    await expect(card.getByRole("progressbar")).toBeVisible();
    await expect(card.getByText("Your video is ready")).toBeVisible({ timeout: 420_000 });
    const video = card.locator("video");
    const facts = await video.evaluate(async (element: HTMLVideoElement) => {
      if (Number.isNaN(element.duration) || !element.duration) {
        await new Promise((resolve) =>
          element.addEventListener("loadedmetadata", resolve, { once: true }),
        );
      }
      const blob = await (await fetch(element.src)).blob();
      return {
        duration: element.duration,
        width: element.videoWidth,
        height: element.videoHeight,
        size: blob.size,
        type: blob.type,
      };
    });
    expect(facts.type).toBe("video/mp4");
    expect(facts.width).toBe(1080);
    expect(facts.height).toBe(1920);
    expect(facts.duration).toBeGreaterThanOrEqual(29.5);
    expect(facts.duration).toBeLessThanOrEqual(45.5);
    expect(facts.size).toBeGreaterThan(100_000);
    await expect(card.getByRole("link", { name: "Download MP4" })).toHaveAttribute(
      "download",
      /arjun-video-\d+-invitation\.mp4$/,
    );
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
});
