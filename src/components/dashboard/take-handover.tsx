"use client";

import { Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { claimHandover } from "@/actions/handover";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";

/** Takes a hand-over link for the signed-in person and opens the invitation in the editor. */
export function TakeHandover({ token }: { token: string }) {
  const { claimCopy } = useText(dashboardText);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const take = () =>
    start(async () => {
      setError(null);
      const result = await claimHandover(token).catch(() => null);
      if (result?.ok) {
        router.push(`/create?invite=${result.id}`);
        return;
      }
      if (result?.reason === "signed-out") {
        router.push(`/sign-in?next=${encodeURIComponent(`/claim/${token}`)}`);
        return;
      }
      if (result?.reason === "used") {
        router.refresh();
        return;
      }
      setError(
        result?.reason === "own"
          ? claimCopy.own
          : result?.reason === "setup"
            ? claimCopy.setup
            : claimCopy.failed,
      );
    });

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        loading={pending}
        leadingIcon={<Gift aria-hidden />}
        onClick={take}
        className="self-start"
      >
        {claimCopy.take}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
