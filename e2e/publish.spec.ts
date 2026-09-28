import { expect, test } from "@playwright/test";
import { axe, next, noOverflow, numberFor, publish, signIn, writeInvite } from "./invite-helpers";

test.describe("publish and share", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host publishes, shares, and a guest opens the invitation", async ({
    page,
    browser,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Aarav", "Meera"]);

    await page.getByRole("button", { name: "Publish" }).click();
    const dialog = page.getByRole("dialog", { name: "Choose your link" });
    await expect(dialog.getByRole("textbox", { name: /Invitation link/ })).toHaveValue(
      /^aarav-weds-meera/,
    );
    // A unique link, as other tests publish the same names
    await dialog
      .getByRole("textbox", { name: /Invitation link/ })
      .fill(`aarav-weds-meera-${Date.now()}`);
    await expect(dialog.getByText("This link is free.")).toBeVisible();
    expect((await axe(page).analyze()).violations).toEqual([]);
    await dialog.getByRole("button", { name: "Publish invitation" }).click();

    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/share$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your invitation is ready to send",
    );
    const link = (await page.getByTestId("invite-link").textContent())!.trim();
    expect(link).toMatch(/\/i\/aarav-weds-meera-\d+$/);
    const whatsapp = page.getByRole("link", { name: "Share on WhatsApp" });
    const href = new URL((await whatsapp.getAttribute("href"))!);
    expect(href.origin).toBe("https://wa.me");
    expect(href.searchParams.get("text")).toContain(link);
    await expect(page.getByRole("img", { name: /QR code for/ }).locator("svg")).toBeVisible();
    // The WhatsApp preview on this page loads the real picture
    const bubble = page.getByRole("region", { name: "How it looks in WhatsApp" }).locator("img");
    await expect
      .poll(() => bubble.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBe(1200);
    // The signed-in header fits common phone widths, with the name showing
    for (const width of [360, 375]) {
      await page.setViewportSize({ width, height: 760 });
      await expect.poll(() => noOverflow(page)).toBe(true);
    }
    await page.setViewportSize(info.project.use.viewport!);
    // The title streams in after the page on a client navigation; wait for it before axe
    await expect(page).toHaveTitle(/\S/);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // A guest, with no account
    const guestContext = await browser.newContext({
      baseURL: info.project.use.baseURL,
      viewport: info.project.use.viewport,
      reducedMotion: "reduce",
    });
    const guest = await guestContext.newPage();
    await guest.goto(`${new URL(link).pathname}?quality=2d`);
    await expect(guest.getByRole("heading", { level: 1 })).toHaveText("Aarav & Meera");
    await expect(guest.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(guest.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
    // The preview WhatsApp shows is a real image
    const image = await guest.locator('meta[property="og:image"]').getAttribute("content");
    const preview = await page.request.get(new URL(image!).pathname);
    expect(preview.ok()).toBe(true);
    expect(preview.headers()["content-type"]).toBe("image/png");
    const haldi = guest.getByRole("article", { name: "Haldi" });
    await expect(haldi.getByText("Wednesday, 14 October 2026")).toBeVisible();
    await expect(haldi.getByText("Family home, Banjara Hills")).toBeVisible();
    const directions = await haldi.getByRole("link", { name: "Directions" }).getAttribute("href");
    expect(directions).toContain("google.com/maps");
    const wedding = guest.getByRole("article", { name: "Wedding" });
    await expect(wedding.getByText("Traditional Indian")).toBeVisible();
    await wedding.getByRole("button", { name: "Add to calendar" }).click();
    const ics = await guest.getByRole("menuitem", { name: /Apple/ }).getAttribute("href");
    const calendar = await guest.request.get(ics!);
    expect(await calendar.text()).toContain("DTSTART:20261015T130000Z");
    await guest.keyboard.press("Escape");
    await expect(guest.getByRole("img", { name: "Photo 1 from the family" })).toBeVisible();
    expect(await noOverflow(guest)).toBe(true);
    expect((await axe(guest).analyze()).violations).toEqual([]);

    // Stopping sharing closes the link
    await page.getByRole("button", { name: "Stop sharing" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Stop sharing" }).click();
    await expect(page).toHaveURL(/\/invites$/);
    await guest.reload();
    await expect(guest.getByRole("heading", { level: 1 })).toHaveText(
      "This invitation isn't available",
    );
  });

  test("photos move to the account and appear on another device", async ({
    page,
    browser,
  }, info) => {
    const number = numberFor(info);
    await writeInvite(page, number, ["Kabir", "Ananya"]);
    // Let the autosave timer fire under the test clock, then wait for the save and upload
    await page.clock.runFor(2_000);
    // "Saved" can still be showing from an earlier save while the last one, with the photo,
    // is on its way: wait until the draft as it stands now is the one marked saved
    await expect
      .poll(() =>
        page.evaluate(() => {
          const draft = JSON.parse(localStorage.getItem("nimantran-invite-draft") ?? "null");
          const saved = localStorage.getItem("nimantran-invite-synced");
          return Boolean(draft?.remoteId) && saved === `${draft.remoteId}:${draft.updatedAt}`;
        }),
      )
      .toBe(true);
    await page.goto("/invites");
    await expect(page.getByRole("article").getByText("Draft", { exact: true })).toBeVisible();

    const laptop = await browser.newPage({
      baseURL: info.project.use.baseURL,
      reducedMotion: "reduce",
    });
    await laptop.goto("/sign-in?next=/invites");
    await signIn(laptop, number);
    await laptop.getByRole("article").getByRole("link", { name: "Continue" }).click();
    await expect(laptop.getByText("Your invitation is ready")).toBeVisible();
    await expect(laptop.getByRole("img", { name: "Photo 1" })).toBeVisible();
    await expect
      .poll(() =>
        laptop
          .getByRole("img", { name: "Photo 1" })
          .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
      )
      .toBe(true);
  });

  test("a two-language card with a muhurat opens in the guest's language", async ({
    page,
    browser,
  }, info) => {
    await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
    await page.goto(`/sign-in?next=${encodeURIComponent("/create?quality=2d&new=1&region=GJ")}`);
    await signIn(page, numberFor(info));
    await expect(page).toHaveURL(/\/create/);
    await next(page);
    await page.getByRole("radio", { name: /^Gujarati/ }).click();
    await next(page);
    await next(page);

    await page.getByRole("radio", { name: "ગુજરાતી and English" }).click();
    await page.locator('[data-slot="first"]').fill("આરવ");
    await page.locator('[data-slot="second"]').fill("મીરા");
    const english = page.getByRole("region", { name: "The card in English" });
    await english.locator('[data-translation="first"]').fill("Aarav");
    await english.locator('[data-translation="second"]').fill("Meera");
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await next(page);

    const wedding = page
      .getByRole("listitem")
      .filter({ has: page.getByRole("checkbox", { name: /^Wedding/ }) });
    await wedding.getByRole("button", { name: /^Date/ }).click();
    await page.getByRole("button", { name: /next month/i }).click();
    await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
    await expect(wedding.getByText("શુભ મુહૂર્ત")).toBeVisible();
    // A muhurat is set to the minute
    await wedding.getByRole("combobox", { name: /Starts at/ }).click();
    await page.getByRole("option", { name: "9:47 am" }).click();
    await wedding.getByRole("combobox", { name: /Ends at/ }).click();
    await page.getByRole("option", { name: "10:31 am" }).click();
    await wedding.getByRole("textbox", { name: /^Venue/ }).fill("Hotel Grand Bhagwati, Surat");
    await next(page);
    await next(page);
    await expect(page.getByText("Your invitation is ready")).toBeVisible();
    const path = await publish(page, "aarav-meera-gu");

    const guestContext = await browser.newContext({
      baseURL: info.project.use.baseURL,
      viewport: info.project.use.viewport,
      reducedMotion: "reduce",
    });
    const guest = await guestContext.newPage();
    // Five days before the wedding, in India
    await guest.clock.install({ time: new Date("2026-10-10T09:00:00+05:30") });
    await guest.goto(`${path}?quality=2d`);
    // The painted theme opens as a doorway, counting down to the wedding
    const door = guest.locator("[data-doorway]");
    await expect(door).toHaveAttribute("data-doorway", "closed");
    await expect(guest.getByRole("timer", { name: /In 5 days/ })).toBeVisible();
    const toggle = guest.getByRole("radiogroup", { name: "Card language" });
    // An English-speaking guest sees the English card first
    await expect(toggle.getByRole("radio", { name: "English" })).toBeChecked();
    await expect(door.getByRole("heading", { level: 1 })).toContainText("Aarav");
    await expect(door.getByText("Shri Ganeshaya Namah")).toBeVisible();
    await toggle.getByRole("radio", { name: "ગુજરાતી" }).click();
    await expect(door.getByRole("heading", { level: 1 })).toContainText("આરવ");
    await expect(door.getByText("॥ શ્રી ગણેશાય નમઃ ॥")).toBeVisible();
    await expect(door.getByText("ગુરુવાર, 15 ઓક્ટોબર 2026")).toBeVisible();
    // The countdown speaks the card's language too
    await expect(door.getByText("દિવસ", { exact: true })).toBeVisible();
    expect(await noOverflow(guest)).toBe(true);
    expect((await axe(guest).analyze()).violations).toEqual([]);

    // Opening it brings the event pages, in the chosen language and the Gujarati
    // tradition's own theme (in Still mode, straight away)
    await guest.getByRole("button", { name: "Open the invitation" }).click();
    const story = guest.locator("[data-story-beat]");
    await expect(story).toHaveAttribute("data-story-beat", "cover");
    await expect(story).toHaveAttribute("data-suite", "kutch-toran");
    await expect(story.getByText("॥ શ્રી ગણેશાય નમઃ ॥")).toBeVisible();
    await expect(story.getByText("આરવ")).toBeVisible();
    await guest.keyboard.press("ArrowRight");
    await expect(story).toHaveAttribute("data-story-beat", "family");
    await guest.keyboard.press("ArrowRight");
    await expect(story).toHaveAttribute("data-story-beat", "fn-wedding");
    await expect(story.getByText("5 દિવસ બાકી")).toBeVisible();
    await expect(story.getByText("શુભ મુહૂર્ત")).toBeVisible();
    // The card's time is Gujarati too, never "AM" in English letters
    await expect(story.getByText("સવારે 9:47 થી 10:31")).toBeVisible();
    await guest.keyboard.press("ArrowRight");
    const reply = story.getByRole("link", { name: "Reply to the invitation" });
    await expect(reply).toHaveAttribute("href", "#rsvp");
    expect((await axe(guest).analyze()).violations).toEqual([]);
    await reply.click();
    await expect(story).toHaveCount(0);
    await expect(guest).toHaveURL(/#rsvp$/);

    const article = guest.getByRole("article", { name: /Wedding/ });
    await expect(article.getByText("શુભ મુહૂર્ત")).toBeVisible();
    await expect(article.getByText("9:47 am to 10:31 am")).toBeVisible();
    await article.getByRole("button", { name: "Add to calendar" }).click();
    const ics = await guest.getByRole("menuitem", { name: /Apple/ }).getAttribute("href");
    const calendar = await (await guest.request.get(ics!)).text();
    expect(calendar).toContain("DTSTART:20261015T041700Z");
    expect(calendar).toContain("DTEND:20261015T050100Z");
    await guest.keyboard.press("Escape");
    expect(await noOverflow(guest)).toBe(true);
    expect((await axe(guest).analyze()).violations).toEqual([]);
    await guestContext.close();
  });

  test("an unknown link says the invitation isn't available", async ({ page }) => {
    await page.goto("/i/nobody-weds-anybody");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "This invitation isn't available",
    );
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
});
