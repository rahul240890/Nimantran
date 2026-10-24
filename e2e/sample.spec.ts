import { expect, test, type Request } from "@playwright/test";
import { LIVE_DEMOS } from "../src/lib/sample/paths";
import { axe, noOverflow } from "./invite-helpers";

/* A design's live sample (/sample/<design>): the whole invitation as a guest gets it, no sign-in. */

const serverAction = (request: Request) =>
  request.method() === "POST" && Boolean(request.headers()["next-action"]);

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`sample, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("fits the screen and passes an accessibility check", async ({ page }) => {
      // As a stop on the home page's tour, so the ways on are checked too
      await page.goto("/sample/shahi-savari?tour=abc");
      const walk = page.getByRole("navigation", { name: "Other designs" });
      await expect(walk.getByRole("link", { name: "Previous design" })).toBeVisible();
      await expect(walk.getByRole("link", { name: "Next design" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Choose this design" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Open the invitation" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  });
}

test.describe("live samples", () => {
  test.use({ reducedMotion: "reduce" });

  test("the home page opens a live invitation, a reply goes nowhere, and Choose this design starts it", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    // Each visit tours the demo designs in an order of its own: Next and Previous walk it
    await page.getByRole("link", { name: "Open a live invitation" }).click();
    const demo = /\/sample\/([a-z-]+)\?tour=([a-z0-9]+)$/;
    await expect(page).toHaveURL(demo, { timeout: 15_000 });
    const [, first, seed] = demo.exec(page.url())!;
    expect(LIVE_DEMOS).toContain(first);
    await expect(page.getByRole("button", { name: "Open the invitation" })).toBeVisible();
    await page.getByRole("link", { name: "Next design" }).click();
    await expect(page).not.toHaveURL(new RegExp(`/sample/${first}\\?`), { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(`\\?tour=${seed}$`));
    expect(LIVE_DEMOS).toContain(demo.exec(page.url())![1]!);
    // The next design starts closed, at its own opening
    await expect(page.getByRole("button", { name: "Open the invitation" })).toBeVisible();
    await page.getByRole("link", { name: "Previous design" }).click();
    await expect(page).toHaveURL(new RegExp(`/sample/${first}\\?tour=${seed}$`), {
      timeout: 15_000,
    });

    // The palace garden story, as a guest gets it
    await page.goto("/sample/rajwada-bagh?tour=abc");
    await expect(page).toHaveTitle(/Sample invitation: Rajwada Bagh/);

    await page.getByRole("button", { name: "Open the invitation" }).click();
    await expect(page.getByRole("dialog", { name: /one page at a time/ })).toBeVisible();
    await page.keyboard.press("Escape");

    const sent: string[] = [];
    page.on("request", (request) => {
      if (serverAction(request)) sent.push(request.url());
    });
    await page.getByLabel("Your name").fill("Priya Mehta");
    await page.getByRole("button", { name: "Coming to everything" }).click();
    await page.getByRole("button", { name: "Send reply" }).click();
    await expect(page.getByRole("heading", { name: "Thank you, Priya!" })).toBeVisible();
    await expect(page.getByText("This is a sample, so nothing was sent.")).toBeVisible();
    // Five celebrations, every one answered, and nothing went to the server
    await expect(page.getByText("Coming · 1 person")).toHaveCount(5);
    expect(sent).toEqual([]);

    await page.getByRole("link", { name: "Choose this design" }).click();
    // The design's own page, to fill in the names, date and venue
    await expect(page).toHaveURL(/\/create\/rajwada-bagh\?category=wedding/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rajwada Bagh");
  });

  test("a design's Live demo opens it as a guest, and Next stays with the occasion", async ({
    page,
  }) => {
    await page.goto("/invitations/birthday");
    await page.getByRole("button", { name: /^Show all \d+ designs$/ }).click();
    await page
      .locator('[data-design="gubbara"]')
      .getByRole("link", { name: "Live demo: Gubbara" })
      .click();
    // The sample is rendered on demand: give a busy machine time to answer
    await expect(page).toHaveURL(/\/sample\/gubbara\?occasion=birthday$/, { timeout: 15_000 });
    // A birthday shows one name, never a couple
    await expect(page.getByText("Aanya").first()).toBeVisible();
    await expect(page.getByText("Arjun")).toHaveCount(0);
    // The designs either side are birthdays too
    await page.getByRole("link", { name: "Next design" }).click();
    await expect(page).toHaveURL(/\/sample\/(?!gubbara)[a-z-]+\?occasion=birthday$/, {
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: "Open the invitation" })).toBeVisible();
  });

  // Owner, 2026-10-24: a story design's demo from the birthdays played a wedding, haldi and all
  test("a story design opened from the birthdays plays a birthday", async ({ page }) => {
    await page.goto("/sample/panchatantra?occasion=birthday");
    await expect(page.getByText("Aanya").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Arjun")).toHaveCount(0);
    for (const wedding of ["Haldi", "Mehendi", "Sangeet", "Baraat"]) {
      await expect(page.getByText(wedding, { exact: true })).toHaveCount(0);
    }
  });

  test("a 3D card's page opens its sample", async ({ page }) => {
    await page.goto("/designs/marigold");
    await page.getByRole("link", { name: "See it live as a guest" }).click();
    await expect(page).toHaveURL(/\/sample\/card-marigold$/, { timeout: 15_000 });
    await expect(page.getByRole("button", { name: "Open the invitation" })).toBeVisible();
    // Next walks the other 3D cards
    await page.getByRole("link", { name: "Next design" }).click();
    await expect(page).toHaveURL(/\/sample\/card-(?!marigold)[a-z-]+\?format=card$/, {
      timeout: 15_000,
    });
  });

  test("a blog post shows designs for its occasion, each opening as a guest", async ({ page }) => {
    await page.goto("/blog/wedding-invitation-wording");
    const designs = page.getByRole("region", { name: "Wedding designs to open as a guest" });
    await expect(designs.locator("[data-sample-design]")).toHaveCount(4);
    const first = designs.locator("[data-sample-design]").first();
    const id = await first.getAttribute("data-sample-design");
    await first.click();
    await expect(page).toHaveURL(new RegExp(`/sample/${id}$`));
    await expect(page.getByRole("link", { name: "Choose this design" })).toBeVisible();
  });

  test("Back, and the browser's back, return to where the sample was opened", async ({ page }) => {
    // From the home page's tour: walking on doesn't fill the history
    await page.goto("/");
    await page.getByRole("link", { name: "Open a live invitation" }).click();
    await expect(page).toHaveURL(/\/sample\/[a-z-]+\?tour=/, { timeout: 15_000 });
    const first = page.url();
    await page.getByRole("link", { name: "Next design" }).click();
    await expect(page).not.toHaveURL(first, { timeout: 15_000 });
    await page.getByRole("link", { name: "Next design" }).click();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
    // And Back itself
    await page.getByRole("link", { name: "Open a live invitation" }).click();
    await expect(page).toHaveURL(/\/sample\/[a-z-]+\?tour=/, { timeout: 15_000 });
    await page.getByRole("link", { name: "Next design" }).click();
    await page.getByRole("link", { name: "Back", exact: true }).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });

    // Opened straight from a shared link, Back goes to the design's listing
    await page.goto("/sample/kutch-toran?tradition=gujarati");
    await page.getByRole("link", { name: "Back", exact: true }).click();
    await expect(page).toHaveURL(/\/invitations\/wedding\/gujarati$/, { timeout: 15_000 });
  });

  test("an unknown design isn't found", async ({ request }) => {
    expect((await request.get("/sample/no-such-design")).status()).toBe(404);
  });
});

test.describe("a painting on a slow connection", () => {
  // Motion on, so the pages turn by themselves
  test.use({ reducedMotion: "no-preference" });

  test("its page comes in on the blurred copy and waits for the painting before turning", async ({
    page,
  }) => {
    test.slow();
    // The family page's painting is held back until the test lets it through
    let release = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/suites/rajwada-bagh/family.webp", async (route) => {
      await held;
      await route.continue();
    });
    await page.goto("/sample/rajwada-bagh");
    await page.getByRole("button", { name: "Open the invitation" }).click();
    const story = page.locator("[data-story-beat]");
    await expect(story).toHaveAttribute("data-story-beat", "cover", { timeout: 20_000 });
    await page.keyboard.press("ArrowRight");
    await expect(story).toHaveAttribute("data-story-beat", "couple");
    await page.keyboard.press("ArrowRight");
    await expect(story).toHaveAttribute("data-story-beat", "family");

    // In on its blurred copy, with a spinner saying the painting is coming
    const family = page.locator('[data-page="family"]');
    await expect(family.locator('img[src^="data:image/webp"]')).toBeAttached();
    const loading = page.getByRole("status", { name: "Loading the page" });
    await expect(loading).toBeVisible();
    // Its time waits: well past its length, the page is still there
    const bar = page.locator(".story-progress");
    const seconds = parseFloat(
      await bar.evaluate((el) => getComputedStyle(el).getPropertyValue("--story-duration")),
    );
    await page.waitForTimeout((seconds + 1) * 1000);
    await expect(story).toHaveAttribute("data-story-beat", "family");

    // The painting comes in, and the page goes on in its own time
    release();
    await expect(loading).toHaveCount(0);
    await expect(family.locator('img[src$="/suites/rajwada-bagh/family.webp"]')).toBeVisible();
    await expect(story).not.toHaveAttribute("data-story-beat", "family", {
      timeout: (seconds + 5) * 1000,
    });
  });
});
