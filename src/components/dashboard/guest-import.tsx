"use client";

import { Contact, FileSpreadsheet, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { addGuests } from "@/actions/guests";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { formatPhone } from "@/lib/auth/phone";
import {
  IMPORT_LIMIT,
  columnLabel,
  contactSources,
  detectColumns,
  parseCsv,
  parseVcard,
  sheetSources,
  toImportRows,
  type Columns,
  type ImportRow,
  type ImportSource,
  type PickedContact,
} from "@/lib/guests/import";
import { GUEST_BATCH, GUEST_RULES, type HostFunction, type HostGuest } from "@/lib/guests/list";
import { readXlsx } from "@/lib/guests/xlsx";
import { cn } from "@/lib/cn";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";
import { FunctionPicker, toStored } from "./guest-fields";

/*
 * Importing guests: from the phone's contacts (Android Chrome's contact picker), or from
 * an Excel, CSV or contacts (.vcf) file. The file is read here in the browser; the host
 * checks the list, and only the guests they tick are saved.
 */

type ContactsManager = {
  select(properties: string[], options: { multiple: boolean }): Promise<PickedContact[]>;
};

const contactsManager = (): ContactsManager | null =>
  typeof navigator !== "undefined" && "contacts" in navigator && "ContactsManager" in window
    ? (navigator as unknown as { contacts: ContactsManager }).contacts
    : null;

const noop = () => () => {};

type Loaded =
  | { kind: "sheet"; file: string; rows: string[][]; columns: Columns }
  | { kind: "list"; label: string; sources: ImportSource[] };

type ReadError = "unreadable" | "oldExcel" | "empty";

/** Big enough for any family's list; stops a wrong file from freezing the page. */
const MAX_FILE_BYTES = 5 * 1024 * 1024;

async function readFile(file: File): Promise<Loaded | ReadError> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "xls") return "oldExcel";
  if (file.size > MAX_FILE_BYTES) return "unreadable";
  try {
    if (extension === "vcf" || file.type.includes("vcard")) {
      const sources = parseVcard(await file.text());
      return sources.length ? { kind: "list", label: file.name, sources } : "empty";
    }
    const rows =
      extension === "xlsx" ? await readXlsx(await file.arrayBuffer()) : parseCsv(await file.text());
    if (!rows.some((row) => row.some(Boolean))) return "empty";
    return { kind: "sheet", file: file.name, rows, columns: detectColumns(rows) };
  } catch {
    return "unreadable";
  }
}

const defaultPick = (row: ImportRow) => !row.error && !row.duplicate;

function ColumnPickers({
  loaded,
  onChange,
}: {
  loaded: Extract<Loaded, { kind: "sheet" }>;
  onChange: (columns: Columns) => void;
}) {
  const copy = useText(dashboardText).dashboardCopy.importer;
  const { rows, columns } = loaded;
  const width = Math.max(0, ...rows.slice(0, 50).map((row) => row.length));
  const label = (index: number) => {
    const name = columnLabel(rows, columns, index);
    if (columns.header) return name;
    const sample = rows.find((row) => row[index])?.[index] ?? "";
    return `${copy.column(name)}${sample ? ` · ${sample.slice(0, 24)}` : ""}`;
  };
  const indexes = Array.from({ length: width }, (_, index) => index);
  const nameOptions = indexes.map((index) => ({ value: String(index), label: label(index) }));
  if (columns.name.length > 1) {
    nameOptions.unshift({
      value: columns.name.join(","),
      label: copy.firstAndLast(label(columns.name[0]!), label(columns.name[1]!)),
    });
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={copy.nameColumn}>
        <Select
          value={columns.name.join(",")}
          options={nameOptions}
          contentClassName="max-h-72"
          onValueChange={(value) => onChange({ ...columns, name: value.split(",").map(Number) })}
        />
      </Field>
      <Field label={copy.phoneColumn}>
        <Select
          value={columns.phone === null ? "none" : String(columns.phone)}
          options={[
            { value: "none", label: copy.noColumn },
            ...indexes.map((index) => ({ value: String(index), label: label(index) })),
          ]}
          contentClassName="max-h-72"
          onValueChange={(value) =>
            onChange({ ...columns, phone: value === "none" ? null : Number(value) })
          }
        />
      </Field>
    </div>
  );
}

