import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, writeInvite } from "./invite-helpers";

/* The invitation video (Step 17c), an MP4 made in the browser: the opening, the welcome, the pages. */

test.describe("invitation video", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host watches the video before publishing", async ({ page }, info) => {
    await writeInvite(page, numberFor(info), ["Kabir", "Meera"]);
    await page.getByRole("button", { name: "Watch it as a video" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/video$/);
    const card = page.locator("[data-video-card]");
    await expect(card.getByRole("heading", { name: "Invitation video" })).toBeVisible();
    await expect(card.getByRole("img", { name: "The video's first moment" })).toBeVisible();
    // Not live yet: watched here, and downloaded once published with its link
    await expect(card.getByText("Publish your invitation to download")).toBeVisible();
    await expect(card.getByRole("link", { name: "Publish your invitation" })).toBeVisible();
    await expect(card.getByRole("link", { name: "Download MP4" })).toHaveCount(0);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    const shots = process.env.VIDEO_SHOTS;
    if (shots) {
      await page.screenshot({ path: `${shots}/video-page-${info.project.name}-light.png` });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.screenshot({ path: `${shots}/video-page-${info.project.name}-dark.png` });
    }
  });

  test("a host makes the video from the share page", async ({ page }, info) => {
    // Open-source Chromium encodes in software, far slower than a phone's hardware
    test.setTimeout(480_000);
    await writeInvite(page, numberFor(info), ["Arjun", "Diya"]);
    await publish(page, "arjun-video");
    const card = page.locator("[data-video-card]");
    await expect(card.getByRole("heading", { name: "Invitation video" })).toBeVisible();
    await expect(card.getByRole("img", { name: "The video's first moment" })).toBeVisible();
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
    // The pages' 30 to 45 seconds, after seven or eight of opening and welcome
    expect(facts.duration).toBeGreaterThanOrEqual(36);
    expect(facts.duration).toBeLessThanOrEqual(54);
    expect(facts.size).toBeGreaterThan(100_000);
    await expect(card.getByRole("link", { name: "Download MP4" })).toHaveAttribute(
      "download",
      /arjun-video-\d+-invitation\.mp4$/,
    );
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Away to another screen and back: the video is still there, not made again
    const share = page.url();
    await page.goto("/templates");
    await page.goto(share);
    await expect(page.locator("[data-video-card]").getByText("Your video is ready")).toBeVisible();
    await expect(page.locator("[data-video-card] video")).toBeVisible();
  });
});
