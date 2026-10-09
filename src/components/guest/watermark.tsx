import { BrandMark } from "@/components/brand/brand-mark";

/*
 * "Made with Shubh" on a free invite (Step 17): a small mark in the bottom corner of the
 * guest's screen, across the card, the event pages and the couple photo pages, opposite
 * the music button. Any paid package takes it away.
 */

export function WatermarkLayer() {
  return (
    <p
      data-watermark
      className="pointer-events-none fixed start-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex items-center gap-1.5 rounded-full bg-night/70 px-3 py-1.5 font-label text-[0.65rem] tracking-[0.12em] text-card-ivory uppercase ring-1 ring-card-ivory/30 backdrop-blur-sm print:hidden"
    >
      <BrandMark className="size-4" />
      Made with Shubh
    </p>
  );
}
