import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
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

      test("walks through the day, showers flowers and lights the lamps", async ({ page }) => {
        await page.goto(`/engine/guest?suite=${suite}`);
        const themed = page.locator(".guest-themed");
        await expect(themed).toHaveAttribute("data-suite", suite);
        await expect(page.getByRole("heading", { name: "The celebrations" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Save the date" })).toBeVisible();
        // Each celebration takes its own hour's light
        await expect(page.locator("li.guest-hour[data-mood]")).toHaveCount(3);

        await page.getByRole("button", { name: "Shower flowers on the couple" }).click();
        await expect(page.getByText("Your flowers are on their way")).toBeVisible();

        const lamps = page.getByRole("button", { name: /Light the|Switch on the lights/ });
        await lamps.click();
        await expect(lamps).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(".guest-night")).toHaveAttribute("data-lit", "true");

        await page.locator("#rsvp").scrollIntoViewIfNeeded();
        await expect(page.getByRole("button", { name: /Play the music/ }).last()).toBeVisible();

        expect(await noOverflow(page)).toBe(true);
        expect((await axe(page).analyze()).violations).toEqual([]);
      });
    });
  }
}

test("a Hindi card's guest page reads Hindi on an English site", async ({ page }) => {
  await page.goto("/engine/guest?suite=rajwada-bagh&lang=hi");
  const themed = page.locator(".guest-themed");
  await expect(themed.getByText("आप सादर आमंत्रित हैं")).toBeVisible();
  await expect(themed.getByText("नवंबर", { exact: true })).toBeVisible();
  await expect(themed.getByRole("heading", { name: "उत्सव" })).toBeVisible();
  for (const english of ["You are invited", "Save the date", "The celebrations", "November"]) {
    await expect(themed.getByText(english, { exact: false })).toHaveCount(0);
  }
  // The buttons around the card speak the card's language too
  await expect(page.getByRole("button", { name: "जोड़े पर फूल बरसाएँ" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Shower flowers on the couple" })).toHaveCount(0);
  expect((await axe(page).analyze()).violations).toEqual([]);
});

for (const suite of ["rajwada-bagh", "kayal"] as const) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${suite} as One Scene, ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(`/engine/guest?suite=${suite}&format=scene&photos=2`);
      // A Scene opens behind the wedding's painted gate too, unless the host chose to go straight in
      await expect(page.locator("[data-opening]")).toHaveAttribute("data-opening", "rajwada-pol");
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

// The thirteen openings added in Step 12y, each in one of the colour themes
for (const [i, [style, god]] of (
  [
    ["mandap", "ganesha-gold"],
    ["jharokha", null],
    ["phool", "swastik"],
    ["scroll", null],
    ["diyas", "om"],
    ["rangoli", null],
    ["peacock", "shrinathji"],
    ["storybook", null],
    ["lanterns", null],
    ["moonlit", null],
    ["fireworks", null],
    ["balloons", null],
    ["gift", "kalash"],
  ] as const
).entries()) {
  const colorScheme = i % 2 === 0 ? "light" : "dark";
  const suite = ["rajwada-bagh", "kayal", "noor-bagh", "gubbara"][i % 4];
  test(`the ${style} opening, ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto(`/engine/guest?suite=${suite}&opening=${style}${god ? `&god=${god}` : ""}`);
    const opening = page.locator(`[data-opening="${style}"]`);
    await expect(opening).toHaveAttribute("data-doorway", "closed");
    await expect(opening.getByRole("heading", { level: 1 })).toBeVisible();
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
  // It waits a moment for the screen to settle after going full screen
  await page.clock.runFor(1000);
  // It opens once its paintings have loaded, at the opening's calmer pace
  await expect(page.locator("[data-doorway]")).toHaveAttribute("data-doorway", "open");
  await page.clock.runFor(2500);
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
