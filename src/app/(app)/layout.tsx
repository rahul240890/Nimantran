import type { Metadata } from "next";
import { RootHtml, rootMetadata, rootViewport } from "@/components/root-html";
import { getLocale } from "@/i18n/server";

/* The app's pages: the editor, accounts, guest lists and invitations. Language from the visitor. */

export async function generateMetadata(): Promise<Metadata> {
  return rootMetadata(await getLocale());
}

export const viewport = rootViewport;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale={await getLocale()}>{children}</RootHtml>;
}
