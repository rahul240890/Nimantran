import "server-only";
import { z } from "zod";
import { askJson } from "@/lib/ai/ask";
import { aiConfig } from "@/lib/wording/providers";
import type { UiLocale } from "@/i18n/locales";

/*
 * A first draft of a blog post from a search phrase, written by the AI the server is set
 * up for, in the blog's light markup (markup.ts), for the admin to check and publish.
 */

const draftSchema = z.object({
  title: z.string(),
  description: z.string(),
  heading: z.string(),
  intro: z.string(),
  body: z.string(),
  faq: z.string(),
  keywords: z.array(z.string()),
});
export type PostDraft = z.infer<typeof draftSchema>;

const SHAPE =
  '{"title":"…","description":"…","heading":"…","intro":"…","body":"…","faq":"Q: …\\nA: …","keywords":["…"]}';

const SYSTEM = `You write blog posts for Shubh Invitation (shubhinvitation.com), an Indian website where families make animated digital invitations for weddings and every celebration, send them on WhatsApp, and collect RSVPs per function. Guests need no app. Making and sharing an invitation with a free design is free, with every function. Each invitation can take one of three packages, priced on its design (paid designs from ₹499, GST included): Basic (the design with no watermark), Celebration (more invites, a video for WhatsApp Status and Reels, a second card language, the host's own song) and Grand (unlimited invites, a video for every function). Never claim features beyond these.

Write for the person searching: put the most useful part (messages to copy, or the steps) near the top, in plain, warm words. Use invented Indian names, never real people. 900 to 1,400 words.

Fields:
- title: for search results, at most 48 characters, containing the search phrase.
- description: at most 155 characters.
- heading: the page's main heading, may be longer than the title.
- intro: two or three sentences.
- body: the post in this markup, one block per line, blank lines between blocks:
  ## Section heading
  ### Smaller heading
  - list item   (or 1. for numbered)
  > [Label] a message the reader can copy   (label optional; one message per line)
  ! a short tip
  Plain lines are paragraphs. Links look like [words](/path); only link to /create, /pricing, /blog, /invitations/<occasion> or /designs.
- faq: three or four questions people ask, as "Q: …" then "A: …" lines.
- keywords: the search phrases the post answers.`;

export async function draftPost(input: {
  keyword: string;
  locale: UiLocale;
  occasion: string;
}): Promise<PostDraft | "off" | null> {
  const config = aiConfig();
  if (!config) return "off";
  const language = input.locale === "hi" ? "Hindi, in Devanagari script" : "Indian English";
  return askJson(config, {
    system: SYSTEM,
    shape: SHAPE,
    schema: draftSchema,
    prompt: `Search phrase: ${input.keyword}\nOccasion: ${input.occasion}\nWrite the whole post in ${language}.`,
  }).catch(() => null);
}

/** A tiny question, to show the admin the AI answers with the key in Vercel. */
export async function testAi(): Promise<"ok" | "off" | "failed"> {
  const config = aiConfig();
  if (!config) return "off";
  const answer = await askJson(config, {
    system: "You answer with JSON only.",
    prompt: 'Reply with {"ok": true}.',
    shape: '{"ok": true}',
    schema: z.object({ ok: z.boolean() }),
    maxTokens: 200,
  }).catch(() => null);
  return answer?.ok ? "ok" : "failed";
}
