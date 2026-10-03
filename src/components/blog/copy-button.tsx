"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

/** Copies one message, as it is, for the reader to paste into a card or WhatsApp. */
export function CopyButton({
  text,
  label,
  copied,
  failed,
}: {
  text: string;
  label: string;
  copied: string;
  failed: string;
}) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast({ title: copied, tone: "success" });
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      toast({ title: failed, tone: "error" });
    }
  };
  return (
    <Button type="button" variant="secondary" size="sm" onClick={copy} className="self-start">
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      {done ? copied : label}
    </Button>
  );
}
