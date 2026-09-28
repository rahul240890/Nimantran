"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { refundPayment } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import type { RefundResult } from "@/lib/payments/editions";

const PROBLEMS: Record<Exclude<RefundResult, { ok: true }>["reason"], string> = {
  "not-found": "That order isn't there any more.",
  "not-paid": "Only paid orders can be refunded.",
  provider: "Razorpay didn't accept the refund. Check the payment on the Razorpay dashboard.",
  failed: "Couldn't refund. Try again.",
};

/** Refunds a paid order in full, after asking. The invite goes back to its earlier edition. */
export function RefundButton({
  orderId,
  amount,
  names,
}: {
  orderId: string;
  amount: string;
  names: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  return (
    <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" leadingIcon={<Undo2 aria-hidden />}>
          Refund
        </Button>
      </DialogTrigger>
      <DialogContent
        title={`Refund ${amount}?`}
        description={`The full amount goes back to the host's card or UPI through Razorpay, usually within 5 to 7 days. ${names || "The invite"} goes back to the edition it had before, and its invoice is marked refunded.`}
        closeLabel="Close"
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary" disabled={pending}>
                Keep payment
              </Button>
            </DialogClose>
            <Button
              variant="danger"
              loading={pending}
              leadingIcon={<Undo2 aria-hidden />}
              onClick={() =>
                startTransition(async () => {
                  const result = await refundPayment(orderId).catch(() => null);
                  if (result?.ok) {
                    toast({ title: `${amount} refunded`, tone: "success" });
                    setOpen(false);
                    router.refresh();
                  } else {
                    toast({
                      title: result && !result.ok ? PROBLEMS[result.reason] : PROBLEMS.failed,
                      tone: "error",
                    });
                  }
                })
              }
            >
              Refund {amount}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">This can&apos;t be undone.</p>
      </DialogContent>
    </Dialog>
  );
}
