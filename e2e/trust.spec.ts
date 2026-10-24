import { expect, test } from "@playwright/test";
import { axe, numberFor, publish, signIn, writeInvite } from "./invite-helpers";

/* What makes paying feel safe: the payment and refund lines, help for anyone stuck, reviews. */

// Preview mode's admin number (src/lib/auth/mode.ts)
const ADMIN = "9999900000";
const DESIGN = "/create/rajwada-bagh?category=wedding";

test.describe("a design's page", () => {
  test.use({ reducedMotion: "reduce" });

  test("says how paying works beside the prices", async ({ page }) => {
    await page.goto(DESIGN);
    const safely = page.locator("[data-design-packages] [data-pay-safely]");
    await expect(safely).toContainText("Paid securely through Razorpay");
    await expect(safely).toContainText("Full refund within 7 days");
  });

  test("after a minute, offers to make it for them, until put away", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
    await page.goto(DESIGN);
    await expect(page.getByRole("textbox", { name: /First name/ })).toBeVisible({
      timeout: 30_000,
    });
    const nudge = page.locator("[data-make-nudge]");
    await expect(nudge).toHaveCount(0);
    await page.clock.fastForward(61_000);
    await expect(nudge.getByRole("link", { name: /We'll make it for you/ })).toHaveAttribute(
      "href",
      "/help/whatsapp?for=make&design=rajwada-bagh",
    );
    expect((await axe(page).analyze()).violations).toEqual([]);
    await nudge.getByRole("button", { name: "Hide this" }).click();
    await expect(nudge).toHaveCount(0);
    // Put away, it stays away for the rest of the visit
    await page.reload();
    await expect(page.getByRole("textbox", { name: /First name/ })).toBeVisible({
      timeout: 30_000,
    });
    await page.clock.fastForward(61_000);
    await expect(nudge).toHaveCount(0);
  });
});

test.describe("reviews", () => {
  test.use({ reducedMotion: "reduce" });

  test("open once an invitation is live, and show once an admin approves them", async ({
    page,
    browser,
  }, info) => {
    test.setTimeout(test.info().timeout + 60_000);
    const words = `Our guests loved the opening, run ${Date.now()}.`;

    const number = numberFor(info);
    await writeInvite(page, number, ["Kabir", "Isha"]);
    // Before anything is live, there is nothing to review yet
    const before = await page.context().newPage();
    await before.goto("/review");
    await expect(
      before.getByText("Reviews open once one of your invitations is live."),
    ).toBeVisible();
    await before.close();
    await publish(page, "kabir-weds-isha");
    await page.goto("/invites");
    const ask = page.locator("[data-ask-review]");
    await expect(ask.getByText("How did it go? Leave a review")).toBeVisible();
    await ask.getByRole("link", { name: "Write a review" }).click();
    await expect(page).toHaveURL(/\/review$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("How did Shubh do for you?");

    const form = page.locator("[data-review-form]");
    // Sending with nothing chosen says what's missing
    await form.getByRole("button", { name: "Send review" }).click();
    await expect(form.getByText("Choose from 1 to 5 stars.")).toBeVisible();
    await form.getByRole("radio", { name: "5 stars" }).click();
    await form.getByRole("textbox", { name: /Your words/ }).fill(words);
    await form.getByRole("textbox", { name: /Name to show/ }).fill("Isha K.");
    await form.getByRole("textbox", { name: /City or town/ }).fill("Pune");
    expect((await axe(page).analyze()).violations).toEqual([]);
    await form.getByRole("button", { name: "Send review" }).click();
    await expect(form.getByRole("status")).toHaveText(
      "Thank you! It shows on the site once we've read it.",
    );
    await page.goto("/invites");
    await expect(page.locator("[data-ask-review]")).toHaveCount(0);

    // Nothing shows until an admin reads it
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const admin = await context.newPage();
    await admin.goto("/sign-in?next=%2Fadmin%2Freviews");
    await signIn(admin, ADMIN);
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Reviews");
    const row = admin.locator("[data-review]").filter({ hasText: words });
    await expect(row.getByText("Waiting for you")).toBeVisible();
    await expect(admin.locator("[data-review-link]")).toContainText("/review");
    expect((await axe(admin).analyze()).violations).toEqual([]);
    await row.getByRole("button", { name: "Show on the site" }).click();
    await expect(row.getByText("On the site")).toBeVisible();

    // The home page shows it, with the name and place the host chose
    const visitor = await context.newPage();
    await visitor.goto("/");
    const reviews = visitor.locator("[data-home-reviews]");
    await expect(reviews.getByRole("heading", { name: "What families say" })).toBeVisible({
      timeout: 15_000,
    });
    const shown = reviews.getByRole("listitem").filter({ hasText: words });
    await expect(shown).toContainText("Isha K. · Pune · Wedding");
    await expect(visitor.locator("[data-trust-line]").first()).toContainText("out of 5 from");

    // Hidden again, it leaves the site
    await row.getByRole("button", { name: "Hide" }).click();
    await expect(row.getByText("Hidden")).toBeVisible();
    await context.close();
  });
});
