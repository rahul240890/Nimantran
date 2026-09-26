import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, writeInvite } from "./invite-helpers";

test.describe("guest RSVP", () => {
  test.use({ reducedMotion: "reduce" });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`a guest replies without signing in and the host sees it (${colorScheme})`, async ({
      page,
      browser,
    }, info) => {
      await writeInvite(page, numberFor(info), ["Ishaan", "Tara"]);
      const path = await publish(page, "ishaan-weds-tara");
      const replies = page.getByRole("region", { name: "Replies" });
      await expect(replies.getByText(/No replies yet/)).toBeVisible();

      const context = await browser.newContext({
        baseURL: info.project.use.baseURL,
        viewport: info.project.use.viewport,
        reducedMotion: "reduce",
        colorScheme,
      });
      const guest = await context.newPage();
      await guest.goto(`${path}?quality=2d`);
      await guest.getByRole("link", { name: "Reply to the invitation" }).click();
      const form = guest.locator("#rsvp");
      await expect(guest.getByRole("heading", { name: "Will you join us?" })).toBeInViewport();

      // Sending with nothing filled in points at what's missing
      await form.getByRole("button", { name: "Send reply" }).click();
      await expect(form.getByRole("alert")).toHaveText("3 answers still need you.");
      await expect(form.getByRole("textbox", { name: /Your name/ })).toBeFocused();

      await form.getByRole("textbox", { name: /Your name/ }).fill("Rohan Mehta");
      await form.getByRole("button", { name: "Coming to everything" }).click();
      const wedding = form.getByRole("radiogroup", { name: "Your reply for the Wedding" });
      await expect(wedding.getByRole("radio", { name: /Joyfully accept/ })).toBeChecked();
      await form.getByRole("button", { name: "More children" }).last().click();
      await form.getByRole("combobox", { name: /Meal/ }).click();
      await guest.getByRole("option", { name: "Jain" }).click();
      await form.getByRole("textbox", { name: /A note for the family/ }).fill("See you there!");
      expect(await noOverflow(guest)).toBe(true);
      expect((await axe(guest).analyze()).violations).toEqual([]);
      await form.getByRole("button", { name: "Send reply" }).click();

      await expect(form.getByRole("heading", { name: "Thank you, Rohan!" })).toBeFocused();
      await expect(form.getByRole("listitem").filter({ hasText: "Wedding" })).toContainText(
        "Coming · 2 people",
      );
      expect((await axe(guest).analyze()).violations).toEqual([]);

      // Coming back on the same phone shows the reply, and it can change
      await guest.reload();
      await expect(form.getByRole("heading", { name: "Thank you, Rohan!" })).toBeVisible();
      await form.getByRole("button", { name: "Change my reply" }).click();
      await form
        .getByRole("radiogroup", { name: "Your reply for the Haldi" })
        .getByRole("radio", { name: /Regretfully decline/ })
        .click();
      await form.getByRole("button", { name: "Update reply" }).click();
      await expect(form.getByRole("listitem").filter({ hasText: "Haldi" })).toContainText(
        "Can't come",
      );

      await page.reload();
      await expect(replies.getByText("Rohan Mehta")).toBeVisible();
      await expect(replies.getByText("See you there!")).toBeVisible();
      await expect(
        replies.getByRole("listitem").filter({ hasText: "Wedding" }).first(),
      ).toContainText("2 coming");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
      await context.close();
    });
  }
});
