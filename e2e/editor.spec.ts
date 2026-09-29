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
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you celebrating?");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await next(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Whose tradition should the card follow?",
      );
      await page.getByRole("radio", { name: /Marathi/ }).click();
      await expect(page.getByRole("heading", { name: "Family wording" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await next(page);
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
    await expect(page.getByRole("radio", { name: /Wedding/ })).toBeChecked();
    await next(page);
    await next(page);
    await page.getByRole("radio", { name: /^Rose Garden/ }).click();
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
    // The photo goes into the theme's own frame on a page after the names
    const onePhoto = page.getByRole("radio", { name: "One photo of you both" });
    await onePhoto.click();
    await expect(onePhoto).toBeChecked();
    await page.getByRole("radio", { name: /Raag Bhupali/ }).click();
    await next(page);

    await expect(page.getByText("Your invitation is ready")).toBeVisible();
    const summary = page.getByRole("region", { name: "Functions" });
    await expect(summary.getByText("Thu, 15 Oct 2026 · 6:30 pm")).toBeVisible();
    await expect(summary.getByText("Taj Falaknuma, Hyderabad")).toBeVisible();
    await expect(page.getByText(/Raag Bhupali/)).toBeVisible();
    // The live card carries the couple's names and the wedding's venue
    await page.getByRole("button", { name: "Card", exact: true }).click();
    const card = page.locator("[data-engine-state]");
    await expect(card.locator(".sr-only").getByText("Aditya and Priya")).toBeAttached();
    await expect(card.locator(".sr-only").getByText("Taj Falaknuma, Hyderabad")).toBeAttached();
    await expect(card.locator(".sr-only").getByText("Thursday, 15 October 2026")).toBeAttached();

    await page.reload();
    await expect(page.getByText("Your invitation is ready")).toBeVisible();
    await expect(page.getByRole("img", { name: "Photo 1" })).toBeVisible();

    await page.getByRole("button", { name: "Start a new invite" }).click();
    await page.getByRole("button", { name: "Clear and start again" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you celebrating?");
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you celebrating?");
  });

  test("a design chosen on the landing page starts the invite", async ({ page }) => {
    await page.goto("/create?quality=2d&template=kasavu");
    await expect(page.getByRole("radio", { name: /Kerala Kasavu/ })).toBeChecked();
  });

  test("an occasion from the home page sets up the functions, wording and designs", async ({
    page,
  }) => {
    await page.goto("/create?quality=2d&category=roka");
    // The occasion is chosen, so the host starts on the designs, the roka's first
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Pick the card your guests will open",
    );
    const designs = page.getByRole("radiogroup", { name: "Choose a design" }).getByRole("radio");
    await expect(designs.first()).toHaveAccessibleName(/Marigold Gate.*Suggested for roka/);
    await expect(designs.filter({ hasText: "Kerala Kasavu" })).not.toHaveAccessibleName(
      /Suggested/,
    );
    await next(page);
    await fillCouple(page);
    await next(page);

    await expect(page.getByRole("heading", { name: "Roka functions" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /Roka/ })).toBeChecked();
    // The wedding is one of the roka's rarer functions, folded until asked for
    await page.getByRole("button", { name: /^Show \d+ more functions$/ }).click();
    await expect(page.getByRole("checkbox", { name: /Wedding/ })).not.toBeChecked();
    // The card announces the roka in the occasion's own words (in a sheet on phones)
    if (page.viewportSize()!.width < 1024) {
      await page.getByRole("button", { name: "Preview" }).click();
    }
    await page.getByRole("button", { name: "Card", exact: true }).click();
    const card = page.locator("[data-engine-state]");
    await expect(
      card.locator(".sr-only").getByText("seek your blessings at their roka ceremony"),
    ).toBeAttached();
    if (page.viewportSize()!.width < 1024) await page.keyboard.press("Escape");

    // Switching the occasion keeps what was typed
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("radio", { name: /Engagement/ }).click();
    await expect(page.getByRole("region", { name: "What this sets up" })).toContainText(
      "Engagement",
    );
    await next(page);
    await next(page);
    await next(page);
    await expect(page.getByRole("textbox", { name: /First name/ })).toHaveValue("Aditya");
  });

  test("a tradition sets the symbol, invocation, ceremony names and family wording", async ({
    page,
  }) => {
    await page.goto("/create?quality=2d&region=TN");
    await next(page);
    // The visitor's own tradition comes first
    const traditions = page.getByRole("radiogroup", { name: "Traditions" }).getByRole("radio");
    await expect(traditions.first()).toHaveAccessibleName(/Tamil Hindu/);
    await traditions.first().click();
    await expect(page.getByRole("radio", { name: "Pillaiyar suzhi", exact: true })).toBeChecked();
    await expect(page.getByRole("radio", { name: /In its script/ })).toBeChecked();
    await expect(page.getByText("திருமணம்")).toBeVisible();

    const wide = page.viewportSize()!.width >= 1024;
    const card = page.locator("[data-engine-state] .sr-only");
    if (wide) await page.getByRole("button", { name: "Card", exact: true }).click();
    if (wide) await expect(card.getByText("ஸ்ரீ விநாயகர் துணை")).toBeAttached();
    await page.getByRole("radio", { name: /In English letters/ }).click();
    if (wide) await expect(card.getByText("Sri Vinayagar Thunai")).toBeAttached();
    await page.getByRole("radio", { name: /Leave it off/ }).click();
    if (wide) await expect(card.getByText("Sri Vinayagar Thunai")).toHaveCount(0);

    await page.getByRole("textbox", { name: /Hosted by/ }).fill("ஐயர் குடும்பத்தினர்");
    await page.reload();
    await expect(page.getByRole("textbox", { name: /Hosted by/ })).toHaveValue(
      "ஐயர் குடும்பத்தினர்",
    );
    await expect(page.getByRole("radio", { name: /Leave it off/ })).toBeChecked();

    // The tradition's designs lead the list
    await next(page);
    const designs = page.getByRole("radiogroup", { name: "Choose a design" }).getByRole("radio");
    await expect(designs.first()).toHaveAccessibleName(/Gopuram Pon/);
  });

  test("the phone follows the page being edited, in the host's own lettering", async ({ page }) => {
    await page.goto(
      "/create?quality=2d&category=wedding&tradition=gujarati&suite=shahi-savari&template=bandhani",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who is the couple?");
    const wide = page.viewportSize()!.width >= 1024;
    const showPhone = async () => {
      if (!wide) await page.getByRole("button", { name: "Preview" }).click();
    };
    const hidePhone = async () => {
      if (!wide) await page.keyboard.press("Escape");
    };
    await page.getByRole("textbox", { name: /First name/ }).fill("રાધા");
    await page.getByRole("textbox", { name: /Second name/ }).fill("અર્જુન");
    // Untyped lines preview in the card's language, never the design's English samples
    await expect(page.getByRole("textbox", { name: /Families/ })).toHaveValue(
      "પટેલ પરિવાર અને શાહ પરિવાર",
    );

    // Lettering: a Gujarati card offers only fonts that write Gujarati
    const names = page.getByRole("radiogroup", { name: "Names", exact: true });
    await expect(names.getByRole("radio", { name: /Great Vibes/ })).toHaveCount(0);
    await names.getByRole("radio", { name: /Mogra/ }).click();
    await page.getByRole("button", { name: "Bold", exact: true }).click();
    await expect(page.getByRole("button", { name: "Bold", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(await axe(page).include("#lettering-heading").analyze()).toMatchObject({
      violations: [],
    });

    await showPhone();
    const phone = page.getByRole("img", { name: /The Cover page, as guests see it/ });
    await expect(phone).toBeVisible();
    const name = page.locator('[data-page="cover"]').getByText("રાધા");
    await expect(name).toHaveCSS("font-family", /Mogra/);
    await expect(name).toHaveCSS("font-weight", "700");
    await hidePhone();

    await next(page);
    await page.getByRole("checkbox", { name: /Sangeet/ }).check();
    await page.getByRole("checkbox", { name: /Sangeet/ }).focus();
    await showPhone();
    await expect(page.getByRole("img", { name: /The Sangeet page/ })).toBeVisible();
    await expect(page.locator('[data-page="fn-sangeet"]').getByText("સંગીત સંધ્યા")).toBeVisible();
    // Every page is a tap away
    await page.getByRole("button", { name: "Show the Cover page" }).click();
    await expect(page.getByRole("img", { name: /The Cover page/ })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
  });

  test("a save-the-date asks only for the date and the city", async ({ page }) => {
    await page.goto("/create?quality=2d&category=save-the-date");
    await next(page);
    await fillCouple(page);
    await next(page);
    await expect(page.getByRole("combobox", { name: /Starts at/ })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "More functions" })).toHaveCount(0);
    await page.getByRole("button", { name: /^Date/ }).click();
    await page.getByRole("button", { name: /next month/i }).click();
    await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
    await page.getByRole("textbox", { name: /City or venue/ }).fill("Udaipur");
    await next(page);
    await expect(page.getByRole("heading", { name: "Make it yours" })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
  });

  test("the button bar fits common phone widths on every step", async ({ browser }, info) => {
    test.skip(info.project.name !== "phone-320", "phones only");
    for (const width of [360, 375, 414]) {
      // A fresh phone each time, so no saved draft or step carries over
      const context = await browser.newContext({
        viewport: { width, height: 760 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.clock.setFixedTime(new Date("2026-09-26T10:00:00"));
      await page.goto("/create?quality=2d");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you celebrating?");
      expect(await noOverflow(page)).toBe(true);
      await next(page); // tradition
      await next(page); // design: Back, Preview and Continue share the bar
      await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      await next(page);
      await fillCouple(page);
      await next(page);
      await fillWedding(page);
      await next(page);
      expect(await noOverflow(page)).toBe(true);
      await next(page);
      await expect(page.getByText("Your invitation is ready")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      await context.close();
    }
  });
});
