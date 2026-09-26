import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const tiles = (page: import("@playwright/test").Page) =>
  page.getByRole("list", { name: "Occasions" }).getByRole("listitem");

for (const colorScheme of ["light", "dark"] as const) {
  test(`occasions fit the screen and pass an accessibility check, ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto("/?region=PB&month=8");
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

test("local occasions come first, named in the local script", async ({ page }) => {
  await page.goto("/?region=PB&month=8");
  await expect(tiles(page).first()).toHaveAttribute("data-category", "roka");
  await expect(tiles(page).first()).toContainText("ਰੋਕਾ");
  await expect(tiles(page).first()).toContainText("Popular near you");

  await page.goto("/?region=KL&month=11");
  await expect(tiles(page).first()).toHaveAttribute("data-category", "wedding");
  await expect(tiles(page).first()).toContainText("വിവാഹം");
});

test("an occasion opens the editor ready for it", async ({ page }) => {
  await page.goto("/?month=11");
  await page.evaluate(() => localStorage.clear());
  await tiles(page).filter({ hasText: "Sangeet" }).getByRole("link").click();
  await expect(page).toHaveURL(/\/create\?category=sangeet/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Pick the card your guests will open",
  );
  await expect(
    page.getByRole("radiogroup", { name: "Choose a design" }).getByRole("radio").first(),
  ).toHaveAccessibleName(/Emerald Palace/);
});
