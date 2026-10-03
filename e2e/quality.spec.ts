import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { noOverflow, numberFor, publish, writeInvite } from "./invite-helpers";
import { UI_LOCALES } from "../src/i18n/locales";
import { pagePath, publicPages } from "../src/lib/seo/paths";
import { POSTS } from "../src/content/blog";
import { blogPostPath } from "../src/lib/blog/posts";

/*
 * Step 13's quality pass: every page a visitor can reach passes a stricter accessibility
 * check (WCAG plus axe's best practices, such as heading order and landmarks) and fits a
 * 320px screen, and a guest can open an invitation and reply with the keyboard alone.
 */

const strictAxe = (page: Page) =>
  new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ]);

const everyPublicPage = [
  ...UI_LOCALES.flatMap((locale) => publicPages().map((page) => pagePath(page, locale))),
  ...POSTS.map((post) => blogPostPath(post.slug, post.locale)),
];
const appPages = ["/sign-in", "/create?quality=2d", "/no-such-page"];

test.describe("accessibility sweep", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of [...everyPublicPage, ...appPages]) {
    test(`${path} passes a strict accessibility check`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await strictAxe(page).analyze()).violations).toEqual([]);
    });
  }
});

/** Presses Tab until the element has focus, as a keyboard user would reach it. */
async function tabTo(page: Page, target: ReturnType<Page["locator"]>, limit = 80) {
  for (let presses = 0; presses < limit; presses++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) {
      // Focus must show: a visible outline or ring on the focused element
      const shown = await target.evaluate((el) => {
        const style = getComputedStyle(el);
        return (
          el.matches(":focus-visible") &&
          ((style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) ||
            style.boxShadow !== "none")
        );
      });
      expect(shown, "focus is visible").toBe(true);
      return;
    }
  }
  throw new Error(`Tab never reached ${target}`);
}

test.describe("keyboard only", () => {
  test.use({ reducedMotion: "reduce" });

  test("a guest opens the invitation and replies without a mouse", async ({
    page,
    browser,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Vihaan", "Diya"]);
    const path = await publish(page, "vihaan-weds-diya");

    const context = await browser.newContext({
      baseURL: info.project.use.baseURL,
      viewport: info.project.use.viewport,
      reducedMotion: "reduce",
    });
    const guest = await context.newPage();
    await guest.goto(`${path}?quality=2d`);
    await expect(guest.getByRole("heading", { level: 1 })).toContainText("Vihaan");
    expect(await noOverflow(guest)).toBe(true);
    expect((await strictAxe(guest).analyze()).violations).toEqual([]);

    await tabTo(guest, guest.getByRole("link", { name: "Reply to the invitation" }));
    await guest.keyboard.press("Enter");
    const form = guest.locator("#rsvp");
    const name = form.getByRole("textbox", { name: /Your name/ });
    await tabTo(guest, name);
    await guest.keyboard.type("Kavya Rao");
    await tabTo(guest, form.getByRole("button", { name: "Coming to everything" }));
    await guest.keyboard.press("Enter");
    await expect(
      form
        .getByRole("radiogroup", { name: "Your reply for the Wedding" })
        .getByRole("radio", { name: /^Coming$/ }),
    ).toBeChecked();
    await tabTo(guest, form.getByRole("button", { name: "Send reply" }));
    await guest.keyboard.press("Enter");

    await expect(form.getByRole("heading", { name: "Thank you, Kavya!" })).toBeFocused();
    expect((await strictAxe(guest).analyze()).violations).toEqual([]);
    await context.close();

    // The host sees the reply on the invite's page
    await page.reload();
    await expect(page.getByRole("region", { name: "Replies" })).toContainText("Kavya Rao");
  });
});
