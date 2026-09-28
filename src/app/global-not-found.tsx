import type { Metadata } from "next";
import { RootHtml, rootViewport } from "@/components/root-html";
import { NotFoundView } from "@/components/shell/not-found-view";
import { uiText } from "@/i18n/copy/ui";
import { site } from "@/lib/site";

/*
 * Any address that matches no page. The site has several root layouts (the English and
 * Hindi home pages, and the app), so this page brings its own frame, and says it in both
 * languages since it can't know which the visitor reads.
 */

const en = uiText.en.uiStrings.notFound;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${en.title} · ${site.name}`,
  robots: { index: false, follow: false },
};
export const viewport = rootViewport;

export default function GlobalNotFound() {
  return (
    <RootHtml locale="en">
      <NotFoundView />
    </RootHtml>
  );
}
