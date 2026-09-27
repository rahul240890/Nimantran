"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteAccount } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { toast, toastAfterNavigation } from "@/components/ui/toast";
import { accountText } from "@/i18n/copy/account";
import { useLocale, useText } from "@/i18n/client";
import { homePath } from "@/i18n/locales";
import { refreshAccountHint } from "./use-account-hint";

/** Invites kept in this browser, which go with the account. */
function forgetThisDevice() {
  try {
    for (const key of [
      "nimantran-invite-draft",
      "nimantran-invite-photos",
      "nimantran-invite-synced",
    ]) {
      localStorage.removeItem(key);
    }
    indexedDB.deleteDatabase("nimantran-editor");
  } catch {
    // Storage blocked: nothing was kept here
  }
}

/** The account's last card: delete everything, after a tick to say they understand. */
export function DeleteAccount() {
  const { profileCopy } = useText(accountText);
  const copy = profileCopy.deleteAccount;
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [deleting, startDeleting] = useTransition();

  const remove = () =>
    startDeleting(async () => {
      if ((await deleteAccount(understood)) !== "deleted") {
        toast({ title: copy.failed, tone: "error" });
        return;
      }
      forgetThisDevice();
      refreshAccountHint();
      setOpen(false);
      toastAfterNavigation({ title: copy.done, tone: "success" });
      router.push(homePath(locale));
      router.refresh();
    });

  return (
    <Card elevation="flat" className="gap-4 border-danger/30 p-5 sm:p-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-xl">{copy.heading}</h2>
        <p className="text-sm text-ink-muted">{copy.hint}</p>
      </div>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setUnderstood(false);
        }}
      >
        <div>
          <Button
            variant="secondary"
            leadingIcon={<Trash2 aria-hidden />}
            onClick={() => setOpen(true)}
            className="text-danger"
          >
            {copy.open}
          </Button>
        </div>
        <DialogContent
          title={copy.title}
          closeLabel={copy.close}
          footer={
            <>
              <DialogClose asChild>
                <Button variant="secondary">{copy.cancel}</Button>
              </DialogClose>
              <Button variant="danger" loading={deleting} disabled={!understood} onClick={remove}>
                {copy.confirm}
              </Button>
            </>
          }
        >
          <p className="text-ink-muted">{copy.body}</p>
          <Checkbox
            label={copy.understand}
            checked={understood}
            onCheckedChange={(value) => setUnderstood(value === true)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
