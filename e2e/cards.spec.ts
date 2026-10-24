import { expect, test, type Page } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, writeInvite } from "./invite-helpers";

/* Save-the-date and thank-you cards (Step 24): pictures in the invitation's own design. */

/** Whether the card's canvas has been drawn on: its middle isn't empty. */
const drawn = (page: Page, name: string) =>
  page.getByRole("img", { name }).evaluate((canvas) => {
    const ctx = (canvas as HTMLCanvasElement).getContext("2d")!;
    return ctx.getImageData(540, 960, 1, 1).data[3]! > 0;
  });

test.describe("save-the-date and thank-you cards", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host makes both before publishing, changes the note and downloads them", async ({
    page,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Kabir", "Meera"]);
    expect(await noOverflow(page)).toBe(true);
    await page.getByRole("button", { name: "Save the date and thank-you cards" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/cards$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Save the date and thank-you cards" }),
    ).toBeVisible();

    const saveTheDate = "Save the date card for Kabir & Meera";
    await expect(page.getByRole("img", { name: saveTheDate })).toBeVisible();
    await expect(page.getByText("Drawing your card…")).toHaveCount(0, { timeout: 30_000 });
    expect(await drawn(page, saveTheDate)).toBe(true);

    // The line at the foot is the host's to change, and comes back to the suggestion
    const note = page.getByRole("textbox", { name: /The line at the foot/ });
    await expect(note).toHaveValue("Invitation to follow");
    await note.fill("Wedding invitation to follow soon");
    await page.getByRole("button", { name: "Use the suggested words" }).click();
    await expect(note).toHaveValue("Invitation to follow");

    // Payments are off in tests, so the picture downloads clean
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download picture" }).click();
    const file = await download;
    expect(file.suggestedFilename()).toBe("save-the-date.png");
    if (process.env.CARD_SHOTS) {
      await file.saveAs(`${process.env.CARD_SHOTS}/save-the-date-${info.project.name}.png`);
    }
    expect(await noOverflow(page)).toBe(true);
    // The picture can be remade once more as the fonts settle, the buttons waiting for it;
    // their colours ease back in 150ms, so the check reads them once they have
    await expect(page.getByRole("button", { name: "Download picture" })).toBeEnabled();
    await page.waitForTimeout(300);
    expect((await axe(page).analyze()).violations).toEqual([]);

    await page.getByRole("tab", { name: "Thank you" }).click();
    const thankYou = "Thank you card for Kabir & Meera";
    await expect(page.getByRole("img", { name: thankYou })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Your message/ })).toHaveValue(
      "For your blessings, your love, and for celebrating with us.",
    );
    await expect(page.getByText("Drawing your card…")).toHaveCount(0, { timeout: 30_000 });
    expect(await drawn(page, thankYou)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    const shots = process.env.CARD_SHOTS;
    if (shots) {
      await page.screenshot({ path: `${shots}/cards-${info.project.name}-light.png` });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.screenshot({ path: `${shots}/cards-${info.project.name}-dark.png` });
      expect((await axe(page).analyze()).violations).toEqual([]);
    }
  });

  test("once checkout is on, a package without them shows them marked, with the way to Grand", async ({
    page,
    context,
  }, info) => {
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
    await writeInvite(page, numberFor(info), ["Isha", "Dev"]);
    await page.getByRole("button", { name: "Save the date and thank-you cards" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/cards$/);
    // Back on the invite's dashboard, its Cards button returns here
    await page.getByRole("link", { name: "Back to the invitation" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+$/);
    await page.getByRole("link", { name: "Cards", exact: true }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/cards$/);

    await expect(page.getByText("Preview", { exact: true })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/come clean with the Grand package/)).toBeVisible();
    const locked = page.getByRole("link", { name: "Download picture" });
    await expect(locked).toHaveAttribute("href", /\/edition\?plan=grand$/);
    await expect(page.getByRole("button", { name: "Download picture" })).toHaveCount(0);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });

  test("the share page leads to them once the invitation is live", async ({ page }, info) => {
    await writeInvite(page, numberFor(info), ["Rhea", "Aditya"]);
    await publish(page, "rhea-weds-aditya");
    await page.getByRole("link", { name: "Cards", exact: true }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/cards$/);
    await expect(
      page.getByRole("img", { name: "Save the date card for Rhea & Aditya" }),
    ).toBeVisible();
  });
});
