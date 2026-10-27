import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { designOpening } from "../src/lib/opening/catalog";
import { sectionLayouts } from "../src/lib/suites/section-layouts";
import { noOverflow } from "./invite-helpers";

// Best practice too, as the keyboard test on a real guest page checks
const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ]);

/* The themed guest page below the painted pages (Step 12q), on the sample review page */
// Every painted theme, each with its own guest look (SUITES[id].guest in src/lib/suites/catalog.ts)
const THEMES = [
  "rajwada-bagh",
  "shahi-savari",
  "kayal",
  "noor-bagh",
  "phulkari-haveli",
  "rajbari",
  "peshwai-wada",
  "kutch-toran",
  "gubbara",
  "saath",
  "rooftop",
  "ivory-arch",
  "gulaab",
  "deco-noir",
  "taara",
  "kaagaz",
  "mitti",
  "neel",
  "pichwai",
  "tanjore",
  "kashi",
  "sagar",
  "mysuru",
  "kalamkari",
  "pattachitra",
  "chinar",
  "chai-bagan",
  "sufi-raat",
  "chapel",
  "sakura",
  "vigna",
  "himani",
  "van",
  "riad",
  "palna",
  "deepotsav",
  "jungle-party",
] as const;

for (const suite of THEMES) {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`${suite} guest page, ${colorScheme} theme`, () => {
      test.use({ colorScheme, reducedMotion: "reduce" });

      test("welcomes the guest, lists the day once on its timeline, then the photos and the reply", async ({
        page,
      }) => {
        await page.goto(`/engine/guest?suite=${suite}&couple=one`);
        const themed = page.locator(".guest-themed");
        await expect(themed).toHaveAttribute("data-suite", suite);
        // On a ground of the theme's own colours, laid out in its own mix (section-layouts.ts)
        const layouts = sectionLayouts(suite);
        await expect(themed).toHaveAttribute("data-ground", layouts.ground);
        // First the welcome: the names, with the couple's photo
        await expect(themed.locator("h2#guest-welcome")).not.toBeEmpty();
        await expect(themed.locator(".guest-welcome-photos")).toBeVisible();
        await expect(page.getByRole("heading", { name: "The celebrations" })).toBeVisible();
        await expect(page.locator(`[data-timeline="${layouts.timeline}"] > li`)).toHaveCount(3);
        // Each named as the design's tradition names it, the Sangeet in the middle
        await expect(themed.getByRole("heading", { level: 3 })).toHaveCount(3);
        await expect(themed.getByRole("heading", { level: 3 }).nth(1)).toContainText("Sangeet");
        // Nothing the pages above already tell comes again below
        for (const name of ["Save the date", "With love from the family"])
          await expect(themed.getByRole("heading", { name })).toHaveCount(0);
        await expect(page.locator(`section[data-layout="${layouts.photos}"]`)).toBeVisible();

        // The reply asks only who and whether
        await page.locator("#rsvp").scrollIntoViewIfNeeded();
        const reply = page.locator("#rsvp");
        await expect(reply.getByRole("textbox")).toHaveCount(1);
        await expect(reply.getByRole("radio")).toHaveCount(2);

        expect(await noOverflow(page)).toBe(true);
        expect((await axe(page).analyze()).violations).toEqual([]);
      });
    });
  }
}

test("a Hindi card's guest page reads Hindi on an English site", async ({ page }) => {
  // Kayal's timeline is a deck of cards, each with its month on a seal
  expect(sectionLayouts("kayal").timeline).toBe("cards");
  await page.goto("/engine/guest?suite=kayal&lang=hi");
  const themed = page.locator(".guest-themed");
  await expect(themed.getByRole("heading", { name: "उत्सव" })).toBeVisible();
  await expect(themed.getByText("नवंबर").first()).toBeVisible();
  for (const english of ["The celebrations", "November"]) {
    await expect(themed.getByText(english, { exact: false })).toHaveCount(0);
  }
  expect((await axe(page).analyze()).violations).toEqual([]);
});

