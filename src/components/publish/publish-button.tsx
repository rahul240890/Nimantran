"use client";

import {
  Check,
  CircleAlert,
  Globe,
  LoaderCircle,
  LogIn,
  PencilLine,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { needsPackage } from "@/actions/checkout";
import { checkSlug, publishInvite, type PublishOutcome, type SlugCheck } from "@/actions/invites";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { mainFunction, type InviteDraft } from "@/lib/editor/draft";
import { draftProblems } from "@/lib/editor/draft-checks";
import { inviteDraft } from "@/lib/editor/store";
import { syncDraft } from "@/lib/invites/sync";
import { cleanSlugInput, isSlug, slugYear, suggestSlug } from "@/lib/publish/slug";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { editionsText } from "@/i18n/copy/editions";
import { funnel } from "@/lib/funnel";

type SlugState = { slug: string; result: SlugCheck } | null;

/**
 * The last step's main action: publish the invite, or share it once it's live. An invite
 * without a package goes to the three packages first and comes back here to publish.
 */
export function PublishButton({
  draft,
  signedIn,
  onNotReady,
  autoOpen = false,
  size,
  signInNext = "/create",
  className,
}: {
  draft: InviteDraft;
  signedIn: boolean;
  /** Called instead of opening when steps still need finishing. */
  onNotReady: () => void;
  /** Open the dialog straight away: the host is back from choosing a package. */
  autoOpen?: boolean;
  size?: "lg";
  /** Where signing in comes back to: the design's page the button is on. */
  signInNext?: string;
  className?: string;
}) {
  const { publishCopy } = useText(publishText);
  const router = useRouter();
  const [open, setOpen] = useState(autoOpen && signedIn && draftProblems(draft).length === 0);
  const [gating, setGating] = useState(false);

  // Packages before publishing: an invite with none sees the three first, every time.
  // Publishing needs the invite saved, so a save that fails stops here instead of skipping
  // the packages; and when the package can't be checked, the packages page says.
  const start = async () => {
    if (draftProblems(draft).length > 0) return onNotReady();
    setGating(true);
    const synced = await syncDraft();
    const remoteId = remoteIdNow();
    if (synced !== "synced" || !remoteId) {
      setGating(false);
      toast({ title: publishCopy.failed, tone: "error" });
      return;
    }
    if (await packageCheck(remoteId)) {
      router.push(`/invites/${remoteId}/edition?publish=1`);
      return;
    }
    setGating(false);
    setOpen(true);
  };

  if (!signedIn) {
    return (
      <Button asChild size={size} className={className}>
        <Link href={`/sign-in?next=${encodeURIComponent(signInNext)}`}>
          <LogIn aria-hidden />
          {publishCopy.signInToPublish}
        </Link>
      </Button>
    );
  }

  if (draft.slug && draft.remoteId) {
    return (
      <Button asChild size={size} className={className}>
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
        size={size}
        className={className}
        leadingIcon={<Globe aria-hidden />}
        loading={gating}
        onClick={() => void start()}
      >
        {publishCopy.publish}
      </Button>
      {open && <PublishDialog draft={draft} onClose={() => setOpen(false)} />}
    </Dialog>
  );
}

const remoteIdNow = () => inviteDraft.get().draft.remoteId;

/** Whether the invite still needs a package: yes when no answer comes, as the page shows. */
async function packageCheck(remoteId: string): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const answer = await Promise.race([
    needsPackage(remoteId).catch(() => true),
    new Promise<boolean>((resolve) => {
      timer = setTimeout(() => resolve(true), 8_000);
    }),
  ]);
  clearTimeout(timer);
  return answer;
}

/** A link typed in English letters is cleaned as it is typed; one in another script once
 * the host leaves the field, so their keyboard can finish each letter. */
const asTyped = (text: string) => (/^[\x20-\x7e]*$/.test(text) ? cleanSlugInput(text) : text);

function PublishDialog({ draft, onClose }: { draft: InviteDraft; onClose: () => void }) {
  const { publishCopy } = useText(publishText);
  const router = useRouter();
  // The link is made from the names, in English letters whatever script they're in, and a
  // free one is found for it (owner, 2026-10-24: hosts kept having to make one up)
  const [text, setText] = useState(() =>
    suggestSlug({
      first: draft.content.first ?? "",
      second: draft.content.second ?? "",
      categoryId: draft.categoryId,
    }),
  );
  const slug = cleanSlugInput(text).replace(/-+$/, "");
  const main = mainFunction(draft);
  const year = slugYear(main ? draft.functions[main].date : undefined);
  /** The host's own link, once they change it; until then, the one made for them. */
  const [editing, setEditing] = useState(false);
  const [check, setCheck] = useState<SlugState>(null);
  const [busy, setBusy] = useState<"saving" | "publishing" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needs, setNeeds] = useState<Extract<PublishOutcome, { status: "needs-plan" }> | null>(
    null,
  );
  const { limitCopy, planCopy } = useText(editionsText);
  const statusId = useId();

  const valid = isSlug(slug);
  const current = check?.slug === slug ? check.result : null;

  // Ask whether the link is free a moment after typing stops; the link made for the host
  // moves on to a free one by itself
  useEffect(() => {
    if (!isSlug(slug)) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await checkSlug(slug, year).catch(() => null);
      if (cancelled || !result) return;
      const free = result.suggestions[0];
      if (!editing && !result.available && free) {
        setText(free);
        setCheck({ slug: free, result: { available: true, suggestions: [] } });
      } else setCheck({ slug, result });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug, year, editing]);

  const publish = async () => {
    if (!valid || busy) return;
    setError(null);
    setNeeds(null);
    setBusy("saving");
    const synced = await syncDraft();
    const remoteId = inviteDraft.get().draft.remoteId;
    if (synced !== "synced" || !remoteId) {
      setBusy(null);
      setError(publishCopy.failed);
      return;
    }
    setBusy("publishing");
    const attempt = (link: string) =>
      publishInvite(remoteId, link, year).catch(() => ({ status: "failed" }) as const);
    let outcome: PublishOutcome = await attempt(slug);
    // Taken in the moment since it was checked: the link made for the host moves on once
    if (outcome.status === "taken" && !editing && outcome.suggestions[0]) {
      setText(outcome.suggestions[0]);
      outcome = await attempt(outcome.suggestions[0]);
    }
    setBusy(null);
    if (outcome.status === "published") {
      funnel("Invite published");
      inviteDraft.update((current) => ({ ...current, slug: outcome.slug }), { touch: false });
      toast({ title: publishCopy.published, tone: "success" });
      onClose();
      router.push(`/invites/${remoteId}/share`);
    } else if (outcome.status === "needs-plan") {
      setNeeds(outcome);
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
      {editing ? publishCopy.checking : publishCopy.finding}
    </span>
  ) : current.available ? (
    <span className="flex items-center gap-1.5 text-success">
      <Check aria-hidden className="size-4 shrink-0" strokeWidth={2.5} />
      {editing ? publishCopy.available : publishCopy.ready}
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
        {editing ? (
          <>
            <Field label={publishCopy.linkLabel} hint={publishCopy.linkHint}>
              <Input
                value={text}
                onChange={(event) => {
                  setError(null);
                  setText(asTyped(event.target.value));
                }}
                onBlur={() => setText(slug)}
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={60}
                aria-describedby={statusId}
                className="font-medium"
              />
            </Field>
            <p className="text-sm break-all text-ink-muted">
              {`${location.host}/i/`}
              <span className="font-semibold text-ink">{slug}</span>
            </p>
          </>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface-2 px-4 py-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-label text-xs tracking-[0.14em] text-ink-muted uppercase">
                {publishCopy.linkLabel}
              </p>
              <p className="text-base break-all text-ink-muted">
                {`${location.host}/i/`}
                <span className="font-semibold text-ink">{slug}</span>
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              leadingIcon={<PencilLine aria-hidden />}
              onClick={() => setEditing(true)}
              disabled={busy !== null}
            >
              {publishCopy.change}
            </Button>
          </div>
        )}
        <p id={statusId} role="status" className="min-h-6 text-sm font-medium">
          {status}
        </p>
        {current && !current.available && current.suggestions.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink-muted">{publishCopy.tryOne}</p>
            <ul className="flex flex-wrap gap-2">
              {current.suggestions.map((option) => (
                <li key={option}>
                  <Button variant="secondary" size="sm" onClick={() => setText(option)}>
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
        {needs && remoteIdNow() && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-md border border-marigold/50 bg-marigold/10 px-4 py-3"
          >
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-ink">{limitCopy.title}</p>
              <p className="text-sm text-ink-muted">
                {needs.shortfalls.map((need) => limitCopy.used[need.limit](need.used)).join(" · ")}
              </p>
              <p className="text-sm text-ink-muted">{limitCopy.body(planCopy[needs.plan].name)}</p>
            </div>
            <Button asChild size="sm" className="self-start">
              <Link href={`/invites/${remoteIdNow()}/edition?plan=${needs.plan}`}>
                <Sparkles aria-hidden />
                {limitCopy.choose}
              </Link>
            </Button>
          </div>
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
