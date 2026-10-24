import { weddingKindCopy } from "@/content/gallery";
import { faq, homeMeta } from "@/content/landing";
import { seoCopy } from "@/content/seo";
import { UI_LOCALES, type UiLocale } from "@/i18n/locales";
import { blogPostPath } from "@/lib/blog/posts";
import { allPostsIn } from "@/lib/blog/store";
import { CATEGORY_IDS } from "@/lib/categories/catalog";
import { WEDDING_KINDS } from "@/lib/gallery/ids";
import { pagePath } from "@/lib/seo/paths";
import { absolute } from "@/lib/seo/structured-data";
import { site } from "@/lib/site";
import { TRADITION_IDS } from "@/lib/traditions/schema";

/*
 * /llms.txt (llmstxt.org): what Shubh is and where its pages are, as plain Markdown for AI
 * assistants and answer engines that read it. Built from the site's own words and pages,
 * so it says only what the site says, and lists blog posts as they are published.
 */

export const revalidate = 3600;

const LANGUAGE_NAMES: Record<UiLocale, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  gu: "Gujarati",
  bn: "Bengali",
  ta: "Tamil",
};

const link = (name: string, path: string, note?: string) =>
  `- [${name}](${absolute(path)})${note ? `: ${note}` : ""}`;

export async function GET() {
  const posts = await Promise.all(UI_LOCALES.map(allPostsIn));
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} (${site.shortName} for short) is made in India for Indian weddings and every family celebration, founded by ${site.founder}. Hosts pick a painted design, add their names, functions and venues, and send one link on WhatsApp. Guests open it in the browser with no app, see every function with directions, and reply in one tap; the host sees replies in a guest list.`,
    "",
    "## Key facts",
    "",
    ...faq.items.map((item) => `- ${item.q} ${item.a}`),
    "- How much does it cost? Make your invite and share it for free. Choose a package when you want more. One payment per invitation, all taxes included. Never a subscription. Every package covers every function.",
    "",
    "## Main pages",
    "",
    link("Home", "/", homeMeta.tagline),
    link("All designs", pagePath({ kind: "designs" }, "en"), seoCopy.gallery.description),
    link("A live sample invitation", "/sample/rajwada-bagh", "Opens as a guest receives it"),
    link("Pricing", pagePath({ kind: "pricing" }, "en")),
    link("Blog", pagePath({ kind: "blog" }, "en"), "Invitation wording, messages and guides"),
    link("Contact", pagePath({ kind: "contact" }, "en")),
    "",
    "## Invitations by occasion",
    "",
    ...CATEGORY_IDS.map((id) =>
      link(
        seoCopy.occasions[id].title,
        pagePath({ kind: "occasion", id }, "en"),
        seoCopy.occasions[id].description,
      ),
    ),
    "",
    "## Wedding invitations by region and community",
    "",
    ...WEDDING_KINDS.map((id) =>
      link(
        weddingKindCopy[id].name,
        pagePath({ kind: "wedding-kind", id }, "en"),
        weddingKindCopy[id].description,
      ),
    ),
    ...TRADITION_IDS.map((id) =>
      link(
        seoCopy.traditionPages[id].title,
        pagePath({ kind: "tradition", id }, "en"),
        seoCopy.traditionPages[id].description,
      ),
    ),
    "",
    ...UI_LOCALES.flatMap((locale, i) =>
      posts[i]!.length === 0
        ? []
        : [
            `## Blog posts in ${LANGUAGE_NAMES[locale]}`,
            "",
            ...posts[i]!.map((post) =>
              link(post.heading, blogPostPath(post.slug, post.locale), post.description),
            ),
            "",
          ],
    ),
    "## Other languages",
    "",
    `The whole site is also in ${UI_LOCALES.filter((l) => l !== "en")
      .map((l) => `${LANGUAGE_NAMES[l]} (${absolute(pagePath({ kind: "home" }, l))})`)
      .join(", ")}.`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
