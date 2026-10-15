"use client";

import { useEffect } from "react";

/**
 * Opens the print window once the receipt has drawn, for "Download PDF" links: the browser
 * offers Save as PDF there. Waits for the fonts, so the PDF uses the brand's.
 */
export function AutoPrint() {
  useEffect(() => {
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) window.print();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
