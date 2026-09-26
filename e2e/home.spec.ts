import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

/** Opens a page and waits until React has taken over, so taps and typing are handled. */
async function visit(page: Page, path = "/") {
  await page.goto(path);
  await expect(page.locator("[data-tier]")).toHaveAttribute("style", /--open/);
}

const isPhone = (page: Page) => page.viewportSize()!.width < 1024;

const openAmount = (page: Page) =>
  page
    .locator("[data-tier]")
    .evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--open") || 0));

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`landing page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("has no horizontal scroll, with the card closed or open", async ({ page }) => {
      await visit(page);
      expect(await noOverflow(page)).toBe(true);
      await page.getByRole("button", { name: "Open the sample invitation" }).click();
      await expect(page.getByRole("button", { pressed: true })).toBeVisible();
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

  test("card toggles with the keyboard", async ({ page }) => {
    await visit(page);
    const card = page.getByRole("button", { name: "Open the sample invitation" });
    await card.focus();
    await page.keyboard.press("Enter");
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Space");
    await expect(card).toHaveAttribute("aria-pressed", "false");
  });

  test("still mode never opens the card on scroll", async ({ page }) => {
    await visit(page);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
    await page.waitForTimeout(300);
    expect(await openAmount(page)).toBe(0);
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

  test("the language menu lists every launch language, with English chosen", async ({ page }) => {
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
    await expect(menu.getByRole("menuitemradio", { name: /हिन्दी/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("the theme switch in the header applies", async ({ page }) => {
    await visit(page);
    if (isPhone(page)) await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("radio", { name: "Dark" }).click();
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

  test("the designs row pages with its arrows", async ({ page }) => {
    await visit(page);
    const previous = page.getByRole("button", { name: "Previous designs" });
    const next = page.getByRole("button", { name: "Next designs" });
    await next.scrollIntoViewIfNeeded();
    await expect(previous).toBeDisabled();
    await next.click();
    await expect(previous).toBeEnabled();
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
});

test.describe("waitlist", () => {
  test.use({ reducedMotion: "reduce" });

  test("shows inline errors, focuses the first one, then clears them as they are fixed", async ({
    page,
  }) => {
    await visit(page, "/#waitlist");
    const form = page.locator("#waitlist form");
    await form.getByRole("button", { name: "Join the waitlist" }).click();

    const name = form.getByRole("textbox", { name: /Your name/ });
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(form.getByText("Enter your name.")).toBeVisible();
    await expect(form.getByText("Choose what you are celebrating.")).toBeVisible();

    await name.fill("Meera Sharma");
    await expect(form.getByText("Enter your name.")).toBeHidden();

    await form.getByRole("textbox", { name: /Email/ }).fill("meera@");
    await form.getByRole("textbox", { name: /WhatsApp/ }).fill("12345");
    await form.getByRole("button", { name: "Join the waitlist" }).click();
    await expect(form.getByText("Enter an email like name@example.com.")).toBeVisible();
    await expect(form.getByText("Enter a phone number with 10 to 15 digits.")).toBeVisible();
  });

  test("keeps what was typed across a reload", async ({ page }) => {
    await visit(page, "/#waitlist");
    const form = page.locator("#waitlist form");
    await form.getByRole("textbox", { name: /Your name/ }).fill("Meera Sharma");
    await form.getByRole("textbox", { name: /Email/ }).fill("meera@example.com");
    await page.reload();
    await expect(page.locator("[data-tier]")).toHaveAttribute("style", /--open/);
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
    await form.getByRole("button", { name: "Join the waitlist" }).click();

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

  test("scrolling opens the invitation and scrolling back closes it", async ({ page }) => {
    await visit(page);
    expect(await openAmount(page)).toBe(0);
    const card = page.getByRole("button", { name: "Open the sample invitation" });

    // Scroll until the card's track has passed, then wait for the doors to settle
    await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>("[data-hero-track]")!;
      window.scrollTo(0, hero.offsetTop + hero.offsetHeight - window.innerHeight);
    });
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => openAmount(page)).toBe(1);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(card).toHaveAttribute("aria-pressed", "false");
    await expect.poll(() => openAmount(page)).toBe(0);
  });

  test("tapping opens the card without scrolling", async ({ page }) => {
    await visit(page);
    const card = page.getByRole("button", { name: "Open the sample invitation" });
    await card.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await card.click();
    await expect(card).toHaveAttribute("aria-pressed", "true");
    // Only a small scroll to reveal the card happened, so the tap stays in control
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(96);
    await expect.poll(() => openAmount(page)).toBe(1);
  });
});

test("serves a link preview image", async ({ request }) => {
  const res = await request.get("/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