// Owner, 2026-10-24: guests had to scroll sideways through the photos
test("the photos turn by themselves", async ({ page }) => {
  expect(sectionLayouts("rajwada-bagh").photos).toBe("film");
  await page.goto("/engine/guest?suite=rajwada-bagh&couple=one");
  const photos = page.getByRole("group", { name: "Photos" });
  await photos.scrollIntoViewIfNeeded();
  const counter = photos.locator("p[aria-live]");
  await expect(counter).toContainText("Photo 1 of 3");
  // It moves on by itself while on screen, unless the guest's pointer rests on it
  await page.mouse.move(1, 1);
  await expect(counter).toContainText("Photo 2 of 3", { timeout: 9_000 });
  await photos.getByRole("button", { name: "Next photo" }).click();
  await expect(counter).toContainText("Photo 3 of 3");
  await photos.getByRole("button", { name: "Previous photo" }).click();
  await expect(counter).toContainText("Photo 2 of 3");
  await photos.getByRole("button", { name: "Pause the photos" }).click();
  await expect(photos.getByRole("button", { name: "Play the photos" })).toBeVisible();
  await page.mouse.move(1, 1);
  await page.waitForTimeout(5_500);
  await expect(counter).toContainText("Photo 2 of 3");
  expect(await noOverflow(page)).toBe(true);
  expect((await axe(page).analyze()).violations).toEqual([]);
});

test("in still mode the photos stay put and have no pause", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/engine/guest?suite=rajwada-bagh&couple=one");
  const photos = page.getByRole("group", { name: "Photos" });
  await photos.scrollIntoViewIfNeeded();
  const counter = photos.locator("p[aria-live]");
  await expect(counter).toContainText("Photo 1 of 3");
  await expect(photos.getByRole("button", { name: "Pause the photos" })).toHaveCount(0);
  await page.mouse.move(1, 1);
  await page.waitForTimeout(5_500);
  await expect(counter).toContainText("Photo 1 of 3");
  await photos.getByRole("button", { name: "Next photo" }).click();
  await expect(counter).toContainText("Photo 2 of 3");
});

// Owner, 2026-10-27: a photo opens full screen, and the guest can go on through the others
test("a photo opens full screen", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/engine/guest?suite=rajwada-bagh&couple=one");
  // The couple's photo is in the welcome, so the photos below count on from 2
  await page.locator("#guest-photos").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open photo 2 full screen" }).click();
  const viewer = page.getByRole("dialog", { name: "Photos from the family" });
  await expect(viewer).toBeVisible();
  await expect(viewer.getByRole("img", { name: "Photo 2 from the family" })).toBeVisible();
  const counter = viewer.locator("p[aria-live]");
  await expect(counter).toContainText("Photo 1 of 3");
  await page.keyboard.press("ArrowRight");
  await expect(counter).toContainText("Photo 2 of 3");
  await viewer.getByRole("button", { name: "Next photo" }).click();
  await expect(counter).toContainText("Photo 3 of 3");
  await expect(viewer.getByRole("button", { name: "Next photo" })).toBeDisabled();
  expect((await axe(page).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);
});

// Owner, 2026-10-27: on the day, the celebration on now glows at the top of the timeline
test("on the day the celebration on now comes first, with directions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/engine/guest?suite=sakura&now=2026-11-19T20:00");
  const today = page.locator(".guest-today");
  await expect(today).toContainText("Happening now");
  await expect(today).toContainText("Sangeet");
  await expect(today.getByRole("link", { name: "Directions" })).toBeVisible();
  const on = page.locator('.guest-timeline-item[data-today="now"]');
  await expect(on).toHaveCount(1);
  await expect(on.getByRole("heading", { level: 3 })).toContainText("Sangeet");
  // The ones still to come say how far off they are, from that day
  await expect(page.locator(".guest-timeline-item").last()).toContainText("Tomorrow");
  expect(await noOverflow(page)).toBe(true);
  expect((await axe(page).analyze()).violations).toEqual([]);
});

// Owner, 2026-10-27: a yes is met with petals, and the guest can pass the invitation on
test("after a yes, the guest can share the invitation on WhatsApp", async ({ page }) => {
  await page.goto("/sample/rajwada-bagh");
  await page.locator("#rsvp").scrollIntoViewIfNeeded();
  await page.getByRole("textbox", { name: /Your name/ }).fill("Priya Mehta");
  await page.getByRole("radio", { name: "Yes, I'll be there" }).click();
  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByRole("heading", { name: "Thank you, Priya!" })).toBeVisible();
  const share = page.getByRole("link", { name: "Share on WhatsApp" });
  await expect(share).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/\?text=.*%2Fsample%2Frajwada-bagh$/,
  );
});

