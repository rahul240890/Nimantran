import type { Metadata } from "next";
import { isCardLanguage } from "@/lib/templates/card-languages";
import { SceneSheet } from "./_sheet";

export const metadata: Metadata = {
  title: "Scenes sheet",
  description: "Every Scene theme side by side, with sample words in a card language.",
  robots: { index: false, follow: false },
};

/*
 * A review page, not a product screen: every Scene theme in phones ?w=<px> wide (390 by
 * default; the editor's small preview is about 170), with a sample family's words in
 * ?lang=<card language>, so the words in every box can be checked in every script.
 * ?only=<theme,theme> narrows it to some themes; ?mini=1 shows them as the editor's small
 * preview does.
 */
export default async function ScenesSheetPage({ searchParams }: PageProps<"/engine/scenes">) {
  const { lang, w, only, mini } = await searchParams;
  const width = Number(w);
  return (
    <SceneSheet
      language={isCardLanguage(lang) ? lang : "en"}
      width={Number.isFinite(width) && width >= 140 && width <= 600 ? width : 390}
      only={typeof only === "string" ? only.split(",") : null}
      miniature={mini === "1"}
    />
  );
}
