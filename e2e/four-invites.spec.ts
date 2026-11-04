import { expect, test, type Page } from "@playwright/test";
import {
  addDesignPhotos,
  editorBar,
  fillEvent,
  fillNames,
  numberFor,
  openPart,
  publish,
  seeInvitation,
  signIn,
} from "./invite-helpers";

/*
 * Many invitations in one account (owner, 2026-11-03): after one invitation is paid for and
 * published, each new one is free to write, preview, watch as a video and see as cards,
 * and asks for its own package only when it is published. The first stays live throughout.
 */

/** Writes the invite open on a design's page: names, the wedding's date and place, photos. */
async function fillInvite(page: Page, names: [string, string]) {
  await fillNames(page, names);
  await fillEvent(page, "wedding", { day: 15, time: "6:30 pm", venue: "Taj Falaknuma" });
  await openPart(page, "Your photos");
  await addDesignPhotos(page);
  await seeInvitation(page);
}

/** The website, the video and the cards, each opened from the design's page and back. */
async function lookAround(page: Page, names: [string, string]) {
  const design = page.url();
  await page.getByRole("button", { name: "Website", exact: true }).click();
  await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/preview$/, { timeout: 30_000 });
  await expect(page.getByText(names[0]).first()).toBeVisible({ timeout: 15_000 });
  const id = new URL(page.url()).pathname.split("/")[2]!;

  await page.goto(`/invites/${id}/video`);
  const video = page.locator("[data-video-card]");
  await expect(video.getByRole("heading", { name: "Invitation video" })).toBeVisible();
  await expect(video.getByRole("img", { name: "The video's first moment" })).toBeVisible();

  await page.goto(`/invites/${id}/cards`);
  await expect(page).toHaveURL(new RegExp(`/invites/${id}/cards$`));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto(design);
  await expect(page.locator('input[data-slot="first"]')).toHaveValue(names[0], {
    timeout: 30_000,
  });
  // Nothing on the page stands in the way: no change held back, nothing locked
  await expect(page.locator("[data-held-back]")).toHaveCount(0);
  await seeInvitation(page);
  return id;
}

/** Publish, through the packages: a paid design pays (test checkout), a free one goes on. */
async function publishThroughPackages(page: Page, base: string, paid: boolean) {
  await expect(async () => {
    await editorBar(page).click({ timeout: 5_000 });
    await expect(page).toHaveURL(/\/edition\?publish=1$/, { timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
  const id = new URL(page.url()).pathname.split("/")[2]!;
  if (paid) {
    const basic = page.getByRole("article", { name: "Basic" });
    await basic.getByRole("button", { name: /^Pay / }).click();
    await page
      .getByRole("dialog", { name: "Test payment" })
      .getByRole("button", { name: "Pay (test)" })
      .click();
    await expect(basic.getByText("Your package")).toBeVisible();
  }
  await page.goto(`/create?invite=${id}&publish=1`);
  return publish(page, base);
}

/** My invites' New invite, then a design: a new invitation, empty, in the account. */
async function newInvite(page: Page, design: string) {
  await page.goto("/invites");
  await page.getByRole("link", { name: "New invite" }).click();
  // The open invite is put away in the account, and the designs show
  await expect(page).not.toHaveURL(/\/invites$|\/create\?new=1/, { timeout: 30_000 });
  await page.goto(`/create/${design}?category=wedding`);
  await expect(page.locator('input[data-slot="first"]')).toHaveValue("", { timeout: 30_000 });
}

test.describe("four invitations in one account", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ context }, info) => {
    test.setTimeout(600_000);
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
  });

  test("each new invitation is free to write and preview, and pays only to publish", async ({
    page,
  }, info) => {
    await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
    await page.goto(`/sign-in?next=${encodeURIComponent("/create/rajwada-bagh?category=wedding")}`);
    await signIn(page, numberFor(info));
    await expect(page).toHaveURL(/\/create\//);

    // The first: paid for and published
    await fillInvite(page, ["Riya", "Arjun"]);
    await lookAround(page, ["Riya", "Arjun"]);
    const first = await publishThroughPackages(page, "four-1", true);

    // Three more, on other designs, a free card among them
    const more: [string, [string, string], boolean][] = [
      ["kayal", ["Meera", "Kabir"], true],
      ["card-kasavu", ["Anika", "Dev"], false],
      ["udaipur-lake-scene", ["Tara", "Rohan"], true],
    ];
    for (const [index, [design, names, paid]] of more.entries()) {
      await newInvite(page, design);
      await fillInvite(page, names);
      await lookAround(page, names);
      await publishThroughPackages(page, `four-${index + 2}`, paid);
    }

    await page.goto("/invites");
    await expect(page.getByRole("article").filter({ hasText: "Published" })).toHaveCount(4);
    // The first is still live, as its guests have it
    await page.goto(first);
    await expect(page.getByText("Riya").first()).toBeVisible({ timeout: 30_000 });
  });

  test("another design after paying, before publishing, starts a new invitation and keeps the paid one", async ({
    page,
  }, info) => {
    await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
    await page.goto(`/sign-in?next=${encodeURIComponent("/create/rajwada-bagh?category=wedding")}`);
    await signIn(page, numberFor(info));
    await expect(page).toHaveURL(/\/create\//);
    await fillInvite(page, ["Riya", "Arjun"]);
    // Paid for, not yet published
    await expect(async () => {
      await editorBar(page).click({ timeout: 5_000 });
      await expect(page).toHaveURL(/\/edition\?publish=1$/, { timeout: 5_000 });
    }).toPass({ timeout: 30_000 });
    const paid = new URL(page.url()).pathname.split("/")[2]!;
    const basic = page.getByRole("article", { name: "Basic" });
    await basic.getByRole("button", { name: /^Pay / }).click();
    await page
      .getByRole("dialog", { name: "Test payment" })
      .getByRole("button", { name: "Pay (test)" })
      .click();
    await expect(basic.getByText("Your package")).toBeVisible();

    // From its own page, another design asks first
    await page.goto(`/create?invite=${paid}`);
    await expect(page).toHaveURL(new RegExp(`/create/rajwada-bagh\\?.*invite=${paid}`), {
      timeout: 30_000,
    });
    const other = page.locator("[data-suggested-designs]").getByRole("link").first();
    const name = (await other.locator("[data-design-name]").textContent())!.trim();
    await expect(async () => {
      await other.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog", { name: `Use ${name} for…` })).toBeVisible({
        timeout: 5_000,
      });
    }).toPass({ timeout: 30_000 });
    await page.keyboard.press("Escape");

    // From the gallery, the design starts a new invitation, already filled in
    await page.goto("/create/kayal?category=wedding");
    await expect(page.locator('input[data-slot="first"]')).toHaveValue("Riya", {
      timeout: 30_000,
    });
    await expect(page.getByText("Saved to your account")).toBeVisible({ timeout: 15_000 });
    await page.goto("/invites");
    await expect(page.getByRole("heading", { name: "Riya & Arjun" })).toHaveCount(2);

    // The paid one publishes without paying again
    await page.goto(`/create?invite=${paid}`);
    await expect(page).toHaveURL(/\/create\/rajwada-bagh\?/, { timeout: 30_000 });
    await publish(page, "four-paid");
  });
});
