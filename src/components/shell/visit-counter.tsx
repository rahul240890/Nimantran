"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { sendVisit } from "@/lib/visits";

/** Counts each page a visitor opens for the admin's Visitors page (lib/visits.ts). */
export function VisitCounter() {
  const pathname = usePathname();
  const landing = useRef(true);
  useEffect(() => {
    sendVisit(landing.current);
    landing.current = false;
  }, [pathname]);
  return null;
}