for (const suite of ["rajwada-bagh", "kayal"] as const) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${suite} as One Scene, ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(`/engine/guest?suite=${suite}&format=scene&photos=2`);
      // A Scene opens at its own gate too, unless the host chose to go straight in
      await expect(page.locator("[data-opening]")).toHaveAttribute(
        "data-opening",
        designOpening(suite, true)!,
      );
      await page.getByRole("button", { name: "Open the invitation" }).click();
      const scene = page.locator("section[data-scene-mood]");
      await expect(page.getByRole("heading", { level: 1, name: /Arjun/ })).toBeVisible();
      // The painting fills the screen like a reel (on the narrowest phones its width sets the height)
      const viewport = page.viewportSize()!;
      const painting = (await scene.locator(".scene-painting").boundingBox())!;
      expect(painting.height).toBeGreaterThan(viewport.height * 0.9);
      // Still with reduced motion: the arrows step through the celebrations
      const slot = page.getByRole("group", { name: "The celebrations, one by one" });
      const first = await slot.innerText();
      await page.getByRole("button", { name: "Next celebration" }).click();
      await expect(slot).not.toHaveText(first);
      await expect(page.getByRole("link", { name: /^Directions:/ })).toBeVisible();
      await expect(page.getByRole("link", { name: "Reply to the invitation" })).toBeVisible();
      // The painting's light follows the celebration in the slot
      const moods = new Set<string | null>([await scene.getAttribute("data-scene-mood")]);
      for (let i = 0; i < 4; i++) {
        await page.getByRole("button", { name: "Next celebration" }).click();
        moods.add(await scene.getAttribute("data-scene-mood"));
      }
      expect(moods.size).toBeGreaterThan(1);
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  }
}

// Every opening style (Step 12w), with and without a god, in both colour themes
for (const [style, god] of [
  ["palace", "ganesha"],
  ["temple", "om"],
  ["curtain", null],
  ["envelope", "lakshmi-ganesha"],
  ["lotus", "kalash"],
  ["doors", "jagannath"],
] as const) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`the ${style} opening, ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(
        `/engine/guest?suite=rajwada-bagh&opening=${style}${god ? `&god=${god}` : ""}`,
      );
      const opening = page.locator(`[data-opening="${style}"]`);
      await expect(opening).toHaveAttribute("data-doorway", "closed");
      await expect(opening.getByRole("heading", { level: 1 })).toContainText("Arjun");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
      // Opening it brings the pages (at once in still mode)
      await page.getByRole("button", { name: "Open the invitation" }).click();
      await expect(page.locator("[data-story-beat]").first()).toBeVisible();
    });
  }
}

// The thirteen openings added in Step 12y, each in one of the colour themes, with the
// symbols of every faith over some of them
for (const [i, [style, god, faith]] of (
  [
    ["mandap", "ganesha-gold", null],
    ["jharokha", "khanda", "sikh"],
    ["phool", "swastik", null],
    ["scroll", "bismillah", "muslim"],
    ["diyas", "om", null],
    ["rangoli", "shri", null],
    ["peacock", "shrinathji", null],
    ["storybook", "cross", "christian"],
    ["lanterns", "chand-tara", "muslim"],
    ["moonlit", "786", "muslim"],
    ["fireworks", null, null],
    ["balloons", null, null],
    ["gift", "kalash", null],
  ] as const
).entries()) {
  const colorScheme = i % 2 === 0 ? "light" : "dark";
  const suite = ["rajwada-bagh", "kayal", "noor-bagh", "gubbara"][i % 4];
  test(`the ${style} opening, ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    const chosen = `${god ? `&god=${god}` : ""}${faith ? `&faith=${faith}` : ""}`;
    await page.goto(`/engine/guest?suite=${suite}&opening=${style}${chosen}`);
    const opening = page.locator(`[data-opening="${style}"]`);
    await expect(opening).toHaveAttribute("data-doorway", "closed");
    await expect(opening.getByRole("heading", { level: 1 })).toBeVisible();
    // The faith's own symbol shows whole over the opening, never another faith's
    if (faith && god) await expect(opening.locator(".opening-medallion")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await page.getByRole("button", { name: "Open the invitation" }).click();
    await expect(page.locator("[data-story-beat]").first()).toBeVisible();
  });
}

