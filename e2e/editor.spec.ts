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

/** Fills each of the design's photo frames through its own upload field. */
async function addDesignPhotos(page: Page) {
  const add = page.getByRole("button", { name: /^Add: / });
  const count = await add.count();
  for (let i = count; i > 0; i--) {
    const chooser = page.waitForEvent("filechooser");
    await add.first().click();
    await (await chooser).setFiles({ name: "us.png", mimeType: "image/png", buffer: PNG });
    await expect(add).toHaveCount(i - 1);
  }
}

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
  // The dress code is one of the details folded away until asked for
  await page.getByRole("button", { name: "More details" }).click();
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
      await expect(page.getByRole("heading", { name: "Ceremony names" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await next(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Pick the card your guests will open",
      );
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await next(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Which language is your card in?",
      );
      // A Marathi tradition suggests a Marathi card; any language can be chosen
      const language = page.getByRole("radiogroup", { name: "Card language" });
      await expect(language.getByRole("radio", { name: /^मराठी/ })).toBeChecked();
      await language.getByRole("radio", { name: /^English/ }).click();
      await expect(language.getByRole("radio", { name: /^English/ })).toBeChecked();
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
      // The design's photo frames are asked for, apart from any other photos
      await next(page);
      await expect(page.getByText(/things? needs? your attention/)).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
      await addDesignPhotos(page);

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
    await next(page); // language

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

    // The theme's own frame has its own upload field; other photos go below it
    await addDesignPhotos(page);
    await expect(page.getByRole("button", { name: /^Change: / }).first()).toBeVisible();
    await page.getByRole("region", { name: "More photos" });
    await page
      .getByRole("region", { name: "More photos" })
      .locator('input[type="file"]')
      .setInputFiles({ name: "more.png", mimeType: "image/png", buffer: PNG });
    await expect(page.getByRole("img", { name: "Photo 1" })).toBeVisible();
    await page.getByRole("radio", { name: /Raag Bhupali/ }).click();
    await next(page);

    await expect(page.getByText("Your invitation is ready")).toBeVisible();
    const summary = page.getByRole("region", { name: "Functions" });
    await expect(summary.getByText("Thu, 15 Oct 2026 · 6:30 pm")).toBeVisible();
    await expect(summary.getByText("Taj Falaknuma, Hyderabad")).toBeVisible();
    await expect(page.getByText(/Raag Bhupali/)).toBeVisible();
    // The design itself carries the couple's names and the wedding's date and venue
    const phone = page.getByRole("img", { name: /, as guests see it$/ });
    await expect(phone).toContainText("Aditya");
    await page.getByRole("button", { name: "Show the Wedding page" }).click();
    await expect(phone).toContainText("Taj Falaknuma, Hyderabad");
    await expect(phone).toContainText("15 October 2026");
    // The editor shows only the design, never a stand-in card
    await expect(page.getByRole("button", { name: "Card", exact: true })).toHaveCount(0);

    await page.reload();
    await expect(page.getByText("Your invitation is ready")).toBeVisible();

    await page.getByRole("button", { name: "Start a new invite" }).click();
    await page.getByRole("button", { name: "Clear and start again" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you celebrating?");
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you celebrating?");
  });

  test("the details are one page whose parts fold to what's in them", async ({ page }) => {
    await page.goto("/create?quality=2d");
    for (let i = 0; i < 4; i++) await next(page);
    const parts = page.getByRole("group", { name: "Your details, in three parts" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who is the couple?");
    await expect(parts.getByRole("button", { name: /^Photos & music: / })).toBeVisible();

    await fillCouple(page);
    await next(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "When and where is everything?",
    );
    const couple = parts.getByRole("button", { name: "Couple: Aditya & Priya, done. Open" });
    await expect(couple).toBeVisible();
    await expect(parts.getByRole("button", { name: /^Functions: / })).toHaveCount(0);

    // Any part opens with one tap, without walking through the others
    await parts.getByRole("button", { name: /^Photos & music: / }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Make it yours");
    await expect(parts.getByRole("button", { name: /^Functions: .*needs a look/ })).toBeVisible();
    await parts.getByRole("button", { name: /^Couple: / }).click();
    await expect(page.getByRole("textbox", { name: /First name/ })).toHaveValue("Aditya");
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
    // Only the roka's own designs are offered, not a Kerala wedding card
    await expect(designs.first()).toHaveAccessibleName(/Marigold Gate/);
    await expect(designs.filter({ hasText: "Kerala Kasavu" })).toHaveCount(0);
    await next(page);
    await next(page); // language
    await fillCouple(page);
    await next(page);

    await expect(page.getByRole("heading", { name: "Roka functions" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /Roka/ })).toBeChecked();
    // The wedding is one of the roka's rarer functions, folded until asked for
    await page.getByRole("button", { name: /^Show \d+ more functions$/ }).click();
    await expect(page.getByRole("checkbox", { name: /Wedding/ })).not.toBeChecked();
    // The design announces the roka in the occasion's own words (in a sheet on phones)
    if (page.viewportSize()!.width < 1024) {
      await page.getByRole("button", { name: "Preview", exact: true }).click();
    }
    await page.getByRole("button", { name: "Show the Family page" }).last().click();
    await expect(page.getByRole("img", { name: /, as guests see it$/ }).last()).toContainText(
      "seek your blessings at their roka ceremony",
    );
    if (page.viewportSize()!.width < 1024) await page.keyboard.press("Escape");

    // Switching the occasion keeps what was typed
    for (let i = 0; i < 5; i++) await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("radio", { name: /Engagement/ }).click();
    await expect(page.getByRole("region", { name: "What this sets up" })).toContainText(
      "Engagement",
    );
    for (let i = 0; i < 4; i++) await next(page);
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
    const card = page.getByRole("img", { name: /, as guests see it$/ });
    if (wide) await expect(card).toContainText("ஸ்ரீ விநாயகர் துணை");
    await page.getByRole("radio", { name: /In English letters/ }).click();
    if (wide) await expect(card).toContainText("Sri Vinayagar Thunai");
    await page.getByRole("radio", { name: /Leave it off/ }).click();
    if (wide) await expect(card).not.toContainText("Sri Vinayagar Thunai");

    await page.reload();
    await expect(page.getByRole("radio", { name: /Leave it off/ })).toBeChecked();

    // The tradition's designs lead the list
    await next(page);
    const designs = page.getByRole("radiogroup", { name: "Choose a design" }).getByRole("radio");
    await expect(designs.first()).toHaveAccessibleName(/Gopuram Pon/);
  });

  test("the family section keeps parents, the tradition's hosts line and whom to call", async ({
    page,
  }) => {
    await page.goto(
      "/create?quality=2d&category=wedding&tradition=tamil&suite=kayal&template=gopuram",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Which language is your card in?",
    );
    await next(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who is the couple?");
    const arjun = page.getByRole("group", { name: "Arjun's family" });
    // Typing or a click that lands before the editor has hydrated is lost, so try again
    await expect(async () => {
      await page.getByRole("textbox", { name: /First name/ }).fill("Arjun");
      if (!(await arjun.isVisible())) {
        await page.locator("summary", { hasText: "Add family details" }).click();
      }
      await expect(arjun).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await arjun.getByRole("radio", { name: "Son of" }).click();
    await arjun.getByRole("textbox", { name: /Parents' names/ }).fill("Smt. Lakshmi & Shri Raman");
    // The tradition's own heading sits beside the hosts line
    await page.getByRole("textbox", { name: /Hosted by/ }).fill("ஐயர் குடும்பத்தினர்");
    await page.getByRole("button", { name: "Add a number" }).click();
    await page.getByRole("textbox", { name: "Phone" }).fill("98765 43210");
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    await page.reload();
    // Filled in, it opens by itself
    const family = page.getByRole("group", { name: "Arjun's family" });
    await expect(family.getByRole("textbox", { name: /Parents' names/ })).toHaveValue(
      "Smt. Lakshmi & Shri Raman",
    );
    await expect(family.getByRole("radio", { name: "Son of" })).toBeChecked();
    await expect(page.getByRole("textbox", { name: /Hosted by/ })).toHaveValue(
      "ஐயர் குடும்பத்தினர்",
    );
    await expect(page.getByRole("textbox", { name: "Phone" })).toHaveValue("98765 43210");
  });

  test("a page's words can be rewritten, placed and left out", async ({ page }) => {
    await page.goto("/create?quality=2d&category=wedding&suite=kayal&template=kasavu");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Which language is your card in?",
    );
    await next(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who is the couple?");
    await page.getByRole("textbox", { name: /First name/ }).fill("Meera");
    await page.getByRole("textbox", { name: /Second name/ }).fill("Kabir");
    const wide = page.viewportSize()!.width >= 1024;
    if (!wide) await page.getByRole("button", { name: "Preview", exact: true }).click();

    await page.getByRole("button", { name: "Edit this page" }).click();
    const dialog = page.getByRole("dialog", { name: "The Cover page" });
    await dialog.getByRole("button", { name: "Add a line" }).click();
    const added = dialog.getByRole("textbox", { name: /^Line \d+$/ }).last();
    await added.fill("Together forever");
    await expect(dialog.locator(".story-line", { hasText: "Together forever" })).toBeAttached();
    await dialog.getByRole("radio", { name: "Top" }).click();
    expect((await axe(page).include("[role=dialog]").analyze()).violations).toEqual([]);
    // The cover can't be left out: it carries the names
    await expect(dialog.getByRole("switch")).toHaveCount(0);
    await dialog.getByRole("button", { name: "Done" }).click();

    await page.reload();
    if (!wide) await page.getByRole("button", { name: "Preview", exact: true }).click();
    await page.getByRole("button", { name: "Edit this page" }).click();
    const again = page.getByRole("dialog", { name: "The Cover page" });
    await expect(again.getByRole("textbox", { name: /^Line \d+$/ }).last()).toHaveValue(
      "Together forever",
    );
    await expect(again.getByRole("radio", { name: "Top" })).toBeChecked();
    await again.getByRole("button", { name: "Back to the suggested words" }).click();
    await expect(again.locator(".story-line", { hasText: "Together forever" })).toHaveCount(0);
    await again.getByRole("button", { name: "Done" }).click();

    // AI writes only for an invite saved to an account
    await page.getByRole("button", { name: "Write with AI" }).click();
    const ai = page.getByRole("dialog", { name: "Write the words with AI" });
    await expect(ai.getByRole("radio", { name: "Traditional" })).toBeChecked();
    expect((await axe(page).include("[role=dialog]").analyze()).violations).toEqual([]);
    await ai.getByRole("button", { name: "Write", exact: true }).click();
    await expect(ai.getByRole("status")).toHaveText(/Sign in so your invite is saved/);
  });

  test("the phone follows the page being edited, in the host's own lettering", async ({ page }) => {
    await page.goto(
      "/create?quality=2d&category=wedding&tradition=gujarati&suite=shahi-savari&template=bandhani",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Which language is your card in?",
    );
    await next(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who is the couple?");
    const wide = page.viewportSize()!.width >= 1024;
    const showPhone = async () => {
      if (!wide) await page.getByRole("button", { name: "Preview", exact: true }).click();
    };
    const hidePhone = async () => {
      if (wide) return;
      await page.keyboard.press("Escape");
      // The page behind the sheet takes clicks again once it has closed
      await expect(page.getByRole("dialog")).toHaveCount(0);
    };
    await page.getByRole("textbox", { name: /First name/ }).fill("રાધા");
    await page.getByRole("textbox", { name: /Second name/ }).fill("અર્જુન");
    // Untyped lines preview in the card's language, never the design's English samples
    await page.locator("summary", { hasText: "More card words" }).click();
    await expect(page.getByRole("textbox", { name: /Families/ })).toHaveValue("બંને પરિવાર તરફથી");
    // Ideas for each line come in the card's language too
    await expect(
      page
        .getByRole("group", { name: /Ideas for Blessing/ })
        .getByRole("button")
        .first(),
    ).toHaveText("॥ શ્રી ગણેશાય નમઃ ॥");

    // Lettering: a Gujarati card offers only fonts that write Gujarati
    await page.locator("summary", { hasText: "Lettering" }).click();
    const names = page.getByRole("radiogroup", { name: "Names", exact: true });
    await expect(names.getByRole("radio", { name: /Great Vibes/ })).toHaveCount(0);
    await names.getByRole("radio", { name: /Mogra/ }).click();
    await page.getByRole("button", { name: "Bold", exact: true }).click();
    await expect(page.getByRole("button", { name: "Bold", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(await axe(page).include('section[aria-label="Lettering"]').analyze()).toMatchObject({
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
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "When and where is everything?",
    );
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
    await next(page); // language
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

  test("a Scene keeps its painting and holds the function being filled in", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, "the phone beside the form");
    await page.goto("/create?suite=udaipur-lake&format=scene");
    await next(page); // language
    await fillCouple(page);
    await next(page);
    await page.getByRole("checkbox", { name: /Sangeet/ }).check();
    await page
      .getByRole("textbox", { name: /^Venue/ })
      .first()
      .fill("Lake Palace lawns");
    // The design itself, with only its event box changing: no stand-in card to switch to
    await expect(page.getByRole("button", { name: "Card", exact: true })).toHaveCount(0);
    const slot = page.getByRole("group", { name: "The celebrations, one by one" });
    await expect(slot).toContainText("Sangeet");
    await expect(slot).toContainText("Lake Palace lawns");
    // It stays while the host types, past the time a function would play for
    await page.waitForTimeout(5000);
    await expect(slot).toContainText("Sangeet");
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
      await next(page); // language
      expect(await noOverflow(page)).toBe(true);
      await next(page);
      await fillCouple(page);
      await next(page);
      await fillWedding(page);
      await next(page);
      expect(await noOverflow(page)).toBe(true);
      await addDesignPhotos(page);
      expect(await noOverflow(page)).toBe(true);
      await next(page);
      await expect(page.getByText("Your invitation is ready")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      await context.close();
    }
  });
});
