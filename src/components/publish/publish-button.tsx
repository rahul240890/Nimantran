"use client";

import { Check, CircleAlert, Globe, LoaderCircle, LogIn, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { checkSlug, publishInvite, type SlugCheck } from "@/actions/invites";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { draftProblems, type InviteDraft } from "@/lib/editor/draft";
import { inviteDraft } from "@/lib/editor/store";
import { syncDraft } from "@/lib/invites/sync";
import { cleanSlugInput, isSlug, suggestSlug } from "@/lib/publish/slug";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy";

type SlugState = { slug: string; result: SlugCheck } | null;

/** The last step's main action: publish the invite, or share it once it's live. */
export function PublishButton({
  draft,
  signedIn,
  onNotReady,
}: {
  draft: InviteDraft;
  signedIn: boolean;
  /** Called instead of opening when steps still need finishing. */
  onNotReady: () => void;
}) {
  const { publishCopy } = useText(publishText);
  const [open, setOpen] = useState(false);

  if (!signedIn) {
    return (
      <Button asChild>
        <Link href={`/sign-in?next=${encodeURIComponent("/create")}`}>
          <LogIn aria-hidden />
          {publishCopy.signInToPublish}
        </Link>
      </Button>
    );
  }

  if (draft.slug && draft.remoteId) {
    return (
      <Button asChild>
        <Link href={`/invites/${draft.remoteId}/share`}>
          <Send aria-hidden className="rtl:-scale-x-100" />
          {publishCopy.share}
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        leadingIcon={<Globe aria-hidden />}
        onClick={() => {
          if (draftProblems(draft).length > 0) onNotReady();
          else setOpen(true);
        }}
      >
        {publishCopy.publish}
      </Button>
      {open && <PublishDialog draft={draft} onClose={() => setOpen(false)} />}
    </Dialog>
  );
}

function PublishDialog({ draft, onClose }: { draft: InviteDraft; onClose: () => void }) {
  const { publishCopy } = useText(publishText);
  const router = useRouter();
  const [slug, setSlug] = useState(() =>
    suggestSlug({
      first: draft.content.first ?? "",
      second: draft.content.second ?? "",
      categoryId: draft.categoryId,
    }),
  );
  const [check, setCheck] = useState<SlugState>(null);
  const [busy, setBusy] = useState<"saving" | "publishing" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const statusId = useId();

  const valid = isSlug(slug);
  const current = check?.slug === slug ? check.result : null;

  // Ask whether the link is free a moment after typing stops
  useEffect(() => {
    if (!isSlug(slug)) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await checkSlug(slug).catch(() => null);
      if (!cancelled && result) setCheck({ slug, result });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug]);

  const publish = async () => {
    if (!valid || busy) return;
    setError(null);
    setBusy("saving");
    const synced = await syncDraft();
    const remoteId = inviteDraft.get().draft.remoteId;
    if (synced !== "synced" || !remoteId) {
      setBusy(null);
      setError(publishCopy.failed);
      return;
    }
    setBusy("publishing");
    const outcome = await publishInvite(remoteId, slug).catch(
      () => ({ status: "failed" }) as const,
    );
    setBusy(null);
    if (outcome.status === "published") {
      inviteDraft.update((current) => ({ ...current, slug: outcome.slug }), { touch: false });
      toast({ title: publishCopy.published, tone: "success" });
      onClose();
      router.push(`/invites/${remoteId}/share`);
    } else if (outcome.status === "taken") {
      setCheck({ slug, result: { available: false, suggestions: outcome.suggestions } });
    } else {
      setError(outcome.status === "not-ready" ? publishCopy.notReady : publishCopy.failed);
    }
  };

  const status = !valid ? (
    <span className="flex items-center gap-1.5 text-danger">
      <CircleAlert aria-hidden className="size-4 shrink-0" />
      {publishCopy.invalid}
    </span>
  ) : !current ? (
    <span className="flex items-center gap-1.5 text-ink-muted">
      <LoaderCircle
        aria-hidden
        className="size-4 shrink-0 animate-spin motion-still:animate-none"
      />
      {publishCopy.checking}
    </span>
  ) : current.available ? (
    <span className="flex items-center gap-1.5 text-success">
      <Check aria-hidden className="size-4 shrink-0" strokeWidth={2.5} />
      {publishCopy.available}
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-danger">
      <CircleAlert aria-hidden className="size-4 shrink-0" />
      {publishCopy.taken}
    </span>
  );

  return (
    <DialogContent
      title={publishCopy.dialogTitle}
      description={publishCopy.dialogBody}
      closeLabel={publishCopy.close}
      onEscapeKeyDown={(event) => busy && event.preventDefault()}
      onInteractOutside={(event) => busy && event.preventDefault()}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy !== null}>
            {publishCopy.cancel}
          </Button>
          <Button
            onClick={() => void publish()}
            loading={busy !== null}
            disabled={!valid || current?.available === false}
            leadingIcon={<Globe aria-hidden />}
          >
            {publishCopy.confirm}
          </Button>
        </>
      }
    >
      <form
        noValidate
        onSubmit={(event) => {
          // The dialog sits inside the editor's form in React's tree
          event.preventDefault();
          event.stopPropagation();
          void publish();
        }}
        className="flex flex-col gap-4"
      >
        <Field label={publishCopy.linkLabel} hint={publishCopy.linkHint}>
          <div className="flex min-w-0 flex-col gap-1.5">
            <span aria-hidden className="truncate text-sm text-ink-muted">
              {`${location.host}/i/`}
            </span>
            <Input
              value={slug}
              onChange={(event) => {
                setError(null);
                setSlug(cleanSlugInput(event.target.value));
              }}
              onBlur={() => setSlug((value) => value.replace(/-+$/, ""))}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="url"
              maxLength={60}
              aria-describedby={statusId}
              className="font-medium"
            />
          </div>
        </Field>
        <p id={statusId} role="status" className="min-h-6 text-sm font-medium">
          {status}
        </p>
        {current && !current.available && current.suggestions.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink-muted">{publishCopy.tryOne}</p>
            <ul className="flex flex-wrap gap-2">
              {current.suggestions.map((option) => (
                <li key={option}>
                  <Button variant="secondary" size="sm" onClick={() => setSlug(option)}>
                    {option}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {busy === "saving" && (
          <p className="text-sm text-ink-muted" role="status">
            {publishCopy.saving}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-md border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {error}
          </p>
        )}
        <button type="submit" hidden />
      </form>
    </DialogContent>
  );
}
