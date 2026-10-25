"use client";

import { useState, type ReactNode } from "react";
import { preload } from "react-dom";
import { cn } from "@/lib/cn";
import { CARD_SHEET, cardPictureFiles } from "@/lib/gallery/card-pictures";

/*
 * A design's painting on its card: its blurred tile the moment the card is drawn, then its
 * thumbnail, cut ahead to what the card shows (src/lib/gallery/card-pictures.ts), from the
 * site's own files rather than the image resizer. A thumbnail that fails gives way to the
 * painting itself; if that fails too, the blurred tile stays.
 */
export function CardPicture({
  src,
  alt = "",
  priority = false,
  box = "inset-0 size-full",
  className,
  children,
}: {
  /** The painting, by its address under /suites. */
  src: string;
  alt?: string;
  /** Near the top of the page, so it loads straight away. */
  priority?: boolean;
  /** Where the picture sits in its card; the blurred tile takes the same place. */
  box?: string;
  className?: string;
  /** What shows through a Scene's cut-out frames, between the blurred tile and the painting. */
  children?: ReactNode;
}) {
  const files = cardPictureFiles(src);
  // The sheet first, ahead of the thumbnails, so on a slow connection every card has its
  // blurred painting while the thumbnails come in
  if (files?.blur) preload(CARD_SHEET, { as: "image", fetchPriority: "high" });
  const [failed, setFailed] = useState<string[]>([]);
  const shown = (files ? [files.thumb, src] : [src]).find((file) => !failed.includes(file));
  const fail = (file: string | null) => {
    if (file) setFailed((list) => (list.includes(file) ? list : [...list, file]));
  };
  // A picture that broke before the page woke up sent its error unheard
  const seen = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0) fail(img.getAttribute("src"));
  };
  return (
    <>
      {files?.blur && (
        <span aria-hidden className={cn("absolute bg-no-repeat", box)} style={files.blur} />
      )}
      {children}
      {shown && (
        // eslint-disable-next-line @next/next/no-img-element -- cut ahead, so never through the resizer
        <img
          ref={seen}
          src={shown}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onError={(event) => fail(event.currentTarget.getAttribute("src"))}
          className={cn("absolute object-cover object-top", box, className)}
        />
      )}
    </>
  );
}
