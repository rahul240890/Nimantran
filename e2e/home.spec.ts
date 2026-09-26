import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`home page, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test("has no horizontal scroll, closed or open", async ({ page }) => {
      await page.goto("/");
      const noOverflow = () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(await noOverflow()).toBe(true);

      await page.getByRole("button", { name: "Open the sample invitation" }).click();
      await expect(page.getByRole("button", { pressed: true })).toBeVisible();
      expect(await noOverflow()).toBe(true);
    });

    test("header fits on one line", async ({ page }) => {
      await page.goto("/");
      const logo = await page.getByRole("link", { name: "Nimantran home" }).boundingBox();
      const badge = await page.locator("header > span").boundingBox();
      expect(logo && badge).toBeTruthy();
      // One line of text, same row as the logo, inside the viewport
      expect(badge!.height).toBeLessThan(44);
      expect(Math.abs(logo!.y + logo!.height / 2 - (badge!.y + badge!.height / 2))).toBeLessThan(4);
      expect(badge!.x + badge!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    });

    test("has no accessibility violations", async ({ page }) => {
      await page.goto("/");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });
}

test("card toggles with the keyboard", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("button", { name: "Open the sample invitation" });
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("aria-pressed", "false");
});

test("serves a link preview image", async ({ request }) => {
  const res = await request.get("/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
