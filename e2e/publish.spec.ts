import { expect, test } from "@playwright/test";
import {
  addDesignPhotos,
  axe,
  firstName,
  noOverflow,
  numberFor,
  openPart,
  openPublish,
  publish,
  seeInvitation,
  signIn,
  writeInvite,
} from "./invite-helpers";

/** A mono WAV of a soft tone, `seconds` long, for the music clip tests. */
function toneWav(seconds: number): Buffer {
  const rate = 8_000;
  const samples = rate * seconds;
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + samples * 2, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) {
    const swell = Math.sin((Math.PI * i) / samples);
    wav.writeInt16LE(
      Math.round(Math.sin((2 * Math.PI * 440 * i) / rate) * 8000 * swell),
      44 + i * 2,
    );
  }
  return wav;
}

test.describe("publish and share", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host publishes, shares, and a guest opens the invitation", async ({
    page,
    browser,
  }, info) => {
    await writeInvite(page, numberFor(info), ["Aarav", "Meera"]);

    // The packages come first; until payments are on, the invite publishes free
    const dialog = await openPublish(page);
    // The link is made from the names and is free, with nothing to type
    await expect(dialog.getByText(/\/i\/aarav-weds-meera/)).toBeVisible();
    await expect(dialog.getByText("Made from your names, and it's yours.")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Publish invitation" })).toBeEnabled();
    // A unique link, as other tests publish the same names
    await dialog.getByRole("button", { name: "Change link" }).click();
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
    // Bold names, the venue, and the link on its own line where WhatsApp builds its preview
    const text = href.searchParams.get("text")!;
    expect(text).toContain("*Aarav & Meera*");
    expect(text).toContain("📍 Taj Falaknuma, Hyderabad");
    expect(text.endsWith(`\n\n${link}`)).toBe(true);
    // The preview on this page shows the message as WhatsApp will: names in bold
    await expect(
      page.getByTestId("chat-text").locator(".font-bold", { hasText: "Aarav & Meera" }),
    ).toBeVisible();
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
      /\/i\/[a-z0-9-]+\/cover\?v=[0-9a-z]+$/,
    );
    // The preview WhatsApp shows is a real image, on the host the guest opened, and small enough
    // for WhatsApp to show it at all (it drops pictures over about 300 KB)
    const image = await guest.locator('meta[property="og:image"]').getAttribute("content");
    expect(new URL(image!).origin).toBe(new URL(link).origin);
    const preview = await page.request.get(`${new URL(image!).pathname}${new URL(image!).search}`);
    expect(preview.ok()).toBe(true);
    expect(preview.headers()["content-type"]).toBe("image/jpeg");
    expect((await preview.body()).byteLength).toBeLessThan(300_000);
    // Versioned, so the CDN keeps it and WhatsApp gets it at once
    expect(preview.headers()["cache-control"]).toContain("s-maxage=31536000");
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

  // Owner, 2026-10-24: names typed in Hindi gave no link, so hosts had to make one up
  test("names in Hindi give a link in English letters, ready in one click", async ({
    page,
  }, info) => {
    await writeInvite(page, numberFor(info), ["राहुल", "प्रिया"]);
    const dialog = await openPublish(page);
    await expect(dialog.getByText(/\/i\/rahul-weds-priya/)).toBeVisible();
    await expect(dialog.getByText("Made from your names, and it's yours.")).toBeVisible();
    expect((await axe(page).analyze()).violations).toEqual([]);
    await dialog.getByRole("button", { name: "Publish invitation" }).click();
    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/share$/);
    const link = (await page.getByTestId("invite-link").textContent())!.trim();
    // Taken by an earlier run, it moves on to the occasion's year, or a number
    expect(link).toMatch(/\/i\/rahul-weds-priya(-\d+)?$/);
  });

  test("photos move to the account and appear on another device", async ({
    page,
    browser,
  }, info) => {
    test.slow();
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
    // Continue opens the invite on its design's page, everything in it
    await laptop.getByRole("article").getByRole("link", { name: "Continue" }).click();
    await expect(laptop).toHaveURL(/\/create\/rajwada-bagh\?.*invite=/);
    await expect(firstName(laptop)).toHaveValue("Kabir", {
      timeout: 30_000,
    });
    await seeInvitation(laptop);
    // The photo's link comes from the account by a server action, slow on a busy runner
    await expect(laptop.getByRole("img", { name: "Photo 1" })).toBeVisible({ timeout: 30_000 });
    await expect
      .poll(() =>
        laptop
          .getByRole("img", { name: "Photo 1" })
          .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
      )
      .toBe(true);
  });

  test("a host's own music is kept at once, its start moved, and follows the invite to another device", async ({
    page,
    browser,
  }, info) => {
    const number = numberFor(info);
    await writeInvite(page, number, ["Ishaan", "Tara"]);
    // The preview's Edit opens Music & replies on the design's page
    await page.getByRole("button", { name: "Edit music" }).click();
    await expect(page).toHaveURL(/\/create\/rajwada-bagh\?.*#part-music$/);
    await page.getByRole("radio", { name: "Your own music" }).click();
    await expect(page.getByText("Only songs you have the right to use.")).toBeVisible();
    await page.locator('input[accept^="audio"]').setInputFiles({
      name: "Shehnai at dawn.wav",
      mimeType: "audio/wav",
      buffer: toneWav(4),
    });
    // Shorter than the invitation plays: the host is asked for a longer song
    await expect(page.getByText(/Choose a longer song/)).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.locator('input[accept^="audio"]').setInputFiles({
      name: "Shehnai at dawn.wav",
      mimeType: "audio/wav",
      buffer: toneWav(150),
    });
    // Long enough: it is the invitation's music straight away, nothing more to press
    await expect(page.getByRole("img", { name: /The shape of Shehnai at dawn/ })).toBeVisible();
    await expect(page.getByText(/Your music · [12]:\d\d/)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: "Use this music" })).toHaveCount(0);
    // Moving where it starts keeps the new part a moment later
    const clipId = () =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("nimantran-invite-draft") ?? "null")?.music?.clip?.id,
      );
    await expect.poll(clipId).toBeTruthy();
    const first = await clipId();
    const start = page.getByRole("slider", { name: "Starts at" });
    await start.focus();
    await page.keyboard.press("End");
    await expect(start).not.toHaveAttribute("aria-valuetext", "0:00");
    await page.clock.runFor(1_000);
    await expect.poll(clipId, { timeout: 30_000 }).not.toBe(first);
    await expect(page.getByText(/Your music · [12]:\d\d/)).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await seeInvitation(page);
    await expect(page.getByText(/Shehnai at dawn/)).toBeVisible();

    await page.clock.runFor(2_000);
    await expect
      .poll(() =>
        page.evaluate(() => {
          const draft = JSON.parse(localStorage.getItem("nimantran-invite-draft") ?? "null");
          const saved = localStorage.getItem("nimantran-invite-synced");
          return Boolean(draft?.remoteId) && saved === `${draft.remoteId}:${draft.updatedAt}`;
        }),
      )
      .toBe(true);

    // On another device the clip comes from the account, ready to play
    const laptop = await browser.newPage({
      baseURL: info.project.use.baseURL,
      reducedMotion: "reduce",
    });
    await laptop.goto("/sign-in?next=/invites");
    await signIn(laptop, number);
    await laptop.getByRole("article").getByRole("link", { name: "Continue" }).click();
    await expect(laptop).toHaveURL(/\/create\/rajwada-bagh\?.*invite=/);
    await openPart(laptop, "Music & replies");
    await expect(laptop.getByRole("radio", { name: "Your own music" })).toBeChecked();
    await expect(laptop.getByText("Shehnai at dawn")).toBeVisible();
    await expect(laptop.getByRole("button", { name: "Listen" })).toBeEnabled({ timeout: 15_000 });
  });

  test("a Gujarati card with a muhurat opens in its own language", async ({
    page,
    browser,
  }, info) => {
    // Every step and the packages before publishing
    test.slow();
    await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
    // A Gujarati wedding's design: the card is written in Gujarati from the start
    await page.goto(
      `/sign-in?next=${encodeURIComponent("/create/kutch-toran?category=wedding&tradition=gujarati")}`,
    );
    await signIn(page, numberFor(info));
    await expect(page).toHaveURL(/\/create\/kutch-toran/);

    // The names, in Gujarati: the tradition's own language
    await expect(page.getByRole("radio", { name: /^ગુજરાતી/ })).toBeChecked({ timeout: 30_000 });
    await expect(async () => {
      await page.locator('[data-slot="first"]').fill("આરવ");
      await expect(page.locator('[data-slot="first"]')).toHaveValue("આરવ", { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await page.locator('[data-slot="second"]').fill("મીરા");

    await openPart(page, "When and where");
    const wedding = page.locator('[data-function="wedding"]');
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
    await openPart(page, "Your photos");
    await addDesignPhotos(page);
    await seeInvitation(page);
    // One card language for now (owner, 2026-10-24): no second one is offered
    await expect(page.getByRole("region", { name: "Add a second language?" })).toHaveCount(0);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
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
    // The painted theme opens at its gate, counting down to the wedding
    const door = guest.locator("[data-doorway]");
    await expect(door).toHaveAttribute("data-doorway", "closed");
    // One language on the card: no switch, and the names in Gujarati
    await expect(guest.getByRole("radiogroup", { name: /Card language|કાર્ડની ભાષા/ })).toHaveCount(
      0,
    );
    await expect(door.getByRole("heading", { level: 1 })).toContainText("આરવ");
    // The opening shows only the names, lightly, with no plate over the gate; the blessing
    // waits for the pages
    await expect(door.getByText("॥ શ્રી ગણેશાય નમઃ ॥")).toHaveCount(0);
    // The countdown and the buttons around the card speak the card's language too
    await expect(door.getByText("દિવસ", { exact: true })).toBeVisible();
    expect(await noOverflow(guest)).toBe(true);
    expect((await axe(guest).analyze()).violations).toEqual([]);

    // Opening it brings the event pages, in the chosen language and the Gujarati
    // tradition's own theme (in Still mode, straight away)
    await guest.getByRole("button", { name: "આમંત્રણ ખોલો" }).click();
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
    // The last page welcomes the guest and carries on down the page, in Gujarati
    await expect(story.getByText("આપનું આગમન, અમારું સૌભાગ્ય")).toBeVisible();
    const more = story.getByRole("button", { name: "વિગતો જુઓ" });
    expect((await axe(guest).analyze()).violations).toEqual([]);
    await more.click();
    await expect(story).toHaveCount(0);

    const article = guest.getByRole("article", { name: "હસ્તમેળાપ" });
    await expect(article.getByText("શુભ મુહૂર્ત")).toBeVisible();
    await expect(article.getByText("સવારે 9:47 થી 10:31")).toBeVisible();
    await article.getByRole("button", { name: "કૅલેન્ડરમાં ઉમેરો" }).click();
    const ics = await guest.getByRole("menuitem", { name: /Apple/ }).getAttribute("href");
    const calendar = await (await guest.request.get(ics!)).text();
    expect(calendar).toContain("DTSTART:20261015T041700Z");
    expect(calendar).toContain("DTEND:20261015T050100Z");
    await guest.keyboard.press("Escape");
    // The reply form below speaks Gujarati as well
    await expect(guest.getByRole("button", { name: "જવાબ મોકલો" })).toBeVisible();
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
