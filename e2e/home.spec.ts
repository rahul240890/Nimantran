import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

/** Opens a page and waits until React has taken over, so taps and typing are handled. */
async function visit(page: Page, path = "/") {
  await page.goto(path);
  await expect(page.locator("[data-deck-live]")).toHaveAttribute("data-deck-live", "true");
}

const isPhone = (page: Page) => page.viewportSize()!.width < 1024;

const deckTheme = (page: Page) =>
  page.getByRole("list", { name: "Painted invitation themes" }).getByRole("button", {
    pressed: true,
  });

/** Brings a theme to the front: its dot when it is in the row on wider screens, else the arrows. */
async function showTheme(page: Page, name: string) {
  const dot = page.getByRole("button", { name: `Show ${name}` });
  if (page.viewportSize()!.width >= 640 && (await dot.count())) {
    await dot.click();
    return;
  }
  for (let turns = 0; turns < 30; turns++) {
    if ((await deckTheme(page).getAttribute("aria-label")) === `Show ${name}`) return;
    await page.getByRole("button", { name: "Next theme" }).click();
  }
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`landing page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("has no horizontal scroll, whichever theme leads the deck", async ({ page }) => {
      await visit(page);
      expect(await noOverflow(page)).toBe(true);
      await showTheme(page, "Kayal");
      await expect(deckTheme(page)).toHaveAccessibleName("Show Kayal");
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
      if (isPhone(page)) {
        await page.getByRole("button", { name: "Open menu" }).click();
        const dialog = page.getByRole("dialog", { name: "Menu" });
        await expect(dialog).toBeVisible();
        expect(await noOverflow(page)).toBe(true);
        expect((await axe(page).include('[role="dialog"]').analyze()).violations).toEqual([]);
      } else {
        await page.getByRole("button", { name: "Language: English" }).click();
        await expect(page.getByRole("menu")).toBeVisible();
        expect((await axe(page).include('[role="menu"]').analyze()).violations).toEqual([]);
      }
    });
  });
}

test.describe("landing page", () => {
  test.use({ reducedMotion: "reduce" });

  test("the theme dots bring a theme to the front", async ({ page }) => {
    await visit(page);
    await showTheme(page, "Rajbari");
    await expect(page.getByRole("img", { name: /Rajbari$/ })).toBeVisible();
  });

  test("the arrows step through the themes and wrap around", async ({ page }) => {
    await visit(page);
    const first = await deckTheme(page).getAttribute("aria-label");
    await page.getByRole("button", { name: "Previous theme" }).click();
    await expect(deckTheme(page)).not.toHaveAttribute("aria-label", first!);
    await page.getByRole("button", { name: "Next theme" }).click();
    await expect(deckTheme(page)).toHaveAttribute("aria-label", first!);
  });

  test("the theme dots stay on one row", async ({ page }) => {
    await visit(page);
    const tops = await page
      .getByRole("list", { name: "Painted invitation themes" })
      .getByRole("listitem")
      .evaluateAll((items) => new Set(items.map((item) => item.getBoundingClientRect().top)).size);
    expect(tops).toBe(1);
  });

  test("at most seven theme dots show, and the front card sits in the middle", async ({ page }) => {
    await visit(page);
    const dots = page
      .getByRole("list", { name: "Painted invitation themes" })
      .getByRole("listitem");
    await expect(dots).toHaveCount(7);
    const front = page.locator("[data-deck-live] [data-front]");
    const box = (await front.boundingBox())!;
    const width = page.viewportSize()!.width;
    if (width < 1024) expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(4);
  });

  test("still mode never turns the deck by itself", async ({ page }) => {
    await visit(page);
    const first = await deckTheme(page).getAttribute("aria-label");
    await page.waitForTimeout(5500);
    await expect(deckTheme(page)).toHaveAttribute("aria-label", first!);
  });

  test("searching from the home page opens the gallery with the results", async ({ page }) => {
    await visit(page);
    const search = page.getByRole("searchbox", { name: "Search occasions and designs" });
    await search.fill("bengali");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/invitations\?q=bengali$/);
    await expect(page.locator('[data-kind="bengali"]')).toBeVisible();
  });

  test("header links move to their section and highlight it", async ({ page }) => {
    await visit(page);
    if (isPhone(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("dialog").getByRole("link", { name: "Pricing" }).click();
      await expect(page.getByRole("dialog")).toBeHidden();
      await expect(page.locator("#pricing")).toBeFocused();
    } else {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Pricing" })
        .click();
      await expect(page).toHaveURL(/#pricing$/);
      await expect(
        page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Pricing" }),
      ).toHaveAttribute("aria-current", "true");
    }
    await expect(page.getByRole("heading", { name: /Free to start/ })).toBeInViewport();
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

  test("the language menu lists every launch language, with English chosen and Hindi ready", async ({
    page,
  }) => {
    await visit(page);
    if (isPhone(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    await page.getByRole("button", { name: "Language: English" }).click();
    const menu = page.getByRole("menu");
    await expect(menu.getByRole("menuitemradio")).toHaveCount(10);
    await expect(menu.getByRole("menuitemradio", { name: "English" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(menu.getByRole("menuitemradio", { name: /हिन्दी/ })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(menu.getByRole("menuitemradio", { name: /मराठी/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("the theme switch in the header applies", async ({ page }) => {
    await visit(page);
    if (isPhone(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("radio", { name: "Dark" }).click();
    } else {
      await page.getByRole("button", { name: /^Colour theme/ }).click();
      await page.getByRole("menuitemradio", { name: "Dark" }).click();
    }
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

  test("the design rows preview a design and lead to View all", async ({ page }) => {
    await visit(page);
    const row = page.locator('[data-shelf="home-photos-none"]');
    const first = row.locator("article").first();
    const name = (await first.locator("h3").first().textContent())!.trim();
    await first.getByRole("button", { name: `Preview ${name}` }).click();
    await expect(page.getByRole("dialog", { name })).toBeVisible();
    await page.keyboard.press("Escape");
    await row
      .getByRole("link", { name: /^View all \d+ designs: Illustrated invitations$/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/designs\?photos=none$/);
  });

  test("a tradition and a kind of invitation open their designs", async ({ page }) => {
    await visit(page);
    await page.locator('#templates [data-kind="gujarati"]').getByRole("link").click();
    await expect(page).toHaveURL(/\/designs\?tradition=gujarati$/);
    await page.goBack();
    await page.locator('[data-kind-banner="scene"]').getByRole("link").click();
    await expect(page).toHaveURL(/\/designs\?format=scene$/);
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

  for (const path of ["/", "/hi"]) {
    test(`the plan cards keep their badges inside, ${path}`, async ({ page }) => {
      await page.goto(path);
      const outside = await page.locator("#pricing").evaluate((section) =>
        [...section.querySelectorAll("h3")].flatMap((heading) => {
          const card = heading.closest("[class*='rounded']")!.getBoundingClientRect();
          return [...heading.parentElement!.children]
            .map((el) => el.getBoundingClientRect())
            .filter((box) => box.right > card.right || box.left < card.left)
            .map(() => heading.textContent);
        }),
      );
      expect(outside).toEqual([]);
    });
  }
});

test.describe("waitlist", () => {
  test.use({ reducedMotion: "reduce" });

  test("shows inline errors, focuses the first one, then clears them as they are fixed", async ({
    page,
  }) => {
    await visit(page, "/#waitlist");
    const form = page.locator("#waitlist form");
    await form.getByRole("button", { name: "Keep me posted" }).click();

    const name = form.getByRole("textbox", { name: /Your name/ });
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(form.getByText("Enter your name.")).toBeVisible();
    await expect(form.getByText("Choose what you are celebrating.")).toBeVisible();

    await name.fill("Meera Sharma");
    await expect(form.getByText("Enter your name.")).toBeHidden();

    await form.getByRole("textbox", { name: /Email/ }).fill("meera@");
    await form.getByRole("textbox", { name: /WhatsApp/ }).fill("12345");
    await form.getByRole("button", { name: "Keep me posted" }).click();
    await expect(form.getByText("Enter an email like name@example.com.")).toBeVisible();
    await expect(form.getByText("Enter a phone number with 10 to 15 digits.")).toBeVisible();
  });

  test("keeps what was typed across a reload", async ({ page }) => {
    await visit(page, "/#waitlist");
    const form = page.locator("#waitlist form");
    await form.getByRole("textbox", { name: /Your name/ }).fill("Meera Sharma");
    await form.getByRole("textbox", { name: /Email/ }).fill("meera@example.com");
    await page.reload();
    await expect(page.locator("[data-deck-live]")).toHaveAttribute("data-deck-live", "true");
    await expect(form.getByRole("textbox", { name: /Your name/ })).toHaveValue("Meera Sharma");
    await expect(form.getByRole("textbox", { name: /Email/ })).toHaveValue("meera@example.com");
  });

  test("joins with valid details and shows a thank-you", async ({ page }) => {
    await visit(page, "/#waitlist");
    const form = page.locator("#waitlist form");
    await form.getByRole("textbox", { name: /Your name/ }).fill("Meera Sharma");
    await form.getByRole("textbox", { name: /Email/ }).fill("meera@example.com");
    await form.getByRole("textbox", { name: /WhatsApp/ }).fill("+91 98765 43210");
    await form.getByRole("combobox", { name: /What are you celebrating/ }).click();
    await page.getByRole("option", { name: "A wedding" }).click();
    await form.getByRole("button", { name: "Keep me posted" }).click();

    const thanks = page.getByRole("heading", { name: "You're on the list, Meera" });
    await expect(thanks).toBeVisible();
    await expect(thanks).toBeFocused();
    expect((await axe(page).include("#waitlist").analyze()).violations).toEqual([]);

    // The draft is cleared once someone has joined
    await page.reload();
    await expect(
      page.locator("#waitlist form").getByRole("textbox", { name: /Your name/ }),
    ).toHaveValue("");
  });
});

test.describe("landing page motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the deck turns to the next theme by itself", async ({ page }) => {
    await visit(page);
    const first = await deckTheme(page).getAttribute("aria-label");
    await expect(deckTheme(page)).not.toHaveAttribute("aria-label", first!, { timeout: 8000 });
  });
});

test("serves a link preview image", async ({ request }) => {
  const res = await request.get("/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
