import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

/** Opens a page and waits until React has taken over, so taps and typing are handled. */
async function visit(page: Page, path = "/") {
  await page.goto(path);
  await expect(page.locator("[data-flow-live]")).toHaveAttribute("data-flow-live", "true");
}

/** Below 1280px the tabs live in the menu button. */
const isNarrow = (page: Page) => page.viewportSize()!.width < 1280;

/** The phone's steps, and the one showing now. */
const steps = (page: Page) => page.locator("[data-flow-live] ol").getByRole("button");
const currentStep = (page: Page) => page.locator('[data-flow-live] ol button[aria-current="step"]');

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`landing page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("has no horizontal scroll, top to bottom", async ({ page }) => {
      await visit(page);
      expect(await noOverflow(page)).toBe(true);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      expect(await noOverflow(page)).toBe(true);
    });

    test("has no accessibility violations", async ({ page }) => {
      await visit(page);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });

    test("open menus have no accessibility violations", async ({ page }) => {
      await visit(page);
      if (isNarrow(page)) {
        await page.getByRole("button", { name: "Open menu" }).click();
        const dialog = page.getByRole("dialog", { name: "Menu" });
        await expect(dialog).toBeVisible();
        await dialog.getByRole("button", { name: "Wedding" }).click();
        await expect(dialog.getByRole("link", { name: /Wedding invitations/ })).toBeVisible();
        expect(await noOverflow(page)).toBe(true);
        expect((await axe(page).include('[role="dialog"]').analyze()).violations).toEqual([]);
      } else {
        const nav = page.getByRole("navigation", { name: "Main" });
        await nav.getByRole("button", { name: "More occasions" }).click();
        await expect(nav.getByRole("link", { name: /Housewarming/ })).toBeVisible();
        // Radix places a hidden, focusable span after an open tab's button that hands Tab on
        // into the open list; axe reads it as a hidden control, so it alone is left out
        const proxy = 'nav[aria-label="Main"] li > span[aria-hidden="true"][tabindex="0"]';
        expect((await axe(page).include("header").exclude(proxy).analyze()).violations).toEqual([]);
        await page.keyboard.press("Escape");
        await page.getByRole("button", { name: "Language: English" }).click();
        await expect(page.getByRole("menu")).toBeVisible();
        expect((await axe(page).include('[role="menu"]').analyze()).violations).toEqual([]);
      }
    });
  });
}

test.describe("landing page", () => {
  test.use({ reducedMotion: "reduce" });

  test("the header's five tabs each open a short list", async ({ page }) => {
    await visit(page);
    const tabs = ["Wedding", "Engagement", "Birthday", "More occasions", "Traditions"];
    if (isNarrow(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const dialog = page.getByRole("dialog", { name: "Menu" });
      for (const name of tabs) await expect(dialog.getByRole("button", { name })).toBeVisible();
      await dialog.getByRole("button", { name: "Wedding" }).click();
      await expect(dialog.getByRole("link", { name: /Wedding invitations/ })).toHaveAttribute(
        "href",
        "/invitations/wedding",
      );
      await expect(dialog.getByRole("link", { name: /Complete Wedding Set/ })).toHaveAttribute(
        "href",
        "/pricing#plan-grand",
      );
      const help = dialog.getByRole("link", { name: "Need help? WhatsApp us" });
      await expect(help).toHaveAttribute("href", "/help/whatsapp");
      await expect(help).toHaveAttribute("target", "_blank");
      await dialog.getByRole("button", { name: "Traditions" }).click();
      await dialog.getByRole("link", { name: /Gujarati/ }).click();
      await expect(page).toHaveURL(/\/invitations\/wedding\/gujarati$/);
    } else {
      const nav = page.getByRole("navigation", { name: "Main" });
      await expect(nav.getByRole("button")).toHaveText(tabs);
      // No Pricing or Help tab: the header leads to the designs
      await expect(nav.getByRole("link", { name: "Pricing" })).toHaveCount(0);
      await nav.getByRole("button", { name: "Wedding" }).click();
      await expect(nav.getByRole("link", { name: /Complete Wedding Set/ })).toHaveAttribute(
        "href",
        "/pricing#plan-grand",
      );
      await nav.getByRole("link", { name: /Wedding invitations/ }).click();
      await expect(page).toHaveURL(/\/invitations\/wedding$/);
    }
  });

  test("Start free opens the occasions, and the live invitation opens a sample", async ({
    page,
  }) => {
    await visit(page);
    const hero = page.locator("main section").first();
    await expect(hero.getByRole("link", { name: "Open a live invitation" })).toHaveAttribute(
      "href",
      "/sample",
    );
    await hero.getByRole("link", { name: "Start free" }).click();
    await expect(page).toHaveURL(/\/invitations$/);
  });

  test("the phone's steps say how it works, and any step can be chosen", async ({ page }) => {
    await visit(page);
    await expect(steps(page)).toHaveCount(6);
    await expect(currentStep(page)).toHaveAccessibleName(/Choose a design/);
    // Still mode: nothing moves on by itself
    await page.waitForTimeout(4000);
    await expect(currentStep(page)).toHaveAccessibleName(/Choose a design/);
    await steps(page).nth(4).click();
    await expect(currentStep(page)).toHaveAccessibleName(/Send on WhatsApp/);
    await expect(page.locator("[data-flow-live]")).toHaveAttribute("data-flow-step", "4");
  });

  test("the occasions lead to their designs", async ({ page }) => {
    await visit(page);
    const occasions = page.locator("#occasions");
    await expect(occasions.locator("[data-occasion]")).toHaveCount(12);
    await expect(occasions.locator('[data-occasion="wedding"]')).toContainText(/\d+ designs/);
    await occasions.locator('[data-occasion="sangeet"]').getByRole("link").click();
    await expect(page).toHaveURL(/\/invitations\/sangeet$/);
    await page.goBack();
    await page.locator("#occasions").getByRole("link", { name: "All occasions" }).click();
    await expect(page).toHaveURL(/\/invitations$/);
  });

  test("the wedding row opens a design's page or its live demo, and leads on", async ({ page }) => {
    await visit(page);
    const row = page.locator('[data-shelf="home-wedding"]');
    await row.scrollIntoViewIfNeeded();
    const first = row.locator("article").first();
    const id = (await first.getAttribute("data-design"))!;
    const name = (await first.locator("h3").first().textContent())!.trim();
    await expect(first.getByRole("link", { name: `Live demo: ${name}` })).toHaveAttribute(
      "href",
      new RegExp(`^/sample/${id}`),
    );
    await expect(
      row.getByRole("link", { name: /^View all \d+ designs: Wedding$/ }).first(),
    ).toHaveAttribute("href", "/invitations/wedding");
    await first.getByRole("link", { name: /Use this design/ }).click();
    await expect(page).toHaveURL(new RegExp(`/create/${id}\\?category=wedding`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
  });

  // Owner, 2026-10-24: what a family gets, in plain words, under the phone
  test("Why Shubh says what a family gets, and opens a live invitation", async ({ page }) => {
    await visit(page);
    const why = page.locator("#why");
    await expect(why.getByRole("heading", { level: 2 })).toHaveText(
      "Everything your invitation needs",
    );
    await expect(why.getByRole("heading", { level: 3 })).toHaveCount(11);
    for (const title of ["See it before you pay", "Make it free, pay later", "Know who's coming"]) {
      await expect(why.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(why.getByRole("link", { name: "Open a live invitation" })).toHaveAttribute(
      "href",
      "/sample",
    );
    expect(await noOverflow(page)).toBe(true);
  });

  test("a row for each main occasion, and See all designs", async ({ page }) => {
    await visit(page);
    for (const shelf of ["home-wedding", "home-engagement", "home-birthday", "home-anniversary"]) {
      await expect(page.locator(`[data-shelf="${shelf}"]`)).toHaveCount(1);
    }
    // No search on the home page: the menu and the occasions lead to the designs
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await page.locator("#designs").getByRole("link", { name: "See all designs" }).last().click();
    await expect(page).toHaveURL(/\/designs$/);
  });

  test("the Complete Wedding Set and We'll make it for you lead on", async ({ page }) => {
    await visit(page);
    await expect(page.getByRole("link", { name: "See what's included" })).toHaveAttribute(
      "href",
      "/pricing#plan-grand",
    );
    const make = page.getByRole("link", { name: "Send details on WhatsApp" });
    await expect(make).toHaveAttribute("href", "/help/whatsapp?for=make");
    await expect(make).toHaveAttribute("target", "_blank");
  });

  test("the skip link jumps to the main content", async ({ page }) => {
    await visit(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("the language menu lists every launch language, with English chosen and six ready", async ({
    page,
  }) => {
    await visit(page);
    if (isNarrow(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    await page.getByRole("button", { name: "Language: English" }).click();
    const menu = page.getByRole("menu");
    await expect(menu.getByRole("menuitemradio")).toHaveCount(10);
    await expect(menu.getByRole("menuitemradio", { name: "English" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    for (const name of [/हिन्दी/, /मराठी/, /ગુજરાતી/, /বাংলা/, /தமிழ்/]) {
      await expect(menu.getByRole("menuitemradio", { name })).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }
    await expect(menu.getByRole("menuitemradio", { name: /తెలుగు/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("the theme switch in the footer applies", async ({ page }) => {
    await visit(page);
    await page.getByRole("contentinfo").getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("FAQ answers open and close", async ({ page }) => {
    await visit(page);
    const question = page.getByRole("button", { name: "Do my guests need to install an app?" });
    await question.click();
    await expect(page.getByText("Guests tap the link in WhatsApp")).toBeVisible();
    await expect(question).toHaveAttribute("aria-expanded", "true");
    await question.click();
    await expect(question).toHaveAttribute("aria-expanded", "false");
  });

  test("every control is at least 44px tall", async ({ page }) => {
    await visit(page);
    const small = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          "header a, header button, main a, main button, main input, footer a",
        ),
      ]
        .filter((el) => el.offsetParent !== null && !el.closest(".sr-only, [aria-hidden=true]"))
        .map((el) => ({
          text: el.textContent || el.getAttribute("aria-label"),
          h: el.getBoundingClientRect().height,
        }))
        .filter(({ h }) => h < 44),
    );
    expect(small).toEqual([]);
  });

  test("the page uses a laptop's width", async ({ page }) => {
    test.skip(isNarrow(page), "a wide screen only");
    await visit(page);
    const width = await page.locator("header > div").evaluate((el) => el.clientWidth);
    expect(width).toBeGreaterThan(1300);
  });

  for (const path of ["/hi", "/ta"]) {
    test(`the home page reads well in its language, ${path}`, async ({ page }) => {
      await visit(page, path);
      expect(await noOverflow(page)).toBe(true);
      await expect(steps(page)).toHaveCount(6);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  }
});

test.describe("landing page motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the phone moves on to the next step by itself, and Pause holds it", async ({ page }) => {
    await visit(page);
    await page.locator("[data-flow-live]").scrollIntoViewIfNeeded();
    await expect(currentStep(page)).toHaveAccessibleName(/Add your details/, { timeout: 8000 });
    await page.getByRole("button", { name: "Pause" }).click();
    const held = await currentStep(page).textContent();
    await page.waitForTimeout(4500);
    await expect(currentStep(page)).toHaveText(held!);
    await page.getByRole("button", { name: "Play" }).click();
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  });
});

test("serves a link preview image", async ({ request }) => {
  const res = await request.get("/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
