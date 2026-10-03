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
 * a theme can be checked in every script at once. ?box=1 shows the box behind the words,
 * ?w=<px> sets the phones' width and ?mini=1 shows them as the editor's small phone does.
 */
export default async function PagesSheetPage({ searchParams }: PageProps<"/engine/pages">) {
  const { suite, lang, box, w, mini } = await searchParams;
  const width = Number(w);
  return (
    <PageSheet
      suite={isSuiteId(suite) ? suite : "rajwada-bagh"}
      language={isCardLanguage(lang) ? lang : "en"}
      textBox={box === "1"}
      width={Number.isFinite(width) && width >= 140 && width <= 600 ? width : 390}
      miniature={mini === "1"}
    />
  );
}
