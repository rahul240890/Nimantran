"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";
import { mediaUrl } from "@/lib/media";

/*
 * next/image that falls back to the picture itself when the image resizer can't make it
 * (owner, 2026-10-24: on the occasion pages most paintings never came in). On the free plan
 * the resizer refuses new sizes once its month's allowance is spent, and a picture it
 * refused stayed empty. The picture as it is, larger but there, takes its place.
 * next/image sends an error from before the page woke up again once it has, so none is
 * missed. Use this in place of next/image everywhere.
 * Theme paintings are asked for at their R2 address once that's set up (src/lib/media.ts), and
 * straight from R2 rather than through the resizer (owner, 2026-11-27: the resizer's writes and
 * transformations were most of what was left on the Vercel bill). R2 charges nothing for
 * downloads, and the paintings are already WebP at about the size a phone shows them.
 */
export function Image({ unoptimized, onError, alt, src, ...rest }: ImageProps) {
  const [direct, setDirect] = useState(false);
  const remote = typeof src === "string" ? mediaUrl(src) : src;
  const props = { ...rest, src: remote };
  // A picture that never goes through the resizer has nothing to fall back to
  if (unoptimized || direct || remote !== src) {
    return <NextImage {...props} alt={alt} unoptimized onError={onError} />;
  }
  return (
    <NextImage
      {...props}
      alt={alt}
      onError={(event) => {
        setDirect(true);
        onError?.(event);
      }}
    />
  );
}
