import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { RootHtml, rootViewport } from "@/components/root-html";
import { Button } from "@/components/ui/button";
import { uiText } from "@/i18n/copy";
import { site } from "@/lib/site";

/*
 * Any address that matches no page. The site has several root layouts (the English and
 * Hindi home pages, and the app), so this page brings its own frame, and says it in both
 * languages since it can't know which the visitor reads.
 */

const en = uiText.en.uiStrings.notFound;
const hi = uiText.hi.uiStrings.notFound;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${en.title} · ${site.name}`,
  robots: { index: false, follow: false },
};
export const viewport = rootViewport;

export default function GlobalNotFound() {
  return (
    <RootHtml locale="en">
      <main id="main" className="grid min-h-dvh place-items-center px-4 py-16">
        <div className="flex max-w-md flex-col items-center gap-5 text-center">
          <BrandMark className="h-20 w-18 text-accent-text" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[2rem] leading-tight">{en.title}</h1>
            <p className="text-ink-muted">{en.body}</p>
          </div>
          <div lang="hi" className="flex flex-col gap-2">
            <p className="font-display text-2xl leading-tight">{hi.title}</p>
            <p className="text-ink-muted">{hi.body}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="secondary">
              <Link href="/">{en.home}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/hi" lang="hi">
                {hi.home}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </RootHtml>
  );
}
