import { RootHtml, rootMetadata, rootViewport } from "@/components/root-html";
import { BUILT_PRICING } from "@/lib/plans/design-defaults";

/* The English home page, served static at /. */

export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootHtml locale="en" pricing={BUILT_PRICING}>
      {children}
    </RootHtml>
  );
}
