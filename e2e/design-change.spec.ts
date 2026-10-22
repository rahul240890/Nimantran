import { expect, test, type Page } from "@playwright/test";
import { axe, noOverflow, numberFor, writeInvite } from "./invite-helpers";

/*
 * Changing the design (owner, 2026-10-22): only the designs, a dozen at a time with filters,
 * and nothing to fill in again, whether the design is changed in the editor or picked in
 * the gallery while the invite is under way.
 */

const title = (page: Page) => page.getByRole("heading", { level: 1 });

test.describe("changing the design", () => {
  test.use({ reducedMotion: "reduce" });

  test("from the preview: filters, a new design, and straight back with every detail", async ({
    page,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Kabir", "Meera"]);
    await page.getByRole("button", { name: "Change design" }).first().click();
    await expect(title(page)).toHaveText("Pick the design your guests will open");
    const designs = page.getByRole("radiogroup", { name: "Designs for your occasion" });
    await expect(designs.getByRole("radio")).toHaveCount(12);
    // Only designs: how it opens is chosen with the music
    await expect(page.getByRole("heading", { name: "How it opens" })).toHaveCount(0);

    // Scenes only, then the first of them
    await page
      .getByRole("radiogroup", { name: "Kind of invitation" })
      .getByRole("radio", { name: "Scene", exact: true })
      .click();
    const scene = designs.getByRole("radio").first();
    await expect(scene).toHaveAccessibleName(/, Scene$/);
    await scene.click();
    await expect(scene).toBeChecked();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Use this design goes back to the preview, the names and functions as they were
    await page.getByRole("button", { name: "Use this design" }).click();
    await expect(title(page)).toHaveText("Here's what your guests will see");
    await expect(page.getByText(/Kabir/).first()).toBeVisible();
    await expect(page.getByText("Taj Falaknuma, Hyderabad").first()).toBeVisible();
  });

  test("a design picked in the gallery joins the invite under way", async ({ page }, info) => {
    await writeInvite(page, numberFor(info), ["Isha", "Dev"]);
    // The gallery's Use this design, while signed in and not yet live
    await page.goto("/create?quality=2d&category=wedding&suite=kayal&template=marigold");
    await expect(title(page)).toHaveText("Here's what your guests will see", { timeout: 20_000 });
    await expect(page.getByText(/Isha/).first()).toBeVisible();
    await expect(page.getByText("Taj Falaknuma, Hyderabad").first()).toBeVisible();
    await expect(page.getByText("Kayal", { exact: true }).first()).toBeVisible();
  });
});
