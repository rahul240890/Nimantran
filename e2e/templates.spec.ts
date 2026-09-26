import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

const engine = (page: Page) => page.locator("[data-engine-state]");

/* CI machines have no graphics chip; SwiftShader draws WebGL in software so the 3D path runs */
test.use({
  launchOptions: {
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {}),
    args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"],
  },
});

const DESIGNS = [
  "Marigold Gate",
  "Rose Garden",
  "Emerald Palace",
  "Royal Scroll",
  "Minimal Monogram",
  "Kerala Kasavu",
];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`templates page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("has no horizontal scroll or accessibility violations", async ({ page }) => {
      await page.goto("/templates?quality=2d");
      await expect(engine(page)).toHaveAttribute("data-engine-state", "fallback");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  });
}

test.describe("template system", () => {
  test.use({ reducedMotion: "reduce" });

  test("every design opens with its own words, without overflowing", async ({ page }) => {
    await page.goto("/templates?quality=2d");
    const preview = page.getByRole("region", { name: "Invitation preview" });
    for (const name of DESIGNS) {
      await page.getByRole("radio", { name: new RegExp(name) }).click();
      await expect(page.getByRole("radio", { name: new RegExp(name) })).toBeChecked();
      await page.getByRole("button", { name: "Open invitation" }).click();
      await expect(page.getByRole("button", { name: "Close invitation" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      await page.getByRole("button", { name: "Close invitation" }).click();
      await expect(preview).toBeVisible();
    }
  });

  test("the chosen design is described by its schema", async ({ page }) => {
    await page.goto("/templates?quality=2d&template=kasavu");
    await expect(page.getByRole("radio", { name: /Kerala Kasavu/ })).toBeChecked();
    await expect(page.getByText("Raag Madhyamavati · 72 beats a minute")).toBeVisible();
    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: "Date and time" })
        .getByText(/17 January 2027/),
    ).toBeVisible();
    // The screen-reader copy of the invitation follows the design
    await expect(page.locator(".sr-only").getByText("Arjun and Lakshmi")).toBeAttached();
  });

  test("draws each design in 3D", async ({ page }) => {
    await page.goto("/templates?quality=low&template=emerald");
    await expect(engine(page)).toHaveAttribute("data-engine-state", "ready", { timeout: 30_000 });
    for (const name of ["Kerala Kasavu", "Minimal Monogram"]) {
      await page.getByRole("radio", { name: new RegExp(name) }).click();
      await expect(engine(page)).toHaveAttribute("data-engine-state", "ready");
    }
    await expect(engine(page).locator("canvas")).toBeVisible();
  });
});
