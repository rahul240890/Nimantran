import type { Metadata } from "next";
import { isSuiteId, type SuiteId } from "@/lib/suites/catalog";
import { blessings } from "@/lib/suites/blessings";
import { guestLook } from "@/lib/suites/guest-look";
import { isCardLanguage } from "@/lib/templates/card-languages";
import { BlessingsBoard } from "./_board";

export const metadata: Metadata = {
  title: "Guest blessings",
  description: "Every way a guest gives flowers and light on the themed guest page.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the guest page's two blessings (blessings.ts), not a product screen:
 * every way of giving flowers and of giving light, side by side in one theme's colours, for
 * ?suite=<theme> (default Rajwada Bagh) and ?lang=hi, mr, gu, bn or ta. Each theme's own
 * pair is named at the top.
 */
export default async function BlessingsPage({ searchParams }: PageProps<"/engine/blessings">) {
  const { suite: asked, lang } = await searchParams;
  const suite: SuiteId = isSuiteId(asked) && guestLook(asked) ? asked : "rajwada-bagh";
  const look = guestLook(suite)!;
  const own = blessings(suite);
  return (
    <main>
      <p className="px-4 py-3 text-center text-sm text-ink-muted">
        {suite}: {own.flowers}, {own.lamp}
      </p>
      <BlessingsBoard suite={suite} look={look} lang={isCardLanguage(lang) ? lang : "en"} />
    </main>
  );
}
