"use client";

import { lazy, Suspense, type ComponentType } from "react";

/** How far ahead of the screen a part starts loading, so it is ready before it scrolls in. */
const AHEAD = "800px 0px";

/**
 * A client component whose script waits until its part of the page nears the screen. The
 * server still draws it, so the page looks the same from the first paint; only its taps and
 * movement wait. A long page's lower parts then stay off the first screen's downloads.
 * `anchor` is the id of an element the server draws around it. Like any part behind a
 * Suspense boundary, React sends a large one at the end of the page and moves it into place.
 */
export function nearScreen<P extends object>(
  anchor: string,
  load: () => Promise<ComponentType<P>>,
): ComponentType<P> {
  const Part = lazy(() =>
    near(anchor)
      .then(load)
      .then((component) => ({ default: component })),
  );
  function NearScreen(props: P) {
    return (
      // Its own boundary, so the rest of the page wakes without waiting for this part
      <Suspense fallback={null}>
        <Part {...props} />
      </Suspense>
    );
  }
  return NearScreen;
}

/** Settles once the anchor is near the screen; at once on the server or when it isn't drawn yet. */
function near(anchor: string): Promise<void> {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return Promise.resolve();
  }
  const element = document.getElementById(anchor);
  // Not on the page yet: arriving by a link inside the site, so nothing to wait for
  if (!element) return Promise.resolve();
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          resolve();
        }
      },
      { rootMargin: AHEAD },
    );
    observer.observe(element);
  });
}
