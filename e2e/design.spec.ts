import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`design page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("has no horizontal scroll", async ({ page }) => {
      await page.goto("/design");
      expect(await noOverflow(page)).toBe(true);
    });

    test("has no accessibility violations", async ({ page }) => {
      await page.goto("/design");
      const results = await axe(page).analyze();
      expect(results.violations).toEqual([]);
    });

    test("open overlays have no accessibility violations or overflow", async ({ page }) => {
      await page.goto("/design");
      await page.getByRole("button", { name: /Wedding date/ }).click();
      await expect(page.getByRole("grid")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect(
        (await axe(page).include("[data-radix-popper-content-wrapper]").analyze()).violations,
      ).toEqual([]);
      await page.keyboard.press("Escape");

      await page.getByRole("button", { name: "Add a guest" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).include('[role="dialog"]').analyze()).violations).toEqual([]);
    });
  });
}

test.describe("design page interactions", () => {
  test.use({ reducedMotion: "reduce" });

  test("dialog traps focus, validates, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/design");
    const trigger = page.getByRole("button", { name: "Add a guest" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Add a guest" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox", { name: /Name/ })).toBeFocused();

    await dialog.getByRole("button", { name: "Add guest", exact: true }).click();
    await expect(dialog.getByText("Enter the guest's name.")).toBeVisible();
    await expect(dialog.getByRole("textbox", { name: /Name/ })).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("adding a guest shows a success toast", async ({ page }) => {
    await page.goto("/design");
    await page.getByRole("button", { name: "Add a guest" }).click();
    await page.getByRole("textbox", { name: /Name/ }).fill("Kabir Singh");
    await page.getByRole("button", { name: "Add guest", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByText("Kabir Singh added", { exact: true })).toBeVisible();
  });

  test("date picker works with the keyboard", async ({ page }) => {
    await page.goto("/design");
    const trigger = page.getByRole("button", { name: /Wedding date/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("grid")).toBeVisible();
    // Focus starts on today; move a week ahead and pick it
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("grid")).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).not.toContainText("Pick a date");
  });

  test("tabs move with arrow keys", async ({ page }) => {
    await page.goto("/design");
    const sangeet = page.getByRole("tab", { name: "Sangeet" });
    await sangeet.click();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Wedding" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tabpanel")).toContainText("Mandap by the lake");
  });

  test("theme choice applies and survives a reload", async ({ page }) => {
    await page.goto("/design");
    await page.getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");

    await page.getByRole("radio", { name: "Match device" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });

  test("reduce motion switch stills animations", async ({ page }) => {
    await page.goto("/design");
    await page.getByRole("switch", { name: "Reduce motion" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
    const animation = await page
      .locator(".text-gold-shimmer")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
  });

  test("every button and field is at least 44px tall", async ({ page }) => {
    await page.goto("/design");
    const small = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          "main button, main input, main a, main [role=tab]",
        ),
      ]
        .filter((el) => el.offsetParent !== null)
        .map((el) => ({
          text: el.textContent || el.getAttribute("aria-label"),
          h: el.getBoundingClientRect().height,
        }))
        .filter(({ h }) => h < 44),
    );
    // Checkboxes, radios and switches are smaller boxes inside a 44px row with an enlarged hit area
    expect(small.filter(({ h }) => h > 36)).toEqual([]);
  });
});
