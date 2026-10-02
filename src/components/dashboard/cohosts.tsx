"use client";

import { Copy, Link2, LogOut, MessageCircle, Sparkles, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { createHostInvite, removeHost, setHostAccess, withdrawHostInvite } from "@/actions/guests";
import { PersonAvatar } from "@/components/account/person-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { normalizePhone } from "@/lib/auth/phone";
import type { Host, HostAccess } from "@/lib/invites/hosts";
import { whatsappToUrl } from "@/lib/publish/links";
import type { DashboardView } from "./types";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";

const joinUrl = (origin: string, token: string) => `${origin}/join/${token}`;

async function copyLink(url: string, words: { copied: string; failed: string }) {
  try {
    await navigator.clipboard.writeText(url);
    toast({ title: words.copied, tone: "success" });
  } catch {
    toast({ title: words.failed, tone: "error" });
  }
}

const ACCESS: HostAccess[] = ["edit", "guests"];

/** Co-hosts and unused links, against the edition's limit; null when there's no limit. */
function seatsLeft(view: DashboardView): number | null {
  if (view.cohostLimit === null) return null;
  const taken = view.hosts.filter((host) => host.role === "cohost").length;
  return view.cohostLimit - taken - view.hostInvites.length;
}

function LinkActions({
  view,
  token,
  phone,
}: {
  view: DashboardView;
  token: string;
  phone: string | null;
}) {
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.hosts;
  const words = { copied: copy.copied, failed: dashboardCopy.guest.copyFailed };
  const url = joinUrl(view.origin, token);
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm">
        <a
          href={whatsappToUrl(phone, copy.message(view.names, url))}
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
  const [access, setAccess] = useState<HostAccess>("edit");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [made, setMade] = useState<{ token: string; phone: string | null } | null>(null);
  const [full, setFull] = useState(false);
  const [pending, start] = useTransition();
  const phoneError =
    tried && phone.trim() && !("phone" in normalizePhone(phone)) ? copy.phoneInvalid : undefined;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    const typed = phone.trim() ? normalizePhone(phone) : null;
    if (typed && !("phone" in typed)) return;
    start(async () => {
      const result = await createHostInvite(view.id, { label, access, phone }).catch(() => null);
      if (!result?.ok) {
        if (result?.reason === "full") setFull(true);
        else
          toast({
            title: result?.reason === "phone" ? copy.phoneInvalid : copy.createFailed,
            tone: "error",
          });
        return;
      }
      setMade({ token: result.token, phone: typed && "phone" in typed ? typed.phone : null });
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setMade(null);
          setLabel("");
          setAccess("edit");
          setPhone("");
          setTried(false);
          setFull(false);
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
        {made ? (
          <div className="flex flex-col gap-4">
            <p
              data-testid="cohost-link"
              className="rounded-md border border-line bg-surface-2/60 px-3.5 py-3 font-medium break-all select-all"
            >
              {joinUrl(view.origin, made.token)}
            </p>
            <LinkActions view={view} token={made.token} phone={made.phone} />
          </div>
        ) : full ? (
          <Full view={view} />
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
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
            <div className="flex flex-col gap-1">
              <p aria-hidden className="font-semibold">
                {copy.accessLabel}
              </p>
              <RadioGroup
                label={copy.accessLabel}
                value={access}
                onValueChange={(value) => setAccess(value === "guests" ? "guests" : "edit")}
              >
                {ACCESS.map((id) => (
                  <RadioItem
                    key={id}
                    value={id}
                    label={copy.access[id].name}
                    description={copy.access[id].hint}
                  />
                ))}
              </RadioGroup>
            </div>
            <Field
              label={copy.phone}
              optionalLabel={dashboardCopy.form.optional}
              hint={copy.phoneHint}
              error={phoneError}
            >
              <Input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={24}
                placeholder="98765 43210"
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

/** The edition's co-hosts are all taken: upgrade, or free a place. */
function Full({ view }: { view: DashboardView }) {
  const copy = useText(dashboardText).dashboardCopy.hosts;
  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-lg border border-marigold/45 bg-marigold/10 p-4"
    >
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold">{copy.fullTitle(view.cohostLimit ?? 0)}</p>
        <p className="text-sm text-ink-muted">{copy.fullBody}</p>
      </div>
      <Button asChild size="sm" className="self-start">
        <Link href={`/invites/${view.id}/edition`}>
          <Sparkles aria-hidden />
          {copy.upgrade}
        </Link>
      </Button>
    </div>
  );
}

/** The owner switches a co-host between editing the invite and running the guests only. */
function AccessPicker({ view, host }: { view: DashboardView; host: Host }) {
  const copy = useText(dashboardText).dashboardCopy.hosts;
  const router = useRouter();
  const [value, setValue] = useState<HostAccess>(host.access);
  const [pending, start] = useTransition();
  const name = host.name || copy.unnamed;
  return (
    <Select
      aria-label={copy.changeAccess(name)}
      value={value}
      disabled={pending}
      className="w-full sm:w-auto"
      options={ACCESS.map((id) => ({ value: id, label: copy.access[id].short }))}
      onValueChange={(next) => {
        const chosen: HostAccess = next === "guests" ? "guests" : "edit";
        const before = value;
        setValue(chosen);
        start(async () => {
          const ok = await setHostAccess(view.id, host.userId, chosen).catch(() => false);
          if (!ok) {
            setValue(before);
            toast({ title: copy.failed, tone: "error" });
            return;
          }
          toast({ title: copy.accessChanged, tone: "success" });
          router.refresh();
        });
      }}
    />
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
  const left = seatsLeft(view);
  return (
    <Card role="region" aria-labelledby="cohosts-heading" className="gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="cohosts-heading" className="font-semibold">
          {copy.heading}
        </h2>
        <p className="text-sm text-ink-muted">{copy.body}</p>
        {owner && view.cohostLimit !== null && (
          <p className="text-sm font-semibold">
            {copy.seats(view.cohostLimit - Math.max(left ?? 0, 0), view.cohostLimit)}
          </p>
        )}
      </div>
      <ul className="flex flex-col gap-4">
        {view.hosts.map((host) => (
          <li key={host.userId} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <PersonAvatar name={host.name} size="sm" label={copy.unnamed} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center gap-2 font-semibold break-words">
                  {host.name || copy.unnamed}
                  {host.you && <Badge tone="gold">{copy.you}</Badge>}
                </span>
                <span className="text-sm text-ink-muted">
                  {[
                    host.role === "owner" ? copy.owner : copy.cohost,
                    host.role === "cohost" && !owner ? copy.access[host.access].short : "",
                    host.side,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              {host.role === "cohost" && (owner || host.you) && (
                <RemoveHost view={view} host={host} />
              )}
            </div>
            {host.role === "cohost" && owner && (
              <div className="ps-11">
                <AccessPicker view={view} host={host} />
              </div>
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
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold break-words">
                      {copy.pendingFor(invite.label)}
                    </span>
                    <span className="text-sm text-ink-muted">
                      {[copy.access[invite.access].short, invite.phone && copy.sentTo(invite.phone)]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <Withdraw view={view} id={invite.id} label={invite.label} />
                </div>
                <LinkActions view={view} token={invite.token} phone={invite.phone} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {owner ? (
        left !== null && left <= 0 ? (
          <Full view={view} />
        ) : (
          <InviteCohost view={view} />
        )
      ) : (
        <p className="text-sm text-ink-muted">{copy.onlyOwner}</p>
      )}
    </Card>
  );
}
