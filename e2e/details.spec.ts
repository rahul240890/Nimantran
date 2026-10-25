import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { firstName, openPart } from "./invite-helpers";

/* A design's own page (update 4): the design on top, one short form below. */

const DESIGN = "/create/rajwada-bagh?category=wedding";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

/** Opens a design's page on a clean device and waits until the form takes typing. */
async function open(page: Page, path = DESIGN) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto(path);
  await expect(page.getByRole("textbox", { name: /First name/ })).toBeVisible({
    timeout: 30_000,
  });
}

async function fillNames(page: Page) {
  await openPart(page, "Names");
  const first = page.getByRole("textbox", { name: /First name/ });
  const second = page.getByRole("textbox", { name: /Second name/ });
  // Typing that lands before the page has hydrated is lost, so try again until both stay
  await expect(async () => {
    await first.fill("Aditya");
    await second.fill("Priya");
    await expect(first).toHaveValue("Aditya", { timeout: 3_000 });
    await expect(second).toHaveValue("Priya", { timeout: 3_000 });
  }).toPass({ timeout: 30_000 });
}

async function fillWedding(page: Page) {
  await openPart(page, "When and where");
  const wedding = page.locator('[data-function="wedding"]');
  await wedding.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
  await wedding.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: "6:30 pm" }).click();
  await wedding.getByRole("textbox", { name: /^Venue/ }).fill("Taj Falaknuma, Hyderabad");
}

