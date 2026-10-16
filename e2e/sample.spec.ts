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
    // The editor sets the design up, then tidies its address
    await expect(page).toHaveURL(/\/create$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who's getting married?");
  });

  test("a gallery preview opens its design as a guest, and Next stays with the occasion", async ({
    page,
  }) => {
    await page.goto("/invitations/birthday");
    await page.getByRole("button", { name: /^Show all \d+ designs$/ }).click();
    await page.getByRole("button", { name: "Preview Gubbara" }).click();
    await page
      .getByRole("dialog", { name: "Gubbara" })
      .getByRole("link", { name: "Open it as a guest" })
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

  test("a 3D card's page opens its sample", async ({ page }) => {
    await page.goto("/designs/marigold");
    await page.getByRole("link", { name: "Open it as a guest" }).click();
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

  test("an unknown design isn't found", async ({ request }) => {
    expect((await request.get("/sample/no-such-design")).status()).toBe(404);
  });
});
