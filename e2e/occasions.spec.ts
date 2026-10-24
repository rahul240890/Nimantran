import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/* The home page's occasions: four large painted tiles, then a row of smaller links. */

for (const colorScheme of ["light", "dark"] as const) {
  test(`occasions fit the screen and pass an accessibility check, ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator("#occasions");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("ul").first().getByRole("listitem")).toHaveCount(4);
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

test("the four large tiles start with the wedding, and the row ends with every occasion", async ({
  page,
}) => {
  await page.goto("/");
  const big = page.locator("#occasions ul").first().getByRole("listitem");
  await expect(big.first()).toContainText("Wedding");
  await expect(big.filter({ hasText: "Birthday" })).toHaveCount(1);
  const more = page.getByRole("list", { name: "More occasions" }).getByRole("listitem");
  await more.last().getByRole("link").click();
  await expect(page).toHaveURL(/\/invitations$/);
});

test("an occasion opens its own designs", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("list", { name: "More occasions" })
    .getByRole("link", { name: "Sangeet" })
    .click();
  await expect(page).toHaveURL(/\/invitations\/sangeet$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sangeet");
});
