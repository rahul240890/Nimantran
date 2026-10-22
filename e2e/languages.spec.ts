import { expect, test, type Page } from "@playwright/test";
import { axe, noOverflow } from "./invite-helpers";

/*
 * The site's languages: the home pages at / and /hi (and /mr, /gu, /bn, /ta), the switcher,
 * and the app following it.
 */

const wide = (page: Page) => page.viewportSize()!.width >= 1280;

/** The language menu: in the header on wide screens, inside the menu on smaller ones. */
async function chooseLanguage(page: Page, current: RegExp, name: string) {
  if (!wide(page)) {
    await page.getByRole("button", { name: /^(Open menu|मेन्यू खोलें)$/ }).click();
  }
  await page.getByRole("button", { name: current }).click();
  await page.getByRole("menuitemradio", { name: new RegExp(name) }).click();
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`Hindi pages, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("the Hindi home page reads in Hindi, fits and passes axe", async ({ page }) => {
      await page.goto("/hi");
      await expect(page.locator("html")).toHaveAttribute("lang", "hi");
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: "निमंत्रण, जो जीवंत हो उठें।",
        }),
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "जोड़े अक्सर पूछते हैं" })).toBeAttached();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });

    test("app pages follow the chosen language", async ({ page }) => {
      await page
        .context()
        .addCookies([{ name: "shubhdwar-locale", value: "hi", url: "http://localhost:3100" }]);
      await page.goto("/sign-in");
      await expect(page.locator("html")).toHaveAttribute("lang", "hi");
      await expect(
        page.getByRole("heading", { name: "शुभ इन्विटेशन में साइन इन करें" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "कोड भेजें" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  });
}

// Marathi, Gujarati, Bengali and Tamil: each home page in its own language and script
const NEW_LOCALES = [
  { code: "mr", script: /[\u0900-\u097F]/ },
  { code: "gu", script: /[\u0A80-\u0AFF]/ },
  { code: "bn", script: /[\u0980-\u09FF]/ },
  { code: "ta", script: /[\u0B80-\u0BFF]/ },
] as const;

for (const [i, { code, script }] of NEW_LOCALES.entries()) {
  const colorScheme = i % 2 ? "dark" : "light";
  test(`the ${code} home page reads in its own script, fits and passes axe (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto(`/${code}`);
    await expect(page.locator("html")).toHaveAttribute("lang", code);
    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toBeVisible();
    expect(await title.textContent()).toMatch(script);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });

  test(`the ${code} app pages and policies follow the language`, async ({ page }) => {
    await page
      .context()
      .addCookies([{ name: "shubhdwar-locale", value: code, url: "http://localhost:3100" }]);
    await page.goto("/sign-in");
    await expect(page.locator("html")).toHaveAttribute("lang", code);
    expect(await page.getByRole("heading", { level: 1 }).textContent()).toMatch(script);
    // The policies stay in English, the binding version, and say so in the page's language
    await page.goto(`/${code}/privacy`);
    await expect(page.getByRole("note").first()).toHaveAttribute("lang", code);
    await expect(page.locator("article")).toHaveAttribute("lang", "en");
    expect(await noOverflow(page)).toBe(true);
    // A guest's invitation in the language: its longer buttons wrap on a phone, never run off
    await page.goto("/sample/kayal-scene");
    await expect(page.locator("html")).toHaveAttribute("lang", code);
    expect(await noOverflow(page)).toBe(true);
  });
}

test("a language the site doesn't speak yet has no pages", async ({ request }) => {
  expect((await request.get("/te")).status()).toBe(404);
  expect((await request.get("/te/pricing")).status()).toBe(404);
});

test.describe("switching language", () => {
  test.use({ reducedMotion: "reduce" });

  test("the switcher moves the home page and the app to Hindi and back", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await chooseLanguage(page, /^Language: English$/, "हिन्दी");
    await expect(page).toHaveURL(/\/hi$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");

    // The choice is remembered for the app's pages
    await page.goto("/sign-in");
    await expect(
      page.getByRole("heading", { name: "शुभ इन्विटेशन में साइन इन करें" }),
    ).toBeVisible();
    await page.getByRole("button", { name: /^भाषा: हिन्दी$/ }).click();
    await page.getByRole("menuitemradio", { name: /English/ }).click();
    await expect(page.getByRole("heading", { name: "Sign in to Shubh" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("a phone set to Hindi gets Hindi app pages", async ({ browser }) => {
    const context = await browser.newContext({ locale: "hi-IN" });
    const page = await context.newPage();
    await page.goto("/sign-in");
    await expect(
      page.getByRole("heading", { name: "शुभ इन्विटेशन में साइन इन करें" }),
    ).toBeVisible();
    await context.close();
  });

  test("the card's language turns the editor to it, and a new invite starts in the site's", async ({
    page,
  }) => {
    const onward = () => page.getByRole("button", { name: /^(Continue|આગળ વધો)$/ }).click();
    const heading = page.getByRole("heading", { level: 1 });
    await page.goto("/create?quality=2d");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    for (let i = 0; i < 3; i++) await onward();
    await expect(heading).toHaveText("Who's getting married?");
    const language = page.getByRole("radiogroup", { name: "Card language" });
    await expect(language.getByRole("radio", { name: /^English/ })).toBeChecked();

    // A Gujarati card: the form's words, examples and ideas all turn Gujarati
    await language.getByRole("radio", { name: /^ગુજરાતી/ }).click();
    await expect(heading).toHaveText("કોનાં લગ્ન છે?");
    await expect(page.locator("html")).toHaveAttribute("lang", "gu");
    const first = page.getByRole("textbox", { name: /^પહેલું નામ/ });
    await expect(first).toHaveAttribute("placeholder", "જેમ કે રાધા");
    await expect(page.getByRole("button", { name: "“સંગ” વાપરો" })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);

    // And back to English
    await page
      .getByRole("radiogroup", { name: "કાર્ડની ભાષા" })
      .getByRole("radio", { name: /^English/ })
      .click();
    await expect(heading).toHaveText("Who's getting married?");
    await expect(page.getByRole("textbox", { name: /^First name/ })).toBeVisible();

    // A new invite on the Gujarati site is a Gujarati card from the start
    await page.context().addCookies([{ name: "shubhdwar-locale", value: "gu", url: page.url() }]);
    // Cleared away from the editor, which would save the open invite again
    await page.goto("/sign-in");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/create?quality=2d");
    for (let i = 0; i < 3; i++) await onward();
    await expect(heading).toHaveText("કોનાં લગ્ન છે?");
    await expect(
      page
        .getByRole("radiogroup", { name: "કાર્ડની ભાષા" })
        .getByRole("radio", { name: /^ગુજરાતી/ }),
    ).toBeChecked();
    await expect(page.getByRole("textbox", { name: /^પહેલું નામ/ })).toBeVisible();
  });

  test("an unknown address shows a missing-page screen in both languages", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    // Drawn in the browser for a one-word address, which can take a moment on a busy runner
    await expect(page.getByRole("heading", { name: "This page isn't here" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("यह पेज यहाँ नहीं है")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await page.getByRole("link", { name: "शुभ इन्विटेशन पर जाएँ" }).click();
    await expect(page).toHaveURL(/\/hi$/);
  });
});
