"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

/** Lets a reviewer preview the still version without changing their device settings. */
export function StillModeSwitch({ className }: { className?: string }) {
  const [still, setStill] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (still) root.dataset.motion = "reduce";
    else delete root.dataset.motion;
    return () => {
      delete root.dataset.motion;
    };
  }, [still]);

  return (
    <Switch
      label={<span className="text-sm font-semibold whitespace-nowrap">Reduce motion</span>}
      checked={still}
      onCheckedChange={setStill}
      className={className}
    />
  );
}
