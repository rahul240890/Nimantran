import { expect, test, type Page } from "@playwright/test";
import { axe, noOverflow } from "./invite-helpers";

/* The gallery (Step 12g): occasions, a wedding's kinds, their designs, search and Use this design. */

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`gallery, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    for (const [path, heading] of [
      ["/invitations", "What are you celebrating?"],
      ["/invitations/wedding/gujarati", "ગુજરાતીGujarati wedding invitation & digital kankotri"],
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
    await expect(designs).toHaveCount(21);
    for (const scene of [
      "pithora-ghoda",
      "patola-bandh",
      "moti-bharat",
      "phool-ladi",
      "kutch-rang",
      "pichwai-gaay",
      "kutch-bhunga",
      "white-rann",
      "mameru-bandhani",
      "mandvi-dhow",
      "sindhi-ajrak",
    ]) {
      await expect(page.locator(`[data-design="${scene}-scene"]`)).toBeVisible();
    }
    await expect(page.locator('[data-design="kutch-toran"]')).toBeVisible();
    await expect(page.locator('[data-design="shahi-savari"]')).toBeVisible();
    await expect(page.locator('[data-design="pichwai"]')).toBeVisible();
    await expect(page.locator('[data-design="card-bandhani"]')).toBeVisible();
    for (const story of [
      "nathdwara-raat",
      "hina",
      "mor-sarovar",
      "kaanch-chitra",
      "rogan",
      "sankheda",
    ]) {
      await expect(page.locator(`[data-design="${story}"]`)).toBeVisible();
    }
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
    // A Story is Royal: what each package costs on it, not just the design's own price
    const packages = preview.getByRole("region", { name: "Packages for this design" });
    for (const [plan, price] of [
      ["basic", "₹799"],
      ["celebration", "₹1,199"],
      ["grand", "₹1,399"],
    ] as const) {
      await expect(packages.locator(`[data-plan="${plan}"]`)).toContainText(price);
    }
    await expect(packages.locator('[data-plan="basic"]')).toContainText("100 guests or families");
    await preview.getByRole("link", { name: "Use this design" }).click();
    await expect(page).toHaveURL(/\/create$/);
    // The names come first, in the card's language: a Gujarati wedding suggests Gujarati
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who's getting married?");
    await expect(page.getByRole("radio", { name: /^ગુજરાતી/ })).toBeChecked();
  });

  test("a birthday has its own theme and one name on the cover", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/invitations/birthday");
    // A long list shows its first designs; the rest come with Show all
    await expect(page.locator("[data-design]")).toHaveCount(24);
    await page.getByRole("button", { name: /^Show all \d+ designs$/ }).click();
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

/**
 * Opens the Designs page once its catalogue has taken over from the server's drawing, which
 * it replaces whole: a row or box found before then is gone a moment later.
 */
async function openDesigns(page: Page, path = "/designs") {
  await page.goto(path);
  await expect(page.locator("[data-catalog-live]")).toBeAttached();
}

test.describe("the Designs page", () => {
  test.use({ reducedMotion: "reduce" });

  test("rows show a few designs each, and View all opens the whole list", async ({ page }) => {
    await openDesigns(page);
    const folkArt = page.locator('[data-shelf="collection-folk-art"]');
    // Rows far down draw their designs as they come near
    await expect(folkArt.locator("[data-design]")).toHaveCount(0);
    // The row can be redrawn while the page settles, so scroll again until it fills
    await expect(async () => {
      await folkArt.scrollIntoViewIfNeeded({ timeout: 2_000 });
      await expect(folkArt.locator("[data-design]")).toHaveCount(10, { timeout: 2_000 });
    }).toPass();
    await folkArt
      .getByRole("link", { name: /^View all \d+ designs: Folk Art Collection$/ })
      .first()
      .click();
    await expect(page).toHaveURL(/collection=folk-art/);
    await expect(
      page.getByRole("heading", { name: /^Folk Art Collection · \d+ designs$/ }),
    ).toBeVisible();
    await expect(page.locator("[data-shelf]")).toHaveCount(0);
    expect(await page.locator("[data-design]").count()).toBeGreaterThan(10);

    // Back returns to the rows
    await page.goBack();
    await expect(folkArt).toBeVisible();
    await expect(page).not.toHaveURL(/collection=/);
  });

  test("collections open as tiles and rows, each listing its own themes", async ({ page }) => {
    await openDesigns(page);
    await expect(page.locator("[data-collection]")).toHaveCount(18);
    await expect(page.locator('[data-shelf="collection-storybook"]')).toBeVisible();
    // Trending leads the rows, its designs badged wherever they show
    const trending = page.locator('[data-shelf="trending"]');
    await expect(trending.locator("[data-design]").first()).toBeVisible();
    await expect(trending.locator("[data-trending]").first()).toBeVisible();
    await page.locator('[data-collection="royal-wedding"]').getByRole("link").click();
    await expect(page).toHaveURL(/collection=royal-wedding/);
    await expect(
      page.getByRole("heading", { name: /^Royal Wedding Collection · \d+ designs$/ }),
    ).toBeVisible();
    await expect(page.locator("[data-design]").first()).toHaveAttribute("data-design", /jal-mahal/);
    await expect(page.locator('[data-design="gubbara"]')).toHaveCount(0);
  });

  test("filters narrow every design, follow the address and open the editor set up", async ({
    page,
  }) => {
    await openDesigns(page);
    await page.locator('[data-kind="gujarati"]').getByRole("link").click();
    await expect(page).toHaveURL(/tradition=gujarati/);
    await expect(
      page.getByRole("heading", { name: /^Gujarati weddings · \d+ designs$/ }),
    ).toBeVisible();
    const occasions = page.getByRole("group", { name: "Occasion" });
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

    // Clearing every filter goes back to the rows
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator('[data-shelf="collection-garden"]')).toBeVisible();

    await page
      .locator('section[aria-labelledby="occasions-heading"]')
      .getByRole("link", { name: "Birthday", exact: true })
      .click();
    await expect(page).toHaveURL(/occasion=birthday/);
    await expect(page.locator('[data-design="gubbara"]')).toBeVisible();
    await expect(page.locator('[data-design="rajwada-bagh"]')).toHaveCount(0);
    // A birthday has no wedding traditions to choose from
    await expect(page.getByRole("group", { name: "Wedding tradition" })).toBeHidden();
    await page.getByRole("radio", { name: "3D card" }).click();
    await page
      .getByRole("group", { name: "Art or photos" })
      .getByRole("button", { name: "Illustrated" })
      .click();
    await expect(page).toHaveURL(/photos=none/);
  });

  test("a price and an order narrow and sort the designs, and follow the address", async ({
    page,
  }) => {
    await openDesigns(page, "/designs?occasion=wedding");
    // The main filters show first; the quick occasions open out to every occasion
    const occasions = page.getByRole("group", { name: "Occasion" });
    await expect(occasions.getByRole("button", { name: "Birthday", exact: true })).toBeVisible();
    await expect(occasions.getByRole("button", { name: "Retirement" })).toHaveCount(0);
    await occasions.getByRole("button", { name: "More occasions" }).click();
    await expect(occasions.getByRole("button", { name: "Retirement" })).toBeVisible();

    await expect(page.getByRole("group", { name: "Price" })).toBeHidden();
    await page.getByRole("button", { name: "More filters" }).click();
    const prices = page.getByRole("group", { name: "Price" });
    await prices.getByRole("button", { name: "Free", exact: true }).click();
    await expect(page).toHaveURL(/price=free/);
    // Every free design is a 3D card
    const formats = await page
      .locator("[data-format-item]")
      .evaluateAll((items) => items.map((item) => item.getAttribute("data-format-item")));
    expect(formats.length).toBeGreaterThan(0);
    expect(new Set(formats)).toEqual(new Set(["card"]));

    await prices.getByRole("button", { name: "Any price" }).click();
    await page.getByRole("combobox", { name: "Sort designs" }).click();
    await page.getByRole("option", { name: "Price: high to low" }).click();
    await expect(page).toHaveURL(/sort=price-high/);
    // The paid designs lead and the free 3D cards come last, past the first few
    await page.getByRole("button", { name: /^Show all \d+ designs$/ }).click();
    const items = page.locator("[data-format-item]");
    await expect(items.first()).not.toHaveAttribute("data-format-item", "card");
    await expect(items.last()).toHaveAttribute("data-format-item", "card");
    expect(await noOverflow(page)).toBe(true);
  });

  test("search finds designs by name, and says so when nothing matches", async ({ page }) => {
    await openDesigns(page);
    const search = page.getByRole("searchbox", { name: "Search designs" });
    await search.fill("kayal");
    await expect(page.locator('[data-design="kayal"]')).toBeVisible();
    await expect(page.locator('[data-design="noor-bagh"]')).toHaveCount(0);
    await search.fill("zzzz");
    await expect(page.getByText("No design matches all of these yet.")).toBeVisible();
  });

  test("words typed before the page has loaded are still searched", async ({ page }) => {
    // The page's scripts are held back, so the box typed into is the server's
    let release = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/_next/static/**/*.js", async (route) => {
      await held;
      await route.continue();
    });
    await page.goto("/designs", { waitUntil: "domcontentloaded" });
    await page.getByRole("searchbox", { name: "Search designs" }).fill("kayal");
    release();
    await expect(page.locator('[data-design="kayal"]')).toBeVisible();
    await expect(page.locator('[data-design="noor-bagh"]')).toHaveCount(0);
    await expect(page).toHaveURL(/q=kayal/);
  });
});
