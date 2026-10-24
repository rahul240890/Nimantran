"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";

/*
 * next/image that falls back to the picture itself when the image resizer can't make it
 * (owner, 2026-10-24: on the occasion pages most paintings never came in). On the free plan
 * the resizer refuses new sizes once its month's allowance is spent, and a picture it
 * refused stayed empty. The picture as it is, larger but there, takes its place.
 * next/image sends an error from before the page woke up again once it has, so none is
 * missed. Use this in place of next/image everywhere.
 */
export function Image({ unoptimized, onError, alt, ...props }: ImageProps) {
  const [direct, setDirect] = useState(false);
  // A picture that never goes through the resizer has nothing to fall back to
  if (unoptimized || direct) {
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
