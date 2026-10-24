import { expect, test } from "@playwright/test";
import { axe, noOverflow, signIn } from "./invite-helpers";

/*
 * The home page's sections of designs (owner, 2026-10-24): Trending and Best sellers first,
 * each a grid that ends in View all so nobody scrolls sideways, and the master admin choosing
 * which sections show and with which designs (Admin, Home page).
 */

// Preview mode's admin number (src/lib/auth/mode.ts)
const ADMIN = "9999900000";

test.use({ reducedMotion: "reduce" });

test("Trending and Best sellers come first, and every section is a grid ending in View all", async ({
  page,
}, info) => {
  await page.goto("/");
  const designs = page.locator("#designs");
  await designs.scrollIntoViewIfNeeded();
  const order = await designs
    .locator("[data-shelf]")
    .evaluateAll((all) => all.map((shelf) => shelf.getAttribute("data-shelf")));
  const at = (id: string) => order.indexOf(id);
  for (const id of ["home-trending", "home-bestsellers", "home-wedding", "home-engagement"]) {
    expect(at(id), id).toBeGreaterThanOrEqual(0);
  }
  expect(at("home-trending")).toBeLessThan(at("home-wedding"));
  expect(at("home-bestsellers")).toBeLessThan(at("home-wedding"));
  expect(at("home-wedding")).toBeLessThan(at("home-engagement"));

  const wedding = page.locator('[data-shelf="home-wedding"]');
  await wedding.scrollIntoViewIfNeeded();
  await expect(wedding).toHaveAttribute("data-layout", "grid");
  await expect(wedding.locator("article").first()).toBeVisible();
  // 5 designs then View all on a phone, 9 then View all on a wide screen
  const shown = info.project.name === "phone-320" ? 5 : 9;
  const cells = wedding.locator("ul > li");
  await expect(cells.filter({ visible: true })).toHaveCount(shown + 1);
  const all = cells.last().getByRole("link");
  await expect(all).toHaveAttribute("href", "/invitations/wedding");
  await expect(all).toHaveAccessibleName(/^View all \d+ designs: Wedding$/);
  // Nothing in the sections scrolls sideways
  const sideways = await designs
    .locator("ul")
    .evaluateAll((lists) => lists.filter((list) => list.scrollWidth > list.clientWidth + 1).length);
  expect(sideways).toBe(0);
  expect(await noOverflow(page)).toBe(true);
});

test("an admin switches a section on, chooses its designs, and the home page follows", async ({
  page,
}, info) => {
  // One screen size changes the shared setting, so the two runs don't undo each other
  test.skip(info.project.name !== "desktop-1440", "the setting is shared by both runs");
  test.setTimeout(90_000);
  await page.goto("/sign-in?next=%2Fadmin%2Fhome");
  await signIn(page, ADMIN);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Home page");
  await expect(
    page.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: "Home page" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page).toHaveTitle(/Home page/);
  expect(await noOverflow(page)).toBe(true);
  expect((await axe(page).analyze()).violations).toEqual([]);

  const section = page.locator('[data-home-section="new"]');
  const show = section.getByRole("switch", { name: "Show on the home page" });
  const save = page.getByRole("button", { name: "Save the home page" });
  try {
    await expect(show).not.toBeChecked();
    await show.click();
    // Choosing starts from what it shows by itself; the first is taken out
    await section.getByRole("button", { name: "Choose designs" }).click();
    const first = section.getByRole("listitem").first();
    const second = section.getByRole("listitem").nth(1);
    const secondName = ((await second.locator("span").first().textContent()) ?? "")
      .replace(/^\d+\.\s*/, "")
      .replace(/\s*\(.*$/, "")
      .trim();
    await first.getByRole("button", { name: /^Take .* out$/ }).click();
    await save.click();
    await expect(page.getByText("Home page saved").first()).toBeVisible();

    await page.goto("/");
    const shelf = page.locator('[data-shelf="home-new"]');
    await shelf.scrollIntoViewIfNeeded();
    await expect(shelf.getByRole("heading", { level: 3, name: "New designs" })).toBeVisible();
    await expect(shelf.locator("article").first().locator("h3").first()).toHaveText(secondName);
  } finally {
    // Back as it was, for every other test
    await page.goto("/admin/home");
    const reset = page.locator('[data-home-section="new"]');
    const restore = reset.getByRole("button", { name: "Let it fill itself" });
    if (await restore.count()) await restore.click();
    const on = reset.getByRole("switch", { name: "Show on the home page" });
    if (await on.isChecked()) await on.click();
    const button = page.getByRole("button", { name: "Save the home page" });
    if (await button.isEnabled()) {
      await button.click();
      await expect(page.getByText("Home page saved").first()).toBeVisible();
    }
  }
});
