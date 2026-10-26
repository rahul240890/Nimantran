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
      await expect(form.getByRole("alert")).toHaveText("2 answers still need you.");
      await expect(form.getByRole("textbox", { name: /Your name/ })).toBeFocused();

      await form.getByRole("textbox", { name: /Your name/ }).fill("Rohan Mehta");
      // Just a name and whether they are coming: no counts, meals or notes (owner, 2026-10-26)
      await expect(form.getByRole("textbox")).toHaveCount(1);
      await form.getByRole("radio", { name: "Yes, I'll be there" }).click();
      expect(await noOverflow(guest)).toBe(true);
      expect((await axe(guest).analyze()).violations).toEqual([]);

      // A bot that fills in the field people never see gets nowhere
      const trap = form.locator('input[name="website"]');
      await trap.fill("https://spam.example", { force: true });
      await form.getByRole("button", { name: "Send reply" }).click();
      await expect(form.getByRole("alert")).toHaveText(/Couldn't send your reply/);
      await trap.fill("", { force: true });
      await form.getByRole("button", { name: "Send reply" }).click();

      await expect(form.getByRole("heading", { name: "Thank you, Rohan!" })).toBeFocused();
      await expect(form.getByText("The family can't wait to celebrate with you.")).toBeVisible();
      // A guest with a celebration of their own starts from this design, counted as a guest
      const likeThis = /^\/(create\/[a-z0-9-]+\?category=wedding&|\?)utm_source=guest$/;
      await expect(
        form.getByRole("link", { name: "Make an invitation like this" }),
      ).toHaveAttribute("href", likeThis);
      await expect(
        guest.locator("footer [data-make-like-this]").getByRole("link", {
          name: "Make an invitation like this",
        }),
      ).toHaveAttribute("href", likeThis);
      expect((await axe(guest).analyze()).violations).toEqual([]);

      // Coming back on the same phone shows the reply, and it can change
      await guest.reload();
      await expect(form.getByRole("heading", { name: "Thank you, Rohan!" })).toBeVisible();
      await form.getByRole("button", { name: "Change my reply" }).click();
      await expect(form.getByRole("radio", { name: "Yes, I'll be there" })).toBeChecked();
      await form.getByRole("radio", { name: "Sorry, I can't come" }).click();
      await form.getByRole("button", { name: "Update reply" }).click();
      await expect(
        form.getByText("You will be missed. Thank you for your blessings."),
      ).toBeVisible();

      await page.reload();
      await expect(replies.getByText("Rohan Mehta")).toBeVisible();
      // One answer for every celebration they were invited to
      await expect(
        replies.getByRole("listitem").filter({ hasText: "Wedding" }).first(),
      ).toContainText("1 can't come");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
      await context.close();
    });
  }
});