test.beforeEach(async ({ page }) => {
  // A fixed "today", so the calendar and the dates it produces never drift
  await page.clock.setFixedTime(new Date("2026-09-26T10:00:00"));
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`fits the screen and passes an accessibility check, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
}

test.describe("a design's page", () => {
  test.use({ reducedMotion: "reduce" });

  test("tapping a design in the gallery opens its page", async ({ page }) => {
    await page.goto("/invitations/wedding/gujarati");
    const card = page.locator("[data-design]").first();
    const id = await card.getAttribute("data-design");
    await card.getByRole("link", { name: /Use this design/ }).click();
    await expect(page).toHaveURL(
      new RegExp(`/create/${id}\\?category=wedding&kind=gujarati&tradition=gujarati$`),
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // A Gujarati wedding is written in Gujarati from the start
    await expect(page.getByRole("radio", { name: /ગુજરાતી/ })).toBeChecked({ timeout: 30_000 });
  });

  test("the names appear on the design, and See my invitation opens its preview", async ({
    page,
  }) => {
    await open(page);
    await expect(page.getByRole("heading", { level: 1, name: "Rajwada Bagh" })).toBeVisible();
    await fillNames(page);
    await expect(
      page.getByRole("region", { name: "Rajwada Bagh" }).getByText("Aditya").first(),
    ).toBeVisible();

    // Nothing more filled in: the wedding's date, time and venue are asked for
    await page.getByRole("button", { name: "See my invitation" }).click();
    const problems = page.getByRole("alert").filter({ hasText: /need your attention/ });
    await expect(problems).toHaveText("3 things need your attention");
    await expect(page).toHaveURL(/\/create\/rajwada-bagh/);

    await fillWedding(page);
    await expect(problems).toHaveCount(0);
    await page.getByRole("button", { name: "See my invitation" }).click();
    await expect(page).toHaveURL(/\/create$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Here's what your guests will see",
      { timeout: 15_000 },
    );
    await expect(page.getByText("Your invitation is ready")).toBeVisible();

    // Back goes to the design's page, with everything as it was, not to the steps
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page).toHaveURL(/\/create\/rajwada-bagh\?category=wedding$/);
    await expect(firstName(page)).toHaveValue("Aditya", { timeout: 30_000 });
    await openPart(page, "When and where");
    await expect(
      page.locator('[data-function="wedding"]').getByRole("textbox", { name: /^Venue/ }),
    ).toHaveValue("Taj Falaknuma, Hyderabad");
  });

  test("the events are ticked first, then each one's date and place", async ({ page }) => {
    await open(page);
    await fillNames(page);
    await fillWedding(page);
    const events = page.getByRole("group", { name: "Your events" });
    // The wedding is on the card already, and stays
    await expect(events.getByRole("button", { name: "Wedding" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(events.getByRole("button", { name: "Wedding" })).toBeDisabled();
    // Several events in a row, then their details in the order they happen
    await events.getByRole("button", { name: "Haldi" }).click();
    await events.getByRole("button", { name: "Reception" }).click();
    await expect(events.getByRole("button", { name: "Haldi" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("[data-function]")).toHaveCount(3);
    expect(
      await page
        .locator("[data-function]")
        .evaluateAll((items) => items.map((item) => item.getAttribute("data-function"))),
    ).toEqual(["haldi", "wedding", "reception"]);
    const haldi = page.locator('[data-function="haldi"]');
    await haldi.getByRole("button", { name: "Same as Wedding" }).click();
    await expect(haldi.getByRole("textbox", { name: /^Venue/ })).toHaveValue(
      "Taj Falaknuma, Hyderabad",
    );
    // Untick one and it goes
    await events.getByRole("button", { name: "Reception" }).click();
    await expect(page.locator('[data-function="reception"]')).toHaveCount(0);
    // The rarer events wait behind More events
    await events.getByRole("button", { name: "More events" }).click();
    await expect(events.getByRole("button", { name: "More events" })).toHaveCount(0);
  });

  test("every part of the editor is on the page, quietly, one part open at a time", async ({
    page,
  }) => {
    await open(page);
    // Nothing nested: no way off to another editor, and no helper words
    await expect(page.getByRole("button", { name: "More options" })).toHaveCount(0);
    await expect(page.getByText("Type in any script")).toHaveCount(0);
    // Every part folds to its title; a new invite opens on the names
    const titles = [
      "Names",
      "When and where",
      "Family names",
      "Your photos",
      "Card words",
      "Music & replies",
      "Opening gate (cover screen)",
    ];
    const folds = page.locator('details[name="editor-parts"]');
    await expect(folds).toHaveCount(titles.length);
    for (const [index, title] of titles.entries()) {
      await expect(folds.nth(index).locator(":scope > summary")).toContainText(title);
    }
    const opened = page.locator('details[name="editor-parts"][open]');
    await expect(opened).toHaveCount(1);
    await expect(opened.locator(":scope > summary")).toContainText("Names");

    // Opening one part closes the one before
    const parts: [string, RegExp][] = [
      ["Family names", /Parents' names/],
      ["Card words", /^Blessing/],
    ];
    for (const [title, field] of parts) {
      await openPart(page, title);
      await expect(opened).toHaveCount(1);
      await expect(page.getByRole("textbox", { name: field }).first()).toBeVisible();
    }
    await openPart(page, "Your photos");
    await expect(page.getByRole("button", { name: /Add photos/ }).first()).toBeVisible();
    await openPart(page, "Music & replies");
    await expect(page.getByRole("radio", { name: /Your own music/ })).toBeVisible();
    // Every raga plays on its own button and is chosen by its name
    await expect(page.getByRole("button", { name: "Listen to Raag Yaman" })).toBeVisible();
    await page.getByRole("radio", { name: /Raag Yaman/ }).click();
    await expect(page.getByRole("radio", { name: /Raag Yaman/ })).toBeChecked();
    // How it opens is the last part
    await openPart(page, "Opening gate (cover screen)");
    await expect(
      page.getByTestId("gate-summary").getByRole("button", { name: "Change opening gate" }),
    ).toBeVisible();
    // The phone above turns to the gate guests open first
    await expect(page.getByRole("img", { name: "The Gate page, as guests see it" })).toBeVisible();
    await expect(opened).toHaveCount(1);
    // Read from the top: a control scrolled under the sticky header counts as too small
    await page.evaluate(() => window.scrollTo(0, 0));
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Folded, the names say what's in them
    await openPart(page, "Names");
    await fillNames(page);
    await openPart(page, "When and where");
    await expect(folds.first().locator(":scope > summary")).toContainText("Aditya & Priya");

    // Other designs for the wedding, each opening its own page, never this one again
    const more = page.locator("[data-suggested-designs]");
    await expect(more.getByRole("heading", { name: "More wedding designs" })).toBeVisible();
    const links = more.getByRole("link");
    expect(await links.count()).toBeGreaterThan(3);
    await expect(more.locator('a[href^="/create/rajwada-bagh"]')).toHaveCount(0);
    await expect(links.first()).toHaveAttribute("href", /^\/create\/[a-z0-9-]+\?category=wedding/);
  });

  test("a demo with sample names, a preview with the family's own, and we'll make it for anyone short of time", async ({
    page,
  }) => {
    await open(page);
    await expect(page.getByRole("link", { name: "Watch demo" })).toHaveAttribute(
      "href",
      "/sample/rajwada-bagh?occasion=wedding",
    );
    // The preview is the invitation as it stands, with the names typed
    await fillNames(page);
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    const preview = page.getByRole("dialog", { name: "Your invitation" });
    await expect(preview.getByRole("img", { name: /, as guests see it$/ })).toContainText("Aditya");
    expect((await axe(page).include("[role=dialog]").analyze()).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(preview).toHaveCount(0);
    const make = page.getByRole("link", { name: /We'll make it for you/ });
    await expect(make).toHaveAttribute("href", "/help/whatsapp?for=make&design=rajwada-bagh");
    await expect(make).toHaveAttribute("target", "_blank");
  });

  test("every control is at least 44px tall", async ({ page }) => {
    await open(page);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("header a, header button, main a, main button")]
        // Folded parts are out of sight until opened
        .filter(
          (el) =>
            el.offsetParent !== null &&
            !el.closest(".sr-only, [aria-hidden=true], details:not([open]) > :not(summary)"),
        )
        .map((el) => ({
          text: el.textContent || el.getAttribute("aria-label"),
          h: el.getBoundingClientRect().height,
        }))
        .filter(({ h }) => h < 44),
    );
    expect(small).toEqual([]);
  });

  test("a design that isn't in the gallery has no page", async ({ request }) => {
    expect((await request.get("/create/no-such-design")).status()).toBe(404);
  });
});
