import { BrandMark } from "@/components/brand/brand-mark";
import { site } from "@/lib/site";

/*
 * "Made with Shubh" on a free invite (Step 17): a small mark in the bottom corner of the
 * guest's screen, across the card, the event pages and the couple photo pages, opposite
 * the music button. Any paid package takes it away.
 *
 * Tried before signing in (/try/website), the brand's name also runs in faint rows across
 * the whole screen, as on the preview video and cards (lib/video/watermark.ts): the whole
 * invitation shows, but it isn't the one to send.
 */

const ROWS = 14;
const PER_ROW = 6;

export function WatermarkLayer({ tiled = false }: { tiled?: boolean }) {
  return (
    <>
      {tiled && (
        <div
          aria-hidden
          data-watermark-tiled
          className="pointer-events-none fixed inset-0 z-[75] overflow-hidden print:hidden"
        >
          <div className="absolute top-1/2 left-1/2 flex w-[260vmax] -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] flex-col gap-16">
            {Array.from({ length: ROWS }, (_, row) => (
              <p
                key={row}
                className="flex gap-16 font-label text-sm tracking-[0.3em] whitespace-nowrap text-card-ivory/30 uppercase drop-shadow-sm odd:ps-24"
              >
                {Array.from({ length: PER_ROW * 2 }, (_, i) => (
                  <span key={i}>{site.name}</span>
                ))}
              </p>
            ))}
          </div>
        </div>
      )}
      <p
        data-watermark
        className="pointer-events-none fixed start-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex items-center gap-1.5 rounded-full bg-night/70 px-3 py-1.5 font-label text-[0.65rem] tracking-[0.12em] text-card-ivory uppercase ring-1 ring-card-ivory/30 backdrop-blur-sm print:hidden"
      >
        <BrandMark className="size-4" />
        Made with Shubh
      </p>
    </>
  );
}
