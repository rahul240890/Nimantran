"use client";

import { Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { giveEdition } from "@/actions/admin";
import { planCopy } from "@/content/editions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { PAID_PLAN_IDS, type PaidPlanId } from "@/lib/plans/catalog";

/** "aarav-weds-meera" from the slug itself or a whole invite link. */
function slugFrom(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/\/i\/([^/?#]+)/);
  return (match ? match[1]! : trimmed).toLowerCase();
}

/** Gives a published invite an edition without payment: pilot families, support, gifts. */
export function GiveEdition() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [plan, setPlan] = useState<PaidPlanId>("royal");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      noValidate
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await giveEdition({ slug: slugFrom(link), planId: plan }).catch(
            () => null,
          );
          if (result?.ok) {
            toast({
              title: `${planCopy[plan].name} given to ${result.names || "the invite"}`,
              tone: "success",
            });
            setLink("");
            router.refresh();
          } else {
            setError(
              result && result.reason === "not-found"
                ? "No invite has that link."
                : "Couldn't give the edition. Try again.",
            );
          }
        });
      }}
    >
      <Field label="Invite link" error={error ?? undefined} className="min-w-0 flex-1">
        <Input
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="aarav-weds-meera"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </Field>
      <Field label="Edition" className="sm:w-52">
        <Select
          value={plan}
          onValueChange={(value) => setPlan(value as PaidPlanId)}
          options={PAID_PLAN_IDS.map((id) => ({ value: id, label: planCopy[id].name }))}
        />
      </Field>
      <Button
        type="submit"
        loading={pending}
        disabled={!link.trim()}
        leadingIcon={<Gift aria-hidden />}
      >
        Give edition
      </Button>
    </form>
  );
}
