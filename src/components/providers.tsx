"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { uiStrings } from "@/lib/ui-strings";

/** App-wide client providers: tooltips share one delay, toasts share one stack. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={400} skipDelayDuration={200}>
      {children}
      <Toaster closeLabel={uiStrings.close} regionLabel={uiStrings.notifications} />
    </TooltipProvider>
  );
}
