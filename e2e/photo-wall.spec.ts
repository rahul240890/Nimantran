import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, writeInvite } from "./invite-helpers";

/* The shared photo wall (Step 24): guests add photos through the link, hosts moderate. */

// A 4×4 PNG, enough for the browser to decode, shrink and upload
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEUlEQVR4nGP4sMQQjhiI4wAA7GIcUc0K+8QAAAAASUVORK5CYII=",
  "base64",
);

test.describe("photo wall", () => {
  test.use({ reducedMotion: "reduce" });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`guests share photos and the host hides and downloads them (${colorScheme})`, async ({
      page,
      browser,
    }, info) => {
      test.setTimeout(120_000);
      await writeInvite(page, numberFor(info), ["Kabir", "Noor"]);
      const path = await publish(page, "kabir-weds-noor");
      const inviteId = new URL(page.url()).pathname.split("/")[2]!;

      const guestOn = async (today: string) => {
        const context = await browser.newContext({
          baseURL: info.project.use.baseURL,
          viewport: info.project.use.viewport,
          reducedMotion: "reduce",
          colorScheme,
        });
        // Preview mode only: the day the server takes as today for the wall
        await context.addCookies([
          { name: "shubh-preview-today", value: today, url: info.project.use.baseURL! },
        ]);
        const guest = await context.newPage();
        await guest.goto(`${path}?quality=2d`);
        return { context, guest };
      };

      // Before the first function the wall says when it opens
      const early = await guestOn("2026-10-01");
      const earlyWall = early.guest.locator("#photo-wall");
      await expect(earlyWall.getByText(/The photo wall opens on 14 October 2026/)).toBeVisible();
      await expect(earlyWall.getByRole("button", { name: "Add photos" })).toHaveCount(0);
      await early.context.close();

      // On the day, a guest adds a photo under their name
      const { context, guest } = await guestOn("2026-10-15");
      const wall = guest.locator("#photo-wall");
      await expect(wall.getByRole("heading", { name: "Photo wall" })).toBeVisible();
      await expect(wall.getByText("No photos yet. Be the first to share one.")).toBeVisible();
      await wall.getByRole("textbox", { name: /Your name/ }).fill("Rohan Mehta");
      await wall
        .locator('input[type="file"]')
        .setInputFiles({ name: "dance.png", mimeType: "image/png", buffer: PNG });
      await expect(wall.getByRole("status")).toHaveText("1 photo added. Thank you!");
      await expect(wall.getByRole("img", { name: "Photo 1 shared by Rohan Mehta" })).toBeVisible();
      await expect(wall.getByText("Shared by Rohan Mehta")).toBeVisible();
      expect(await noOverflow(guest)).toBe(true);
      expect((await axe(guest).analyze()).violations).toEqual([]);

      // The photo opens large
      await wall.getByRole("button", { name: "View photo 1" }).click();
      const viewer = guest.getByRole("dialog", { name: "Photo 1 of 1" });
      await expect(viewer.getByRole("img", { name: /shared by Rohan Mehta/ })).toBeVisible();
      await guest.keyboard.press("Escape");

      // The host sees it, and the dashboard counts it
      await page.goto(`/invites/${inviteId}`);
      await expect(page.getByText("1 photo from your guests.")).toBeVisible();
      await page.getByRole("link", { name: "See photos" }).click();
      await expect(page).toHaveURL(new RegExp(`/invites/${inviteId}/photos$`));
      await expect(page.getByRole("heading", { name: "Kabir & Noor" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Photo 1 shared by Rohan Mehta" }),
      ).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      const download = page.waitForEvent("download");
      await page.getByRole("button", { name: "Download all" }).click();
      expect((await download).suggestedFilename()).toBe("photo-wall.zip");

      // Hiding takes it off the guests' wall
      await page.getByRole("button", { name: "Hide photo 1 from guests" }).click();
      await expect(page.getByText("1 photo · 1 hidden")).toBeVisible();
      await guest.reload();
      await expect(wall.getByText("No photos yet. Be the first to share one.")).toBeVisible();

      // Deleting asks first
      await page.getByRole("button", { name: "Delete photo 1" }).click();
      const confirm = page.getByRole("dialog", { name: "Delete this photo?" });
      await confirm.getByRole("button", { name: "Delete" }).click();
      await expect(page.getByText("No photos yet")).toBeVisible();
      await context.close();
    });
  }

  test("a guest takes back their own photo", async ({ page, browser }, info) => {
    test.setTimeout(120_000);
    await writeInvite(page, numberFor(info), ["Dev", "Asha"]);
    const path = await publish(page, "dev-weds-asha");
    const context = await browser.newContext({
      baseURL: info.project.use.baseURL,
      viewport: info.project.use.viewport,
    });
    await context.addCookies([
      { name: "shubh-preview-today", value: "2026-10-20", url: info.project.use.baseURL! },
    ]);
    const guest = await context.newPage();
    await guest.goto(`${path}?quality=2d`);
    const wall = guest.locator("#photo-wall");
    await wall
      .locator('input[type="file"]')
      .setInputFiles({ name: "us.png", mimeType: "image/png", buffer: PNG });
    await expect(wall.getByText("Shared by a guest")).toBeVisible();
    await wall.getByRole("button", { name: "Remove your photo 1" }).click();
    await expect(wall.getByText("No photos yet. Be the first to share one.")).toBeVisible();
    await context.close();
  });
});
