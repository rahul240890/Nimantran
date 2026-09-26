import { RootHtml, rootMetadata, rootViewport } from "@/components/root-html";

/* The Hindi home page, served static at /hi. */

export const metadata = rootMetadata("hi");
export const viewport = rootViewport;

export default function HindiHomeLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="hi">{children}</RootHtml>;
}
