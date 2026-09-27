import type { CSSProperties } from "react";
import type { StoryPhoto } from "@/lib/engine/story";
import { PAINTING_ASPECT, type FrameBox } from "@/lib/suites/photo-frames";

/*
 * The couple's photos on their photo page (Step 12l). On a theme with framed paintings the
 * photos lie under the painting, each in its frame's box, and show through the frame's cut
 * out opening, so any frame shape fits. A photo page shows its whole painting (cropping
 * would cut the frames on narrow phones), and this layer sits exactly over it. Faces sit
 * in the upper part of most photos, so the crop keeps the top.
 */

const FACES = "50% 30%";

export function PhotoWindows({
  frames,
  photos,
}: {
  frames: readonly FrameBox[];
  photos: readonly StoryPhoto[];
}) {
  return (
    <div className="[container-type:size] pointer-events-none absolute inset-0">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `min(100cqw, calc(100cqh * ${PAINTING_ASPECT}))`,
          aspectRatio: String(PAINTING_ASPECT),
        }}
      >
        {frames.map(([x, y, width, height], i) => {
          const photo = photos[i];
          if (!photo) return null;
          // A little past the opening on every side, so no gap shows under the frame's edge
          const style: CSSProperties = {
            left: `${x - 0.8}%`,
            top: `${y - 0.5}%`,
            width: `${width + 1.6}%`,
            height: `${height + 1}%`,
            objectPosition: FACES,
          };
          return (
            // eslint-disable-next-line @next/next/no-img-element -- the host's own photo, sized by the frame
            <img
              key={i}
              src={photo.src}
              alt=""
              decoding="async"
              draggable={false}
              className="absolute bg-card-ivory object-cover select-none"
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Themes without framed paintings hang the photos in arches above the names. */
export function PhotoArches({ photos }: { photos: readonly StoryPhoto[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-[8%] top-[calc(max(0.75rem,env(safe-area-inset-top))+4.5rem)] bottom-[44%] flex items-end justify-center gap-[5cqmin]"
    >
      {photos.map((photo, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- the host's own photo, sized by its arch
        <img
          key={i}
          src={photo.src}
          alt=""
          decoding="async"
          draggable={false}
          className="aspect-[3/4] max-h-full min-w-0 rounded-t-full rounded-b-[1.25rem] border-[3px] border-card-gold bg-card-ivory object-cover shadow-overlay select-none"
          style={{ objectPosition: FACES, width: photos.length > 1 ? "46%" : "72%" }}
        />
      ))}
    </div>
  );
}
