import Link from "next/link";
import { Fragment } from "react";
import { INLINE_TOKEN } from "@/lib/blog/posts";

/* A post's paragraph with its [links](/path) and **bold** words; nothing else is parsed. */

export function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_TOKEN)) {
    const index = match.index;
    if (index > last) parts.push(text.slice(last, index));
    const [, label, href, bold] = match;
    if (label && href) {
      parts.push(
        <Link
          key={index}
          href={href}
          className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
        >
          {label}
        </Link>,
      );
    } else if (bold) {
      parts.push(
        <strong key={index} className="font-semibold text-ink">
          {bold}
        </strong>,
      );
    }
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}
