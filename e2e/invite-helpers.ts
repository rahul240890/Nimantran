import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

/* Shared steps for the tests that write and publish an invite on a design's page. */

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

/** The design an invite is written on unless a test names another. */
export const DESIGN = "/create/rajwada-bagh?category=wedding";

/** Fills the names on a design's page, again if typing landed before the page hydrated. */
export async function fillNames(page: Page, names: [string, string]) {
  await openPart(page, "Names");
  const first = page.getByRole("textbox", { name: /First name/ });
  const second = page.getByRole("textbox", { name: /Second name/ });
  await expect(async () => {
    await first.fill(names[0]);
    await second.fill(names[1]);
    await expect(first).toHaveValue(names[0], { timeout: 3_000 });
    await expect(second).toHaveValue(names[1], { timeout: 3_000 });
  }).toPass({ timeout: 30_000 });
}

/** Ticks events in When and where on a design's page, from behind More events if need be. */
export async function tickEvents(page: Page, ...names: string[]) {
  await openPart(page, "When and where");
  const events = page.getByRole("group", { name: "Your events" });
  for (const name of names) {
    const chip = events.getByRole("button", { name, exact: true });
    if ((await chip.count()) === 0) {
      await events.getByRole("button", { name: "More events" }).click();
    }
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
  }
}

/** One event's date (a day next month), time and venue, in its card on a design's page. */
export async function fillEvent(
  page: Page,
  id: string,
  { day, time, venue }: { day: number; time: string; venue: string },
) {
  await openPart(page, "When and where");
  const event = page.locator(`[data-function="${id}"]`);
  await event.getByRole("button", { name: /^Date/ }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page
    .getByRole("gridcell")
    .getByRole("button", { name: new RegExp(`, ${day} `) })
    .click();
  await event.getByRole("combobox", { name: /Starts at/ }).click();
  await page.getByRole("option", { name: time }).click();
  await event.getByRole("textbox", { name: /^Venue/ }).fill(venue);
  return event;
}

/** Opens one of the folded parts of a design's page: Family names, Your photos and the rest. */
export async function openPart(page: Page, title: string) {
  // The title leads its summary, ahead of what's in it ("NamesAditya & Priya")
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const details = page.locator('details[name="editor-parts"]').filter({
    has: page.locator(":scope > summary", { hasText: new RegExp(`^${escaped}`) }),
  });
  if ((await details.getAttribute("open")) === null) {
    await details.locator(":scope > summary").click();
  }
  await expect(details).toHaveAttribute("open", "");
}

/** The first name's field, folded away or not. */
export const firstName = (page: Page) => page.locator('input[data-slot="first"]');

/** See my invitation: from a design's page to its preview. */
export async function seeInvitation(page: Page) {
  await page.getByRole("button", { name: "See my invitation" }).click();
  await expect(page).toHaveURL(/\/create$/);
  await expect(page.getByText("Your invitation is ready")).toBeVisible({ timeout: 15_000 });
}

/**
 * Signs in and writes a complete wedding invite with one photo on a design's page, ending
 * on its preview.
 */
export async function writeInvite(
  page: Page,
  number: string,
  names: [string, string],
  design = DESIGN,
) {
  // The whole page, then the packages before publishing: more time than a plain test
  test.info().setTimeout(test.info().timeout + 45_000);
  // A known "today" for the calendar; time still moves, so every edit saves
  await page.clock.install({ time: new Date("2026-09-26T10:00:00") });
  await page.goto(`/sign-in?next=${encodeURIComponent(design)}`);
  await signIn(page, number);
  await expect(page).toHaveURL(/\/create\//);
  await fillNames(page, names);
  await tickEvents(page, "Haldi");
  const wedding = await fillEvent(page, "wedding", {
    day: 15,
    time: "6:30 pm",
    venue: "Taj Falaknuma, Hyderabad",
  });
  await wedding.getByRole("button", { name: "More details" }).click();
  await wedding.getByRole("button", { name: "Traditional Indian" }).click();
  await fillEvent(page, "haldi", {
    day: 14,
    time: "10:00 am",
    venue: "Family home, Banjara Hills",
  });
  await openPart(page, "Your photos");
  await addDesignPhotos(page);
  await seeInvitation(page);
}

/**
 * Opens the link dialog from the editor. Publishing passes through the packages first; until
 * payments are on, they publish free. A click that lands before the page has hydrated does
 * nothing, so try again.
 */
export async function openPublish(page: Page) {
  const dialog = page.getByRole("dialog", { name: "Choose your link" });
  await expect(async () => {
    if (!(await dialog.isVisible())) {
      if (/\/edition/.test(page.url())) {
        await page.getByRole("link", { name: "Publish your invite" }).click();
      } else {
        await page.getByRole("button", { name: "Publish" }).click();
      }
    }
    await expect(dialog).toBeVisible({ timeout: 5_000 });
  }).toPass({ timeout: 60_000 });
  // Back from the packages, the editor reopens the invite and then the dialog, once
  await expect(page).not.toHaveURL(/[?&]invite=/);
  await expect(dialog).toBeVisible();
  return dialog;
}

/** Publishes the invite open in the editor under a unique link; ends on the share page. */
export async function publish(page: Page, base: string): Promise<string> {
  const dialog = await openPublish(page);
  const link = dialog.getByRole("textbox", { name: /Invitation link/ });
  const wanted = `${base}-${Date.now()}`;
  await link.fill(wanted);
  await expect(link).toHaveValue(wanted);
  await expect(dialog.getByText("This link is free.")).toBeVisible();
  await dialog.getByRole("button", { name: "Publish invitation" }).click();
  await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/share$/);
  return new URL((await page.getByTestId("invite-link").textContent())!.trim()).pathname;
}
