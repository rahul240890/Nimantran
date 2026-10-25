import { expect, test, type Page } from "@playwright/test";
import { AI_SHOWN } from "../src/lib/ai/shown";
import {
  addDesignPhotos,
  axe,
  fillEvent,
  fillNames,
  firstName,
  noOverflow,
  editorBar,
  openPart,
  seeInvitation,
  tickEvents,
} from "./invite-helpers";

/*
 * The editor: one page per design (owner, 2026-10-24: one editor for everything), its parts
 * folded and opened one at a time, then the preview to publish from.
 */

// A 4×4 marigold PNG, enough for the browser to decode, shrink and store
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEUlEQVR4nGP4sMQQjhiI4wAA7GIcUc0K+8QAAAAASUVORK5CYII=",
  "base64",
);

const PARTS = [
  "Names",
  "When and where",
  "Family names",
  "Your photos",
  "Card words",
  "Music & replies",
  "Opening gate (cover screen)",
];

/** Opens a design's page on this device's empty draft, ready for typing. */
async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('details[name="editor-parts"]').first()).toBeAttached({
    timeout: 30_000,
  });
}

/** The accessibility check, read from the top: a control under the sticky header reads small. */
async function axeFromTop(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  return (await axe(page).analyze()).violations;
}

/** The wedding's date, time, venue and dress code. */
async function fillWedding(page: Page) {
  const wedding = await fillEvent(page, "wedding", {
    day: 15,
    time: "6:30 pm",
    venue: "Taj Falaknuma, Hyderabad",
  });
  // The dress code is one of the details folded away until asked for
  await wedding.getByRole("button", { name: "More details" }).click();
  await wedding.getByRole("button", { name: "Traditional Indian" }).click();
  return wedding;
}

/** Opens the first design a gallery page offers. */
async function useFirstDesign(page: Page, gallery: string) {
  await page.goto(gallery);
  await page
    .locator("[data-design]")
    .first()
    .getByRole("link", { name: /Use this design/ })
    .click();
  await expect(page).toHaveURL(/\/create\/[a-z0-9-]+\?/);
  await expect(page.locator('details[name="editor-parts"]').first()).toBeAttached({
    timeout: 30_000,
  });
}

