import { expect, test } from "@playwright/test";
import { axe, noOverflow, signIn } from "./invite-helpers";

/* Admin, Blog and Admin, AI (Step 14 part 4), in preview mode. */

// Preview mode's admin number (src/lib/auth/mode.ts)
const ADMIN = "9999900000";

// A 1 × 1 PNG, enough for the cover upload
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

test.describe("blog manager", () => {
  test.use({ reducedMotion: "reduce" });

  test("an admin writes, publishes, schedules and deletes a post", async ({ page }, info) => {
    const slug = `test-post-${info.project.name}`;
    // Both screen sizes run at once against one server, so each writes its own post
    const title = `Test puja ${info.project.name}`;
    const heading = `Puja wording for a test, ${info.project.name}`;
    await page.goto("/sign-in?next=%2Fadmin%2Fblog");
    await signIn(page, ADMIN);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blog");
    // The built-in posts are listed too
    await expect(page.getByText("Wedding invitation wording: 30 messages")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    await page.getByRole("link", { name: "New post" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("New post");
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Address").fill(slug);
    await page.getByLabel("Heading").fill(heading);
    await page
      .getByLabel("Description")
      .fill("Puja invitation messages to copy for WhatsApp, written for a test.");
    await page
      .getByLabel("Post")
      .fill(
        "## Messages\n\n> [Short] Please join us for the puja on Sunday.\n\n- Send it a week ahead\n\n! Call the elders first.",
      );
    await page
      .getByLabel("Questions and answers")
      .fill("Q: When should I send it?\nA: A week ahead.");
    await page.locator('input[type="file"]').setInputFiles({
      name: "cover.png",
      mimeType: "image/png",
      buffer: PNG,
    });
    await expect(page.locator("form img")).toBeVisible();
    await page.getByLabel("Describe the picture").fill("A brass diya on a rangoli");
    await page.getByRole("radio", { name: /Published/ }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Published").first()).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/blog\/[0-9a-f-]{36}$/);
    // The new address comes before its title on a client-side move; check the finished page
    await expect(page).toHaveTitle(/Edit post/);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Live on the blog, with its cover, answers and copy buttons
    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByRole("img", { name: "A brass diya on a rangoli" })).toBeVisible();
    await expect(page.getByText("Please join us for the puja on Sunday.")).toBeVisible();
    await expect(page.getByText("When should I send it?")).toBeVisible();
    await page.goto("/blog");
    await expect(page.getByRole("link", { name: heading })).toBeVisible();

    // A date ahead schedules it: off the blog until then
    await page.goBack();
    await page.goto("/admin/blog");
    await page.getByRole("link", { name: heading, exact: true }).click();
    await page.getByLabel("Publish date").fill("2030-01-01T09:00");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByText("Scheduled: it goes live on its date", { exact: true }),
    ).toBeVisible();
    const scheduled = await page.request.get(`/blog/${slug}`);
    expect(scheduled.status()).toBe(404);

    // Two steps to delete
    await page.getByRole("button", { name: "Delete post" }).click();
    await page.getByRole("button", { name: "Delete for good" }).click();
    await expect(page).toHaveURL(/\/admin\/blog$/);
    await expect(page.getByRole("link", { name: heading, exact: true })).toHaveCount(0);
  });

  test("the AI page shows the provider without the key", async ({ page }) => {
    await page.goto("/sign-in?next=%2Fadmin%2Fai");
    await signIn(page, ADMIN);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI");
    await expect(
      page.getByText("AI_PROVIDER: gemini, openai, deepseek or anthropic"),
    ).toBeVisible();
    await expect(page.getByText("aistudio.google.com → Get API key")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
});
