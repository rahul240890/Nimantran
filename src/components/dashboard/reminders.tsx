"use client";

import { formatDistanceToNow } from "date-fns";
import { BellRing, Check, Copy, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { markReminded } from "@/actions/guests";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { formatPhone } from "@/lib/auth/phone";
import { guestState, type HostGuest } from "@/lib/guests/list";
import { whatsappToUrl } from "@/lib/publish/links";
import { guestMessage } from "./guest-list";
import type { DashboardView } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { dateLocale } from "@/i18n/dates";
import { dashboardText } from "@/i18n/copy";

/**
 * Reminders for guests who haven't replied, sent from the host's own WhatsApp one tap at a
 * time. Bulk sending needs WhatsApp Business (Step 22); this works today, for free.
 */
export function Reminders({ view }: { view: DashboardView }) {
  const locale = useLocale();
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.reminders;
  const router = useRouter();
  const waiting = view.guests.filter((guest) => guestState(guest) === "waiting");
  const [template, setTemplate] = useState(() =>
    dashboardCopy.messages.reminder("{name}", view.names, view.occasion, view.when),
  );
  const [sent, setSent] = useState<string[]>([]);

  const record = (guest: HostGuest) => {
    setSent((current) => [...current, guest.id]);
    void markReminded(view.id, [guest.id]);
  };

  const copyFor = async (guest: HostGuest) => {
    try {
      await navigator.clipboard.writeText(
        guestMessage(dashboardCopy.messages, view, guest, "reminder", template),
      );
      toast({ title: dashboardCopy.hosts.copied, tone: "success" });
      record(guest);
    } catch {
      toast({ title: dashboardCopy.guest.copyFailed, tone: "error" });
    }
  };

  return (
    <Card role="region" aria-labelledby="reminders-heading" className="gap-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold/15 text-accent-text">
          <BellRing aria-hidden className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="reminders-heading" className="font-semibold">
            {copy.heading}
          </h2>
          <p className="text-sm text-ink-muted">{copy.body(waiting.length)}</p>
        </div>
      </div>
      {waiting.length > 0 && view.url && (
        <Dialog
          onOpenChange={(open) => {
            if (!open && sent.length) router.refresh();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="secondary" leadingIcon={<MessageCircle aria-hidden />}>
              {copy.open}
            </Button>
          </DialogTrigger>
          <DialogContent
            title={copy.title}
            description={copy.description}
            closeLabel={copy.close}
            className="sm:max-w-xl"
            footer={
              <DialogClose asChild>
                <Button>{copy.done}</Button>
              </DialogClose>
            }
          >
            <div className="flex flex-col gap-5">
              <Field label={copy.message} hint={copy.messageHint}>
                <Textarea
                  value={template}
                  onChange={(event) => setTemplate(event.target.value)}
                  rows={4}
                  maxLength={600}
                />
              </Field>
              <ul className="flex flex-col divide-y divide-line">
                {waiting.map((guest) => {
                  const done = sent.includes(guest.id);
                  return (
                    <li key={guest.id} className="flex items-center gap-3 py-3">
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="font-semibold break-words">{guest.name}</span>
                        <span className="text-sm text-ink-muted">
                          {guest.phone ? formatPhone(guest.phone) : copy.noPhone}
                          {guest.remindedAt &&
                            ` · ${copy.lastReminded(formatDistanceToNow(guest.remindedAt, { addSuffix: true, locale: dateLocale[locale] }))}`}
                        </span>
                      </div>
                      {guest.phone ? (
                        <Button
                          asChild
                          size="sm"
                          variant={done ? "ghost" : "primary"}
                          className="shrink-0"
                        >
                          <a
                            href={whatsappToUrl(
                              guest.phone,
                              guestMessage(
                                dashboardCopy.messages,
                                view,
                                guest,
                                "reminder",
                                template,
                              ),
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => record(guest)}
                            aria-label={dashboardCopy.guest.remindTo(guest.name)}
                          >
                            {done ? <Check aria-hidden /> : <MessageCircle aria-hidden />}
                            {done ? copy.sent : copy.send}
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0"
                          leadingIcon={done ? <Check aria-hidden /> : <Copy aria-hidden />}
                          onClick={() => void copyFor(guest)}
                          aria-label={`${copy.copy}: ${guest.name}`}
                        >
                          {done ? copy.sent : copy.copy}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <p className="text-xs text-ink-muted">{copy.automatic}</p>
    </Card>
  );
}
