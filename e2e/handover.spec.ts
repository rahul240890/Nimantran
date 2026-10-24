import { expect, test, type Page } from "@playwright/test";
import { axe, noOverflow, numberFor, signIn } from "./invite-helpers";

/* Hand-over links (update 5), in preview mode: Shubh makes an invite, the family takes it. */

// Preview mode's admin number (src/lib/auth/mode.ts)
const ADMIN = "9999900000";

/** Letters only, so each run's names are its own among the admin's invites. */
const tag = () =>
  Date.now()
    .toString()
    .slice(-6)
    .replace(/\d/g, (digit) => String.fromCharCode(97 + Number(digit)));

const tooSmall = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main a, main button")]
      .filter((el) => el.offsetParent !== null && !el.closest(".sr-only, [aria-hidden=true]"))
      .map((el) => ({
        text: el.textContent || el.getAttribute("aria-label"),
        h: el.getBoundingClientRect().height,
      }))
      .filter(({ h }) => h < 44),
  );

/** The admin writes a wedding invite on a design's own page, saved to their account. */
async function makeInvite(page: Page, names: [string, string]) {
  // A known "today" for the calendar; time still moves, so every edit saves
  await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
  const design = "/create/rajwada-bagh?category=wedding";
  await page.goto(`/sign-in?next=${encodeURIComponent(design)}`);
  await signIn(page, ADMIN);
  await expect(page).toHaveURL(/\/create\/rajwada-bagh/);
  const first = page.getByRole("textbox", { name: /First name/ });
  const second = page.getByRole("textbox", { name: /Second name/ });
  // Typing that lands before the page has hydrated is lost, so try again until both stay
  await expect(async () => {
    await first.fill(names[0]);
    await second.fill(names[1]);
    await expect(first).toHaveValue(names[0], { timeout: 3_000 });
    await expect(second).toHaveValue(names[1], { timeout: 3_000 });
  }).toPass({ timeout: 30_000 });
  const wedding = page.locator('[data-function="wedding"]');
  await wedding.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
  await wedding.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: "6:30 pm" }).click();
  await wedding.getByRole("textbox", { name: /^Venue/ }).fill("Taj Falaknuma, Hyderabad");
  await page.getByRole("button", { name: "See my invitation" }).click();
  await expect(page.getByText("Your invitation is ready")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Saved to your account")).toHaveCount(1, { timeout: 15_000 });
}

test.describe("hand-over links", () => {
  test.use({ reducedMotion: "reduce" });

  test("the admin hands an invite over, and the family takes it", async ({
    page: editor,
    browser,
  }, info) => {
    test.setTimeout(120_000);
    const names: [string, string] = ["Kabir", `Meher${tag()}`];
    const both = `${names[0]} & ${names[1]}`;
    await makeInvite(editor, names);

    // Admin, Hand over, in another tab, so the editor finishes saving: the invite is there
    const admin = await editor.context().newPage();
    const invite = admin.locator("[data-invite]").filter({ hasText: both });
    await expect(async () => {
      await admin.goto("/admin/handover");
      await expect(invite).toHaveCount(1, { timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    await expect(
      admin.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: "Hand over" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Hand over");
    await invite.getByRole("button", { name: "Make a hand-over link" }).click();
    const link = invite.locator("[data-handover-link]");
    await expect(link).toContainText("/claim/");
    const token = /\/claim\/([0-9a-f]+)$/.exec((await link.textContent()) ?? "")?.[1];
    expect(token).toMatch(/^[0-9a-f]{48}$/);
    await expect(invite.getByText(/^Works once, until /)).toBeVisible();
    await expect(invite.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute(
      "href",
      new RegExp(`^https://wa\\.me/\\?text=.*${token}`),
    );
    await expect(admin).toHaveTitle(/Hand over/);
    expect(await noOverflow(admin)).toBe(true);
    expect((await axe(admin).analyze()).violations).toEqual([]);

    // Opened by whoever made it, the link says to send it on instead
    await admin.goto(`/claim/${token}`);
    await admin.getByRole("button", { name: "Take it to my account" }).click();
    await expect(
      admin.getByRole("alert").filter({ hasText: /already in your account/ }),
    ).toBeVisible();

    // The family opens it, signs in and takes it
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const family = await context.newPage();
    await family.goto(`/claim/${token}`);
    await expect(family.getByRole("heading", { level: 1 })).toHaveText(
      `${both}: your invitation is ready`,
    );
    await expect(family).toHaveTitle(/Your invitation/);
    expect(await noOverflow(family)).toBe(true);
    expect(await tooSmall(family)).toEqual([]);
    expect((await axe(family).analyze()).violations).toEqual([]);
    await family.emulateMedia({ colorScheme: "dark" });
    expect((await axe(family).analyze()).violations).toEqual([]);
    await family.emulateMedia({ colorScheme: "light" });

    await family.getByRole("link", { name: "Sign in to take it" }).click();
    await expect(family).toHaveURL(/\/sign-in\?next=%2Fclaim%2F/);
    await signIn(family, numberFor(info));
    await expect(family).toHaveURL(new RegExp(`/claim/${token}$`));
    await family.getByRole("button", { name: "Take it to my account" }).click();
    await expect(family).toHaveURL(/\/create/, { timeout: 15_000 });
    await family.goto("/invites");
    await expect(family.getByRole("article").getByRole("heading", { name: both })).toBeVisible();

    // It has left the admin's account, and the link works only once
    await admin.goto("/admin/handover");
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Hand over");
    await expect(admin.locator("[data-invite]").filter({ hasText: both })).toHaveCount(0);
    await family.goto(`/claim/${token}`);
    await expect(
      family.getByRole("heading", { name: "This link has already been used" }),
    ).toBeVisible();
    await context.close();
  });

  test("a link that was never made shows nothing of anyone's", async ({ page }) => {
    for (const token of ["0".repeat(48), "not-a-link"]) {
      await page.goto(`/claim/${token}`);
      await expect(
        page.getByRole("heading", { name: "This link has already been used" }),
      ).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Go to My invites" })).toHaveAttribute(
      "href",
      "/invites",
    );
    expect(await tooSmall(page)).toEqual([]);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });

  test("only an admin can see the hand-over page", async ({ page }, info) => {
    await page.goto("/admin/handover");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Fadmin%2Fhandover/);
    await signIn(page, numberFor(info));
    await expect(page.getByRole("heading", { name: "This page isn't here" })).toBeVisible();
  });
});
