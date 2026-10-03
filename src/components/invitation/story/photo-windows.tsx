import type { CSSProperties } from "react";
import type { StoryPhoto } from "@/lib/engine/story";
import { frameAspectOf } from "@/lib/editor/photo-fit";
import { ARCH_ASPECT, PAINTING_ASPECT, photoBox, type FrameBox } from "@/lib/suites/photo-frames";
import { FramedPhoto } from "./framed-photo";

/*
 * The couple's photos on their photo page (Step 12l). On a theme with framed paintings the
 * photos lie under the painting, each in its frame's box, and show through the frame's cut
 * out opening, so any frame shape fits. A photo page shows its whole painting (cropping
 * would cut the frames on narrow phones), and this layer sits exactly over it. Each photo
 * sits as the host placed it (framed-photo.tsx), or with the faces kept high.
 */

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
        {frames.map((frame, i) => {
          const photo = photos[i];
          if (!photo) return null;
          const [x, y, width, height] = photoBox(frame);
          const style: CSSProperties = {
            left: `${x}%`,
            top: `${y}%`,
            width: `${width}%`,
            height: `${height}%`,
          };
          return (
            <FramedPhoto
              key={i}
              photo={photo}
              alt=""
              frameAspect={frameAspectOf(photoBox(frame), PAINTING_ASPECT)}
              className="absolute bg-card-ivory"
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
        <FramedPhoto
          key={i}
          photo={photo}
          alt=""
          frameAspect={ARCH_ASPECT}
          className="aspect-[3/4] max-h-full min-w-0 rounded-t-full rounded-b-[1.25rem] border-[3px] border-card-gold bg-card-ivory shadow-overlay"
          style={{ width: photos.length > 1 ? "46%" : "72%" }}
        />
      ))}
    </div>
  );
}
