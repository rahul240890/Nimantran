import { expect, test, type Page } from "@playwright/test";
import {
  axe,
  firstName,
  noOverflow,
  numberFor,
  openPart,
  publish,
  seeInvitation,
  writeInvite,
} from "./invite-helpers";

/*
 * Changing the design (owner, 2026-10-22, 2026-10-24): every name, date, place and word
 * stays, whether another design is picked under the invite's own page or in the gallery,
 * and a live invite opened from the account is changed on its design's page.
 */

/** The wedding's venue, its part opened. */
async function weddingVenue(page: Page) {
  await openPart(page, "When and where");
  return page.locator('[data-function="wedding"]').getByRole("textbox", { name: /^Venue/ });
}

test.describe("changing the design", () => {
  test.use({ reducedMotion: "reduce" });

  test("from the preview: other designs under the invite's page, and every detail kept", async ({
    page,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Kabir", "Meera"]);
    await page.getByRole("button", { name: "Change design" }).first().click();
    await expect(page).toHaveURL(/\/create\/rajwada-bagh\?category=wedding.*#more-designs$/);
    const designs = page.locator("[data-suggested-designs]");
    await expect(designs.getByRole("link").first()).toBeVisible({ timeout: 30_000 });
    expect(await noOverflow(page)).toBe(true);
    // Read from the top: a control scrolled under the sticky header counts as too small
    await page.evaluate(() => window.scrollTo(0, 0));
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Another design is this invite's, with its names and functions as they were
    const other = designs.getByRole("link").first();
    const name = (await other.locator("[data-design-name]").textContent())!.trim();
    await other.click();
    await expect(page).not.toHaveURL(/\/create\/rajwada-bagh/);
    await expect(firstName(page)).toHaveValue("Kabir", { timeout: 30_000 });
    await expect(await weddingVenue(page)).toHaveValue("Taj Falaknuma, Hyderabad");
    await seeInvitation(page);
    await expect(page.getByText(/Kabir/).first()).toBeVisible();
    await expect(page.getByText("Taj Falaknuma, Hyderabad").first()).toBeVisible();
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  });

  test("a design picked in the gallery joins the invite under way", async ({ page }, info) => {
    await writeInvite(page, numberFor(info), ["Isha", "Dev"]);
    // An older link to the editor naming a design: the design's page, with the invite in it
    await page.goto("/create?category=wedding&suite=kayal&template=marigold");
    await expect(page).toHaveURL(/\/create\/kayal\?category=wedding$/);
    await expect(firstName(page)).toHaveValue("Isha", { timeout: 30_000 });
    await expect(await weddingVenue(page)).toHaveValue("Taj Falaknuma, Hyderabad");
    await expect(page.getByRole("heading", { level: 1, name: "Kayal" })).toBeVisible();
  });

  test("a live invite opens on its design's page, and a design from the gallery starts a new one already filled in", async ({
    page,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Riya", "Arjun"]);
    await publish(page, "change");
    const live = /\/invites\/([0-9a-f-]{36})\/share$/.exec(page.url())![1]!;

    // Edit invite: the whole invite on its design's page
    await page.getByRole("link", { name: "Edit invite" }).click();
    await expect(page).toHaveURL(new RegExp(`/create/rajwada-bagh\\?.*invite=${live}`));
    await expect(firstName(page)).toHaveValue("Riya", { timeout: 30_000 });
    await expect(await weddingVenue(page)).toHaveValue("Taj Falaknuma, Hyderabad");

    // A design picked in the gallery is another invite: the live one stays as it is, and
    // the new one starts with all of its details
    await page.goto("/invitations/wedding");
    const card = page.locator("[data-design]").nth(2);
    await card.getByRole("link", { name: /Use this design/ }).click();
    await expect(page).toHaveURL(/\/create\/[a-z0-9-]+\?category=wedding/);
    await expect(firstName(page)).toHaveValue("Riya", { timeout: 30_000 });
    await expect(await weddingVenue(page)).toHaveValue("Taj Falaknuma, Hyderabad");
    await seeInvitation(page);
    // Not live yet: it publishes under a link of its own
    await expect(page.getByRole("button", { name: "Publish", exact: true })).toBeVisible();
    await page.goto("/invites");
    await expect(page.getByRole("heading", { name: "Riya & Arjun" })).toHaveCount(2);
  });

  test("a gate chosen on another design's page is the one its preview opens with", async ({
    page,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Kabir", "Meera"]);
    await page.getByRole("button", { name: "Change design" }).first().click();
    const designs = page.locator("[data-suggested-designs]");
    await expect(designs.getByRole("link").first()).toBeVisible({ timeout: 30_000 });
    // Each design carries the couple's own names, on a painting or in a card's lettering,
    // and its price
    await expect(designs.getByText("Kabir & Meera").first()).toBeAttached();
    await expect(
      designs.locator("[data-invitation]").getByText("Kabir", { exact: true }).first(),
    ).toBeAttached();
    await expect(designs.getByText("Aarav")).toHaveCount(0);
    await expect(designs.locator("[data-design-price]").first()).toBeVisible();
    await designs.getByRole("link").nth(1).click();
    await expect(page).not.toHaveURL(/\/create\/rajwada-bagh/);

    // A new gate on the new design
    await openPart(page, "Opening gate (cover screen)");
    // The part's own button; the phone above turns to the gate and has one too
    await page
      .getByTestId("gate-summary")
      .getByRole("button", { name: "Change opening gate" })
      .click();
    const dialog = page.getByRole("dialog", { name: "Choose your opening gate" });
    await dialog.getByRole("button", { name: "Curtains and reveals" }).click();
    await dialog.getByRole("radio", { name: /^Silk curtains/ }).click();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(page.locator("#part-gate")).toContainText("Silk curtains");

    // Preview, signed in, is the guests' own view: it opens with that gate
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/preview\?from=design$/);
    const guest = info.project.name.startsWith("phone")
      ? page
      : page.frameLocator('[data-testid="host-preview-phone"]');
    await expect(guest.locator("[data-opening]").first()).toHaveAttribute(
      "data-opening",
      "curtain",
      { timeout: 15_000 },
    );
    // Its way back is the design's page
    const back = page.getByRole("link", { name: "Keep editing" });
    if (info.project.name.startsWith("phone")) {
      await page.getByRole("button", { name: "Preview options" }).click();
      await expect(page.getByRole("menuitem", { name: "Keep editing" })).toHaveAttribute(
        "href",
        /^\/create\/[a-z0-9-]+\?.*invite=/,
      );
    } else {
      await expect(back).toHaveAttribute("href", /^\/create\/[a-z0-9-]+\?.*invite=/);
    }
  });
});
