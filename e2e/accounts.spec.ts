import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

/** Preview accounts are per number, so tests that save invites each get their own. */
const numberFor = (info: TestInfo) =>
  `9${String((info.parallelIndex % 10) * 1000 + info.repeatEachIndex * 100 + info.retry).padStart(4, "0")}${String(Date.now()).slice(-5)}`;

async function signInWithPhone(page: Page, number = "98765 43210") {
  await page.getByRole("textbox", { name: /Mobile number/ }).fill(number);
  await page.getByRole("button", { name: "Send code" }).click();
  const last4 = number.replace(/\D/g, "").slice(-4);
  await expect(page.getByText(`We sent a 6-digit code to +91 ••••• •${last4}.`)).toBeVisible();
  await page.getByRole("textbox", { name: /6-digit code/ }).fill("123456");
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`accounts, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    test("sign-in, My invites and the profile fit and pass an accessibility check", async ({
      page,
    }) => {
      await page.goto("/sign-in");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sign in to Shubh");
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

    // Hindi as the profile language switches the app to Hindi
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await expect(page.getByRole("heading", { name: "आपका ब्योरा" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /आपका नाम/ })).toHaveValue("Priya Sharma");
    await expect(page.getByRole("combobox", { name: /पसंदीदा भाषा/ })).toContainText("हिन्दी");

    await page.goto("/");
    await page.getByRole("button", { name: "Account: Priya Sharma" }).click();
    await page.getByRole("menuitem", { name: "My invites" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("नमस्ते, Priya");

    await page.getByRole("button", { name: "खाता: Priya Sharma" }).click();
    await page.getByRole("menuitem", { name: "साइन आउट" }).click();
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

  test("a draft made before signing in moves into the account", async ({ page }, info) => {
    await page.goto("/create?quality=2d&category=engagement");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/create?quality=2d&category=engagement");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("textbox", { name: /First name/ }).fill("Aditya");
    await page.getByRole("textbox", { name: /Second name/ }).fill("Priya");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.goto("/sign-in?next=/invites");
    await signInWithPhone(page, numberFor(info));
    const draft = page.getByRole("article");
    await expect(draft.getByRole("heading", { name: "Aditya & Priya" })).toBeVisible();
    await expect(draft.getByText("Engagement")).toBeVisible();
    await expect(draft.getByText("Not in your account")).toBeVisible();
    await draft.getByRole("link", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/create/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "When and where is everything?",
    );
    await expect(page.getByText("Saved to your account")).toHaveCount(1);

    await page.goto("/invites");
    await expect(page.getByRole("heading", { name: "1 invite" })).toBeVisible();
    await expect(page.getByText("Not in your account")).toHaveCount(0);
    await expect(page.getByRole("article").getByText("Draft", { exact: true })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });

  test("an invite follows the host to another device, and can be deleted", async ({
    page: phone,
    browser,
  }, info) => {
    const number = numberFor(info);
    await phone.goto(`/sign-in?next=${encodeURIComponent("/create?quality=2d&new=1")}`);
    await signInWithPhone(phone, number);
    await expect(phone).toHaveURL(/\/create/);
    await phone.getByRole("radio", { name: /Roka/ }).click();
    await phone.getByRole("button", { name: "Continue" }).click();
    await phone.getByRole("button", { name: "Continue" }).click();
    await phone.getByRole("button", { name: "Continue" }).click();
    await phone.getByRole("textbox", { name: /First name/ }).fill("Kabir");
    await phone.getByRole("textbox", { name: /Second name/ }).fill("Ananya");
    await expect(phone.getByText("Saved to your account")).toHaveCount(1);

    // A second browser has none of the first one's storage
    const laptop = await browser.newPage({
      baseURL: info.project.use.baseURL,
      reducedMotion: "reduce",
    });
    await laptop.goto("/sign-in?next=/invites");
    await signInWithPhone(laptop, number);
    const card = laptop.getByRole("article");
    await expect(card.getByRole("heading", { name: "Kabir & Ananya" })).toBeVisible();
    await expect(card.getByText("Roka")).toBeVisible();
    await card.getByRole("link", { name: "Continue" }).click();
    await expect(laptop).toHaveURL(/\/create$/);
    await expect(laptop.getByRole("heading", { level: 1 })).toHaveText("Who is the couple?");
    await expect(laptop.getByRole("textbox", { name: /First name/ })).toHaveValue("Kabir");
    await laptop.getByRole("textbox", { name: /First name/ }).fill("Kabir Singh");
    await expect(laptop.getByText("Saved to your account")).toHaveCount(1);

    // Starting another keeps the first in the account
    await laptop.goto("/invites");
    await laptop.getByRole("link", { name: "New invite" }).click();
    await expect(laptop).toHaveURL(/\/create$/);
    await expect(laptop.getByRole("heading", { level: 1 })).toHaveText("What are you celebrating?");

    await phone.goto("/invites");
    await expect(phone.getByRole("heading", { name: "Kabir Singh & Ananya" })).toBeVisible();
    await phone.getByRole("button", { name: "Delete Kabir Singh & Ananya" }).click();
    const dialog = phone.getByRole("dialog", { name: "Delete this invite?" });
    expect((await axe(phone).analyze()).violations).toEqual([]);
    await dialog.getByRole("button", { name: "Delete invite" }).click();
    await expect(phone.getByText("Invite deleted").first()).toBeVisible();
    await expect(phone.getByRole("heading", { name: "No invites yet" })).toBeVisible();

    await laptop.close();
  });

  test("an invite that isn't in the account says so", async ({ page }, info) => {
    await page.goto("/sign-in?next=/invites");
    await signInWithPhone(page, numberFor(info));
    await page.goto("/create?quality=2d&invite=7d7f1f5e-3c55-4d3a-9d1c-2b1e6f0b9a11");
    await expect(page.getByText(/isn't in your account/).first()).toBeVisible();
    await expect(page).toHaveURL(/\/create$/);
  });
});
