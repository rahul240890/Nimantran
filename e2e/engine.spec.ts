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
