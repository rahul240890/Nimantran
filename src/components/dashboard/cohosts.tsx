"use client";

import { Copy, Link2, LogOut, MessageCircle, UserMinus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { createHostInvite, removeHost, withdrawHostInvite } from "@/actions/guests";
import { PersonAvatar } from "@/components/account/person-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { Host } from "@/lib/invites/hosts";
import { whatsappShareUrl } from "@/lib/publish/links";
import type { DashboardView } from "./types";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy";

const joinUrl = (origin: string, token: string) => `${origin}/join/${token}`;

async function copyLink(url: string, words: { copied: string; failed: string }) {
  try {
    await navigator.clipboard.writeText(url);
    toast({ title: words.copied, tone: "success" });
  } catch {
    toast({ title: words.failed, tone: "error" });
  }
}

function LinkActions({ view, token }: { view: DashboardView; token: string }) {
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.hosts;
  const words = { copied: copy.copied, failed: dashboardCopy.guest.copyFailed };
  const url = joinUrl(view.origin, token);
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm">
        <a
          href={whatsappShareUrl(copy.message(view.names, url))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden />
          {copy.whatsapp}
        </a>
      </Button>
      <Button
        size="sm"
        variant="secondary"
        leadingIcon={<Copy aria-hidden />}
        onClick={() => void copyLink(url, words)}
      >
        {copy.copy}
      </Button>
    </div>
  );
}

function InviteCohost({ view }: { view: DashboardView }) {
  const copy = useText(dashboardText).dashboardCopy.hosts;
  const { dashboardCopy } = useText(dashboardText);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    start(async () => {
      const made = await createHostInvite(view.id, label).catch(() => null);
      if (!made) {
        toast({ title: copy.createFailed, tone: "error" });
        return;
      }
      setToken(made);
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setToken(null);
          setLabel("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" leadingIcon={<UserPlus aria-hidden />}>
          {copy.invite}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={copy.inviteTitle}
        description={copy.inviteBody}
        closeLabel={dashboardCopy.form.close}
      >
        {token ? (
          <div className="flex flex-col gap-4">
            <p
              data-testid="cohost-link"
              className="rounded-md border border-line bg-surface-2/60 px-3.5 py-3 font-medium break-all select-all"
            >
              {joinUrl(view.origin, token)}
            </p>
            <LinkActions view={view} token={token} />
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <Field
              label={copy.label}
              optionalLabel={dashboardCopy.form.optional}
              hint={copy.labelHint}
            >
              <Input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                maxLength={40}
                placeholder={copy.labelPlaceholder}
                autoComplete="off"
              />
            </Field>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={pending}>
                  {copy.keep}
                </Button>
              </DialogClose>
              <Button type="submit" loading={pending} leadingIcon={<Link2 aria-hidden />}>
                {copy.create}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Asks before a co-host is removed, or before a co-host leaves. */
function RemoveHost({ view, host }: { view: DashboardView; host: Host }) {
  const copy = useText(dashboardText).dashboardCopy.hosts;
  const { dashboardCopy } = useText(dashboardText);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const leaving = host.you;
  const name = host.name || copy.unnamed;

  const confirm = () =>
    start(async () => {
      const ok = await removeHost(view.id, host.userId).catch(() => false);
      if (!ok) {
        toast({ title: copy.failed, tone: "error" });
        return;
      }
      setOpen(false);
      toast({ title: leaving ? copy.left : copy.removed, tone: "success" });
      if (leaving) router.push("/invites");
      router.refresh();
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {leaving ? (
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<LogOut aria-hidden className="rtl:-scale-x-100" />}
          onClick={() => setOpen(true)}
        >
          {copy.leave}
        </Button>
      ) : (
        <IconButton
          variant="ghost"
          size="sm"
          label={copy.remove(name)}
          icon={<UserMinus aria-hidden />}
          onClick={() => setOpen(true)}
          className="text-ink-muted hover:text-danger"
        />
      )}
      <DialogContent
        title={leaving ? copy.leaveTitle : copy.removeTitle}
        closeLabel={dashboardCopy.form.close}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary" disabled={pending}>
                {copy.keep}
              </Button>
            </DialogClose>
            <Button variant="danger" loading={pending} onClick={confirm}>
              {leaving ? copy.leaveConfirm : copy.removeConfirm}
            </Button>
          </>
        }
      >
        <p className="text-ink-muted">{leaving ? copy.leaveBody : copy.removeBody(name)}</p>
      </DialogContent>
    </Dialog>
  );
}

function Withdraw({ view, id, label }: { view: DashboardView; id: string; label: string }) {
  const copy = useText(dashboardText).dashboardCopy.hosts;
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      loading={pending}
      aria-label={copy.withdrawLabel(label)}
      onClick={() =>
        start(async () => {
          const ok = await withdrawHostInvite(view.id, id).catch(() => false);
          toast(
            ok ? { title: copy.withdrawn, tone: "success" } : { title: copy.failed, tone: "error" },
          );
          if (ok) router.refresh();
        })
      }
    >
      {copy.withdraw}
    </Button>
  );
}

/** The people running this invite, pending co-host links, and inviting another family. */
export function Cohosts({ view }: { view: DashboardView }) {
  const copy = useText(dashboardText).dashboardCopy.hosts;
  const owner = view.role === "owner";
  return (
    <Card role="region" aria-labelledby="cohosts-heading" className="gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="cohosts-heading" className="font-semibold">
          {copy.heading}
        </h2>
        <p className="text-sm text-ink-muted">{copy.body}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {view.hosts.map((host) => (
          <li key={host.userId} className="flex items-center gap-3">
            <PersonAvatar name={host.name} size="sm" label={copy.unnamed} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex flex-wrap items-center gap-2 font-semibold break-words">
                {host.name || copy.unnamed}
                {host.you && <Badge tone="gold">{copy.you}</Badge>}
              </span>
              <span className="text-sm text-ink-muted">
                {[host.role === "owner" ? copy.owner : copy.cohost, host.side]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
            {host.role === "cohost" && (owner || host.you) && (
              <RemoveHost view={view} host={host} />
            )}
          </li>
        ))}
      </ul>

      {owner && view.hostInvites.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <h3 className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
            {copy.pending}
          </h3>
          <ul className="flex flex-col gap-4">
            {view.hostInvites.map((invite) => (
              <li key={invite.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 text-sm font-semibold break-words">
                    {copy.pendingFor(invite.label)}
                  </span>
                  <Withdraw view={view} id={invite.id} label={invite.label} />
                </div>
                <LinkActions view={view} token={invite.token} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {owner ? (
        <InviteCohost view={view} />
      ) : (
        <p className="text-sm text-ink-muted">{copy.onlyOwner}</p>
      )}
    </Card>
  );
}
