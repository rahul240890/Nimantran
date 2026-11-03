import { expect, test } from "@playwright/test";
import { numberFor, openPart, publish, writeInvite } from "./invite-helpers";

// A 4×4 marigold PNG, as the shared helpers upload
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEUlEQVR4nGP4sMQQjhiI4wAA7GIcUc0K+8QAAAAASUVORK5CYII=",
  "base64",
);

// Owner, 2026-11-03: a design's own photo could be changed or adjusted, but never taken out
test("a design's photo can be taken out of its frame", async ({ page }, info) => {
  await writeInvite(page, numberFor(info), ["Aarav", "Meera"]);
  await openPart(page, "Your photos");
  const frames = page.locator("section[aria-labelledby=design-photos-heading]");
  await frames.getByRole("button", { name: /^Remove: / }).click();
  await expect(frames.getByRole("button", { name: /^Add: / })).toBeFocused();
  await expect(frames.getByRole("button", { name: /^Remove: / })).toHaveCount(0);
});

// Owner, 2026-11-03: a photo whose file couldn't be shown left a blank frame on the live page
test("a photo that can't be shown leaves no blank frame for guests", async ({
  page,
  browser,
}, info) => {
  let uploads = 0;
  // The first of the gallery's photos reaches the account as something no browser can draw
  await page.route("**/api/invites/*/photos/*", async (route) => {
    uploads += 1;
    await route.continue(uploads === 2 ? { postData: Buffer.from("not a picture") } : undefined);
  });
  await writeInvite(
    page,
    numberFor(info),
    ["Aarav", "Meera"],
    "/create/noor-bagh?category=wedding",
  );
  await openPart(page, "Your photos");
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Add photos" }).click();
  await (
    await chooser
  ).setFiles([1, 2, 3].map((i) => ({ name: `more-${i}.png`, mimeType: "image/png", buffer: PNG })));
  await expect(page.getByRole("button", { name: /^Remove photo/ })).toHaveCount(3);
  const link = await publish(page, "broken-photo");

  const context = await browser.newContext({
    baseURL: info.project.use.baseURL,
    viewport: info.project.use.viewport,
    reducedMotion: "reduce",
  });
  const guest = await context.newPage();
  await guest.goto(`${link}?quality=2d`);
  const gallery = guest.locator("section[aria-labelledby=guest-photos]");
  await gallery.scrollIntoViewIfNeeded();
  // Two photos drew; the third is taken off the page rather than left empty
  await expect(gallery.locator("li")).toHaveCount(2);
  for (const img of await gallery.locator("img").all()) {
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
  }
  await context.close();
});
