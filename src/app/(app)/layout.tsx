import type { Metadata } from "next";
import { RootHtml, rootMetadata, rootViewport } from "@/components/root-html";
import { BUILT_PRICING } from "@/lib/plans/design-defaults";
import { getLocale } from "@/i18n/server";

/* The app's pages: the editor, accounts, guest lists and invitations. Language from the visitor. */

// Nothing here is for search engines: the public pages live under (home) and (home-hi)
export async function generateMetadata(): Promise<Metadata> {
  return { ...rootMetadata(await getLocale()), robots: { index: false, follow: false } };
}

export const viewport = rootViewport;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootHtml locale={await getLocale()} pricing={BUILT_PRICING}>
      {children}
    </RootHtml>
  );
}