// With motion on, a welcome with the names comes between the opening and the pages
test("the welcome before the pages", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // The page's clock is held, so the welcome waits while it is checked
  await page.clock.install({ time: new Date("2026-10-01T10:00:00+05:30") });
  await page.clock.pauseAt(new Date("2026-10-01T10:00:05+05:30"));
  await page.goto("/engine/guest?suite=rajwada-bagh&opening=palace");
  await page.getByRole("button", { name: "Open the invitation" }).click();
  // It waits a moment for the screen to settle after going full screen, then opens once its
  // paintings have loaded. They load in real time while the page's clock is held, so the
  // clock moves on in small steps until the doors open: a busy machine loads them late
  const doorway = page.locator("[data-doorway]");
  await page.clock.runFor(1000);
  await expect(async () => {
    if ((await doorway.getAttribute("data-doorway")) !== "open") await page.clock.runFor(100);
    await expect(doorway).toHaveAttribute("data-doorway", "open", { timeout: 500 });
  }).toPass({ timeout: 30_000 });
  // At the opening's calmer pace (1500ms x OPENING_PACE 2.2)
  await page.clock.runFor(3500);
  const welcome = page.getByTestId("opening-welcome");
  await expect(welcome).toBeVisible();
  await expect(welcome).toContainText("Arjun");
  await expect(page.getByRole("button", { name: "Continue" })).toBeFocused();
  // It waits on its own while the clock is held, then Continue moves on at once
  await page.clock.runFor(2000);
  await expect(welcome).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(welcome).toHaveCount(0);
  await expect(page.locator("[data-story-beat]").first()).toBeVisible();
});

// Every welcome scene, held still while it is checked, over a few themes in both colours
for (const [i, scene] of (
  [
    "mandala",
    "peacock",
    "sunrise",
    "garden",
    "rangoli",
    "ghat",
    "fireflies",
    "sky-lanterns",
    "kites",
    "waves",
  ] as const
).entries()) {
  const suite = ["rajwada-bagh", "kayal", "noor-bagh", "pichwai"][i % 4];
  test(`the ${scene} welcome, ${i % 2 ? "dark" : "light"} theme`, async ({ page }) => {
    await page.emulateMedia({
      colorScheme: i % 2 ? "dark" : "light",
      reducedMotion: "no-preference",
    });
    // Held up until Continue, so it can be looked at as long as the check takes
    await page.goto(`/engine/guest?suite=${suite}&opening=palace&welcome=${scene}&hold=1`);
    await page.getByRole("button", { name: "Open the invitation" }).click();
    const welcome = page.getByTestId("opening-welcome");
    await expect(welcome).toHaveAttribute("data-welcome", scene, { timeout: 15_000 });
    await expect(welcome).toContainText("Arjun");
    // Once the words have come in
    await page.waitForTimeout(3200);
    expect(await noOverflow(page)).toBe(true);
    expect(
      (await axe(page).include('[data-testid="opening-welcome"]').analyze()).violations,
    ).toEqual([]);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(welcome).toHaveCount(0);
  });
}

// The guest's first tap starts the music and keeps the screen on; once the invitation has
// played to the reply form, it offers to play again, from the top, music and all
test("the music starts on the first tap, and the invitation opens again at the end", async ({
  page,
}) => {
  test.slow();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const counts = { locks: 0 };
    (window as unknown as { __awake: typeof counts }).__awake = counts;
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: {
        request: async () => {
          counts.locks += 1;
          return { released: false, release: async () => {} };
        },
      },
    });
  });
  await page.clock.install({ time: new Date("2026-10-01T10:00:00+05:30") });
  await page.goto("/engine/guest?suite=rajwada-bagh&opening=palace");
  const open = page.getByRole("button", { name: "Open the invitation", exact: true });
  await expect(open).toBeVisible();
  // A tap anywhere before the gate is enough to start the music
  await page.mouse.click(5, 5);
  await open.click();
  await page.clock.runFor(8000);
  await expect(page.getByRole("button", { name: "Pause music" }).first()).toBeVisible();
  expect(
    await page.evaluate(() => (window as unknown as { __awake: { locks: number } }).__awake.locks),
  ).toBeGreaterThan(0);

  // Every page, then the page below moving on by itself to the reply form
  const again = page.locator("[data-tour-controls]").getByRole("button", {
    name: "Watch the invitation again",
  });
  for (let i = 0; i < 60 && !(await again.isVisible()); i++) await page.clock.runFor(5000);
  await expect(again).toBeVisible();
  await again.click();
  await page.clock.runFor(1500);
  await expect(page.locator("[data-doorway]")).toHaveAttribute("data-doorway", "open");
  await expect(again).toHaveCount(0);
  // The page's footer offers it too, for a guest who scrolled there themselves
  await expect(
    page.locator("footer").getByRole("button", { name: "Watch the invitation again" }),
  ).toBeAttached();
});
