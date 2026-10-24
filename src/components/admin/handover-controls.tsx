"use client";

import { Copy, Link2, Link2Off } from "lucide-react";
import { useState, useTransition } from "react";
import { createHandover, withdrawHandover } from "@/actions/handover";
import { SocialIcon } from "@/components/brand/social-links";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { inviteDraft } from "@/lib/editor/store";
import type { HandoverLink } from "@/lib/invites/handover";
import { syncDraft } from "@/lib/invites/sync";

/**
 * The editor on this device lets go of an invite being handed over, once it is saved, so
 * nothing typed there later is saved as a copy after the family has taken it. It stays in
 * My invites until they do.
 */
async function letGo(eventId: string) {
  if (inviteDraft.get().draft.remoteId !== eventId) return;
  if ((await syncDraft()) === "synced") inviteDraft.reset();
}

const until = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

/**
 * One invite's hand-over link on Admin, Hand over: make it, copy it, send it on WhatsApp,
 * or withdraw it. A new link replaces the old one.
 */
export function HandoverControls({
  eventId,
  initial,
  origin,
  names,
}: {
  eventId: string;
  initial: HandoverLink | null;
  /** The site's address, for the full link. */
  origin: string;
  /** The invite's names, for the WhatsApp message. */
  names: string;
}) {
  const [link, setLink] = useState(initial);
  const [pending, start] = useTransition();
  const url = link ? `${origin}/claim/${link.token}` : null;
  const message = url
    ? `Namaste! ${names ? `${names}: your` : "Your"} invitation is ready. Open this link and sign in, and it's yours to look over, pay for and send to your guests: ${url}`
    : "";

  const make = () =>
    start(async () => {
      const made = await createHandover(eventId).catch(() => null);
      if (made) {
        setLink(made);
        await letGo(eventId);
      } else
        toast({
          title: "Couldn't make the link. Has the hand-over migration been run?",
          tone: "error",
        });
    });
  const withdraw = () =>
    start(async () => {
      if (await withdrawHandover(eventId).catch(() => false)) setLink(null);
      else toast({ title: "Couldn't withdraw the link", tone: "error" });
    });

  if (!link || !url) {
    return (
      <Button
        size="sm"
        variant="secondary"
        loading={pending}
        leadingIcon={<Link2 aria-hidden />}
        onClick={make}
      >
        Make a hand-over link
      </Button>
    );
  }
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-sm break-all text-ink" data-handover-link>
        {url}
      </p>
      <p className="text-xs text-ink-muted">
        Works once, until {until.format(new Date(link.expiresAt))}.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          leadingIcon={<Copy aria-hidden />}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              toast({ title: "Link copied", tone: "success" });
            } catch {
              toast({ title: "Couldn't copy. Select the link and copy it.", tone: "error" });
            }
          }}
        >
          Copy link
        </Button>
        <Button asChild size="sm" variant="secondary">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon channel="whatsapp" className="text-success" />
            Send on WhatsApp
          </a>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          loading={pending}
          leadingIcon={<Link2Off aria-hidden />}
          onClick={withdraw}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}
