import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, signIn, writeInvite } from "./invite-helpers";

/* The master admin and packages (Steps 15 to 17), in preview mode. */

// Preview mode's admin number (src/lib/auth/mode.ts)
const ADMIN = "9999900000";

test.describe("master admin", () => {
  test.use({ reducedMotion: "reduce" });

  test("stays hidden from everyone but an admin", async ({ page }, info) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Fadmin/);
    await signIn(page, numberFor(info));
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "This page isn't here" })).toBeVisible();
    await page.goto("/admin/razorpay");
    await expect(page.getByRole("heading", { name: "Razorpay" })).toHaveCount(0);
  });

  test("an admin sets up Razorpay and turns checkout on", async ({ page }) => {
    await page.goto("/sign-in?next=%2Fadmin");
    await signIn(page, ADMIN);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Namaste/);
    const menu = page.getByRole("navigation", { name: "Admin" });
    await expect(menu.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    // The title can land after the heading, so wait for it before the axe check
    await expect(page).toHaveTitle(/Overview/);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    await menu.getByRole("link", { name: "Razorpay" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Razorpay");
    await expect(page.getByText("RAZORPAY_KEY_SECRET").first()).toBeVisible();
    await expect(page.getByText(/\/api\/razorpay\/webhook$/)).toBeVisible();
    const checkout = page.getByRole("switch", { name: "Checkout for hosts" });
    await expect(checkout).not.toBeChecked();
    await checkout.click();
    await expect(checkout).toBeChecked();
    await expect(page.getByText("Checkout is on").first()).toBeVisible();
    await page.reload();
    await expect(page.getByRole("switch", { name: "Checkout for hosts" })).toBeChecked();
    await expect(page).toHaveTitle(/Razorpay/);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    await menu.getByRole("link", { name: "Orders" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orders");
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
});

test.describe("designs and prices", () => {
  test.use({ reducedMotion: "reduce" });

  test("an admin makes a design free and its tile says so", async ({ page }, info) => {
    test.setTimeout(90_000);
    const [id, word, name] = ["kayal-scene", "kayal", "Kayal"];
    await page.goto(`/designs?q=${word}`);
    const tile = page.locator(`[data-design="${id}"]`);
    await expect(tile.locator("[data-tier]")).toHaveAttribute("data-tier", "premium");
    // A phone's narrow tile shows the price alone
    const phone = info.project.name.startsWith("phone");
    await expect(tile.getByText(phone ? "₹499" : "Premium · ₹499", { exact: true })).toBeVisible();

    await page.goto("/sign-in?next=%2Fadmin%2Fdesigns");
    await signIn(page, ADMIN);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designs and prices");
    await expect(page).toHaveTitle(/Designs and prices/);
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    // Both screen sizes run at once on one server; one of them changes the setting
    if (phone) return;

    const search = page.getByRole("searchbox", { name: "Search designs" });
    const tiers = page.getByRole("radiogroup", { name: `${name} (Scene) tier` });
    await search.fill(word);
    await tiers.getByRole("radio", { name: "Free" }).click();
    await expect(page.getByText("1 change not saved yet.")).toBeVisible();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Designs and prices saved").first()).toBeVisible();

    await page.goto(`/designs?q=${word}`);
    await expect(tile.locator("[data-tier]")).toHaveAttribute("data-tier", "free");
    await expect(tile.getByText("Free", { exact: true })).toBeVisible();

    // Back as it was, for every other test
    await page.goto("/admin/designs");
    await search.fill(word);
    await tiers.getByRole("radio", { name: "Premium" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Designs and prices saved").first()).toBeVisible();
  });
});

test.describe("packages", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host sees the packages before publishing, pays, then publishes", async ({
    page,
    context,
  }, info) => {
    test.setTimeout(90_000);
    // Checkout on for this browser, as the admin's switch does in preview mode
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
    await writeInvite(page, numberFor(info), ["Aarav", "Meera"]);
    // A Free invite goes to the packages first
    await expect(async () => {
      await page.getByRole("button", { name: "Publish" }).click();
      await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/edition\?publish=1$/, {
        timeout: 5_000,
      });
    }).toPass({ timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose your package");
    const basic = page.getByRole("article", { name: "Basic" });
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await basic.getByRole("button", { name: "Pay ₹499" }).click();
    const pay = page.getByRole("dialog", { name: "Test payment" });
    await pay.getByRole("button", { name: "Pay (test)" }).click();
    await expect(page.getByText("Basic is on. Thank you!").first()).toBeVisible();
    await expect(basic.getByText("Your package")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Receipts" })).toBeVisible();
    await expect(
      page.getByRole("article", { name: "Celebration" }).getByRole("button", {
        name: "Upgrade for ₹500",
      }),
    ).toBeVisible();

    // Back to the editor with the link dialog open
    const id = new URL(page.url()).pathname.split("/")[2];
    await expect(page.getByRole("link", { name: "Publish your invite" })).toHaveAttribute(
      "href",
      `/create?invite=${id}&publish=1`,
    );
    await page.goto(`/create?invite=${id}&publish=1&quality=2d`);
    await expect(page.getByRole("dialog", { name: "Choose your link" })).toBeVisible({
      timeout: 30_000,
    });
    const path = await publish(page, "aarav-paid");
    await page.goto(`${path}?quality=2d`);
    await expect(page.locator("[data-watermark]")).toHaveCount(0);
  });

  test("a Free invite carries the watermark once checkout is on", async ({
    page,
    context,
  }, info) => {
    test.setTimeout(90_000);
    await writeInvite(page, numberFor(info), ["Kabir", "Isha"]);
    // Published while checkout is off: no limits yet
    const path = await publish(page, "kabir-free");
    await page.goto(`${path}?quality=2d`);
    await expect(page.locator("[data-watermark]")).toHaveCount(0);
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
    await page.reload();
    await expect(page.locator("[data-watermark]")).toHaveCount(1);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });
});

test.describe("coupons, invoices and refunds", () => {
  test.use({ reducedMotion: "reduce" });

  test("an admin makes a coupon, a host pays less with it, and the admin refunds", async ({
    page,
    context,
    browser,
  }, info) => {
    test.setTimeout(120_000);
    const baseURL = info.project.use.baseURL!;
    const code = `TEST${Date.now().toString().slice(-8)}`;

    // The admin, in a browser of their own
    const adminContext = await browser.newContext({
      ...info.project.use,
      baseURL,
      reducedMotion: "reduce",
    });
    const admin = await adminContext.newPage();
    await admin.goto("/sign-in?next=%2Fadmin%2Fbusiness");
    await signIn(admin, ADMIN);
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Business details");
    await admin.getByRole("textbox", { name: "Legal name" }).fill("Shubh Test Pvt Ltd");
    await admin.getByRole("textbox", { name: "Address" }).fill("1 MG Road, Ahmedabad, Gujarat");
    await admin.getByRole("textbox", { name: /GSTIN/ }).fill("24ABCDE1234F1Z");
    await admin.getByRole("button", { name: "Save details" }).click();
    await expect(admin.getByText(/A GSTIN has 15 letters/)).toBeVisible();
    await admin.getByRole("textbox", { name: /GSTIN/ }).fill("24ABCDE1234F1Z5");
    await admin.getByRole("button", { name: "Save details" }).click();
    await expect(admin.getByText("Business details saved").first()).toBeVisible();
    expect(await noOverflow(admin)).toBe(true);
    expect((await axe(admin).analyze()).violations).toEqual([]);

    await admin
      .getByRole("navigation", { name: "Admin" })
      .getByRole("link", { name: "Coupons" })
      .click();
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Coupons");
    await admin.getByRole("textbox", { name: "Code" }).fill(code.toLowerCase());
    await admin.getByRole("textbox", { name: "Percent off" }).fill("20");
    await admin.getByRole("button", { name: "Make coupon" }).click();
    await expect(admin.getByText(`${code} is ready`).first()).toBeVisible();
    await expect(admin.getByText(code, { exact: true })).toBeVisible();
    expect(await noOverflow(admin)).toBe(true);
    // After a client navigation the <title> streams in late
    await expect(admin).toHaveTitle(/\S/);
    expect((await axe(admin).analyze()).violations).toEqual([]);

    // The host, with checkout on
    await context.addCookies([{ name: "shubh-preview-checkout", value: "on", url: baseURL }]);
    await writeInvite(page, numberFor(info), ["Rohan", "Tara"]);
    const notice = page.locator("[data-edition-notice]");
    await expect(notice.getByText("This invite needs a package")).toBeVisible();
    await notice.getByRole("link", { name: "Get Basic" }).click();
    await expect(page).toHaveURL(/\/edition\?plan=basic$/);

    await page.getByRole("textbox", { name: "Coupon code" }).fill("NOPE123");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByRole("textbox", { name: "Coupon code" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await page.getByRole("textbox", { name: "Coupon code" }).fill(code);
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText(`Coupon ${code} applied`).first()).toBeVisible();
    const basic = page.getByRole("article", { name: "Basic" });
    await basic.getByRole("button", { name: "Pay ₹399" }).click();
    await page
      .getByRole("dialog", { name: "Test payment" })
      .getByRole("button", { name: "Pay (test)" })
      .click();
    await expect(page.getByText("Basic is on. Thank you!").first()).toBeVisible();

    await page.getByRole("link", { name: "Invoice" }).first().click();
    await expect(page.getByRole("heading", { name: "Tax invoice" })).toBeVisible();
    await expect(page.getByText("Shubh Test Pvt Ltd").first()).toBeVisible();
    await expect(page.getByText(/SHUBH\/\d{4}-\d{2}\/\d{5}/).first()).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Back to the admin: the order, its coupon and a refund
    await admin.goto("/admin/orders");
    const row = admin.getByRole("row").filter({ hasText: code });
    await expect(row.getByText("₹399")).toBeVisible();
    await row.getByRole("button", { name: "Refund" }).click();
    const confirm = admin.getByRole("dialog", { name: "Refund ₹399?" });
    await confirm.getByRole("button", { name: "Refund ₹399" }).click();
    await expect(admin.getByText("₹399 refunded").first()).toBeVisible();
    await expect(row.getByText("Refunded")).toBeVisible();
    await expect(row.getByRole("button", { name: "Refund" })).toHaveCount(0);

    await admin
      .getByRole("navigation", { name: "Admin" })
      .getByRole("link", { name: "Invites" })
      .click();
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Invites");
    expect(await noOverflow(admin)).toBe(true);
    // After a client navigation the <title> streams in late
    await expect(admin).toHaveTitle(/\S/);
    expect((await axe(admin).analyze()).violations).toEqual([]);
    await adminContext.close();

    // The host's invite is back on Free
    await page.goBack();
    await page.reload();
    await expect(page.getByText("Refunded").first()).toBeVisible();
  });
});
