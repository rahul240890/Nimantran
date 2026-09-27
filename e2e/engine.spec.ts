import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

const engine = (page: Page) => page.locator("[data-engine-state]");

/* CI machines have no graphics chip; SwiftShader draws WebGL in software so the 3D path runs */
test.use({
  launchOptions: {
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {}),
    args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"],
  },
});

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`engine page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("has no horizontal scroll or accessibility violations, shut and open", async ({
      page,
    }) => {
      await page.goto("/engine?quality=2d");
      await expect(engine(page)).toHaveAttribute("data-engine-state", "fallback");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await page.getByRole("button", { name: "Open invitation" }).click();
      await expect(page.getByRole("button", { name: "Close invitation" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });

    test("draws the 3D card and cross-fades to it", async ({ page }) => {
      await page.goto("/engine?quality=high");
      await expect(engine(page)).toHaveAttribute("data-engine-state", "ready", { timeout: 30_000 });
      await expect(engine(page).locator("canvas")).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
    });
  });
}

test.describe("invitation engine", () => {
  test.use({ reducedMotion: "reduce" });

  test("opens and closes the 3D card from the keyboard", async ({ page }) => {
    await page.goto("/engine?quality=medium");
    await expect(engine(page)).toHaveAttribute("data-engine-state", "ready", { timeout: 30_000 });
    const open = page.getByRole("button", { name: "Open invitation" });
    await open.focus();
    await page.keyboard.press("Enter");
    const close = page.getByRole("button", { name: "Close invitation" });
    await expect(close).toBeFocused();
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Open invitation" })).toBeFocused();
  });

  test("opens when the 3D card itself is tapped", async ({ page }) => {
    await page.goto("/engine?quality=low");
    await expect(engine(page)).toHaveAttribute("data-engine-state", "ready", { timeout: 30_000 });
    const canvas = engine(page).locator("canvas");
    const box = (await canvas.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.getByRole("button", { name: "Close invitation" })).toBeVisible();
  });

  test("steps down to the 2D card on a machine without a real graphics chip", async ({ page }) => {
    await page.goto("/engine");
    // Never a blank stage: the 2D card is there from the first paint
    await expect(engine(page).locator("[aria-hidden] > div").first()).toBeVisible();
    await expect(engine(page)).toHaveAttribute("data-engine-state", /fallback|ready/, {
      timeout: 30_000,
    });
    if ((await engine(page).getAttribute("data-engine-state")) === "fallback") {
      await expect(page.getByText("3D would run without a graphics chip")).toBeVisible();
    }
  });

  test("keeps the controls large enough to tap", async ({ page }) => {
    await page.goto("/engine?quality=2d");
    for (const name of ["Open invitation", "Play music"]) {
      const box = (await page.getByRole("button", { name }).boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("the 2D card and the landing page never download three.js", async ({ page }) => {
    const scripts: string[] = [];
    page.on("response", async (response) => {
      if (response.request().resourceType() === "script") {
        scripts.push(await response.text().catch(() => ""));
      }
    });
    for (const path of ["/engine?quality=2d", "/"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(scripts.length).toBeGreaterThan(0);
    expect(scripts.some((source) => source.includes("WebGLRenderer"))).toBe(false);
  });

  test("changing the design keeps the 3D card showing", async ({ page }) => {
    await page.goto("/engine?quality=low");
    await expect(engine(page)).toHaveAttribute("data-engine-state", "ready", { timeout: 30_000 });
    await page.getByRole("radio", { name: /Emerald Palace/ }).click();
    await expect(engine(page)).toHaveAttribute("data-engine-state", "ready");
    await expect(page.getByRole("radio", { name: /Emerald Palace/ })).toBeChecked();
  });
});

test.describe("regional openings", () => {
  test("a tradition's opening plays and can be skipped", async ({ page }) => {
    await page.goto("/engine?quality=low&opening=tamil");
    await expect(engine(page)).toHaveAttribute("data-engine-state", "ready", { timeout: 30_000 });
    await page.getByRole("button", { name: "Open invitation" }).click();
    const skip = page.getByRole("button", { name: "Skip opening" });
    await expect(skip).toBeVisible();
    const box = (await skip.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    await skip.click();
    await expect(skip).toBeHidden();
    await expect(page.getByRole("button", { name: "Close invitation" })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`still mode shows the finished pattern with no skip, ${colorScheme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme });
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto("/engine?quality=2d&opening=bengali");
      await expect(engine(page)).toHaveAttribute("data-engine-state", "fallback");
      await page.getByRole("button", { name: "Open invitation" }).click();
      await expect(engine(page).locator("svg path").first()).toBeAttached();
      await expect(page.getByRole("button", { name: "Skip opening" })).toHaveCount(0);
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  }
});

