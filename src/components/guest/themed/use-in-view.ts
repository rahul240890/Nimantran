"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has scrolled into view, and from then on: the themed sections
 * play their entrance once. Without IntersectionObserver everything simply shows.
 */
export function useInView<T extends Element>(margin = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin, seen]);
  return [ref, seen] as const;
}

/** Whether the element is on screen right now (null until known). */
export function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState<boolean | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) =>
      setOnScreen(entries.some((entry) => entry.isIntersecting)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, onScreen] as const;
}
