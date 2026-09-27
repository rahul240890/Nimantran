import { expect, test } from "@playwright/test";

/* Step 14: the privacy policy and terms, security headers and error reports. */

test.describe("launch", () => {
  test.use({ reducedMotion: "reduce" });

  test("the footer and sign-in lead to the privacy policy and terms", async ({ page }) => {
    await page.goto("/");
    const legal = page.getByRole("navigation", { name: "Legal" });
    await legal.getByRole("link", { name: "Privacy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy");
    await page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("link", { name: "Your rights" })
      .click();
    await expect(page).toHaveURL(/#your-rights$/);
    await expect(page.getByRole("heading", { name: "Your rights" })).toBeInViewport();

    await page.goto("/sign-in");
    await page.getByRole("link", { name: "terms" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Terms of use");
  });

  test("the Hindi policy is its own page, linked as the Hindi version", async ({ page }) => {
    await page.goto("/hi/privacy");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("गोपनीयता नीति");
    await expect(page.locator('link[rel="alternate"][hreflang="en-IN"]')).toHaveAttribute(
      "href",
      /\/privacy$/,
    );
  });

  test("every response carries the security headers", async ({ request }) => {
    for (const path of ["/", "/i/nobody-weds-anybody", "/sign-in"]) {
      const response = await request.get(path);
      const headers = response.headers();
      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
      expect(headers["content-security-policy"], path).toContain("frame-ancestors 'none'");
      expect(headers["x-powered-by"], path).toBeUndefined();
    }
  });

  test("browser error reports are accepted, and junk is turned away", async ({ request }) => {
    const ok = await request.post("/api/errors", {
      data: { message: "Test error", url: "http://localhost/i/aarav?g=secret", source: "window" },
    });
    expect(ok.status()).toBe(204);
    const junk = await request.post("/api/errors", { data: { hello: "there" } });
    expect(junk.status()).toBe(400);
    const huge = await request.post("/api/errors", {
      data: { message: "x".repeat(5000), url: "/", source: "window" },
    });
    expect(huge.status()).toBe(413);
  });
});
