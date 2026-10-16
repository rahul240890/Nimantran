/* The WhatsApp message sent with an invitation link: the spacing every language shares. */

/** What the message says about the invite, in the site language. */
export type ShareMessage = { names: string; occasion: string; when: string; where: string };

/** A rule WhatsApp draws without wrapping, even on a 320px phone. */
const RULE = "━━━━━━━━━━━━";

/** The date and place between two rules, so they stand apart in a chat. */
export function detailLines(when: string, where: string): string[] {
  const details = [when && `🗓️ ${when}`, where && `📍 ${where}`].filter(Boolean);
  return details.length ? ["", RULE, ...details, RULE] : [];
}

/** Lines for a chat: a blank line between parts, never two, and none at either end. */
export function chatLines(lines: string[]): string {
  return lines
    .filter((line, index) => line !== "" || (index > 0 && lines[index - 1] !== ""))
    .join("\n")
    .trim();
}

/** The message, a blank line, then the link on its own so WhatsApp builds its preview. */
export function withLink(message: string, url: string): string {
  const text = message.trim();
  return text ? `${text}\n\n${url}` : url;
}

/** A run of a chat line, with the formatting WhatsApp gives it. */
export type ChatSegment = { text: string; style?: "bold" | "italic" | "strike" | "link" };

// A link, or *bold*, _italic_ or ~struck~ words: the marks hug the words, as WhatsApp needs
const MARKS = /(https?:\/\/\S+)|\*(\S(?:[^*]*?\S)?)\*|_(\S(?:[^_]*?\S)?)_|~(\S(?:[^~]*?\S)?)~/g;

/** One line of a message as WhatsApp shows it, so the share page's preview can match. */
export function chatSegments(line: string): ChatSegment[] {
  const segments: ChatSegment[] = [];
  let last = 0;
  for (const match of line.matchAll(MARKS)) {
    if (match.index > last) segments.push({ text: line.slice(last, match.index) });
    const [, link, bold, italic, strike] = match;
    if (link) segments.push({ text: link, style: "link" });
    else if (bold) segments.push({ text: bold, style: "bold" });
    else if (italic) segments.push({ text: italic, style: "italic" });
    else if (strike) segments.push({ text: strike, style: "strike" });
    last = match.index + match[0].length;
  }
  if (last < line.length) segments.push({ text: line.slice(last) });
  return segments;
}