test.describe("event pages", () => {
  for (const [colorScheme, width, suite] of [
    ["light", 320, "rajwada-bagh"],
    ["dark", 1440, "kayal"],
    ["light", 390, "shahi-savari"],
    ["dark", 390, "classic"],
  ] as const) {
    test(`turns full-screen pages one at a time, ${suite}, ${colorScheme} theme at ${width}px`, async ({
      page,
    }) => {
      // Eight pages plus an accessibility scan over full-screen art: slower on CI runners
      test.slow();
      const height = width === 1440 ? 900 : 720;
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ colorScheme });
      await page.goto(`/engine?quality=2d&opening=north-hindu&suite=${suite}`);
      await page.getByRole("button", { name: "Open invitation" }).click();
      const story = page.locator("[data-story-beat]");
      // It starts on its own once the opening has played, over the whole screen
      await expect(story).toBeVisible({ timeout: 10_000 });
      await expect(story).toHaveAttribute("data-suite", suite);
      const box = (await story.boundingBox())!;
      expect(box.width).toBe(width);
      expect(box.height).toBe(height);
      await page.getByRole("button", { name: "Pause the pages" }).click();
      await expect(page.getByRole("button", { name: "Carry on" })).toBeVisible();

      const beats: string[] = [];
      for (let i = 0; i < 12; i++) {
        beats.push((await story.getAttribute("data-story-beat"))!);
        const next = page.getByRole("button", { name: "Next page", exact: true });
        if ((await next.count()) === 0) break;
        await next.click();
      }
      expect(beats).toEqual([
        "cover",
        "family",
        "fn-haldi",
        "fn-mehendi",
        "fn-sangeet",
        "fn-wedding",
        "fn-reception",
        "reply",
      ]);
      await expect(story.getByText("Will you join us?")).toBeVisible();
      for (const name of ["Previous page", "See the card"]) {
        const button = (await page.getByRole("button", { name }).boundingBox())!;
        expect(button.height).toBeGreaterThanOrEqual(44);
      }
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await page.getByRole("button", { name: "See the card" }).click();
      await expect(story).toHaveCount(0);
      // Focus comes back to the button that plays the pages again
      await expect(page.getByRole("button", { name: "Play the invitation pages" })).toBeFocused();
      await page.getByRole("button", { name: "Play the invitation pages" }).click();
      await expect(story).toHaveAttribute("data-story-beat", "cover");
      await page.keyboard.press("Escape");
      await expect(story).toHaveCount(0);
    });
  }

  test("a swipe turns the page and keyboard focus stays inside", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 780 });
    await page.goto("/engine?quality=2d&suite=kayal");
    await page.getByRole("button", { name: "Open invitation" }).click();
    await page.getByRole("button", { name: "Play the invitation pages" }).click();
    const story = page.locator("[data-story-beat]");
    await expect(story).toHaveAttribute("data-story-beat", "cover");
    await page.mouse.move(320, 700);
    await page.mouse.down();
    await page.mouse.move(120, 705, { steps: 6 });
    await page.mouse.up();
    await expect(story).toHaveAttribute("data-story-beat", "family");
    for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
    expect(await story.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  });

  test("still mode waits to be asked and never moves on by itself", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/engine?quality=2d");
    await page.getByRole("button", { name: "Open invitation" }).click();
    await page.waitForTimeout(3_000);
    const story = page.locator("[data-story-beat]");
    await expect(story).toHaveCount(0);
    await page.getByRole("button", { name: "Play the invitation pages" }).click();
    const first = await story.getAttribute("data-story-beat");
    await expect(page.getByRole("button", { name: "Pause the pages" })).toHaveCount(0);
    await page.waitForTimeout(6_000);
    await expect(story).toHaveAttribute("data-story-beat", first!);
    await page.getByRole("button", { name: "Next page", exact: true }).click();
    await expect(story).not.toHaveAttribute("data-story-beat", first!);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
});
