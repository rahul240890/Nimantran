import type { CSSProperties } from "react";
import type { StoryPhoto } from "@/lib/engine/story";
import { frameAspectOf } from "@/lib/editor/photo-fit";
import { ARCH_ASPECT, PAINTING_ASPECT, photoBox, type FrameBox } from "@/lib/suites/photo-frames";
import type { PhotoReveal } from "@/lib/suites/reveal";
import { cn } from "@/lib/cn";
import { photoReveal } from "@/components/invitation/reveal/reveal";
import { FramedPhoto } from "./framed-photo";

/*
 * The couple's photos on their photo page (Step 12l). On a theme with framed paintings the
 * photos lie under the painting, each in its frame's box, and show through the frame's cut
 * out opening, so any frame shape fits. A photo page shows its whole painting (cropping
 * would cut the frames on narrow phones), and this layer sits exactly over it. Each photo
 * sits as the host placed it (framed-photo.tsx), or with the faces kept high, and arrives
 * in the theme's own way (reveal.ts) once the page is up.
 */

/** When the photos start arriving after their page comes in. */
const PHOTO_START_MS = 250;

export function PhotoWindows({
  frames,
  photos,
  reveal,
}: {
  frames: readonly FrameBox[];
  photos: readonly StoryPhoto[];
  /** How they arrive; left out, they are simply there. */
  reveal?: PhotoReveal;
}) {
  const count = Math.min(frames.length, photos.length);
  return (
    <div className="[container-type:size] pointer-events-none absolute inset-0">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `min(100cqw, calc(100cqh * ${PAINTING_ASPECT}))`,
          aspectRatio: String(PAINTING_ASPECT),
        }}
      >
        {frames.map((frame, i) => {
          const photo = photos[i];
          if (!photo) return null;
          const [x, y, width, height] = photoBox(frame);
          const arrive = reveal ? photoReveal(reveal, i, count, PHOTO_START_MS) : null;
          const style: CSSProperties = {
            left: `${x}%`,
            top: `${y}%`,
            width: `${width}%`,
            height: `${height}%`,
            ...arrive?.style,
          };
          return (
            <FramedPhoto
              key={i}
              photo={photo}
              alt=""
              frameAspect={frameAspectOf(photoBox(frame), PAINTING_ASPECT)}
              className={cn("absolute bg-card-ivory", arrive?.className)}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Themes without framed paintings hang the photos in arches above the names. */
export function PhotoArches({
  photos,
  reveal,
}: {
  photos: readonly StoryPhoto[];
  reveal?: PhotoReveal;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-[8%] top-[calc(max(0.75rem,env(safe-area-inset-top))+4.5rem)] bottom-[44%] flex items-end justify-center gap-[5cqmin]"
    >
      {photos.map((photo, i) => {
        const arrive = reveal ? photoReveal(reveal, i, photos.length, PHOTO_START_MS) : null;
        return (
          <FramedPhoto
            key={i}
            photo={photo}
            alt=""
            frameAspect={ARCH_ASPECT}
            className={cn(
              "aspect-[3/4] max-h-full min-w-0 rounded-t-full rounded-b-[1.25rem] border-[3px] border-card-gold bg-card-ivory shadow-overlay",
              arrive?.className,
            )}
            style={{ width: photos.length > 1 ? "46%" : "72%", ...arrive?.style }}
          />
        );
      })}
    </div>
  );
}
