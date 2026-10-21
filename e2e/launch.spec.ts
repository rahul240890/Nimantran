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
    await expect(page.getByText("Your account has been deleted", { exact: true })).toBeVisible();
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

test.describe("pages for payments", () => {
  test.use({ reducedMotion: "reduce" });

  test("the footer leads to pricing, refunds and contact", async ({ page }) => {
    await page.goto("/");
    const legal = page.getByRole("navigation", { name: "Legal" });
    await legal.getByRole("link", { name: "Refunds" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Refund and cancellation policy",
    );
    await expect(page.getByRole("heading", { name: "Full refund within 7 days" })).toBeVisible();

    await page
      .getByRole("navigation", { name: "Legal" })
      .getByRole("link", { name: "Contact" })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contact us");

    await page.goto("/pricing");
    for (const [name, price] of [
      ["Basic", "₹499"],
      ["Celebration", "₹899"],
      ["Grand", "₹1,099"],
    ] as const) {
      const plan = page.getByRole("article", { name, exact: true });
      await expect(plan.getByText(price, { exact: true })).toBeVisible();
    }
    await expect(
      page
        .getByRole("article", { name: "Basic", exact: true })
        .getByText("Up to 100 guests or families"),
    ).toBeVisible();
    // Every kind of design, with what each package costs on it
    const table = page.getByRole("table");
    await expect(table.getByRole("row", { name: /^Free/ })).toContainText("₹400");
    await expect(table.getByRole("row", { name: /^Royal/ })).toContainText("₹799");
    await expect(table.getByRole("row", { name: /^Royal/ })).toContainText("₹1,399");
    await expect(page.getByText("no guest has opened your invitation yet")).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    await page.getByRole("link", { name: "Read the refund policy" }).click();
    await expect(page).toHaveURL(/\/refunds$/);
  });

  test("the brand's channels are linked from the footer, Contact and every invitation", async ({
    page,
  }) => {
    const channels = {
      instagram: "https://www.instagram.com/shubh.celebration/",
      whatsapp: "https://whatsapp.com/channel/0029VbDJL893rZZZPyZ2q80o",
      youtube: "https://www.youtube.com/channel/UCGcpksufbY45cL9ujZkpyBw",
    };
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Shubh on Instagram" })).toHaveAttribute(
      "href",
      channels.instagram,
    );
    for (const [channel, href] of Object.entries(channels)) {
      const link = footer.locator(`[data-social="${channel}"]`);
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /\bme\b/);
    }
    // Search engines are told the profiles are the brand's own
    const sameAs = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) =>
      (JSON.parse(text) as { sameAs?: string[] }[]).flatMap((item) => item.sameAs ?? []),
    );
    expect(sameAs).toEqual(expect.arrayContaining(Object.values(channels)));

    await page.goto("/contact");
    await expect(
      page
        .getByRole("region", { name: "Follow Shubh" })
        .getByRole("link", { name: "Shubh's WhatsApp channel" }),
    ).toHaveAttribute("href", channels.whatsapp);

    // A guest sees them at the foot of the invitation, in the card's language
    await page.goto("/sample/rajwada-bagh");
    await expect(page.locator('footer [data-social="youtube"]')).toHaveAttribute(
      "href",
      channels.youtube,
    );
  });
});

test.describe("blog", () => {
  test.use({ reducedMotion: "reduce" });

  test("a reader finds a post, copies a message and goes on to the editor", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/blog");
    await page
      .getByRole("link", { name: "Wedding invitation wording: 30 messages to copy" })
      .click();
    await expect(page).toHaveURL(/\/blog\/wedding-invitation-wording$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Wedding invitation wording: 30 messages to copy",
    );
    const types = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) =>
      (JSON.parse(text) as Record<string, unknown>[]).map((item) => item["@type"]),
    );
    expect(types).toEqual(expect.arrayContaining(["BlogPosting", "FAQPage", "BreadcrumbList"]));

    await page.getByRole("button", { name: "Copy", exact: true }).first().click();
    await expect(page.getByText("Copied").first()).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("Ramesh Sharma");
    expect(await noOverflow(page)).toBe(true);

    await page.getByRole("link", { name: "Create your invitation" }).last().click();
    await expect(page).toHaveURL(/\/create\?category=wedding/);
  });

  test("a Hindi post switches to the English blog", async ({ page }) => {
    await page.goto("/hi/blog/shadi-card-matter-hindi");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/hi\/blog\/shadi-card-matter-hindi$/,
    );
    await expect(page.locator('link[hreflang="en-IN"]')).toHaveCount(0);
  });

  test("a post in Gujarati is its own page, linked with its English version", async ({ page }) => {
    await page.goto("/gu/blog");
    await page
      .getByRole("link", { name: /કંકોતરી લખાણ/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/gu\/blog\/kankotri-lakhan$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "gu");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("કંકોતરી લખાણ");
    await expect(page.locator('link[hreflang="en-IN"]')).toHaveAttribute(
      "href",
      /\/blog\/gujarati-wedding-invitation-wording$/,
    );
    expect(await noOverflow(page)).toBe(true);
  });

  test("a post answers its question first, and its table scrolls in its own frame", async ({
    page,
  }) => {
    await page.goto("/blog/when-to-send-wedding-invitations");
    const answer = page.getByRole("region", { name: "In short" });
    await expect(answer).toContainText("4 to 6 weeks before the first function");
    // Answer engines get the same answer as the article's abstract
    const abstracts = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) =>
      (JSON.parse(text) as { abstract?: string }[]).flatMap((item) => item.abstract ?? []),
    );
    expect(abstracts[0]).toContain("4 to 6 weeks");
    // Signed by the founder, on the page and for search engines
    await expect(page.getByText("By Ved RK, founder of Shubh Invitation")).toBeVisible();
    const authors = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) =>
      (JSON.parse(text) as { author?: { name?: string } }[]).flatMap((item) =>
        item.author?.name ? [item.author.name] : [],
      ),
    );
    expect(authors).toContain("Ved RK");
    const table = page.getByRole("region", {
      name: "When to send each part of a wedding invitation",
    });
    await expect(table.getByRole("rowheader", { name: "Save the date" })).toBeAttached();
    await table.focus();
    await expect(table).toBeFocused();
    expect(await noOverflow(page)).toBe(true);
    expect((await axe(page).analyze()).violations).toEqual([]);
  });

  test("llms.txt describes the site and lists the posts", async ({ request }) => {
    const text = await (await request.get("/llms.txt")).text();
    expect(text).toMatch(/^# Shubh Invitation/);
    expect(text).toContain("/blog/when-to-send-wedding-invitations");
    expect(text).toContain("/hi/blog/shadi-card-kab-bhejein");
    expect(text).toContain("/invitations/wedding");
  });

  test("the sitemap lists every post", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/blog/indian-wedding-functions");
    expect(sitemap).toContain("/hi/blog/shadi-card-matter-hindi");
    for (const post of [
      "/gu/blog/kankotri-lakhan",
      "/mr/blog/lagna-patrika-majkur",
      "/ta/blog/thirumana-azhaippithazh-vasagam",
      "/bn/blog/biyer-card-lekha",
    ]) {
      expect(sitemap).toContain(`${post}</loc>`);
    }
    expect(sitemap).toContain("/refunds");
  });
});
