"use client";

import { useEffect } from "react";
import { funnel, type FunnelStep } from "@/lib/funnel";

/** Counts a funnel step once when a server-drawn page opens, such as a design's live sample. */
export function FunnelMark({ step, design }: { step: FunnelStep; design?: string }) {
  useEffect(() => {
    funnel(step, design ? { design } : undefined);
  }, [step, design]);
  return null;
}
