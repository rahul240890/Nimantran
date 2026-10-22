"use client";

import { useEffect } from "react";

/** What counts as the site's art: pictures, videos and drawn canvases. */
const ART = "img, picture, video, canvas, svg image";

/*
 * Keeps the site's paintings from being saved the easy way (owner, 2026-10-22): no "Save
 * image" or "Copy image" menu on a right click or a long press, and no dragging a picture
 * out to the desktop. globals.css stops the long-press callout on phones. A screenshot or a
 * screen recording can't be stopped by any website; the paintings' own marks are the guard
 * there.
 */
export function ArtGuard() {
  useEffect(() => {
    const onArt = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(ART)) event.preventDefault();
    };
    document.addEventListener("contextmenu", onArt);
    document.addEventListener("dragstart", onArt);
    return () => {
      document.removeEventListener("contextmenu", onArt);
      document.removeEventListener("dragstart", onArt);
    };
  }, []);
  return null;
}
