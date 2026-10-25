import type { Metadata } from "next";
import { OpeningSample } from "@/components/guest/opening/opening";
import { POSTER_GATES } from "@/lib/opening/poster-gates";

export const metadata: Metadata = {
  title: "Gate pictures",
  description: "Every painted opening gate, closed, as its tile in the gate picker shows it.",
  robots: { index: false, follow: false },
};

/*
 * A review page, not a product screen: every painted gate closed, at the size of its tile
 * in the editor's gate picker, for scripts/gate-posters.ts to photograph into the small
 * pictures the picker shows (and for anyone to look the gates over at once).
 */
export default function GatePicturesPage() {
  return (
    <main className="flex flex-wrap gap-4 bg-paper p-4">
      {POSTER_GATES.map((style) => (
        <div key={style} data-gate={style} className="w-60 shrink-0">
          <OpeningSample suite="rajwada-bagh" style={style} god={null} open={false} />
        </div>
      ))}
    </main>
  );
}
