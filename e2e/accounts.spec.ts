import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

async function signInWithPhone(page: Page, number = "98765 43210") {
  await page.getByRole("textbox", { name: /Mobile number/ }).fill(number);
  await page.getByRole("button", { name: "Send code" }).click();
  await expect(page.getByText("We sent a 6-digit code to +91 ••••• •3210.")).toBeVisible();
  await page.getByRole("textbox", { name: /6-digit code/ }).fill("123456");
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`accounts, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("sign-in, My invites and the profile fit and pass an accessibility check", async ({
      page,
    }) => {
      await page.goto("/sign-in");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sign in to Nimantran");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await page.getByRole("button", { name: "Send code" }).click();
      await expect(page.getByText("Enter your mobile number")).toBeVisible();
      await page.getByRole("textbox", { name: /Mobile number/ }).fill("12345");
      await page.getByRole("button", { name: "Send code" }).click();
      await expect(page.getByText(/doesn't look like a mobile number/)).toBeVisible();
      expect((await axe(page).analyze()).violations).toEqual([]);

      await page.getByRole("textbox", { name: /Mobile number/ }).fill("98765 43210");
      await page.getByRole("button", { name: "Send code" }).click();
      await expect(page.getByRole("heading", { name: "Enter the code" })).toBeVisible();
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await page.getByRole("textbox", { name: /6-digit code/ }).fill("123456");
      await expect(page).toHaveURL(/\/invites$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Namaste");
      await expect(page.getByText("Add your name")).toBeVisible();
      await expect(page.getByRole("heading", { name: "No invites yet" })).toBeVisible();
      // The title streams in after a client-side move from sign-in
      await expect(page).toHaveTitle(/My invites/);
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);

      await page.goto("/account");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your details");
      expect(await noOverflow(page)).toBe(true);
      expect((await axe(page).analyze()).violations).toEqual([]);
    });
  });
}

test.describe("accounts", () => {
  test.use({ reducedMotion: "reduce" });

  test("account pages send signed-out visitors to sign in, then back", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Faccount$/);
    await signInWithPhone(page);
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByRole("main")).toContainText("Signed in with+91 98765 43210");
  });

  test("a wrong code says so and lets the host try again", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("textbox", { name: /Mobile number/ }).fill("+91 98765 43210");
    await page.getByRole("button", { name: "Send code" }).click();
    await page.getByRole("textbox", { name: /6-digit code/ }).fill("000000");
    await expect(page.getByText(/That code is wrong or has expired/)).toBeVisible();
    await expect(page.getByRole("textbox", { name: /6-digit code/ })).toHaveValue("");
    // A refresh while waiting for the SMS keeps the number
    await page.reload();
    await expect(page.getByRole("heading", { name: "Enter the code" })).toBeVisible();
    await page.getByRole("button", { name: "Change number" }).click();
    await expect(page.getByRole("textbox", { name: /Mobile number/ })).toHaveValue(
      "+91 98765 43210",
    );
  });

  test("the profile saves a name and language, and the header greets by it", async ({ page }) => {
    await page.goto("/sign-in?next=/account");
    await signInWithPhone(page);
    await expect(page).toHaveURL(/\/account$/);
    const name = page.getByRole("textbox", { name: /Your name/ });
    await name.fill("");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Please enter your name")).toBeVisible();
    await name.fill("Priya Sharma");
    await page.getByRole("combobox", { name: /Preferred language/ }).click();
    await page.getByRole("option", { name: /Hindi/ }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Profile saved").first()).toBeVisible();

    await page.reload();
    await expect(name).toHaveValue("Priya Sharma");
    await expect(page.getByRole("combobox", { name: /Preferred language/ })).toContainText(
      "हिन्दी",
    );

    await page.goto("/");
    await page.getByRole("button", { name: "Account: Priya Sharma" }).click();
    await page.getByRole("menuitem", { name: "My invites" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Namaste, Priya");

    await page.getByRole("button", { name: "Account: Priya Sharma" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await page.goto("/invites");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("Google sign-in returns to where the host was", async ({ page }) => {
    await page.goto("/sign-in?next=/invites");
    await page.getByRole("button", { name: "Continue with Google" }).click();
    await expect(page).toHaveURL(/\/invites$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Namaste, Meera");
  });

  test("My invites shows the draft on this device", async ({ page }) => {
    await page.goto("/create?quality=2d&category=engagement");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/create?quality=2d&category=engagement");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("textbox", { name: /First name/ }).fill("Aditya");
    await page.getByRole("textbox", { name: /Second name/ }).fill("Priya");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.goto("/sign-in?next=/invites");
    await signInWithPhone(page);
    const draft = page.getByRole("article");
    await expect(draft.getByRole("heading", { name: "Aditya & Priya" })).toBeVisible();
    await expect(draft.getByText("Engagement")).toBeVisible();
    await draft.getByRole("link", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/create/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "When and where is everything?",
    );
  });
});
