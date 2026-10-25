import { expect, test, type Page } from "@playwright/test";
import {
  axe,
  editorBar,
  firstName,
  noOverflow,
  numberFor,
  publish,
  seeInvitation,
  writeInvite,
} from "./invite-helpers";

/*
 * Many invitations (owner, 2026-10-25): another design picked under a live invite's page
 * asks first, a new invitation already filled in or the live one changed, and a change its
 * package doesn't cover is never called live, nor shown as the live copy.
 */

/** Writes, pays for (test checkout) and publishes an invite; ends on its share page. */
async function paidLiveInvite(page: Page, number: string, names: [string, string]) {
  await writeInvite(page, number, names);
  await expect(async () => {
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page).toHaveURL(/\/edition\?publish=1$/, { timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
  const basic = page.getByRole("article", { name: "Basic" });
  await basic.getByRole("button", { name: /^Pay / }).click();
  await page
    .getByRole("dialog", { name: "Test payment" })
    .getByRole("button", { name: "Pay (test)" })
    .click();
  await expect(basic.getByText("Your package")).toBeVisible();
  const id = new URL(page.url()).pathname.split("/")[2]!;
  await page.goto(`/create?invite=${id}&publish=1&quality=2d`);
  await expect(page.getByRole("dialog", { name: "Publish your invitation" })).toBeVisible({
    timeout: 30_000,
  });
  await publish(page, "many");
  return id;
}

/** From the share page: the live invite's design page, then another design under it. */
async function pickAnotherDesign(page: Page, id: string) {
  await page.getByRole("link", { name: "Edit invite" }).click();
  await expect(page).toHaveURL(new RegExp(`invite=${id}`));
  await expect(firstName(page)).toHaveValue("Riya", { timeout: 30_000 });
  const other = page.locator("[data-suggested-designs]").getByRole("link").first();
  const name = (await other.locator("[data-design-name]").textContent())!.trim();
  await other.click();
  const choice = page.getByRole("dialog", { name: `Use ${name} for…` });
  await expect(choice).toBeVisible();
  return choice;
}

test.describe("many invitations", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ context }, info) => {
    test.setTimeout(180_000);
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
  });

  test("another design under a live invite can be a new invitation, already filled in", async ({
    page,
  }, info) => {
    const id = await paidLiveInvite(page, numberFor(info), ["Riya", "Arjun"]);
    const choice = await pickAnotherDesign(page, id);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    await choice.getByRole("button", { name: /^A new invitation/ }).click();
    await expect(page).not.toHaveURL(/invite=/);
    await expect(firstName(page)).toHaveValue("Riya", { timeout: 30_000 });
    // Nothing held back: it isn't the live one, and it publishes on its own
    await expect(page.locator("[data-held-back]")).toHaveCount(0);
    await seeInvitation(page);
    await expect(editorBar(page)).toHaveText("Publish");
    await page.goto("/invites");
    await expect(page.getByRole("heading", { name: "Riya & Arjun" })).toHaveCount(2);
  });

  test("the live invite in a design its package doesn't cover isn't called live, and can become a new one", async ({
    page,
  }, info) => {
    const id = await paidLiveInvite(page, numberFor(info), ["Riya", "Arjun"]);
    const choice = await pickAnotherDesign(page, id);
    await choice.getByRole("button", { name: /^Your live invitation/ }).click();
    await expect(page).toHaveURL(new RegExp(`invite=${id}`));
    const held = page.locator("[data-held-back]");
    await expect(held).toBeVisible({ timeout: 30_000 });

    // The guests' view, video and cards would show the live copy, so they wait
    await expect(page.locator("[data-try-video]")).toHaveCount(0);
    await expect(page.locator("[data-try-cards]")).toHaveCount(0);

    await held.getByRole("button", { name: "Make it a new invitation" }).click();
    await expect(held).toHaveCount(0);
    await seeInvitation(page);
    await expect(editorBar(page)).toHaveText("Publish");
    await page.goto("/invites");
    await expect(page.getByRole("heading", { name: "Riya & Arjun" })).toHaveCount(2);
  });
});