export function GuestImport({
  inviteId,
  functions,
  guests,
  onDone,
}: {
  inviteId: string;
  functions: HostFunction[];
  guests: HostGuest[];
  onDone: () => void;
}) {
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.importer;
  const form = dashboardCopy.form;
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const canPickContacts = useSyncExternalStore(
    noop,
    () => contactsManager() !== null,
    () => false,
  );
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [reading, setReading] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // Ticks the host changed; everything else follows defaultPick
  const [overrides, setOverrides] = useState<Map<number, boolean>>(new Map());
  const [group, setGroup] = useState("");
  const [picked, setPicked] = useState(functions.map((fn) => fn.id));
  const [tried, setTried] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const rows = useMemo(() => {
    if (!loaded) return [];
    const sources =
      loaded.kind === "sheet" ? sheetSources(loaded.rows, loaded.columns) : loaded.sources;
    return toImportRows(sources, guests);
  }, [loaded, guests]);

  const isPicked = (row: ImportRow) =>
    !(row.error === "name") && (overrides.get(row.key) ?? defaultPick(row));
  const chosen = rows.filter(isPicked);
  const selectable = rows.filter((row) => row.error !== "name");

  const load = (next: Loaded | null) => {
    setLoaded(next);
    setOverrides(new Map());
    setTried(false);
  };

  const pickContacts = async () => {
    const manager = contactsManager();
    if (!manager) return;
    setProblem(null);
    try {
      const contacts = await manager.select(["name", "tel"], { multiple: true });
      if (contacts.length) {
        load({ kind: "list", label: copy.contactsSource, sources: contactSources(contacts) });
      }
    } catch {
      toast({ title: copy.contactsFailed, tone: "error" });
    }
  };

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setProblem(null);
    setReading(true);
    const result = await readFile(file);
    setReading(false);
    if (fileInput.current) fileInput.current.value = "";
    if (typeof result === "string") {
      setProblem(copy[result]);
      return;
    }
    load(result);
  };

  const toggleAll = (on: boolean) => setOverrides(new Map(selectable.map((row) => [row.key, on])));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    if (chosen.length === 0 || (functions.length > 1 && picked.length === 0)) return;
    const functionIds = toStored(functions, picked);
    const input = chosen.map((row) => ({
      name: row.name,
      phone: row.phone ?? "",
      group: row.group || group.trim(),
      partySize: row.partySize,
      functionIds,
    }));
    let done = 0;
    setProgress({ done, total: input.length });
    for (let start = 0; start < input.length; start += GUEST_BATCH) {
      const batch = input.slice(start, start + GUEST_BATCH);
      const ok = await addGuests(inviteId, batch).catch(() => false);
      if (!ok) {
        setProgress(null);
        if (done) {
          toast({ title: copy.partial(done, input.length), tone: "error" });
          router.refresh();
          onDone();
        } else toast({ title: form.failed, tone: "error" });
        return;
      }
      done += batch.length;
      setProgress({ done, total: input.length });
    }
    toast({ title: copy.added(done), tone: "success" });
    router.refresh();
    onDone();
  };

  const filePicker = (
    <input
      ref={fileInput}
      type="file"
      accept=".xlsx,.csv,.tsv,.txt,.vcf,.xls,text/csv,text/vcard,text/x-vcard,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(event) => void pickFile(event.target.files?.[0])}
    />
  );

  if (!loaded) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-ink-muted">{copy.intro}</p>
        <div className="flex flex-col gap-3">
          {canPickContacts && (
            <div className="flex flex-col gap-1.5">
              <Button
                variant="secondary"
                leadingIcon={<Contact aria-hidden />}
                onClick={() => void pickContacts()}
              >
                {copy.contacts}
              </Button>
              <p className="text-sm text-ink-muted">{copy.contactsHint}</p>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Button
              variant="secondary"
              leadingIcon={<Upload aria-hidden />}
              loading={reading}
              onClick={() => fileInput.current?.click()}
            >
              {reading ? copy.reading : copy.file}
            </Button>
            <p className="text-sm text-ink-muted">{copy.fileHint}</p>
            {filePicker}
          </div>
          {!canPickContacts && <p className="text-sm text-ink-muted">{copy.noContactsHint}</p>}
          {problem && (
            <p role="alert" className="text-sm font-medium text-danger">
              {problem}
            </p>
          )}
        </div>
        <div className="flex justify-end border-t border-line pt-5">
          <Button type="button" variant="secondary" onClick={onDone}>
            {form.cancel}
          </Button>
        </div>
      </div>
    );
  }

  const allState =
    chosen.length === 0 ? false : chosen.length === selectable.length ? true : "indeterminate";
  const pending = progress !== null;

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 font-semibold">
          {loaded.kind === "sheet" ? (
            <FileSpreadsheet aria-hidden className="size-5 shrink-0 text-accent-text" />
          ) : (
            <Contact aria-hidden className="size-5 shrink-0 text-accent-text" />
          )}
          <span className="min-w-0 break-words">
            {copy.from(loaded.kind === "sheet" ? loaded.file : loaded.label)}
          </span>
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => load(null)}
        >
          {copy.another}
        </Button>
      </div>

      {loaded.kind === "sheet" && (
        <ColumnPickers loaded={loaded} onChange={(columns) => load({ ...loaded, columns })} />
      )}

      {rows.length === 0 ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {copy.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <Checkbox
              label={copy.selectAll}
              checked={allState}
              disabled={pending}
              onCheckedChange={(checked) => toggleAll(checked === true)}
            />
            <p aria-live="polite" className="text-sm text-ink-muted tabular-nums">
              {copy.summary(chosen.length, rows.length)}
            </p>
          </div>
          <ul
            aria-label={copy.from(loaded.kind === "sheet" ? loaded.file : loaded.label)}
            className="flex max-h-[min(22rem,45vh)] flex-col divide-y divide-line overflow-y-auto overscroll-contain rounded-md border border-line bg-surface-2/40 px-3"
            data-testid="import-rows"
          >
            {rows.map((row) => {
              const notes = [
                row.phone
                  ? formatPhone(row.phone)
                  : row.error === "phone"
                    ? copy.badPhone
                    : copy.noPhone,
                copy.party(row.partySize),
                row.group,
              ].filter(Boolean);
              return (
                <li key={row.key} className="py-0.5">
                  <Checkbox
                    label={
                      <span className={cn("break-words", !row.name && "italic")}>
                        {row.name || copy.noName}
                      </span>
                    }
                    description={
                      <>
                        <span className="tabular-nums">{notes.join(" · ")}</span>
                        {row.duplicate && (
                          <span className="ms-2 font-semibold text-warning">{copy.duplicate}</span>
                        )}
                      </>
                    }
                    checked={isPicked(row)}
                    disabled={row.error === "name" || pending}
                    onCheckedChange={(checked) =>
                      setOverrides((current) => new Map(current).set(row.key, checked === true))
                    }
                  />
                </li>
              );
            })}
          </ul>
          {tried && chosen.length === 0 && (
            <p role="alert" className="text-sm font-medium text-danger">
              {copy.nothingPicked}
            </p>
          )}
          {rows.length >= IMPORT_LIMIT && <p className="text-sm text-ink-muted">{copy.fileHint}</p>}
        </div>
      )}

      <Field label={form.pasteGroup} optionalLabel={form.optional}>
        <Input
          value={group}
          onChange={(event) => setGroup(event.target.value)}
          maxLength={GUEST_RULES.group}
          placeholder={form.groupPlaceholder}
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
          {form.cancel}
        </Button>
        <Button type="submit" loading={pending} disabled={rows.length === 0}>
          {progress ? copy.adding(progress.done, progress.total) : copy.add(chosen.length)}
        </Button>
      </div>
    </form>
  );
}
