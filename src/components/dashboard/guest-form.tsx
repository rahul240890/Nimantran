"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, useTransition, type FormEvent } from "react";
import { addGuests, updateGuest } from "@/actions/guests";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { normalizePhone } from "@/lib/auth/phone";
import { GUEST_RULES, parseGuestList, type HostFunction, type HostGuest } from "@/lib/guests/list";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";
import { FunctionPicker, toStored } from "./guest-fields";
import { GuestImport } from "./guest-import";

function PartySize({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const copy = useText(dashboardText).dashboardCopy.form;
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div role="group" aria-labelledby={id} className="flex items-center justify-between gap-3">
        <span className="flex flex-col">
          <span id={id} className="font-semibold">
            {copy.partySize}
          </span>
          <span className="text-sm text-ink-muted">{copy.partyHint}</span>
        </span>
        <span className="flex items-center gap-2">
          <IconButton
            label={copy.fewer}
            icon={<Minus />}
            size="sm"
            disabled={value <= 1}
            onClick={() => onChange(Math.max(1, value - 1))}
          />
          <output aria-live="polite" className="w-8 text-center text-lg font-semibold tabular-nums">
            {value}
          </output>
          <IconButton
            label={copy.more}
            icon={<Plus />}
            size="sm"
            disabled={value >= GUEST_RULES.partySize}
            onClick={() => onChange(Math.min(GUEST_RULES.partySize, value + 1))}
          />
        </span>
      </div>
    </div>
  );
}

type SingleProps = {
  inviteId: string;
  functions: HostFunction[];
  guest?: HostGuest;
  onDone: () => void;
};

function SingleGuest({ inviteId, functions, guest, onDone }: SingleProps) {
  const copy = useText(dashboardText).dashboardCopy.form;
  const router = useRouter();
  const formId = useId();
  const [name, setName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [group, setGroup] = useState(guest?.group ?? "");
  const [partySize, setPartySize] = useState(guest?.partySize ?? 1);
  const [picked, setPicked] = useState(
    guest?.functionIds.length ? guest.functionIds : functions.map((fn) => fn.id),
  );
  const [tried, setTried] = useState(false);
  const [pending, start] = useTransition();

  const nameError = tried && !name.trim() ? copy.nameRequired : undefined;
  const phoneError =
    tried && phone.trim() && !("phone" in normalizePhone(phone)) ? copy.phoneInvalid : undefined;
  const functionsError = tried && functions.length > 1 && picked.length === 0;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    const phoneOk = !phone.trim() || "phone" in normalizePhone(phone);
    if (!name.trim() || !phoneOk || (functions.length > 1 && picked.length === 0)) {
      const form = event.currentTarget as HTMLFormElement;
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    const input = {
      name: name.trim(),
      phone: phone.trim(),
      group: group.trim(),
      partySize,
      functionIds: toStored(functions, picked),
    };
    start(async () => {
      const ok = guest
        ? await updateGuest(inviteId, guest.id, input).catch(() => false)
        : await addGuests(inviteId, [input]).catch(() => false);
      if (!ok) {
        toast({ title: copy.failed, tone: "error" });
        return;
      }
      toast({ title: guest ? copy.saved : copy.added(1), tone: "success" });
      router.refresh();
      onDone();
    });
  };

  return (
    <form id={formId} noValidate onSubmit={submit} className="flex flex-col gap-5">
      <Field label={copy.name} required error={nameError}>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={GUEST_RULES.name}
          placeholder={copy.namePlaceholder}
          autoComplete="off"
          autoFocus
        />
      </Field>
      <Field
        label={copy.phone}
        optionalLabel={copy.optional}
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
      <Field label={copy.group} optionalLabel={copy.optional} hint={copy.groupHint}>
        <Input
          value={group}
          onChange={(event) => setGroup(event.target.value)}
          maxLength={GUEST_RULES.group}
          placeholder={copy.groupPlaceholder}
          autoComplete="off"
        />
      </Field>
      <PartySize value={partySize} onChange={setPartySize} />
      <FunctionPicker
        functions={functions}
        value={picked}
        onChange={setPicked}
        error={functionsError}
      />
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onDone} disabled={pending}>
          {copy.cancel}
        </Button>
        <Button type="submit" loading={pending}>
          {guest ? copy.save : copy.addOne}
        </Button>
      </div>
    </form>
  );
}

