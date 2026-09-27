"use client";

import { UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { acceptHostInvite } from "@/actions/guests";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";

/** Accepts a co-host link for the signed-in person and opens the guest list. */
export function AcceptCohost({ token }: { token: string }) {
  const { joinCopy } = useText(dashboardText);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const accept = () =>
    start(async () => {
      setError(null);
      const result = await acceptHostInvite(token).catch(() => null);
      if (result?.ok) {
        router.push(`/invites/${result.id}`);
        return;
      }
      if (result?.reason === "signed-out") {
        router.push(`/sign-in?next=${encodeURIComponent(`/join/${token}`)}`);
        return;
      }
      if (result?.reason === "used") {
        router.refresh();
        return;
      }
      setError(joinCopy.failed);
    });

  return (
    <div className="flex flex-col gap-3">
      <Button size="lg" loading={pending} leadingIcon={<UserCheck aria-hidden />} onClick={accept}>
        {joinCopy.accept}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
