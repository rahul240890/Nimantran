import { expect, test } from "@playwright/test";
import {
  axe,
  firstName,
  noOverflow,
  numberFor,
  openPart,
  publish,
  signIn,
  writeInvite,
} from "./invite-helpers";

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
    // Two accessibility checks of every design's tile, a save, and the same again to undo
    test.setTimeout(150_000);
    const [id, word, name] = ["kayal-scene", "kayal", "Kayal"];
    await page.goto(`/designs?q=${word}`);
    // The search's own result, first on the page: the shelves below can show it too
    const tile = page.locator(`[data-design="${id}"]`).first();
    await expect(tile.locator("[data-tier]")).toHaveAttribute("data-tier", "premium");
    // The price large, its tier's name small beside it
    const phone = info.project.name.startsWith("phone");
    await expect(tile.getByText("₹499", { exact: true })).toBeVisible();
    await expect(tile.getByText("Premium", { exact: true })).toBeVisible();

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
    // Its demo shows every page, and its tier can be set there too
    await page
      .getByRole("button", { name: `Preview ${name}`, exact: true })
      .first()
      .click();
    const demo = page.getByRole("dialog");
    await expect(demo.getByRole("radiogroup", { name: /tier$/ })).toBeVisible();
    expect((await axe(page).analyze()).violations).toEqual([]);
    await page.keyboard.press("Escape");
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
    await basic.getByRole("button", { name: "Pay ₹799" }).click();
    const pay = page.getByRole("dialog", { name: "Test payment" });
    await pay.getByRole("button", { name: "Pay (test)" }).click();
    await expect(page.getByText("Basic is on. Thank you!").first()).toBeVisible();
    await expect(basic.getByText("Your package")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Receipts" })).toBeVisible();
    await expect(
      page.getByRole("article", { name: "Celebration" }).getByRole("button", {
        name: "Upgrade for ₹400",
      }),
    ).toBeVisible();

    const id = new URL(page.url()).pathname.split("/")[2];

    await expect(page.getByRole("link", { name: "Publish your invite" })).toHaveAttribute(
      "href",
      `/create?invite=${id}&publish=1`,
    );

    // The payment in the account's history, with its receipt and the spreadsheet
    await page.goto("/account/payments");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Payment history");
    const payment = page.getByRole("article", { name: "Basic package" });
    await expect(payment.getByText("₹799").first()).toBeVisible();
    await expect(payment.getByText(/Aarav & Meera/)).toBeVisible();
    await expect(payment.getByText("Paid", { exact: true })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    const csv = await page.request.get("/account/payments/export");
    expect(csv.headers()["content-type"]).toContain("text/csv");
    expect(await csv.text()).toContain("Basic");
    await payment.getByRole("link", { name: "View receipt" }).click();
    await expect(page.getByRole("heading", { name: /^(Receipt|Tax invoice)$/ })).toBeVisible();
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page).toHaveURL(/\/account\/payments$/);

    // Back to the editor with the link dialog open
    await page.goto(`/create?invite=${id}&publish=1&quality=2d`);
    await expect(page.getByRole("dialog", { name: "Publish your invitation" })).toBeVisible({
      timeout: 30_000,
    });
    const path = await publish(page, "aarav-paid");
    await page.goto(`${path}?quality=2d`);
    await expect(page.locator("[data-watermark]")).toHaveCount(0);
  });

  test("one payment covers one design: another design on a live invite needs its own", async ({
    page,
    browser,
    context,
  }, info) => {
    test.setTimeout(150_000);
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
    await writeInvite(page, numberFor(info), ["Ved", "Gauri"]);
    await expect(async () => {
      await page.getByRole("button", { name: "Publish" }).click();
      await expect(page).toHaveURL(/\/edition\?publish=1$/, { timeout: 5_000 });
    }).toPass({ timeout: 30_000 });
    const id = new URL(page.url()).pathname.split("/")[2];
    await page
      .getByRole("article", { name: "Basic" })
      .getByRole("button", { name: "Pay ₹799" })
      .click();
    await page
      .getByRole("dialog", { name: "Test payment" })
      .getByRole("button", { name: "Pay (test)" })
      .click();
    await expect(page.getByText("Basic is on. Thank you!").first()).toBeVisible();
    await page.goto(`/create?invite=${id}&publish=1&quality=2d`);
    const path = await publish(page, "ved-one-design");

    // A guest, who sees the design that was paid for
    const guestContext = await browser.newContext({
      baseURL: info.project.use.baseURL,
      viewport: info.project.use.viewport,
      reducedMotion: "reduce",
    });
    const guest = await guestContext.newPage();
    await guest.goto(`${path}?quality=2d`);
    await expect(guest.locator("[data-suite]").first()).toHaveAttribute(
      "data-suite",
      "rajwada-bagh",
    );

    // Edit invite opens it on its design's page
    await page.goto(`/create?invite=${id}`);
    await expect(page).toHaveURL(new RegExp(`/create/rajwada-bagh\\?.*invite=${id}`));
    await expect(firstName(page)).toHaveValue("Ved", {
      timeout: 30_000,
    });

    // Another ₹799 design for the live invite, as picked under its page, isn't saved:
    // guests keep the paid one
    const kayal = `/create/kayal?category=wedding&invite=${id}`;
    await page.goto(kayal);
    const held = page.locator("[data-held-back]");
    await expect(held).toBeVisible({ timeout: 20_000 });
    await expect(held).toContainText("Your package is for Rajwada Bagh");
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
    await guest.reload();
    await expect(guest.locator("[data-suite]").first()).toHaveAttribute(
      "data-suite",
      "rajwada-bagh",
    );

    // Going back to the paid design saves again, and the page turns to it
    await held.getByRole("button", { name: "Go back to Rajwada Bagh" }).click();
    await expect(held).toHaveCount(0, { timeout: 20_000 });
    await expect(page).toHaveURL(new RegExp(`/create/rajwada-bagh\\?.*invite=${id}`));

    // Or the new design gets its own package, at its full price, and then goes live
    await page.goto(kayal);
    await expect(held).toBeVisible({ timeout: 20_000 });
    await held.getByRole("link", { name: "Choose a package" }).click();
    await expect(page).toHaveURL(/\/edition\?plan=basic&design=kayal$/);
    await expect(
      page.getByText(/Your package is for Rajwada Bagh\. Each package is for one design/),
    ).toBeVisible();
    const basic = page.getByRole("article", { name: "Basic" });
    await basic.getByRole("button", { name: "Pay ₹799" }).click();
    await page
      .getByRole("dialog", { name: "Test payment" })
      .getByRole("button", { name: "Pay (test)" })
      .click();
    await expect(page.getByText("Basic is on. Thank you!").first()).toBeVisible();
    // Back on the invite's page in its new design, which now saves and goes live
    await page.getByRole("link", { name: "Put it live" }).click();
    await expect(page).toHaveURL(new RegExp(`/create/kayal\\?.*invite=${id}`), {
      timeout: 30_000,
    });
    await expect(firstName(page)).toHaveValue("Ved", {
      timeout: 30_000,
    });
    await expect(page.locator("[data-held-back]")).toHaveCount(0);
    await expect
      .poll(
        async () => {
          await guest.reload();
          return guest.locator("[data-suite]").first().getAttribute("data-suite");
        },
        { timeout: 30_000 },
      )
      .toBe("kayal");
    await guestContext.close();
  });

  test("a Free invite carries the watermark once checkout is on", async ({
    page,
    context,
  }, info) => {
    test.setTimeout(90_000);
    await writeInvite(page, numberFor(info), ["Kabir", "Isha"]);
    // Published while checkout is off: no limits yet
    const path = await publish(page, "kabir-free");
    const id = new URL(page.url()).pathname.split("/")[2];
    await page.goto(`${path}?quality=2d`);
    await expect(page.locator("[data-watermark]")).toHaveCount(0);
    await context.addCookies([
      { name: "shubh-preview-checkout", value: "on", url: info.project.use.baseURL! },
    ]);
    await page.reload();
    await expect(page.locator("[data-watermark]")).toHaveCount(1);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Its paid design has no package, yet its words can still be corrected: only a change
    // that adds what isn't paid for (another design, more languages) waits for a package
    await page.goto(`/create?invite=${id}`);
    await expect(page).toHaveURL(new RegExp(`/create/rajwada-bagh\\?.*invite=${id}`));
    await expect(firstName(page)).toHaveValue("Kabir", { timeout: 30_000 });
    await openPart(page, "Names");
    await page.getByRole("textbox", { name: /Second name/ }).fill("Isha Rani");
    await expect
      .poll(
        async () => {
          await page.request.get("/"); // let the editor's save run
          const guest = await page.request.get(path);
          return (await guest.text()).includes("Isha Rani");
        },
        { timeout: 30_000 },
      )
      .toBe(true);
    await expect(page.locator("[data-held-back]")).toHaveCount(0);
  });
});

