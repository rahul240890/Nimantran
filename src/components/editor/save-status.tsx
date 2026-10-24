"use client";

import { Check, Cloud, CloudCheck, CloudOff, HardDrive, LoaderCircle, Lock } from "lucide-react";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import type { SaveState } from "@/lib/editor/store";
import type { SyncState } from "@/lib/invites/sync";

/** Where the draft is saved: this device, or the account once signed in. */
export function SaveStatus({
  state,
  sync,
  signedIn,
  edited,
}: {
  state: SaveState;
  sync: SyncState;
  signedIn: boolean;
  edited: boolean;
}) {
  const { editor, syncCopy } = useText(editorText);
  if (signedIn && state !== "unavailable" && sync !== "signed-out") {
    const busy = state === "saving" || sync === "syncing";
    const key = busy ? "syncing" : sync === "offline" ? "offline" : edited ? sync : "idle";
    const icon =
      key === "syncing" ? (
        <LoaderCircle className="size-4 animate-spin motion-still:animate-none" />
      ) : key === "synced" ? (
        <CloudCheck className="size-4 text-success" />
      ) : key === "offline" ? (
        <CloudOff className="size-4 text-warning" />
      ) : key === "needs-plan" ? (
        <Lock className="size-4 text-warning" />
      ) : (
        <Cloud className="size-4" />
      );
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
        <span aria-hidden>{icon}</span>
        <span className="truncate max-[419px]:sr-only">{syncCopy[key]}</span>
      </span>
    );
  }
  const icon =
    state === "saving" ? (
      <LoaderCircle className="size-4 animate-spin motion-still:animate-none" />
    ) : state === "saved" ? (
      <Check className="size-4 text-success" strokeWidth={2.5} />
    ) : state === "unavailable" ? (
      <CloudOff className="size-4 text-warning" />
    ) : (
      <HardDrive className="size-4" />
    );
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
      <span aria-hidden>{icon}</span>
      <span className="truncate max-[419px]:sr-only">{editor.save[state]}</span>
    </span>
  );
}
