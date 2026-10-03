"use client";

import { PlugZap } from "lucide-react";
import { useState, useTransition } from "react";
import { testAiConnection } from "@/actions/blog";
import { Button } from "@/components/ui/button";

const MESSAGES = {
  ok: { tone: "text-success", text: "The AI answered. Write with AI and blog drafts will work." },
  off: { tone: "text-danger", text: "No AI key is set in Vercel yet." },
  failed: {
    tone: "text-danger",
    text: "The AI didn't answer. Check the key, the provider and the model name, then redeploy.",
  },
} as const;

/** Asks the AI one tiny question with the key in Vercel. */
export function TestAi({ disabled }: { disabled: boolean }) {
  const [result, setResult] = useState<keyof typeof MESSAGES | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="secondary"
        size="sm"
        className="self-start"
        disabled={disabled}
        loading={pending}
        leadingIcon={<PlugZap aria-hidden />}
        onClick={() =>
          startTransition(async () => {
            setResult((await testAiConnection().catch(() => null)) ?? "failed");
          })
        }
      >
        Test the AI
      </Button>
      <p role="status" className="min-h-5 text-sm font-medium">
        {result && <span className={MESSAGES[result].tone}>{MESSAGES[result].text}</span>}
      </p>
    </div>
  );
}
