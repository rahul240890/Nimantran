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

  test("the Celebration package makes the video preview right on its card", async ({
    page,
    context,
  }, info) => {
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
    await writeInvite(page, numberFor(info), ["Ishaan", "Riya"]);
    await page.getByRole("button", { name: "Watch it as a video" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/video$/);
    const id = new URL(page.url()).pathname.split("/")[2];
    await page.goto(`/invites/${id}/edition`);
    const counts = [
      ["Basic", "100"],
      ["Celebration", "500"],
      ["Grand", "Unlimited"],
    ] as const;
    for (const [name, count] of counts) {
      const plan = page.getByRole("article", { name, exact: true });
      await expect(plan.getByText(count, { exact: true })).toBeVisible();
    }
    const celebration = page.getByRole("article", { name: "Celebration", exact: true });
    const video = celebration.getByRole("region", { name: "WhatsApp video included" });
    await expect(video.getByRole("img", { name: "The video's first moment" })).toBeVisible();
    const unsupported = video.getByText("This browser can't make videos.", { exact: false });
    await expect(
      video.getByRole("button", { name: "Make video preview" }).or(unsupported),
    ).toBeVisible();
    // Grand has the video too; Basic doesn't
    await expect(
      page.getByRole("article", { name: "Grand" }).getByRole("region", {
        name: "WhatsApp video included",
      }),
    ).toBeVisible();
    await expect(page.getByRole("article", { name: "Basic" }).getByRole("region")).toHaveCount(0);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    const shots = process.env.VIDEO_SHOTS;
    if (shots) {
      await page.screenshot({
        path: `${shots}/packages-${info.project.name}-light.png`,
        fullPage: true,
      });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.screenshot({
        path: `${shots}/packages-${info.project.name}-dark.png`,
        fullPage: true,
      });
    }
  });

  test("a video made before publishing is finished on the share page, not asked for again", async ({
    page,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Rohan", "Tara"]);
    await page.getByRole("button", { name: "Watch it as a video" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/video$/);
    const card = page.locator("[data-video-card]");
    const [id, ...tail] = (await card.getAttribute("data-video-key"))!.split(":");
    // A video made before videos were kept under the invitation: under its draft's name
    await page.evaluate(
      async (old) => {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open("shubh-videos", 1);
          request.onupgradeneeded = () => request.result.createObjectStore("videos");
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction("videos", "readwrite");
          const blob = new Blob([new Uint8Array(64)], { type: "video/mp4" });
          tx.objectStore("videos").put({ blob, look: "before", made: Date.now() }, old);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
        db.close();
      },
      `draft-${id!.slice(0, 8)}:${tail.join(":")}`,
    );

    // Before publishing it is the host's video, watched here and not yet to download
    await page.reload();
    const unsupported = card.getByText("This browser can't make videos.", { exact: false });
    await expect(card.getByText("Your video is ready").or(unsupported)).toBeVisible();
    if (await unsupported.isVisible()) return;
    // Download leads to publishing: the file itself waits for the link
    await expect(card.locator("a[download]")).toHaveCount(0);

    // Live: the share page finishes it with the invitation's link instead of asking for it
    await page.getByRole("link", { name: "Back to your invite" }).click();
    await publish(page, "rohan-video");
    await expect(card.getByText("Finishing the video you made", { exact: false })).toBeVisible();
    await expect(card.getByRole("progressbar")).toBeVisible();
    await expect(card.getByRole("button", { name: "Make video" })).toHaveCount(0);
    // Stopped, the one made before stays to make again; without the link it doesn't download
    await card.getByRole("button", { name: "Stop" }).click();
    await expect(
      card.getByText("made before your invitation was live", { exact: false }),
    ).toBeVisible();
    await expect(card.getByRole("button", { name: "Make it again" })).toBeVisible();
    await expect(card.locator("a[download]")).toHaveCount(0);
    expect((await axe(page).analyze()).violations).toEqual([]);
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
    await expect(card.getByRole("button", { name: "Full screen" })).toBeVisible();

    // Deleted from this device after asking, and it stays deleted when the page comes back
    await card.getByRole("button", { name: "Delete video" }).click();
    const confirm = page.getByRole("dialog", { name: "Delete this video?" });
    expect((await axe(page).analyze()).violations).toEqual([]);
    await confirm.getByRole("button", { name: "Delete video" }).click();
    await expect(page.getByText("Video deleted").first()).toBeVisible();
    await expect(card.getByRole("button", { name: "Make video" })).toBeVisible();
    await expect(card.locator("video")).toHaveCount(0);
    await page.reload();
    await expect(
      page.locator("[data-video-card]").getByRole("button", { name: "Make video" }),
    ).toBeVisible();
    await expect(page.locator("[data-video-card] video")).toHaveCount(0);
  });
});
