import { expect, test, type Page } from "@playwright/test";
import { axe, noOverflow } from "./invite-helpers";

/* The public pages search engines index (Step 12b), and what they tell crawlers. */

const wide = (page: Page) => page.viewportSize()!.width >= 1280;

async function structuredData(page: Page): Promise<Record<string, unknown>[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((text) => JSON.parse(text) as Record<string, unknown>[]);
}

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`public pages, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    for (const [path, heading] of [
      ["/invitations/haldi", "Haldi invitations as bright as the day"],
      ["/traditions/bengali", "Bengali biye cards with Prajapati's blessing"],
      ["/designs/gopuram", "Gopuram Pon"],
      ["/designs", "Find your invitation design"],
      ["/hi/invitations/wedding", "द्वार की तरह खुलने वाला शादी का कार्ड"],
      ["/hi/traditions/tamil", "मुहूर्तम के साथ तमिल कल्याण पत्रिकै"],
    ] as const) {
      test(`${path} fits the screen and passes an accessibility check`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          "href",
          new RegExp(`${path}$`),
        );
        await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
        expect(await noOverflow(page)).toBe(true);
        expect((await axe(page).analyze()).violations).toEqual([]);
      });
    }
  });
}

test.describe("search engines", () => {
  test.use({ reducedMotion: "reduce" });

  test("each page links its language versions and describes itself", async ({ page }) => {
    await page.goto("/traditions/tamil");
    await expect(page).toHaveTitle("Tamil kalyana pathirikai online · Shubh Invitation");
    await expect(page.locator('link[hreflang="hi-IN"]')).toHaveAttribute(
      "href",
      /\/hi\/traditions\/tamil$/,
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      "href",
      /\/traditions\/tamil$/,
    );
    const crumbs = (await structuredData(page)).find((item) => item["@type"] === "BreadcrumbList");
    expect(crumbs?.itemListElement).toHaveLength(2);

    await page.goto("/");
    const types = (await structuredData(page)).map((item) => item["@type"]);
    expect(types).toEqual(
      expect.arrayContaining(["Organization", "WebSite", "SoftwareApplication", "FAQPage"]),
    );
  });

  test("the sitemap lists public pages only, and robots points to it", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/hi/designs/alpona</loc>");
    expect(sitemap).toContain("/invitations/save-the-date</loc>");
    expect(sitemap).not.toContain("/i/");
    expect(sitemap).not.toContain("/create");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /account");
    expect(robots).toContain("Sitemap: ");
    expect(robots).not.toMatch(/Disallow: \/design\b/);
  });

  test("app pages ask not to be indexed", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("moving around", () => {
  test.use({ reducedMotion: "reduce" });

  test("a tradition page starts an invite in that tradition", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/traditions/gujarati");
    await page.getByRole("link", { name: "Create your invitation" }).click();
    await expect(page).toHaveURL(/\/create/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Pick the design your guests will open",
    );
    // The cards behind the pages show once Card colours is the design
    await page.getByRole("radio", { name: /^Card colours/ }).click();
    const designs = page
      .getByRole("radiogroup", { name: "Card paper and colours" })
      .getByRole("radio");
    await expect(designs.first()).toHaveAccessibleName(/Bandhani Utsav/);
  });

  test("the language menu keeps the page and the footer reaches every page", async ({ page }) => {
    await page.goto("/designs/rose");
    if (!wide(page)) await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: /^Language: English$/ }).click();
    await page.getByRole("menuitemradio", { name: /हिन्दी/ }).click();
    await expect(page).toHaveURL(/\/hi\/designs\/rose$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");

    await page.goto("/designs");
    const footer = page.getByRole("contentinfo");
    await footer.getByRole("link", { name: "Sangeet" }).click();
    await expect(page).toHaveURL(/\/invitations\/sangeet$/);
    // Section links go back to the home page
    await footer.getByRole("link", { name: "FAQ" }).click();
    await expect(page).toHaveURL(/\/#faq$/);
  });
});
