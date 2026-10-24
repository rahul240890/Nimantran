import { expect, test, type Page } from "@playwright/test";
import { axe, numberFor, openPart, signIn } from "./invite-helpers";

/* Family preview links: the invitation shown to the family before it is paid for and sent. */

const DESIGN = "/create/rajwada-bagh?category=wedding";

/** Writes a wedding on a design's own page and opens its preview. */
async function writeAndPreview(page: Page) {
  const first = page.getByRole("textbox", { name: /First name/ });
  const second = page.getByRole("textbox", { name: /Second name/ });
  // Typing that lands before the page has hydrated is lost, so try again until both stay
  await expect(async () => {
    await first.fill("Aditya");
    await second.fill("Priya");
    await expect(first).toHaveValue("Aditya", { timeout: 3_000 });
    await expect(second).toHaveValue("Priya", { timeout: 3_000 });
  }).toPass({ timeout: 30_000 });
  await openPart(page, "When and where");
  const wedding = page.locator('[data-function="wedding"]');
  await wedding.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
  await wedding.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: "6:30 pm" }).click();
  await wedding.getByRole("textbox", { name: /^Venue/ }).fill("Taj Falaknuma, Hyderabad");
  await page.getByRole("button", { name: "See my invitation" }).click();
  await expect(page.getByText("Your invitation is ready")).toBeVisible({ timeout: 15_000 });
}

test.describe("family preview links", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host sends a preview, and the family sees it marked as one", async ({
    page,
    browser,
  }, info) => {
    test.setTimeout(90_000);
    // A known "today" for the calendar; time still moves, so every edit saves
    await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
    await page.goto(`/sign-in?next=${encodeURIComponent(DESIGN)}`);
    await signIn(page, numberFor(info));
    await expect(page).toHaveURL(/\/create\/rajwada-bagh/);
    await writeAndPreview(page);

    const card = page.locator("[data-family-share]");
    await expect(card.getByText("Show your family first")).toBeVisible();
    const send = card.getByRole("link", { name: "Send to family on WhatsApp" });
    await expect(send).toHaveAttribute("href", /^https:\/\/wa\.me\/\?text=/, { timeout: 15_000 });
    const text = decodeURIComponent((await send.getAttribute("href"))!.split("text=")[1]!);
    const path = /\/family\/[0-9a-f-]{36}\.[A-Za-z0-9_-]{22}/.exec(text)?.[0];
    expect(path).toBeTruthy();
    await expect(send).toHaveAttribute("target", "_blank");

    // The family, not signed in, sees the invitation, marked as a preview
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const family = await context.newPage();
    await family.goto(path!);
    await expect(family).toHaveTitle("Aditya & Priya: invitation preview");
    await expect(family.locator("[data-family-preview]")).toHaveText(
      "Preview · not sent to guests yet",
    );
    await expect(family.locator("footer [data-make-like-this]").getByRole("link")).toHaveAttribute(
      "href",
      /utm_source=family$/,
    );
    expect((await axe(family).analyze()).violations).toEqual([]);

    // A link changed by one letter opens nothing
    const changed = path!.slice(0, -1) + (path!.endsWith("A") ? "B" : "A");
    expect((await family.request.get(changed)).status()).toBe(404);
    await context.close();
  });

  test("signed out, the preview offers to sign in to share it", async ({ page }) => {
    test.setTimeout(60_000);
    await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto(DESIGN);
    await writeAndPreview(page);
    const card = page.locator("[data-family-share]");
    await expect(card.getByRole("link", { name: "Sign in to share" })).toHaveAttribute(
      "href",
      "/sign-in?next=%2Fcreate",
    );
  });
});