test.describe("coupons, invoices and refunds", () => {
  test.use({ reducedMotion: "reduce" });

  test("an admin makes a coupon, a host pays less with it, and the admin refunds", async ({
    page,
    context,
    browser,
  }, info) => {
    test.setTimeout(180_000);
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
    await admin.getByRole("textbox", { name: /^Phone/ }).fill("98765 43210");
    await admin.getByRole("button", { name: "Save details" }).click();
    await expect(admin.getByText("Business details saved").first()).toBeVisible();
    expect(await noOverflow(admin)).toBe(true);
    // Saving refreshes the page, which puts its title back a moment later
    await expect(admin).toHaveTitle(/\S/);
    expect((await axe(admin).analyze()).violations).toEqual([]);

    // The contact page shows the business, and a chat on WhatsApp with its number
    await admin.goto("/contact");
    await expect(admin.getByText("Shubh Test Pvt Ltd")).toBeVisible();
    await expect(admin.getByRole("link", { name: "Chat with us on WhatsApp" })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/919876543210\?text=/,
    );
    await admin.goto("/admin/business");

    await admin
      .getByRole("navigation", { name: "Admin" })
      .getByRole("link", { name: "Offers" })
      .click();
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Offers");
    await admin.getByRole("textbox", { name: "Code" }).fill(code.toLowerCase());
    await admin.getByRole("textbox", { name: "Percent off" }).fill("20");
    // The offers page needs a title for an offer it shows
    await admin.getByRole("button", { name: "Make offer" }).click();
    await expect(admin.getByText("An offer on the offers page needs a title.")).toBeVisible();
    await admin.getByRole("textbox", { name: /^Title/ }).fill("Test festival offer");
    await admin
      .getByRole("textbox", { name: /^Terms and conditions/ })
      .fill("Valid once per invitation.");
    await admin.getByRole("radio", { name: "Wedding" }).check();
    await admin.getByRole("button", { name: "Make offer" }).click();
    await expect(admin.getByText(`${code} is ready`).first()).toBeVisible();
    await expect(admin.getByText(code, { exact: true })).toBeVisible();

    // The offers page shows it with its code and terms, for anyone
    await admin.goto("/offers");
    const offer = admin.locator(`[data-offer="${code}"]`);
    await expect(offer).toHaveAccessibleName("Test festival offer");
    await expect(offer.getByText(code, { exact: true })).toBeVisible();
    await expect(offer.getByText("20% off")).toBeVisible();
    await expect(offer.locator('img[src*="wedding"]')).toHaveCount(1);
    // The bar over every public page carries an offer running now
    await expect(admin.locator("[data-offer-bar]")).toBeVisible();
    // Saving an offer leaves the prebuilt pages standing
    expect((await admin.goto("/invitations/haldi"))?.status()).toBe(200);
    await admin.goto("/offers");
    await offer.getByText("Terms and conditions").click();
    await expect(offer.getByText("Valid once per invitation.")).toBeVisible();
    expect(await noOverflow(admin)).toBe(true);
    expect((await axe(admin).analyze()).violations).toEqual([]);

    // Admin, Emails draws the new-account emails with the offer in them
    await admin.goto("/admin/emails");
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Emails");
    const welcome = admin.frameLocator('iframe[title="Welcome email"]');
    await expect(welcome.getByText(code, { exact: true })).toBeVisible();
    await expect(
      admin
        .frameLocator('iframe[title="New designs and offers email"]')
        .getByText(code, { exact: true }),
    ).toBeVisible();
    expect(await noOverflow(admin)).toBe(true);
    await expect(admin).toHaveTitle(/\S/);
    // The email previews are sandboxed with no scripts, so axe can't run inside them
    expect((await axe(admin).exclude("iframe").analyze()).violations).toEqual([]);

    // Changing it shows on the offers page too
    await admin.goto("/admin/coupons");
    await admin.getByRole("button", { name: `Edit ${code}` }).click();
    const edit = admin.getByRole("dialog", { name: `Edit ${code}` });
    await edit.getByRole("textbox", { name: /^Short description/ }).fill("For every design");
    await edit.getByRole("button", { name: "Save offer" }).click();
    await expect(admin.getByText(`${code} is saved`).first()).toBeVisible();
    await admin.goto("/offers");
    await expect(offer.getByText("For every design")).toBeVisible();
    await admin.goto("/admin/coupons");
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
    // Bought for the design on screen: one payment, one design
    await expect(page).toHaveURL(/\/edition\?plan=basic&design=rajwada-bagh$/);

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
    await basic.getByRole("button", { name: "Pay ₹639" }).click();
    await page
      .getByRole("dialog", { name: "Test payment" })
      .getByRole("button", { name: "Pay (test)" })
      .click();
    await expect(page.getByText("Basic is on. Thank you!").first()).toBeVisible();
    // The cards show what's paid now, never the coupon's prices from before
    await expect(basic.getByText("Your package")).toBeVisible();
    await expect(basic.getByRole("button", { name: /^Pay / })).toHaveCount(0);
    await expect(
      page
        .getByRole("article", { name: "Celebration" })
        .getByRole("button", { name: /^Upgrade for ₹/ }),
    ).toBeVisible();
    // and the editor says the design is paid for, in place of its price
    const packages = page.url();
    const inviteId = new URL(packages).pathname.split("/")[2];
    await page.goto(`/create?invite=${inviteId}`);
    // Once the editor has tidied its address, which can take a moment on a busy machine
    await expect(page.locator("[data-paid]").first()).toHaveText("Paid · Basic", {
      timeout: 15_000,
    });
    await page.goto(packages);

    await page.getByRole("link", { name: "Invoice" }).first().click();
    await expect(page.getByRole("heading", { name: "Tax invoice" })).toBeVisible();
    await expect(page.getByText("Shubh Test Pvt Ltd").first()).toBeVisible();
    await expect(page.getByText(/SHUBH\/\d{4}-\d{2}\/\d{5}/).first()).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);

    // Back to the admin: the order, its coupon and a refund
    await admin.goto("/admin/orders");
    const row = admin.getByRole("row").filter({ hasText: code });
    await expect(row.getByText("₹639")).toBeVisible();
    await row.getByRole("button", { name: "Refund" }).click();
    const confirm = admin.getByRole("dialog", { name: "Refund ₹639?" });
    await confirm.getByRole("button", { name: "Refund ₹639" }).click();
    await expect(admin.getByText("₹639 refunded").first()).toBeVisible();
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

  test("a 100% off code gives the package with no payment", async ({
    page,
    context,
    browser,
  }, info) => {
    test.setTimeout(120_000);
    const baseURL = info.project.use.baseURL!;
    const code = `FREE${Date.now().toString().slice(-8)}`;
    const adminContext = await browser.newContext({ ...info.project.use, baseURL });
    const admin = await adminContext.newPage();
    await admin.goto("/sign-in?next=%2Fadmin%2Fcoupons");
    await signIn(admin, ADMIN);
    await expect(admin.getByRole("heading", { level: 1 })).toHaveText("Offers");
    await admin.getByRole("textbox", { name: "Code" }).fill(code);
    await admin.getByRole("textbox", { name: "Percent off" }).fill("100");
    await admin.getByRole("switch", { name: "Show on the offers page" }).click();
    await admin.getByRole("button", { name: "Make offer" }).click();
    await expect(admin.getByText(`${code} is ready`).first()).toBeVisible();

    await context.addCookies([{ name: "shubh-preview-checkout", value: "on", url: baseURL }]);
    await writeInvite(page, numberFor(info), ["Rohan", "Tara"]);
    await page.locator("[data-edition-notice]").getByRole("link", { name: "Get Basic" }).click();
    await page.getByRole("textbox", { name: "Coupon code" }).fill(code);
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText(`Coupon ${code} applied`).first()).toBeVisible();
    const basic = page.getByRole("article", { name: "Basic" });
    // No payment window: the package is the invite's at once
    await basic.getByRole("button", { name: "Get it free" }).click();
    await expect(page.getByText("Basic is on. Thank you!").first()).toBeVisible();
    await expect(basic.getByText("Your package")).toBeVisible();

    // The admin sees a ₹0 order, and can take it back without Razorpay
    await admin.goto("/admin/orders");
    const row = admin.getByRole("row").filter({ hasText: code });
    await expect(row.getByText("₹0").first()).toBeVisible();
    await row.getByRole("button", { name: "Refund" }).click();
    await admin
      .getByRole("dialog")
      .getByRole("button", { name: /^Refund/ })
      .click();
    await expect(row.getByText("Refunded")).toBeVisible();
    await adminContext.close();
  });
});
