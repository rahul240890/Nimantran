import { expect, test } from "@playwright/test";
import { axe, noOverflow } from "./invite-helpers";

/* The gallery (Step 12g): occasions, a wedding's kinds, their designs, search and Use this design. */

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`gallery, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    for (const [path, heading] of [
      ["/invitations", "What are you celebrating?"],
      ["/invitations/wedding/gujarati", "ગુજરાતીGujarati wedding invitations"],
      ["/invitations/birthday", "Birthday invitations full of balloons and cake"],
      ["/hi/invitations", "आप क्या मना रहे हैं?"],
      ["/designs?occasion=wedding&tradition=gujarati", "Find your invitation design"],
      ["/hi/designs", "अपने निमंत्रण का डिज़ाइन खोजिए"],
    ] as const) {
      test(`${path} fits the screen and passes an accessibility check`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
        expect(await noOverflow(page)).toBe(true);
        expect((await axe(page).analyze()).violations).toEqual([]);
      });
    }
  });
}

test.describe("finding a design", () => {
  test.use({ reducedMotion: "reduce" });

  test("a wedding kind shows only its own designs", async ({ page }) => {
    await page.goto("/invitations/wedding");
    await page.locator('[data-kind="gujarati"]').click();
    await expect(page).toHaveURL(/\/invitations\/wedding\/gujarati$/);
    const designs = page.locator("[data-design]");
    await expect(designs).toHaveCount(8);
    for (const scene of ["kutch-bhunga", "white-rann", "mameru-bandhani", "sindhi-ajrak"]) {
      await expect(page.locator(`[data-design="${scene}-scene"]`)).toBeVisible();
    }
    await expect(page.locator('[data-design="kutch-toran"]')).toBeVisible();
    await expect(page.locator('[data-design="shahi-savari"]')).toBeVisible();
    await expect(page.locator('[data-design="pichwai"]')).toBeVisible();
    await expect(page.locator('[data-design="card-bandhani"]')).toBeVisible();
  });

  test("search finds kinds and designs as you type", async ({ page }) => {
    await page.goto("/invitations");
    await page.getByRole("searchbox", { name: "Search occasions and designs" }).fill("gujarati");
    await expect(page.locator('[data-kind="gujarati"]')).toBeVisible();
    await expect(page.locator('[data-design="card-bandhani"]')).toBeVisible();
    await expect(page.locator('[data-occasion="birthday"]')).toHaveCount(0);
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page.locator('[data-occasion="birthday"]')).toBeVisible();
  });

  test("the preview shows every page, and Use this design sets up the editor", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/invitations/wedding/gujarati");
    await page.getByRole("button", { name: "Preview Shahi Savari" }).click();
    const preview = page.getByRole("dialog", { name: "Shahi Savari" });
    await expect(preview.getByText("Page 1 of 9")).toBeVisible();
    await preview.getByRole("button", { name: "Next page" }).click();
    await expect(preview.getByText("Page 2 of 9")).toBeVisible();
    await preview.getByRole("link", { name: "Use this design" }).click();
    await expect(page).toHaveURL(/\/create$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who is the couple?");
    // A Gujarati wedding is written in Gujarati
    await expect(page.getByRole("radio", { name: "ગુજરાતી", exact: true })).toBeChecked();
  });

  test("a birthday has its own theme and one name on the cover", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/invitations/birthday");
    await expect(page.locator('[data-design="gubbara"]')).toBeVisible();
    // Wedding themes stay with weddings
    await expect(page.locator('[data-design="rajwada-bagh"]')).toHaveCount(0);
    await page.getByRole("button", { name: "Preview Gubbara" }).click();
    const preview = page.getByRole("dialog", { name: "Gubbara" });
    await expect(preview.getByText("Page 1 of 4")).toBeVisible();
    await preview.getByRole("link", { name: "Use this design" }).click();
    await expect(page).toHaveURL(/\/create$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Whose birthday is it?");
    await expect(page.getByLabel(/^Second name/)).toHaveCount(0);
    await page.getByLabel(/^Birthday name/).fill("Aarav");
    // Phones show the live page behind a Preview button
    if (page.viewportSize()!.width < 1024)
      await page.getByRole("button", { name: "Preview", exact: true }).click();
    const cover = page.locator('[data-suite="gubbara"]').first();
    await expect(cover).toContainText("Happy birthday");
    await expect(cover).toContainText("Aarav");
    await expect(cover).not.toContainText("&");
  });
});

test.describe("the Designs page", () => {
  test.use({ reducedMotion: "reduce" });

  test("filters narrow every design, follow the address and open the editor set up", async ({
    page,
  }) => {
    await page.goto("/designs");
    const count = page.getByText(/^\d+ designs?$/);
    const all = Number((await count.textContent())!.split(" ")[0]);

    const occasions = page.getByRole("group", { name: "Occasion" });
    await occasions.getByRole("button", { name: "Birthday" }).click();
    await expect(page).toHaveURL(/occasion=birthday/);
    await expect(page.locator('[data-design="gubbara"]')).toBeVisible();
    await expect(page.locator('[data-design="rajwada-bagh"]')).toHaveCount(0);
    // A birthday has no wedding traditions to choose from
    await expect(page.getByRole("group", { name: "Wedding tradition" })).toBeHidden();

    await occasions.getByRole("button", { name: "All occasions" }).click();
    await page
      .getByRole("group", { name: "Wedding tradition" })
      .getByRole("button", { name: "Gujarati" })
      .click();
    await expect(page).toHaveURL(/tradition=gujarati/);
    await expect(occasions.getByRole("button", { name: "Wedding" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator('[data-design="kayal"]')).toHaveCount(0);

    await page.getByRole("radio", { name: "3D card" }).click();
    await expect(page.locator("[data-design]")).toHaveCount(1);
    await expect(page.locator('[data-design="card-bandhani"]')).toBeVisible();
    await expect(
      page.locator('[data-design="card-bandhani"]').getByRole("link", { name: /Use this design/ }),
    ).toHaveAttribute("href", /category=wedding.*tradition=gujarati/);

    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(count).toHaveText(`${all} designs`);
  });

  test("search finds designs by name, and says so when nothing matches", async ({ page }) => {
    await page.goto("/designs");
    const search = page.getByRole("searchbox", { name: "Search designs" });
    await search.fill("kayal");
    await expect(page.locator('[data-design="kayal"]')).toBeVisible();
    await expect(page.locator('[data-design="noor-bagh"]')).toHaveCount(0);
    await search.fill("zzzz");
    await expect(page.getByText("No design matches all of these yet.")).toBeVisible();
  });
});
