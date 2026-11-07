"use client";

import { useEffect } from "react";
import { rememberDesign } from "@/lib/gallery/recent";

/** Notes the design open on this page, for the home page's Recently viewed. */
export function RememberDesign({ id }: { id: string }) {
  useEffect(() => rememberDesign(id), [id]);
  return null;
}
