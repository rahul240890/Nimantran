import { VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The music's one sign, wherever its button sits (the opening's welcome, the pages, One
 * Scene and the page below): three bars dancing while it plays, a quiet speaker when it is
 * off. In still mode the bars stand still.
 */
export function MusicBars({ playing, className }: { playing: boolean; className?: string }) {
  if (!playing) return <VolumeX aria-hidden className={className} />;
  return (
    <span aria-hidden className={cn("flex items-end justify-center gap-[15%] py-0.5", className)}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="music-bar h-full w-[18%] rounded-full bg-current" />
      ))}
    </span>
  );
}
