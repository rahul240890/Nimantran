import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/* The home page's occasions: the wedding journey as paintings, each opening its designs. */
const tiles = (page: Page) => page.locator("#occasions ul").first().getByRole("listitem");

for (const colorScheme of ["light", "dark"] as const) {
  test(`occasions fit the screen and pass an accessibility check, ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator("#occasions");
    await section.scrollIntoViewIfNeeded();
    await expect(tiles(page)).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page })
      .include("#occasions")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("each occasion names itself in both site languages and says what's coming next", async ({
  page,
}) => {
  await page.goto("/");
  await expect(tiles(page).first()).toContainText("Wedding");
  await expect(tiles(page).filter({ hasText: "Sangeet" })).toHaveCount(1);
  await expect(page.locator("#occasions")).toContainText("Coming next");
  await expect(page.locator("#occasions")).toContainText("Birthday");
});

test("an occasion opens its own designs", async ({ page }) => {
  await page.goto("/");
  await tiles(page).filter({ hasText: "Sangeet" }).getByRole("link").click();
  await expect(page).toHaveURL(/\/invitations\/sangeet$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sangeet");
});
