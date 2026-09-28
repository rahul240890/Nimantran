"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens the browser's print window, where the invoice can also be saved as a PDF. */
export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      leadingIcon={<Printer aria-hidden />}
      onClick={() => window.print()}
    >
      {label}
    </Button>
  );
}
