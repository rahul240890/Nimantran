import { BrandMark } from "@/components/brand/brand-mark";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/*
 * "Made with Shubh" on a free invite (Step 17): a small mark in the bottom corner of the
 * guest's screen, across the card, the event pages and the couple photo pages, opposite
 * the music button. Any paid package takes it away.
 *
 * Tried before signing in (/try/website), the brand's name also runs in faint rows across
 * the whole screen, as on the preview video and cards (lib/video/watermark.ts): the whole
 * invitation shows, but it isn't the one to send. A family preview link (/family/...) runs
 * "Family preview · Not final" beside the name in the same rows.
 */

const ROWS = 14;
const PER_ROW = 6;

export function WatermarkLayer({
  tiled = false,
  label = null,
}: {
  tiled?: boolean;
  /** Words run beside the brand's name in the tiled rows, as on a family preview. */
  label?: string | null;
}) {
  return (
    <>
      {tiled && (
        <div
          aria-hidden
          data-watermark-tiled
          className={cn(
            "pointer-events-none fixed inset-0 z-[75] overflow-hidden print:hidden",
            label && "mix-blend-difference",
          )}
        >
          <div className="absolute top-1/2 left-1/2 flex w-[260vmax] -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] flex-col gap-16">
            {Array.from({ length: ROWS }, (_, row) => (
              <p
                key={row}
                className={cn(
                  "flex gap-16 font-label text-sm tracking-[0.3em] whitespace-nowrap uppercase odd:ps-24",
                  // A family preview's words must read on pale card stock as well as dark
                  // photos: the difference blend turns them dark on light and light on dark
                  label ? "text-card-ivory/45" : "text-card-ivory/30 drop-shadow-sm",
                )}
              >
                {Array.from({ length: PER_ROW * 2 }, (_, i) => (
                  <span key={i}>{label ? `${site.name} · ${label}` : site.name}</span>
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
