import type { CSSProperties } from "react";
import type { StoryPhoto } from "@/lib/engine/story";
import { cn } from "@/lib/cn";
import { photoPlacement, turnedAspect, type PhotoFit } from "@/lib/editor/photo-fit";

/** Faces sit in the upper part of most photos, so an unadjusted photo keeps its top. */
export const FACES = "50% 30%";

/**
 * The turned photo's box, as a share of the frame, and the image inside it: an image on
 * its side is laid the other way round and turned, so it fills the box exactly.
 */
export function fittedStyles(fit: PhotoFit, frameAspect: number) {
  const place = photoPlacement(fit, frameAspect);
  const shown = turnedAspect(fit.aspect, place.turn);
  const box: CSSProperties = {
    position: "absolute",
    left: `${place.left * 100}%`,
    top: `${place.top * 100}%`,
    width: `${place.width * 100}%`,
    height: `${place.height * 100}%`,
    transform: place.tilt ? `rotate(${place.tilt}deg)` : undefined,
    transformOrigin: `${place.x * 100}% ${place.y * 100}%`,
  };
  const sideways = place.turn % 2 === 1;
  const image: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: sideways ? `${100 / shown}%` : "100%",
    height: sideways ? `${100 * shown}%` : "100%",
    maxWidth: "none",
    transform: `translate(-50%, -50%)${place.turn ? ` rotate(${place.turn * 90}deg)` : ""}`,
  };
  return { box, image };
}

/**
 * A host's photo filling a frame `frameAspect` wide for each unit of height, as they
 * placed it, or covering the frame with the faces kept high if they never adjusted it.
 */
export function FramedPhoto({
  photo,
  frameAspect,
  alt = photo.alt,
  className,
  style,
}: {
  photo: StoryPhoto;
  frameAspect: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (!photo.fit) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- the family's own photo, sized by its frame
      <img
        src={photo.src}
        alt={alt}
        decoding="async"
        draggable={false}
        className={cn("object-cover select-none", className)}
        style={{ objectPosition: FACES, ...style }}
      />
    );
  }
  const { box, image } = fittedStyles(photo.fit, frameAspect);
  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("relative block overflow-hidden", className)}
      style={style}
    >
      <span className="block" style={box}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the family's own photo, placed by them */}
        <img
          src={photo.src}
          alt=""
          decoding="async"
          draggable={false}
          className="select-none"
          style={image}
        />
      </span>
    </span>
  );
}
