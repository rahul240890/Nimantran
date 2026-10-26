import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, writeInvite } from "./invite-helpers";

/* The host sees the invite exactly as a guest will: edge to edge on a phone, in a phone on a computer. */

const shots = process.env.HOST_PREVIEW_SHOTS;

test.describe("host preview", () => {
  test("a phone shows the guest page edge to edge, a computer shows it in a phone", async ({
    page,
  }, info) => {
    // Writing the invite takes most of the time
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await writeInvite(page, numberFor(info), ["Kabir", "Anaya"]);
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/preview$/);
    const id = new URL(page.url()).pathname.split("/")[2];

    // On a phone: the guest's own first screen fills it, with only a small round button added
    const opening = page.locator("[data-opening]");
    await expect(opening).toBeVisible();
    const stage = opening.locator(".opening-stage");
    // Coming from the editor part way down, the preview still starts at its top
    await expect.poll(async () => (await stage.boundingBox())!.y).toBe(0);
    const box = (await stage.boundingBox())!;
    expect(box.width).toBe(390);
    expect(box.height).toBe(844);
    const menu = page.getByRole("button", { name: "Preview options" });
    await expect(menu).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    if (shots) await page.screenshot({ path: `${shots}/preview-phone.png` });
    await menu.click();
    await expect(page.getByRole("menuitem", { name: "Keep editing" })).toBeVisible();
    if (shots) await page.screenshot({ path: `${shots}/preview-phone-menu.png` });
    await page.keyboard.press("Escape");

    // Opened, the invitation runs on down one page (Rajwada Bagh turns no pages), the menu
    // still at hand
    await page.getByRole("button", { name: "Open the invitation" }).click();
    await expect(page.locator("#guest-welcome")).toBeInViewport({ timeout: 15_000 });
    await expect(menu).toBeVisible();
    if (shots) await page.screenshot({ path: `${shots}/preview-phone-pages.png` });
    // It opens in place: switching to full screen blanked the screen for seconds
    expect(await page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false);

    // On a computer: the same page inside a phone, with the notes and next step beside it
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/invites/${id}/preview`);
    await expect(
      page.getByRole("heading", { name: "This is what your guests will see" }),
    ).toBeVisible();
    const phone = page.frameLocator('[data-testid="host-preview-phone"]');
    await expect(phone.getByRole("button", { name: "Open the invitation" })).toBeVisible({
      timeout: 15_000,
    });
    // Nothing of the host's inside the phone
    await expect(phone.getByRole("button", { name: "Preview options" })).toHaveCount(0);
    // The guest page inside the phone is checked on its own pages; here, the host's frame round it
    expect(
      (await axe(page).exclude('[data-testid="host-preview-phone"]').analyze()).violations,
    ).toEqual([]);
    if (shots) await page.screenshot({ path: `${shots}/preview-desktop.png` });
    await phone.getByRole("button", { name: "Open the invitation" }).click();
    await expect(phone.locator("#guest-welcome")).toBeInViewport({ timeout: 15_000 });
    if (shots) {
      await page.waitForTimeout(4_000);
      await page.screenshot({ path: `${shots}/preview-desktop-pages.png` });
    }

    // Full screen on a computer is the guest page itself
    await page.getByRole("link", { name: "See it full screen" }).click();
    await expect(page).toHaveURL(/full=1/);
    await expect(page.locator("[data-opening]")).toBeVisible();
    await expect(page.getByRole("button", { name: "Preview options" })).toBeVisible();
  });
});
