import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, writeInvite } from "./invite-helpers";

/* Step 14: the privacy policy and terms, security headers, error reports, deleting an account. */

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

test.describe("deleting an account", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host deletes their account and their invitation goes with it", async ({ page }, info) => {
    await writeInvite(page, numberFor(info), ["Kabir", "Tara"]);
    const path = await publish(page, "kabir-weds-tara");

    await page.goto("/account");
    const confirm = page.getByRole("button", { name: "Delete my account" });
    await page.getByRole("button", { name: "Delete account" }).click();
    const dialog = page.getByRole("dialog", { name: "Delete your account?" });
    await expect(dialog.getByRole("button", { name: "Delete my account" })).toBeDisabled();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await dialog.getByRole("checkbox", { name: /I understand/ }).click();
    await confirm.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Your account has been deleted")).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("nimantran-invite-draft"))).toBeNull();

    // The guest link is closed, and the account pages ask to sign in again
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "This invitation isn't available",
    );
    await page.goto("/invites");
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
