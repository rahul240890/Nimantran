import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, openPublish, publish, writeInvite } from "./invite-helpers";

/*
 * Owner, 2026-11-08: a host who paid but hadn't published saw only "Draft" in My invites
 * and thought the payment hadn't counted. A paid draft says so and offers Publish; a free
 * draft doesn't; a live invite offers Share and Download apart.
 */
test("My invites shows a paid draft's package and Publish, then Share and Download once live", async ({
  page,
  context,
}, info) => {
  await context.addCookies([
    { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
  ]);
  await writeInvite(page, numberFor(info), ["Kabir", "Ananya"]);

  // Free and unpublished: a draft, with no Publish on the card
  await page.goto("/invites");
  const card = page.getByRole("listitem").filter({ hasText: "Kabir & Ananya" });
  await expect(card.getByText("Draft")).toBeVisible();
  await expect(card.getByText(/^Paid/)).toHaveCount(0);
  await expect(card.getByRole("link", { name: "Publish" })).toHaveCount(0);

  // Paid on the packages page, without coming from Publish: it points at publishing
  await card.getByRole("link", { name: "Guests" }).click();
  await expect(page).toHaveURL(/\/invites\/[0-9a-f-]{36}$/);
  const id = new URL(page.url()).pathname.split("/")[2]!;
  await page.goto(`/invites/${id}/edition`);
  const basic = page.getByRole("article", { name: "Basic" });
  await basic.getByRole("button", { name: /^Pay / }).click();
  await page
    .getByRole("dialog", { name: "Test payment" })
    .getByRole("button", { name: "Pay (test)" })
    .click();
  await expect(basic.getByText("Your package")).toBeVisible();
  await expect(page.getByRole("link", { name: "Publish your invite" })).toBeVisible();

  await page.goto("/invites");
  await expect(card.getByText("Draft")).toBeVisible();
  await expect(card.getByText("Paid · Basic")).toBeVisible();
  await expect(card.getByRole("link", { name: "Publish" })).toBeVisible();
  await expect(card.getByRole("link", { name: "Share" })).toHaveCount(0);
  expect(await noOverflow(page)).toBe(true);
  expect((await axe(page).analyze()).violations).toEqual([]);
  if (process.env.SHOTS)
    await page.screenshot({
      path: `${process.env.SHOTS}/paid-draft-${info.project.name}.png`,
      fullPage: true,
    });

  // Publish from the card, then the card offers Share and Download
  await card.getByRole("link", { name: "Publish" }).click();
  await openPublish(page);
  await publish(page, "kabir-weds-ananya");
  await page.goto("/invites");
  await expect(card.getByText("Published")).toBeVisible();
  await expect(card.getByRole("link", { name: "Publish" })).toHaveCount(0);
  await expect(card.getByRole("link", { name: "Share" })).toBeVisible();
  if (process.env.SHOTS)
    await page.screenshot({
      path: `${process.env.SHOTS}/live-${info.project.name}.png`,
      fullPage: true,
    });
  if (process.env.SHOTS) {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.screenshot({
      path: `${process.env.SHOTS}/live-dark-${info.project.name}.png`,
      fullPage: true,
    });
    await page.emulateMedia({ colorScheme: "light" });
  }
  await card.getByRole("button", { name: "Download" }).click();
  const download = page.getByRole("dialog", { name: /^Download/ });
  await expect(download.getByRole("link", { name: "Invitation video" })).toHaveAttribute(
    "href",
    `/invites/${id}/video`,
  );
  await expect(download.getByRole("link", { name: /cards/ })).toHaveAttribute(
    "href",
    `/invites/${id}/cards`,
  );
  expect((await axe(page).analyze()).violations).toEqual([]);
  if (process.env.SHOTS)
    await page.screenshot({ path: `${process.env.SHOTS}/download-${info.project.name}.png` });
});
