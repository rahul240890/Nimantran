import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

// A 4×4 marigold PNG, enough for the browser to decode, shrink and store
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEUlEQVR4nGP4sMQQjhiI4wAA7GIcUc0K+8QAAAAASUVORK5CYII=",
  "base64",
);

const next = (page: Page) =>
  page.getByRole("button", { name: /^(Continue|Preview invitation)$/ }).click();

async function fillCouple(page: Page) {
  await page.getByRole("textbox", { name: /First name/ }).fill("Aditya");
  await page.getByRole("textbox", { name: /Second name/ }).fill("Priya");
}

async function fillWedding(page: Page) {
  await page.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
  await page.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: "6:30 pm" }).click();
  await page.getByRole("textbox", { name: /^Venue/ }).fill("Taj Falaknuma, Hyderabad");
  await page.getByRole("button", { name: "Traditional Indian" }).click();
}

test.beforeEach(async ({ page }) => {
  // A fixed "today", so the calendar and the dates it produces never drift
  await page.clock.setFixedTime(new Date("2026-09-26T10:00:00"));
  await page.goto("/create?quality=2d");
  await page.evaluate(() => localStorage.clear());
});

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`invite editor, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("every step fits the screen and passes an accessibility check", async ({ page }) => {
      await page.goto("/create?quality=2d");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Pick the card your guests will open",
      );
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await next(page);
      await next(page); // names missing: errors show
      await expect(page.getByText("2 things need your attention")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await fillCouple(page);
      await next(page);
      await next(page);
      await expect(page.getByText("3 things need your attention")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await fillWedding(page);
      await next(page);
      await expect(page.getByRole("heading", { name: "Make it yours" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await next(page);
      await expect(page.getByText("Your invitation is ready")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  });
}

test.describe("invite editor", () => {
  test.use({ reducedMotion: "reduce" });

  test("writes an invite from design to preview and keeps it after a reload", async ({ page }) => {
    await page.goto("/create?quality=2d");
    await page.getByRole("radio", { name: /Rose Garden/ }).click();
    await next(page);

    await fillCouple(page);
    await next(page);

    // Only the wedding starts planned; add the sangeet too
    await page.getByRole("checkbox", { name: /Sangeet/ }).click();
    await next(page);
    await expect(page.getByText("6 things need your attention")).toBeVisible();
    await page.getByRole("checkbox", { name: /Sangeet/ }).click();
    await fillWedding(page);
    await expect(page.getByRole("button", { name: "Traditional Indian" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await next(page);

    await page.locator('input[type="file"]').setInputFiles({
      name: "us.png",
      mimeType: "image/png",
      buffer: PNG,
    });
    await expect(page.getByRole("img", { name: "Photo 1" })).toBeVisible();
    await page.getByRole("radio", { name: /Raag Bhupali/ }).click();
    await next(page);

    await expect(page.getByText("Your invitation is ready")).toBeVisible();
    const summary = page.getByRole("region", { name: "Functions" });
    await expect(summary.getByText("Thu, 15 Oct 2026 · 6:30 pm")).toBeVisible();
    await expect(summary.getByText("Taj Falaknuma, Hyderabad")).toBeVisible();
    await expect(page.getByText(/Raag Bhupali/)).toBeVisible();
    // The live card carries the couple's names and the wedding's venue
    const card = page.locator("[data-engine-state]");
    await expect(card.locator(".sr-only").getByText("Aditya and Priya")).toBeAttached();
    await expect(card.locator(".sr-only").getByText("Taj Falaknuma, Hyderabad")).toBeAttached();
    await expect(card.locator(".sr-only").getByText("Thursday, 15 October 2026")).toBeAttached();

    await page.reload();
    await expect(page.getByText("Your invitation is ready")).toBeVisible();
    await expect(page.getByRole("img", { name: "Photo 1" })).toBeVisible();

    await page.getByRole("button", { name: "Start a new invite" }).click();
    await page.getByRole("button", { name: "Clear and start again" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Pick the card your guests will open",
    );
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Pick the card your guests will open",
    );
  });

  test("a design chosen on the landing page starts the invite", async ({ page }) => {
    await page.goto("/create?quality=2d&template=kasavu");
    await expect(page.getByRole("radio", { name: /Kerala Kasavu/ })).toBeChecked();
  });
});
