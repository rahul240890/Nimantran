import type { Metadata } from "next";
import { isCardLanguage } from "@/lib/templates/card-languages";
import { isSuiteId } from "@/lib/suites/catalog";
import { PageSheet } from "./_sheet";

export const metadata: Metadata = {
  title: "Event pages sheet",
  description: "Every event page of a theme side by side, with sample words in a card language.",
  robots: { index: false, follow: false },
};

/*
 * A review page, not a product screen: every page of ?suite=<theme> side by side in phones,
 * with sample names, family and functions in ?lang=<card language>, so the typesetting of
 * a theme can be checked in every script at once. ?box=1 shows the box behind the words.
 */
export default async function PagesSheetPage({ searchParams }: PageProps<"/engine/pages">) {
  const { suite, lang, box } = await searchParams;
  return (
    <PageSheet
      suite={isSuiteId(suite) ? suite : "rajwada-bagh"}
      language={isCardLanguage(lang) ? lang : "en"}
      textBox={box === "1"}
    />
  );
}
