import type { PostBlock, Wording } from "@/content/blog/types";

/*
 * The light markup posts are written in on Admin, Blog (docs/BLOG.md), turned into the
 * same blocks the posts in the code use:
 *   ## Section heading      a section, listed in "On this page"
 *   ### Smaller heading
 *   - item                  a list (1. item for a numbered one)
 *   > [Label] message       a message with a Copy button; the [Label] is optional
 *   ! tip                   a highlighted tip
 *   anything else           a paragraph; [a link](/path) and **bold** work inside
 * A blank line ends a paragraph, list or set of messages.
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

const LABELLED = /^\[([^\]]{1,60})\]\s*(.+)$/;
const DEVANAGARI = /[ऀ-ॿ]/;

function wording(line: string): Wording {
  const match = LABELLED.exec(line);
  const text = (match ? match[2]! : line).trim();
  return {
    ...(match ? { label: match[1]!.trim() } : {}),
    text,
    ...(DEVANAGARI.test(text) ? { lang: "hi" } : {}),
  };
}

export function parseBody(source: string): PostBlock[] {
  const blocks: PostBlock[] = [];
  const ids = new Set<string>();
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let messages: Wording[] = [];

  const flush = () => {
    if (paragraph.length) blocks.push(paragraph.join(" "));
    if (list)
      blocks.push(list.ordered ? { list: list.items, ordered: true } : { list: list.items });
    if (messages.length) blocks.push({ wording: messages });
    paragraph = [];
    list = null;
    messages = [];
  };

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    let match: RegExpExecArray | null;
    if ((match = /^###\s+(.+)$/.exec(line))) {
      flush();
      blocks.push({ h3: match[1]!.trim() });
    } else if ((match = /^##\s+(.+)$/.exec(line))) {
      flush();
      const text = match[1]!.trim();
      let id = slugify(text) || "section";
      for (let n = 2; ids.has(id); n++) id = `${slugify(text) || "section"}-${n}`;
      ids.add(id);
      blocks.push({ h2: text, id });
    } else if ((match = /^(-|\*|\d+[.)])\s+(.+)$/.exec(line))) {
      const ordered = /^\d/.test(match[1]!);
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push(match[2]!.trim());
    } else if ((match = /^>\s*(.+)$/.exec(line))) {
      if (paragraph.length || list) flush();
      messages.push(wording(match[1]!));
    } else if ((match = /^!\s*(.+)$/.exec(line))) {
      flush();
      blocks.push({ tip: match[1]!.trim() });
    } else {
      if (list || messages.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

/** Questions as "Q: …" lines, each followed by its "A: …" answer. */
export function parseFaq(source: string): { q: string; a: string }[] {
  const items: { q: string; a: string }[] = [];
  let current: { q: string; a: string } | null = null;
  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const question = /^q[:.]\s*(.+)$/i.exec(line);
    const answer = /^a[:.]\s*(.+)$/i.exec(line);
    if (question) {
      if (current?.a) items.push(current);
      current = { q: question[1]!.trim(), a: "" };
    } else if (current && (answer || current.a)) {
      current.a = [current.a, (answer ? answer[1]! : line).trim()].filter(Boolean).join(" ");
    }
  }
  if (current?.a) items.push(current);
  return items;
}
