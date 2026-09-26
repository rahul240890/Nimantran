import { RootHtml, rootMetadata, rootViewport } from "@/components/root-html";

/* The English home page, served static at /. */

export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="en">{children}</RootHtml>;
}
