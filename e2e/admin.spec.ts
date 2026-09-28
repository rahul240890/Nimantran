import { expect, test } from "@playwright/test";
import { axe, noOverflow, numberFor, publish, signIn, writeInvite } from "./invite-helpers";

/* The master admin and editions (Steps 15 to 17), in preview mode. */

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

test.describe("editions", () => {
  test.use({ reducedMotion: "reduce" });

  test("a host pays for the edition their invite needs, then publishes", async ({
    page,
    context,
  }, info) => {
    test.setTimeout(90_000);
    // Checkout on for this browser, as the admin's switch does in preview mode
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
    // Two functions: more than Free's one
    await writeInvite(page, numberFor(info), ["Aarav", "Meera"]);
    await page.getByRole("button", { name: "Publish" }).click();
    const dialog = page.getByRole("dialog", { name: "Choose your link" });
    await dialog
      .getByRole("textbox", { name: /Invitation link/ })
      .fill(`aarav-edition-${Date.now()}`);
    await expect(dialog.getByText("This link is free.")).toBeVisible();
    await dialog.getByRole("button", { name: "Publish invitation" }).click();
    await expect(dialog.getByText("This invite needs a bigger edition")).toBeVisible();
    await expect(dialog.getByText("2 functions")).toBeVisible();
    await dialog.getByRole("link", { name: "Choose edition" }).click();

    await expect(page).toHaveURL(/\/invites\/[0-9a-f-]+\/edition\?plan=premium$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose your edition");
    const premium = page.getByRole("article", { name: "Premium" });
    await expect(premium.getByText("Fits your invite")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await premium.getByRole("button", { name: "Pay ₹499" }).click();
    const pay = page.getByRole("dialog", { name: "Test payment" });
    await pay.getByRole("button", { name: "Pay (test)" }).click();
    await expect(page.getByText("Premium is on. Thank you!").first()).toBeVisible();
    await expect(premium.getByText("Your edition")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Receipts" })).toBeVisible();
    await expect(
      page.getByRole("article", { name: "Royal" }).getByRole("button", {
        name: "Upgrade for ₹1,500",
      }),
    ).toBeVisible();

    const id = new URL(page.url()).pathname.split("/")[2];
    await page.goto(`/create?invite=${id}&quality=2d`);
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