test.beforeEach(async ({ page }) => {
  // A fixed "today", so the calendar and the dates it produces never drift
  await page.clock.setFixedTime(new Date("2026-09-26T10:00:00"));
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`invite editor, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("every part and the preview fit the screen and pass an accessibility check", async ({
      page,
    }) => {
      test.slow();
      await open(page, "/create/rajwada-bagh?category=wedding&tradition=marathi");
      // The card's language leads the names: a Marathi tradition suggests a Marathi card
      const language = page.getByRole("radiogroup", { name: "Card language" });
      await expect(language.getByRole("radio", { name: /^मराठी/ })).toBeChecked();
      await language.getByRole("radio", { name: /^English/ }).click();
      await expect(language.getByRole("radio", { name: /^English/ })).toBeChecked();
      expect(await noOverflow(page)).toBe(true);
      expect(await axeFromTop(page)).toEqual([]);

      // Nothing typed: what's missing is shown, the first of it opened
      await editorBar(page).click();
      await expect(page.getByText(/\d+ things need your attention/)).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect(await axeFromTop(page)).toEqual([]);

      // Each part, opened in turn
      for (const part of PARTS) {
        await openPart(page, part);
        expect(await noOverflow(page)).toBe(true);
        expect(await axeFromTop(page)).toEqual([]);
      }

      await openPart(page, "Names");
      await fillNames(page, ["Aditya", "Priya"]);
      await fillWedding(page);
      await openPart(page, "Your photos");
      await addDesignPhotos(page);
      await seeInvitation(page);
      // No second language is offered for now (owner, 2026-10-24)
      await expect(page.getByRole("radiogroup", { name: "Add a second language?" })).toHaveCount(0);
      expect(await noOverflow(page)).toBe(true);
      expect(await axeFromTop(page)).toEqual([]);
    });
  });
}

test.describe("invite editor", () => {
  test.use({ reducedMotion: "reduce" });

  test("the design shows large, its gate first, in the card's one language and without a price", async ({
    page,
  }, info) => {
    await open(page, "/create/noor-bagh?category=wedding");
    // An invite from before a second card language was taken away
    await page.evaluate(() => {
      const draft = JSON.parse(localStorage.getItem("nimantran-invite-draft")!);
      localStorage.setItem(
        "nimantran-invite-draft",
        JSON.stringify({ ...draft, languages: ["en", "gu"] }),
      );
    });
    await open(page, "/create/noor-bagh?category=wedding");
    await fillNames(page, ["Aditya", "Priya"]);
    // One language: no switch over the design, and the second is gone from the invite
    await expect(page.getByRole("radiogroup", { name: "Card language" })).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem("nimantran-invite-draft")!).languages as string[],
        ),
      )
      .toEqual(["en"]);
    // The price is with the packages, not beside the design's name
    await expect(page.locator('section[aria-labelledby="design-name"] [data-tier]')).toHaveCount(0);

    // The phone is the page's picture
    const phone = page.getByRole("img", { name: /, as guests see it$/ }).first();
    await expect(phone).toContainText("Aditya");
    const height = (await phone.boundingBox())!.height;
    expect(height).toBeGreaterThan(info.project.name.startsWith("phone") ? 350 : 500);

    // The gate guests open first leads the pages, with the way to change it
    await page.getByRole("button", { name: "Show the Gate page" }).first().click();
    await expect(page.getByRole("img", { name: "The Gate page, as guests see it" })).toBeVisible();
    await expect(phone).toContainText("Open the invitation");
    await page.getByRole("button", { name: "Change opening gate" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Choose your opening gate" });
    await dialog.getByRole("button", { name: "Curtains and reveals" }).click();
    await dialog.getByRole("radio", { name: /^Silk curtains/ }).click();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(phone.locator("[data-opening]")).toHaveAttribute("data-opening", "curtain");
    await expect(phone).toContainText("Aditya");
    expect(await noOverflow(page)).toBe(true);
    expect(await axeFromTop(page)).toEqual([]);

    // On a phone, the small copy floats only while a field is typed in
    if (info.project.name.startsWith("phone")) {
      const mini = page.getByRole("button", { name: "Live preview, open it large" });
      await openPart(page, "Family names");
      const field = page.locator("#part-family").getByRole("textbox").first();
      await field.scrollIntoViewIfNeeded();
      await expect(mini).toHaveCount(0);
      await field.click();
      await expect(mini).toBeVisible();
      await page.locator("#part-family > summary").click();
      await expect(mini).toHaveCount(0);
    }
  });

  test("writes an invite on its design's page, previews it, and keeps it after a reload", async ({
    page,
  }) => {
    await open(page, "/create/rajwada-bagh?category=wedding");
    await fillNames(page, ["Aditya", "Priya"]);

    // Only the wedding starts planned; add the sangeet too
    await tickEvents(page, "Sangeet");
    await editorBar(page).click();
    await expect(page.getByText("6 things need your attention")).toBeVisible();
    await page
      .getByRole("group", { name: "Your events" })
      .getByRole("button", { name: "Sangeet", exact: true })
      .click();
    const wedding = await fillWedding(page);
    await expect(wedding.getByRole("button", { name: "Traditional Indian" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // The theme's own frame has its own upload field; other photos go below it
    await openPart(page, "Your photos");
    await addDesignPhotos(page);
    await expect(page.getByRole("button", { name: /^Change: / }).first()).toBeVisible();
    await page
      .getByRole("region", { name: "More photos" })
      .locator('input[type="file"]')
      .setInputFiles({ name: "more.png", mimeType: "image/png", buffer: PNG });
    await expect(page.getByRole("img", { name: "Photo 1" })).toBeVisible();
    await openPart(page, "Music & replies");
    await page.getByRole("radio", { name: /Raag Bhupali/ }).click();
    await seeInvitation(page);

    // Nothing to go on to: the design's page is the whole editor (owner, 2026-10-25)
    await expect(page).toHaveURL(/\/create\/rajwada-bagh\?category=wedding$/);
    // The design itself carries the couple's names and the wedding's date and venue
    const phone = page.getByRole("img", { name: /, as guests see it$/ });
    await page.getByRole("button", { name: "Show the Cover page" }).click();
    await expect(phone).toContainText("Aditya");
    await page.getByRole("button", { name: "Show the Wedding page" }).click();
    await expect(phone).toContainText("Taj Falaknuma, Hyderabad");
    await expect(phone).toContainText("15 October 2026");
    // The demo's sample names give way to the family's own video and cards
    await expect(page.getByRole("link", { name: "Watch demo" })).toHaveCount(0);
    await expect(editorBar(page)).toHaveText("Sign in to publish");

    // The opening gate changes here, and its fold shows the new one at once
    await openPart(page, "Opening gate (cover screen)");
    await page
      .getByTestId("gate-summary")
      .getByRole("button", { name: "Change opening gate" })
      .click();
    const dialog = page.getByRole("dialog", { name: "Choose your opening gate" });
    // Owner, 2026-10-24: the picker was heavy to open. Each painted gate is now its small
    // picture, made ahead, and only the chosen gate plays, in the preview beside the list
    await expect(dialog.locator("[data-gate-preview] [data-opening]")).toHaveCount(1);
    await expect(dialog.getByRole("radio").first().locator("img")).toHaveAttribute(
      "src",
      /^\/openings\/posters\/[a-z-]+\.webp$/,
    );
    await dialog.getByRole("button", { name: "Curtains and reveals" }).click();
    await dialog.getByRole("radio", { name: /^Silk curtains/ }).click();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toHaveCount(0);

    await page.reload();
    await expect(firstName(page)).toHaveValue("Aditya", { timeout: 30_000 });
    await seeInvitation(page);
    await expect(page.locator("#part-gate")).toContainText("Silk curtains");
  });

  test("older links into the editor open the design's page or its designs", async ({ page }) => {
    const goes = async (from: string, to: string) => {
      const response = await page.request.get(from, { maxRedirects: 0 });
      expect(response.status(), from).toBe(307);
      expect(response.headers().location, from).toBe(to);
    };
    await goes(
      "/create?category=wedding&tradition=marathi&suite=kayal&template=gopuram",
      "/create/kayal?category=wedding&tradition=marathi",
    );
    await goes("/create?template=kasavu", "/create/card-kasavu?category=wedding");
    await goes(
      "/create?suite=udaipur-lake&format=scene",
      "/create/udaipur-lake-scene?category=wedding",
    );
    await goes("/create?category=roka", "/invitations/roka");
    await goes("/create?category=wedding&tradition=gujarati", "/invitations/wedding/gujarati");
    // A design from a landing page, opened: its own page, already chosen
    await page.goto("/create?template=kasavu");
    await expect(page.getByRole("heading", { level: 1, name: "Kerala Kasavu" })).toBeVisible();
  });

  test("an occasion's design sets up its events and wording, and another occasion keeps the names", async ({
    page,
  }) => {
    await useFirstDesign(page, "/invitations/roka");
    await expect(page).toHaveURL(/category=roka/);
    await fillNames(page, ["Aditya", "Priya"]);
    await openPart(page, "When and where");
    const events = page.getByRole("group", { name: "Your events" });
    await expect(events.getByRole("button", { name: "Roka", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // The wedding is one of the roka's rarer events, folded until asked for
    await events.getByRole("button", { name: "More events" }).click();
    await expect(events.getByRole("button", { name: "Wedding", exact: true })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    // The design announces the roka in the occasion's own words
    await page.getByRole("button", { name: "Show the Family page" }).first().click();
    await expect(page.getByRole("img", { name: /, as guests see it$/ }).first()).toContainText(
      "seek your blessings at their roka ceremony",
    );

    // Another occasion's design keeps what was typed
    await useFirstDesign(page, "/invitations/engagement");
    await expect(firstName(page)).toHaveValue("Aditya", { timeout: 30_000 });
  });

  test("a tradition's symbol and invocation wait in the card words", async ({ page }) => {
    await open(page, "/create/kayal?category=wedding&tradition=tamil");
    await page
      .getByRole("radiogroup", { name: "Card language" })
      .getByRole("radio", { name: /^English/ })
      .click();
    await openPart(page, "Card words");
    await expect(page.getByRole("heading", { name: "Symbol and blessing" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Pillaiyar suzhi", exact: true })).toBeChecked();
    await expect(page.getByRole("radio", { name: /In its script/ })).toBeChecked();
    const blessing = page.getByRole("textbox", { name: /^Blessing/ });

    const card = page.getByRole("img", { name: /, as guests see it$/ }).first();
    await page.getByRole("radio", { name: /In English letters/ }).click();
    await expect(blessing).toHaveValue("Sri Vinayagar Thunai");
    await expect(card).toContainText("Sri Vinayagar Thunai");
    // A typed blessing wins until an invocation is picked again
    await blessing.fill("Om Shanti");
    await expect(page.getByRole("radio", { name: /In English letters/ })).toBeChecked();
    await page.getByRole("radio", { name: /Leave it off/ }).click();
    await expect(blessing).toHaveValue("");
    await expect(card).not.toContainText("Sri Vinayagar Thunai");
    await page.getByRole("radio", { name: "No symbol" }).click();

    await page.reload();
    await openPart(page, "Card words");
    await expect(page.getByRole("radio", { name: /Leave it off/ })).toBeChecked();
    await expect(page.getByRole("radio", { name: "No symbol" })).toBeChecked();
  });

  test("the family's faith sets the blessing and its ideas, and the host's own words stay", async ({
    page,
  }) => {
    // A Nikah design from the gallery opens Muslim
    await page.goto("/designs");
    await page.locator('[data-kind="muslim"]').getByRole("link").click();
    const use = page
      .locator("[data-design]")
      .first()
      .getByRole("link", { name: /Use this design/ });
    await expect(use).toHaveAttribute("href", /faith=muslim/);
    await open(page, (await use.getAttribute("href"))!);
    await openPart(page, "Card words");
    const faith = page.getByRole("radiogroup", { name: "Faith" });
    await expect(faith.getByRole("radio", { name: "Muslim" })).toBeChecked();
    const blessing = page.getByRole("textbox", { name: /^Blessing/ });
    const ideas = page.getByRole("group", { name: /Ideas for Blessing/ }).getByRole("button");
    await expect(blessing).toHaveValue("Bismillah ir-Rahman ir-Rahim");
    await expect(ideas.first()).toHaveText("Bismillah ir-Rahman ir-Rahim");
    await expect(page.getByText("Shri Ganeshaya Namah")).toHaveCount(0);
    // The top of the card takes the faith's own symbol, and offers no Hindu ones
    const symbols = page.getByRole("radiogroup", { name: "Symbol at the top of the card" });
    await expect(symbols.getByRole("radio", { name: "Crescent and star" })).toBeChecked();
    await expect(symbols.getByRole("radio", { name: "Swastik" })).toHaveCount(0);
    await symbols.getByRole("radio", { name: "786" }).click();
    await expect(symbols.getByRole("radio", { name: "786" })).toBeChecked();

    // Another faith changes what was still as suggested
    await faith.getByRole("radio", { name: "Sikh" }).click();
    await expect(blessing).toHaveValue("Ik Onkar Satgur Prasad");
    await expect(ideas.first()).toHaveText("Ik Onkar Satgur Prasad");
    await expect(symbols.getByRole("radio", { name: "Khanda" })).toBeChecked();
    // and keeps what the family wrote themselves
    await blessing.fill("With the blessings of our elders");
    await faith.getByRole("radio", { name: "Christian" }).click();
    await expect(blessing).toHaveValue("With the blessings of our elders");
    expect(
      await axe(page).include('section[aria-labelledby="faith-heading"]').analyze(),
    ).toMatchObject({
      violations: [],
    });

    // Back on the page, and on another design, the family's faith stays
    await page.reload();
    await openPart(page, "Card words");
    await expect(
      page.getByRole("radiogroup", { name: "Faith" }).getByRole("radio", { name: "Christian" }),
    ).toBeChecked();
    await expect(page.getByRole("textbox", { name: /^Blessing/ })).toHaveValue(
      "With the blessings of our elders",
    );
    expect(await noOverflow(page)).toBe(true);
    await open(page, "/create/kayal?category=wedding");
    await openPart(page, "Card words");
    await expect(
      page.getByRole("radiogroup", { name: "Faith" }).getByRole("radio", { name: "Christian" }),
    ).toBeChecked();
  });

  test("the family section keeps parents, the tradition's hosts line and whom to call", async ({
    page,
  }) => {
    await open(page, "/create/kayal?category=wedding&tradition=tamil");
    await fillNames(page, ["Arjun", "Meena"]);
    await openPart(page, "Family names");
    const arjun = page.getByRole("group", { name: "Arjun's family" });
    await arjun.getByRole("radio", { name: "Son of" }).click();
    await arjun.getByRole("textbox", { name: /Parents' names/ }).fill("Smt. Lakshmi & Shri Raman");
    // The tradition's own heading sits beside the hosts line
    await page.getByRole("textbox", { name: /Hosted by/ }).fill("ஐயர் குடும்பத்தினர்");
    expect(await noOverflow(page)).toBe(true);
    expect(await axeFromTop(page)).toEqual([]);

    // Whom guests can call sits with the replies
    await openPart(page, "Music & replies");
    await page.getByRole("button", { name: "Add a number" }).click();
    await page.getByRole("textbox", { name: "Phone" }).fill("98765 43210");
    expect(await noOverflow(page)).toBe(true);
    expect(await axeFromTop(page)).toEqual([]);

    await page.reload();
    await openPart(page, "Music & replies");
    await expect(page.getByRole("textbox", { name: "Phone" })).toHaveValue("98765 43210");
    await openPart(page, "Family names");
    const family = page.getByRole("group", { name: "Arjun's family" });
    await expect(family.getByRole("textbox", { name: /Parents' names/ })).toHaveValue(
      "Smt. Lakshmi & Shri Raman",
    );
    await expect(family.getByRole("radio", { name: "Son of" })).toBeChecked();
    await expect(page.getByRole("textbox", { name: /Hosted by/ })).toHaveValue(
      "ஐயர் குடும்பத்தினர்",
    );
  });

  test("a page's words can be rewritten, placed and left out", async ({ page }) => {
    await open(page, "/create/kayal?category=wedding");
    await fillNames(page, ["Meera", "Kabir"]);

    await page.getByRole("button", { name: "Edit this page" }).first().click();
    const dialog = page.getByRole("dialog", { name: "The Cover page" });
    await dialog.getByRole("button", { name: "Add a line" }).click();
    const added = dialog.getByRole("textbox", { name: /^Line \d+$/ }).last();
    await added.fill("Together forever");
    await expect(dialog.locator(".story-line", { hasText: "Together forever" })).toBeAttached();
    await dialog.getByRole("radio", { name: "Top" }).click();
    expect((await axe(page).include("[role=dialog]").analyze()).violations).toEqual([]);
    // The cover can't be left out: it carries the names
    await expect(dialog.getByRole("switch")).toHaveCount(0);
    await dialog.getByRole("button", { name: "Done" }).click();

    await page.reload();
    await page.getByRole("button", { name: "Edit this page" }).first().click();
    const again = page.getByRole("dialog", { name: "The Cover page" });
    await expect(again.getByRole("textbox", { name: /^Line \d+$/ }).last()).toHaveValue(
      "Together forever",
    );
    await expect(again.getByRole("radio", { name: "Top" })).toBeChecked();
    await again.getByRole("button", { name: "Back to the suggested words" }).click();
    await expect(again.locator(".story-line", { hasText: "Together forever" })).toHaveCount(0);
    await again.getByRole("button", { name: "Done" }).click();

    // AI is hidden for now (src/lib/ai/shown.ts); when shown, it writes only for a saved invite
    const write = page.getByRole("button", { name: "Write with AI" });
    if (!AI_SHOWN) {
      await expect(write).toHaveCount(0);
      return;
    }
    await write.click();
    const ai = page.getByRole("dialog", { name: "Write the words with AI" });
    await expect(ai.getByRole("radio", { name: "Traditional" })).toBeChecked();
    expect((await axe(page).include("[role=dialog]").analyze()).violations).toEqual([]);
    await ai.getByRole("button", { name: "Write", exact: true }).click();
    await expect(ai.getByRole("status")).toHaveText(/Sign in so your invite is saved/);
  });

  test("the design follows the part being filled in, in the host's own lettering", async ({
    page,
  }) => {
    await open(page, "/create/shahi-savari?category=wedding&tradition=gujarati");
    await fillNames(page, ["રાધા", "અર્જુન"]);
    // Untyped lines preview in the card's language, never the design's English samples
    await openPart(page, "Card words");
    await expect(page.getByRole("textbox", { name: /Families/ })).toHaveValue("બંને પરિવાર તરફથી");
    // Ideas for each line come in the card's language too
    await expect(
      page
        .getByRole("group", { name: /Ideas for Blessing/ })
        .getByRole("button")
        .first(),
    ).toHaveText("॥ શ્રી ગણેશાય નમઃ ॥");

    // Lettering: a Gujarati card offers only fonts that write Gujarati
    await page.locator("summary", { hasText: "Lettering" }).click();
    const names = page.getByRole("radiogroup", { name: "Names", exact: true });
    await expect(names.getByRole("radio", { name: /Great Vibes/ })).toHaveCount(0);
    await names.getByRole("radio", { name: /Mogra/ }).click();
    await page.getByRole("button", { name: "Bold", exact: true }).click();
    await expect(page.getByRole("button", { name: "Bold", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(await axe(page).include('section[aria-label="Lettering"]').analyze()).toMatchObject({
      violations: [],
    });

    await expect(
      page.getByRole("img", { name: /The Cover page, as guests see it/ }).first(),
    ).toBeVisible();
    const name = page.locator('[data-page="cover"]').getByText("રાધા").first();
    await expect(name).toHaveCSS("font-family", /Mogra/);
    await expect(name).toHaveCSS("font-weight", "700");

    // An event being filled in turns the design to its page
    await tickEvents(page, "Sangeet");
    await page.locator('[data-function="sangeet"]').getByRole("button", { name: /^Date/ }).focus();
    await expect(page.getByRole("img", { name: /The Sangeet page/ }).first()).toBeVisible();
    await expect(
      page.locator('[data-page="fn-sangeet"]').getByText("સંગીત સંધ્યા").first(),
    ).toBeVisible();
    // Every page is a tap away
    await page.getByRole("button", { name: "Show the Cover page" }).first().click();
    await expect(page.getByRole("img", { name: /The Cover page/ }).first()).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
  });

  test("a save-the-date asks only for the date and the city", async ({ page }) => {
    await useFirstDesign(page, "/invitations/save-the-date");
    await fillNames(page, ["Aditya", "Priya"]);
    await openPart(page, "When and where");
    await expect(page.getByRole("combobox", { name: /Starts at/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "More events" })).toHaveCount(0);
    await page.getByRole("button", { name: /^Date/ }).click();
    await page.getByRole("button", { name: /next month/i }).click();
    await page.getByRole("gridcell").getByRole("button", { name: /, 15 / }).click();
    await page.getByRole("textbox", { name: /City or venue/ }).fill("Udaipur");
    await seeInvitation(page);
    expect(await noOverflow(page)).toBe(true);
  });

  test("a place typed for one event fills the others in a tap", async ({ page }) => {
    await open(page, "/create/udaipur-lake?category=wedding");
    await fillNames(page, ["Aditya", "Priya"]);
    await tickEvents(page, "Sangeet", "Haldi");
    const wedding = page.locator('[data-page-target="fn-wedding"]');
    const sangeet = page.locator('[data-page-target="fn-sangeet"]');
    const haldi = page.locator('[data-page-target="fn-haldi"]');
    await wedding.getByRole("textbox", { name: /^Venue/ }).fill("Taj Falaknuma, Hyderabad");
    await wedding.getByRole("button", { name: "More details" }).click();
    await wedding.getByRole("textbox", { name: /^Address/ }).fill("Engine Bowli, Falaknuma");

    // The sangeet takes the wedding's venue and address, which open its details to show them
    await sangeet.getByRole("button", { name: "Same as Wedding" }).click();
    await expect(sangeet.getByRole("textbox", { name: /^Venue/ })).toHaveValue(
      "Taj Falaknuma, Hyderabad",
    );
    await expect(sangeet.getByRole("textbox", { name: /^Address/ })).toHaveValue(
      "Engine Bowli, Falaknuma",
    );
    // Its chip goes once the places match
    await expect(sangeet.getByRole("button", { name: "Same as Wedding" })).toHaveCount(0);

    // Every event still without a place, from the wedding at once
    await wedding.getByRole("button", { name: /^Use this place for/ }).click();
    await expect(haldi.getByRole("textbox", { name: /^Venue/ })).toHaveValue(
      "Taj Falaknuma, Hyderabad",
    );
    await expect(wedding.getByRole("button", { name: /^Use this place for/ })).toHaveCount(0);
  });

  test("a Scene keeps its painting and holds the event being filled in", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, "the design beside the form");
    await open(page, "/create/udaipur-lake-scene?category=wedding");
    await fillNames(page, ["Aditya", "Priya"]);
    await tickEvents(page, "Sangeet");
    await page
      .locator('[data-function="sangeet"]')
      .getByRole("textbox", { name: /^Venue/ })
      .fill("Lake Palace lawns");
    // The design itself, with only its event box changing: no stand-in card to switch to
    await expect(page.getByRole("button", { name: "Card", exact: true })).toHaveCount(0);
    const slot = page.getByRole("group", { name: "The celebrations, one by one" }).first();
    await expect(slot).toContainText("Sangeet");
    await expect(slot).toContainText("Lake Palace lawns");
    // It stays while the host types, past the time a function would play for
    await page.waitForTimeout(5000);
    await expect(slot).toContainText("Sangeet");
  });

  test("the page and the preview fit common phone widths", async ({ browser }, info) => {
    test.skip(info.project.name !== "phone-320", "phones only");
    test.setTimeout(120_000);
    for (const width of [360, 375, 414]) {
      // A fresh phone each time, so no saved draft carries over
      const context = await browser.newContext({
        viewport: { width, height: 760 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.clock.setFixedTime(new Date("2026-09-26T10:00:00"));
      await open(page, "/create/rajwada-bagh?category=wedding");
      expect(await noOverflow(page)).toBe(true);
      for (const part of PARTS) {
        await openPart(page, part);
        expect(await noOverflow(page)).toBe(true);
      }
      await openPart(page, "Names");
      await fillNames(page, ["Aditya", "Priya"]);
      await fillWedding(page);
      await openPart(page, "Your photos");
      await addDesignPhotos(page);
      expect(await noOverflow(page)).toBe(true);
      await seeInvitation(page);
      // The way to publish stays in the bar
      await expect(editorBar(page)).toHaveText("Sign in to publish");
      expect(await noOverflow(page)).toBe(true);
      await context.close();
    }
  });
});
