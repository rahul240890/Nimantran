"use client";

import { lazy, Suspense, useEffect, type ComponentType } from "react";

/** How far ahead of the screen a part starts loading, so it is ready before it scrolls in. */
const AHEAD = "800px 0px";

/**
 * A client component whose script waits until its part of the page nears the screen or the
 * visitor first taps or types. The server still draws it, so the page looks the same from the
 * first paint; only its taps and movement wait. A long page's lower parts then stay off the
 * first screen's downloads.
 * `anchor` is the id of an element the server draws around it. A tap inside it before its
 * script arrives is held and made again once the part is awake, so no tap is lost.
 * Like any part behind a Suspense boundary, React sends a large one at the end of the page
 * and moves it into place.
 */
export function nearScreen<P extends object>(
  anchor: string,
  load: () => Promise<ComponentType<P>>,
): ComponentType<P> {
  let awake: () => void = () => {};
  const Part = lazy(async () => {
    const held = holdTaps(anchor);
    awake = held.release;
    await near(anchor);
    const Component = await load();
    function Awake(props: P) {
      useEffect(() => awake(), []);
      return <Component {...props} />;
    }
    return { default: Awake };
  });
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

/**
 * Settles once the anchor is near the screen or the visitor first touches the page; at once on
 * the server or when the anchor isn't drawn yet.
 */
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
        if (entries.some((entry) => entry.isIntersecting)) done();
      },
      { rootMargin: AHEAD },
    );
    function done() {
      observer.disconnect();
      resolve();
    }
    observer.observe(element);
    void firstTouch().then(done);
  });
}

let touched: Promise<void> | undefined;

/**
 * Settles on the visitor's first tap, key or focus. A link within the page re-renders it, and
 * would otherwise wait on a part still asleep below.
 */
function firstTouch(): Promise<void> {
  touched ??= new Promise((resolve) => {
    const events = ["pointerdown", "keydown", "focusin"] as const;
    function done() {
      for (const name of events) window.removeEventListener(name, done, true);
      resolve();
    }
    for (const name of events) window.addEventListener(name, done, { capture: true });
  });
  return touched;
}

/**
 * Holds clicks inside the anchor until `release`, then makes the last one again. React drops
 * a click on a part it hasn't woken yet, so without this the first tap would do nothing.
 */
function holdTaps(anchor: string): { release: () => void } {
  const element = typeof document === "undefined" ? null : document.getElementById(anchor);
  if (!element) return { release: () => {} };
  let held: Element | null = null;
  function hold(event: MouseEvent) {
    if (!(event.target instanceof Element) || !element!.contains(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    held = event.target;
  }
  window.addEventListener("click", hold, { capture: true });
  return {
    release() {
      window.removeEventListener("click", hold, { capture: true });
      if (held?.isConnected) {
        held.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      }
      held = null;
    },
  };
}
