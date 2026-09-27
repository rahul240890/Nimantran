"use client";

import { useEffect } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { RootHtml } from "@/components/root-html";
import { Button } from "@/components/ui/button";
import { uiText } from "@/i18n/copy/ui";
import { reportError } from "@/lib/errors/report";
import { site } from "@/lib/site";

/*
 * When even a root layout fails. It brings its own frame and speaks both languages, as it
 * can't know which the visitor reads (like global-not-found.tsx).
 */

const en = uiText.en.uiStrings.error;
const hi = uiText.hi.uiStrings.error;

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    reportError(error, "boundary");
  }, [error]);
  return (
    <RootHtml locale="en">
      <title>{`${en.title} · ${site.name}`}</title>
      <main id="main" className="grid min-h-dvh place-items-center px-4 py-16">
        <div role="alert" className="flex max-w-md flex-col items-center gap-5 text-center">
          <BrandMark className="h-20 w-18 text-accent-text" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[2rem] leading-tight">{en.title}</h1>
            <p className="text-ink-muted">{en.body}</p>
          </div>
          <div lang="hi" className="flex flex-col gap-2">
            <p className="font-display text-2xl leading-tight">{hi.title}</p>
            <p className="text-ink-muted">{hi.body}</p>
          </div>
          <Button onClick={retry}>
            {en.retry} · <span lang="hi">{hi.retry}</span>
          </Button>
        </div>
      </main>
    </RootHtml>
  );
}
