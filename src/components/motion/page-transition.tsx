import { ViewTransition, type ReactNode } from "react";

/**
 * Wrap each page's content. On navigation the old page fades out and the new one rises in
 * (styles in globals.css). Still mode and browsers without view transitions swap instantly.
 * It lives in pages, not the layout: layouts persist, so they never enter or exit.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
