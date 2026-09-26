import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const numberFor = (info: TestInfo) =>
  `8${String(info.workerIndex * 1000 + info.repeatEachIndex * 100 + info.retry).padStart(4, "0")}${String(Date.now()).slice(-5)}`;

// A 4×4 marigold PNG, enough for the browser to decode, shrink and store
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEUlEQVR4nGP4sMQQjhiI4wAA7GIcUc0K+8QAAAAASUVORK5CYII=",
  "base64",
);

const next = (page: Page) =>
  page.getByRole("button", { name: /^(Continue|Preview invitation)$/ }).click();

async function signIn(page: Page, number: string) {
  await page.getByRole("textbox", { name: /Mobile number/ }).fill(number);
  await page.getByRole("button", { name: "Send code" }).click();
  await page.getByRole("textbox", { name: /6-digit code/ }).fill("123456");
}

/** Signs in and writes a complete wedding invite with one photo, ending on the preview step. */
async function writeInvite(page: Page, number: string, names: [string, string]) {
  // A known "today" for the calendar; time still moves, so every edit saves
  await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
  await page.goto(`/sign-in?next=${encodeURIComponent("/create?quality=2d&new=1")}`);
  await signIn(page, number);
  await expect(page).toHaveURL(/\/create/);
  await next(page);
  await next(page);
  await page.getByRole("textbox", { name: /First name/ }).fill(names[0]);
  await page.getByRole("textbox", { name: /Second name/ }).fill(names[1]);
  await next(page);
  await page.getByRole("checkbox", { name: /Haldi/ }).click();
  const item = (name: string) =>
    page
      .getByRole("listitem")
      .filter({ has: page.getByRole("checkbox", { name: new RegExp(`^${name}`) }) });
  const wedding = item("Wedding");
  await wedding.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
  await wedding.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: "6:30 pm" }).click();
  await wedding.getByRole("textbox", { name: /^Venue/ }).fill("Taj Falaknuma, Hyderabad");
  await wedding.getByRole("button", { name: "Traditional Indian" }).click();
  const haldi = item("Haldi");
  await haldi.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("gridcell").getByRole("button", { name: /, 14 / }).click();
  await haldi.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: "10:00 am" }).click();
  await haldi.getByRole("textbox", { name: /^Venue/ }).fill("Family home, Banjara Hills");
  await next(page);
  await page.locator('input[type="file"]').setInputFiles({
    name: "us.png",
    mimeType: "image/png",
    buffer: PNG,
  });
  await expect(page.getByRole("img", { name: "Photo 1" })).toBeVisible();
  await next(page);
  await expect(page.getByText("Your invitation is ready")).toBeVisible();
}

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
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // The preview WhatsApp shows is a real image
    const preview = await page.request.get(`${new URL(link).pathname}/opengraph-image`);
    expect(preview.ok()).toBe(true);
    expect(preview.headers()["content-type"]).toBe("image/png");

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
    await expect(page.getByText("Saved to your account")).toHaveCount(1);
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

  test("an unknown link says the invitation isn't available", async ({ page }) => {
    await page.goto("/i/nobody-weds-anybody");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "This invitation isn't available",
    );
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
});
