import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, type TestInfo } from "@playwright/test";

/* Shared steps for the publish and RSVP tests. */

export const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

export const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

// Ten digits even after failed workers restart: parallelIndex stays below the worker count
export const numberFor = (info: TestInfo) =>
  `8${String((info.parallelIndex % 10) * 1000 + info.repeatEachIndex * 100 + info.retry).padStart(4, "0")}${String(Date.now()).slice(-5)}`;

// A 4×4 marigold PNG, enough for the browser to decode, shrink and store
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEUlEQVR4nGP4sMQQjhiI4wAA7GIcUc0K+8QAAAAASUVORK5CYII=",
  "base64",
);

export const next = (page: Page) =>
  page.getByRole("button", { name: /^(Continue|Preview invitation)$/ }).click();

export async function signIn(page: Page, number: string) {
  await page.getByRole("textbox", { name: /Mobile number/ }).fill(number);
  await page.getByRole("button", { name: "Send code" }).click();
  await page.getByRole("textbox", { name: /6-digit code/ }).fill("123456");
  // A new account is asked its name first
  await page.getByRole("button", { name: "Skip for now" }).click();
}

/** Fills each of the design's photo frames through its own upload field. */
export async function addDesignPhotos(page: Page) {
  const add = page.getByRole("button", { name: /^Add: / });
  const count = await add.count();
  for (let i = count; i > 0; i--) {
    const chooser = page.waitForEvent("filechooser");
    await add.first().click();
    await (await chooser).setFiles({ name: "us.png", mimeType: "image/png", buffer: PNG });
    await expect(add).toHaveCount(i - 1);
  }
}

/** Signs in and writes a complete wedding invite with one photo, ending on the preview step. */
export async function writeInvite(page: Page, number: string, names: [string, string]) {
  // A known "today" for the calendar; time still moves, so every edit saves
  await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
  await page.goto(`/sign-in?next=${encodeURIComponent("/create?quality=2d&new=1")}`);
  await signIn(page, number);
  await expect(page).toHaveURL(/\/create/);
  await next(page);
  await next(page);
  await next(page);
  await next(page); // language
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
  await wedding.getByRole("button", { name: "More details" }).click();
  await wedding.getByRole("button", { name: "Traditional Indian" }).click();
  const haldi = item("Haldi");
  await haldi.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.getByRole("gridcell").getByRole("button", { name: /, 14 / }).click();
  await haldi.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: "10:00 am" }).click();
  await haldi.getByRole("textbox", { name: /^Venue/ }).fill("Family home, Banjara Hills");
  await next(page);
  await addDesignPhotos(page);
  await next(page);
  await expect(page.getByText("Your invitation is ready")).toBeVisible();
}

/** Publishes the invite open in the editor under a unique link; ends on the share page. */
export async function publish(page: Page, base: string): Promise<string> {
  const dialog = page.getByRole("dialog", { name: "Choose your link" });
  // A click that lands before the editor has hydrated opens nothing, so try again
  await expect(async () => {
    if (!(await dialog.isVisible())) await page.getByRole("button", { name: "Publish" }).click();
    await expect(dialog).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 30_000 });
  await dialog.getByRole("textbox", { name: /Invitation link/ }).fill(`${base}-${Date.now()}`);
  await expect(dialog.getByText("This link is free.")).toBeVisible();
  await dialog.getByRole("button", { name: "Publish invitation" }).click();
  await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/share$/);
  return new URL((await page.getByTestId("invite-link").textContent())!.trim()).pathname;
}
