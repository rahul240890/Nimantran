import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { noOverflow } from "./invite-helpers";

// Best practice too, as the keyboard test on a real guest page checks
const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ]);

/* The themed guest page below the painted pages (Step 12q), on the sample review page */
for (const suite of ["rajwada-bagh", "kayal"] as const) {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`${suite} guest page, ${colorScheme} theme`, () => {
      test.use({ colorScheme, reducedMotion: "reduce" });

      test("wears the theme, opens the seal and lights up", async ({ page }) => {
        await page.goto(`/engine/guest?suite=${suite}`);
        const themed = page.locator(".guest-themed");
        await expect(themed).toHaveAttribute("data-suite", suite);
        await expect(page.getByRole("heading", { name: "The celebrations" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Save the date" })).toBeVisible();

        const seal = page.getByRole("button", { name: /Break the seal|Open the lotus/ });
        await expect(seal).toHaveAttribute("aria-expanded", "false");
        await seal.click();
        await expect(seal).toHaveAttribute("aria-expanded", "true");
        await expect(page.getByText("Together with their families")).toBeVisible();

        const lights = page.getByRole("button", { name: /Light the/ });
        await lights.click();
        await expect(lights).toHaveAttribute("aria-pressed", "true");

        await page.locator("#rsvp").scrollIntoViewIfNeeded();
        await expect(page.getByRole("button", { name: /Play the music/ }).last()).toBeVisible();

        expect(await noOverflow(page)).toBe(true);
        expect((await axe(page).analyze()).violations).toEqual([]);
      });
    });
  }
}