function PastedList({ inviteId, functions, onDone }: Omit<SingleProps, "guest">) {
  const copy = useText(dashboardText).dashboardCopy.form;
  const router = useRouter();
  const [text, setText] = useState("");
  const [group, setGroup] = useState("");
  const [picked, setPicked] = useState(functions.map((fn) => fn.id));
  const [tried, setTried] = useState(false);
  const [pending, start] = useTransition();
  const parsed = useMemo(() => parseGuestList(text), [text]);
  const ready = parsed.filter((line) => !line.error);
  const problems = parsed.filter((line) => line.error);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    if (ready.length === 0 || (functions.length > 1 && picked.length === 0)) return;
    start(async () => {
      const ok = await addGuests(
        inviteId,
        ready.map((line) => ({
          name: line.name,
          phone: line.phone ?? "",
          group: group.trim(),
          partySize: line.partySize,
          functionIds: toStored(functions, picked),
        })),
      ).catch(() => false);
      if (!ok) {
        toast({ title: copy.failed, tone: "error" });
        return;
      }
      toast({ title: copy.added(ready.length), tone: "success" });
      router.refresh();
      onDone();
    });
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-5">
      <Field
        label={copy.paste}
        required
        hint={copy.pasteHint}
        error={tried && ready.length === 0 ? copy.pasteEmpty : undefined}
      >
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={7}
          placeholder={copy.pastePlaceholder}
          className="font-mono text-sm"
        />
      </Field>
      {parsed.length > 0 && (
        <div aria-live="polite" className="flex flex-col gap-2 text-sm">
          <p
            className={
              problems.length ? "font-semibold text-warning" : "font-semibold text-success"
            }
          >
            {copy.pasteSummary(ready.length, problems.length)}
          </p>
          {problems.length > 0 && (
            <ul className="flex flex-col gap-1 text-ink-muted">
              {problems.slice(0, 5).map((line) => (
                <li key={line.line} className="break-words">
                  {copy.pasteLine(line.line)}:{" "}
                  {line.error === "name" ? copy.pasteNoName : copy.pastePhone}
                  {line.name ? ` (${line.name})` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <Field label={copy.pasteGroup} optionalLabel={copy.optional}>
        <Input
          value={group}
          onChange={(event) => setGroup(event.target.value)}
          maxLength={GUEST_RULES.group}
          placeholder={copy.groupPlaceholder}
          autoComplete="off"
        />
      </Field>
      <FunctionPicker
        functions={functions}
        value={picked}
        onChange={setPicked}
        error={tried && functions.length > 1 && picked.length === 0}
      />
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onDone} disabled={pending}>
          {copy.cancel}
        </Button>
        <Button type="submit" loading={pending}>
          {copy.addMany(ready.length)}
        </Button>
      </div>
    </form>
  );
}

/** Adding guests one at a time, imported or as a pasted list, or editing one guest. */
export function GuestFormDialog({
  inviteId,
  functions,
  guests,
  guest,
  onDone,
}: {
  inviteId: string;
  functions: HostFunction[];
  /** Everyone on the list already, so an import can skip them. */
  guests: HostGuest[];
  guest?: HostGuest;
  onDone: () => void;
}) {
  const copy = useText(dashboardText).dashboardCopy.form;
  return (
    <DialogContent title={guest ? copy.editTitle : copy.addTitle} closeLabel={copy.close}>
      {guest ? (
        <SingleGuest inviteId={inviteId} functions={functions} guest={guest} onDone={onDone} />
      ) : (
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">{copy.oneTab}</TabsTrigger>
            <TabsTrigger value="import">{copy.importTab}</TabsTrigger>
            <TabsTrigger value="paste">{copy.pasteTab}</TabsTrigger>
          </TabsList>
          <TabsContent value="one">
            <SingleGuest inviteId={inviteId} functions={functions} onDone={onDone} />
          </TabsContent>
          <TabsContent value="import">
            <GuestImport
              inviteId={inviteId}
              functions={functions}
              guests={guests}
              onDone={onDone}
            />
          </TabsContent>
          <TabsContent value="paste">
            <PastedList inviteId={inviteId} functions={functions} onDone={onDone} />
          </TabsContent>
        </Tabs>
      )}
    </DialogContent>
  );
}
