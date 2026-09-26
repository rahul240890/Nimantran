import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, signIn, writeInvite } from "./invite-helpers";

test.describe("host dashboard", () => {
  test.use({ reducedMotion: "reduce" });

  test("hosts build a guest list, guests reply from personal links, a co-host joins", async ({
    page,
    browser,
  }, info) => {
    test.slow();
    await writeInvite(page, numberFor(info), ["Kabir", "Anaya"]);
    await publish(page, "kabir-weds-anaya");
    await page.getByRole("link", { name: "Open guest list" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+$/);
    await expect(page.getByRole("heading", { name: "Kabir & Anaya" })).toBeVisible();
    await expect(page.getByText("Your guest list starts here")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // One guest, checked as they're typed
    await page.getByRole("button", { name: "Add guests" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Add guests" });
    await dialog.getByRole("textbox", { name: /WhatsApp number/ }).fill("12345");
    await dialog.getByRole("button", { name: "Add guest" }).click();
    await expect(dialog.getByText("Enter a name")).toBeVisible();
    await expect(dialog.getByText("That doesn't look like a phone number")).toBeVisible();
    await dialog.getByRole("textbox", { name: /^Name/ }).fill("Nani");
    await dialog.getByRole("textbox", { name: /WhatsApp number/ }).fill("98123 45678");
    await dialog.getByRole("textbox", { name: /^Group/ }).fill("Bride's family");
    await dialog.getByRole("button", { name: "More people" }).click();
    await dialog.getByRole("button", { name: "Add guest" }).click();
    await expect(page.getByText("Guest added", { exact: true })).toBeVisible();

    // A pasted list
    await page.getByRole("button", { name: "Add guests" }).first().click();
    await dialog.getByRole("tab", { name: "Paste a list" }).click();
    await dialog
      .getByRole("textbox", { name: /Your list/ })
      .fill("Sharma uncle, 98765 43210 (4)\nDadi\nAnil 1234567890");
    await expect(dialog.getByText("2 guests ready. 1 line needs fixing.")).toBeVisible();
    expect((await axe(page).analyze()).violations).toEqual([]);
    await dialog.getByRole("button", { name: "Add 2 guests" }).click();
    await expect(page.getByText("2 guests added", { exact: true })).toBeVisible();

    const list = page.getByTestId("guest-list");
    await expect(list.getByRole("listitem").filter({ hasText: /^Sharma uncle/ })).toContainText(
      "4 people",
    );
    const stats = page.getByRole("region", { name: "At a glance" });
    await expect(stats.getByRole("definition").first()).toHaveText("3");

    // Nani's personal link, from the menu beside her name
    await page.getByRole("button", { name: "Actions for Nani" }).click();
    const send = page.getByRole("menuitem", { name: "Send invitation" });
    const wa = new URL((await send.getAttribute("href"))!);
    expect(wa.pathname).toBe("/919812345678");
    const personal = /https?:\/\/\S+\?g=[0-9a-f]+/.exec(wa.searchParams.get("text")!)![0];
    await page.keyboard.press("Escape");

    const guestContext = await browser.newContext({
      baseURL: info.project.use.baseURL,
      viewport: info.project.use.viewport,
      reducedMotion: "reduce",
    });
    const guest = await guestContext.newPage();
    await guest.goto(`${new URL(personal).pathname}${new URL(personal).search}&quality=2d`);
    const form = guest.locator("#rsvp");
    await form.getByRole("textbox", { name: /Your name/ }).fill("Nani ji");
    await form.getByRole("button", { name: "Coming to everything" }).click();
    await form.getByRole("button", { name: "Send reply" }).click();
    await expect(form.getByRole("heading", { name: /Thank you/ })).toBeVisible();
    await guestContext.close();

    await page.reload();
    await expect(list.getByRole("listitem").filter({ hasText: /^Nani/ }).first()).toContainText(
      "Wedding: Coming",
    );
    await page.getByRole("button", { name: /^Waiting/ }).click();
    await expect(page.getByText("2 of 3 guests")).toBeVisible();
    await page.getByRole("button", { name: /^Everyone/ }).click();
    await page.getByRole("searchbox", { name: "Search guests" }).fill("dadi");
    await expect(page.getByText("1 of 3 guests")).toBeVisible();
    await page.getByRole("button", { name: "Clear search" }).click();

    // The spreadsheet has everyone with their replies
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Download CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("kabir-anaya-guests.csv");
    const csv = await readFile((await download.path())!, "utf8");
    expect(csv).toContain("Nani,'+919812345678,Bride's family,2");
    expect(csv).toContain("Coming");

    // Reminders go to those still waiting
    const reminders = page.getByRole("region", { name: "Reminders" });
    await expect(reminders).toContainText("2 guests haven't replied yet");
    await reminders.getByRole("button", { name: "Send reminders" }).click();
    const remindDialog = page.getByRole("dialog", { name: /Remind guests/ });
    await expect(
      remindDialog.getByRole("link", { name: "Remind Sharma uncle on WhatsApp" }),
    ).toHaveAttribute("href", /wa\.me\/919876543210/);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await remindDialog.getByRole("button", { name: "Done" }).click();

    // A co-host joins from a private link
    const cohosts = page.getByRole("region", { name: "Co-hosts" });
    await cohosts.getByRole("button", { name: "Invite a co-host" }).click();
    const inviteDialog = page.getByRole("dialog", { name: "Invite a co-host" });
    await inviteDialog.getByRole("textbox", { name: /Who is it for/ }).fill("Anaya's family");
    await inviteDialog.getByRole("button", { name: "Make link" }).click();
    const joinLink = (await inviteDialog.getByTestId("cohost-link").textContent())!.trim();
    await inviteDialog.getByRole("button", { name: "Close" }).click();
    await expect(cohosts.getByText("Link for Anaya's family")).toBeVisible();

    const cohostContext = await browser.newContext({
      baseURL: info.project.use.baseURL,
      viewport: info.project.use.viewport,
      reducedMotion: "reduce",
    });
    const cohost = await cohostContext.newPage();
    await cohost.goto(new URL(joinLink).pathname);
    await expect(
      cohost.getByRole("heading", { name: "Help run Kabir & Anaya's invitation" }),
    ).toBeVisible();
    expect(await noOverflow(cohost)).toBe(true);
    await cohost.getByRole("link", { name: "Sign in to accept" }).click();
    await signIn(cohost, numberFor(info).replace(/^8/, "7"));
    await expect(cohost).toHaveURL(/\/join\//);
    await cohost.getByRole("button", { name: "Accept and open guest list" }).click();
    await expect(cohost).toHaveURL(/\/invites\/[0-9a-f-]+$/);
    await expect(cohost.getByTestId("guest-list")).toContainText("Nani");
    await expect(
      cohost.getByText("Only the person who created the invite can add co-hosts."),
    ).toBeVisible();
    expect(await noOverflow(cohost)).toBe(true);
    expect((await axe(cohost).analyze()).violations).toEqual([]);

    // The link works once
    await cohost.goto(new URL(joinLink).pathname);
    await expect(cohost.getByText("This link has already been used")).toBeVisible();
    await cohost.goto("/invites");
    await expect(cohost.getByText("Co-host", { exact: true })).toBeVisible();
    await cohostContext.close();

    await page.reload();
    await expect(cohosts.getByText("Anaya's family")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`the dashboard passes accessibility checks (${colorScheme})`, async ({ page }, info) => {
      await page.emulateMedia({ colorScheme });
      await writeInvite(page, numberFor(info), ["Vir", "Isha"]);
      await publish(page, "vir-weds-isha");
      await page.getByRole("link", { name: "Open guest list" }).click();
      await page.getByRole("button", { name: "Add guests" }).first().click();
      const dialog = page.getByRole("dialog", { name: "Add guests" });
      await dialog.getByRole("textbox", { name: /^Name/ }).fill("Masi");
      await dialog.getByRole("button", { name: "Add guest" }).click();
      await expect(page.getByTestId("guest-list")).toContainText("Masi");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  }
});
