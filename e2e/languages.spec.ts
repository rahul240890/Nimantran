import { expect, test, type Page } from "@playwright/test";
import { axe, noOverflow } from "./invite-helpers";

/* English and Hindi: the home pages at / and /hi, the switcher, and the app following it. */

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

  test("an unknown address shows a missing-page screen in both languages", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page isn't here" })).toBeVisible();
    await expect(page.getByText("यह पेज यहाँ नहीं है")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await page.getByRole("link", { name: "शुभ इन्विटेशन पर जाएँ" }).click();
    await expect(page).toHaveURL(/\/hi$/);
  });
});
