"use client";

import {
  Camera,
  Check,
  Contact,
  FileSpreadsheet,
  ImageIcon,
  Pencil,
  Sparkles,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { addGuests } from "@/actions/guests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { formatPhone } from "@/lib/auth/phone";
import {
  IMPORT_LIMIT,
  columnLabel,
  contactSources,
  detectColumns,
  needsCheck,
  parseCsv,
  parseVcard,
  sheetSources,
  textSources,
  toImportRows,
  type Columns,
  type ImportEdit,
  type ImportRow,
  type ImportSource,
  type PickedContact,
} from "@/lib/guests/import";
import { GUEST_BATCH, GUEST_RULES, type HostFunction, type HostGuest } from "@/lib/guests/list";
import { MAX_READ_PAGES, type PageProblem, type ReadResult } from "@/lib/guests/read-list";
import { readDocx, readXlsx } from "@/lib/guests/xlsx";
import { cn } from "@/lib/cn";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";
import type { DashboardView } from "./types";
import { FunctionPicker, toStored } from "./guest-fields";

/*
 * Importing guests: from the phone's contacts (Android Chrome's contact picker), from an
 * Excel, CSV, notes or contacts (.vcf) file read here in the browser, or from photos and
 * any other file read by AI (the photo goes to the server, is read and dropped). Every way
 * ends in the same review: rows that need a look come first, any row can be edited, and
 * only the guests the host ticks are saved.
 */

type ContactsManager = {
  select(properties: string[], options: { multiple: boolean }): Promise<PickedContact[]>;
};

const contactsManager = (): ContactsManager | null =>
  typeof navigator !== "undefined" && "contacts" in navigator && "ContactsManager" in window
    ? (navigator as unknown as { contacts: ContactsManager }).contacts
    : null;

const noop = () => () => {};

/** What happened to one photo or file read by AI. */
type PageOutcome = PageProblem | "failed" | "unsupported" | "used-up" | "too-big";
type ReadPage = { name: string; photo: string | null; outcome: PageOutcome };

type Loaded =
  | { kind: "sheet"; file: string; rows: string[][]; columns: Columns }
  | { kind: "list"; label: string; sources: ImportSource[] }
  | { kind: "ai"; label: string; sources: ImportSource[]; pages: ReadPage[] };

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
    if (extension === "txt") {
      // A notes file is read like a pasted list, unless it is a sheet saved as text
      const text = await file.text();
      const rows = parseCsv(text);
      if (!detectColumns(rows).header) {
        const sources = textSources(text);
        return sources.length ? { kind: "list", label: file.name, sources } : "empty";
      }
    }
    const rows =
      extension === "xlsx" ? await readXlsx(await file.arrayBuffer()) : parseCsv(await file.text());
    if (!rows.some((row) => row.some(Boolean))) return "empty";
    return { kind: "sheet", file: file.name, rows, columns: detectColumns(rows) };
  } catch {
    return "unreadable";
  }
}

/* ---------- Reading with AI ---------- */

/** Big enough for handwriting to stay sharp, small enough to send quickly. */
const PHOTO_EDGE = 2000;

async function shrinkPhoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, PHOTO_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("no photo"))),
      "image/jpeg",
      0.85,
    ),
  );
}

/** One file as the read-list route takes it: a photo, a PDF, or the file's text. */
async function pageBody(
  file: File,
  pdf: boolean,
): Promise<{ body: Blob; type: string; photo: string | null } | PageOutcome> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  try {
    if (file.type.startsWith("image/") || ["heic", "heif"].includes(extension)) {
      const body = await shrinkPhoto(file);
      return { body, type: "image/jpeg", photo: URL.createObjectURL(body) };
    }
    if (extension === "pdf" || file.type === "application/pdf") {
      return pdf ? { body: file, type: "application/pdf", photo: null } : "unsupported";
    }
    let text: string;
    if (extension === "docx") text = await readDocx(await file.arrayBuffer());
    else if (extension === "xlsx") {
      text = (await readXlsx(await file.arrayBuffer())).map((row) => row.join("\t")).join("\n");
    } else if (
      ["txt", "csv", "tsv", "vcf", "md", "rtf"].includes(extension) ||
      file.type.startsWith("text/")
    ) {
      text = await file.text();
    } else return "unsupported";
    return text.trim()
      ? { body: new Blob([text], { type: "text/plain" }), type: "text/plain", photo: null }
      : "not-a-list";
  } catch {
    return "failed";
  }
}

async function readPage(
  inviteId: string,
  page: { body: Blob; type: string },
  index: number,
  english: boolean,
): Promise<ReadResult> {
  try {
    const response = await fetch(
      `/api/invites/${inviteId}/read-list?page=${index + 1}&english=${english ? 1 : 0}`,
      { method: "POST", headers: { "content-type": page.type }, body: page.body },
    );
    return (await response.json()) as ReadResult;
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/* ---------- Review ---------- */

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
  const optional = (key: "phone" | "group" | "party", title: string) => (
    <Field label={title}>
      <Select
        value={columns[key] === null ? "none" : String(columns[key])}
        options={[
          { value: "none", label: copy.noColumn },
          ...indexes.map((index) => ({ value: String(index), label: label(index) })),
        ]}
        contentClassName="max-h-72"
        onValueChange={(value) =>
          onChange({ ...columns, [key]: value === "none" ? null : Number(value) })
        }
      />
    </Field>
  );
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
      {optional("phone", copy.phoneColumn)}
      {optional("group", copy.groupColumn)}
      {optional("party", copy.partyColumn)}
    </div>
  );
}

/** One guest in the review: tick to add, a flag when it needs a look, and editing in place. */
function ReviewRow({
  row,
  picked,
  disabled,
  photo,
  onPick,
  onEdit,
  onPhoto,
}: {
  row: ImportRow;
  picked: boolean;
  disabled: boolean;
  photo: boolean;
  onPick: (checked: boolean) => void;
  onEdit: (edit: ImportEdit) => void;
  onPhoto: () => void;
}) {
  const copy = useText(dashboardText).dashboardCopy.importer;
  const [editing, setEditing] = useState<ImportEdit | null>(null);

  if (editing) {
    const save = () => {
      onEdit({ ...editing, name: editing.name.trim(), phone: editing.phone.trim() });
      setEditing(null);
    };
    return (
      <li className="flex flex-col gap-3 py-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={copy.editName}>
            <Input
              value={editing.name}
              maxLength={GUEST_RULES.name}
              autoFocus
              onChange={(event) => setEditing({ ...editing, name: event.target.value })}
            />
          </Field>
          <Field label={copy.editPhone}>
            <Input
              value={editing.phone}
              inputMode="tel"
              autoComplete="off"
              onChange={(event) => setEditing({ ...editing, phone: event.target.value })}
            />
          </Field>
          <Field label={copy.editGroup}>
            <Input
              value={editing.group}
              maxLength={GUEST_RULES.group}
              onChange={(event) => setEditing({ ...editing, group: event.target.value })}
            />
          </Field>
          <Field label={copy.editParty}>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={GUEST_RULES.partySize}
              value={editing.partySize}
              onChange={(event) =>
                setEditing({ ...editing, partySize: Number(event.target.value) || 1 })
              }
            />
          </Field>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leadingIcon={<X aria-hidden />}
            onClick={() => setEditing(null)}
          >
            {copy.editCancel}
          </Button>
          <Button type="button" size="sm" leadingIcon={<Check aria-hidden />} onClick={save}>
            {copy.editDone}
          </Button>
        </div>
      </li>
    );
  }

  const flag =
    row.error === "name"
      ? copy.flags.noName
      : row.error === "phone"
        ? copy.flags.phone
        : row.unsure && !row.edited
          ? copy.flags.unsure
          : row.duplicate
            ? copy.duplicate
            : null;
  const notes = [
    row.phone ? formatPhone(row.phone) : (row.rawPhone ?? copy.noPhone),
    copy.party(row.partySize),
    row.group,
  ].filter(Boolean);
  return (
    <li className="flex items-start gap-1 py-0.5">
      <div className="min-w-0 flex-1">
        <Checkbox
          label={
            <span className={cn("break-words", !row.name && "italic")}>
              {row.name || copy.noName}
            </span>
          }
          description={
            <>
              {notes.length > 0 && <span className="tabular-nums">{notes.join(" · ")}</span>}
              {flag && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-semibold text-warning",
                    notes.length > 0 && "ms-2",
                  )}
                >
                  <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
                  {flag}
                </span>
              )}
              {row.edited && !flag && (
                <span className="ms-2 font-semibold text-success">{copy.edited}</span>
              )}
            </>
          }
          checked={picked}
          disabled={row.error === "name" || disabled}
          onCheckedChange={(checked) => onPick(checked === true)}
        />
      </div>
      {photo && row.page !== null && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 px-2.5"
          leadingIcon={<ImageIcon aria-hidden />}
          onClick={onPhoto}
          aria-label={copy.seePage(row.page)}
        >
          {row.page}
        </Button>
      )}
      <IconButton
        variant="ghost"
        size="sm"
        label={copy.editRow(row.name || copy.noName)}
        icon={<Pencil aria-hidden />}
        disabled={disabled}
        onClick={() =>
          setEditing({
            name: row.name,
            phone: row.phone ? formatPhone(row.phone) : (row.rawPhone ?? ""),
            group: row.group,
            partySize: row.partySize,
          })
        }
      />
    </li>
  );
}

export function GuestImport({
  inviteId,
  functions,
  guests,
  reading,
  onDone,
}: {
  inviteId: string;
  functions: HostFunction[];
  guests: HostGuest[];
  reading: DashboardView["listReading"];
  onDone: () => void;
}) {
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.importer;
  const ai = dashboardCopy.aiImport;
  const form = dashboardCopy.form;
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const aiInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const canPickContacts = useSyncExternalStore(
    noop,
    () => contactsManager() !== null,
    () => false,
  );
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [reading_, setReadingFile] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // Ticks the host changed; everything else follows defaultPick
  const [overrides, setOverrides] = useState<Map<number, boolean>>(new Map());
  const [edits, setEdits] = useState<Map<number, ImportEdit>>(new Map());
  const [group, setGroup] = useState("");
  const [picked, setPicked] = useState(functions.map((fn) => fn.id));
  const [tried, setTried] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [english, setEnglish] = useState(false);
  const [aiProgress, setAiProgress] = useState<{ done: number; total: number } | null>(null);
  const [pagesLeft, setPagesLeft] = useState(reading?.left ?? 0);
  const [photo, setPhoto] = useState<ReadPage | null>(null);

  const rows = useMemo(() => {
    if (!loaded) return [];
    const sources =
      loaded.kind === "sheet" ? sheetSources(loaded.rows, loaded.columns) : loaded.sources;
    const all = toImportRows(sources, guests, edits);
    // The ones to look at first, each group in its own order
    return [...all.filter(needsCheck), ...all.filter((row) => !needsCheck(row))];
  }, [loaded, guests, edits]);

  // Ticks follow the source, so a row keeps its tick when an edit moves it
  const isPicked = (row: ImportRow) =>
    !(row.error === "name") && (overrides.get(row.source) ?? defaultPick(row));
  const chosen = rows.filter(isPicked);
  const selectable = rows.filter((row) => row.error !== "name");
  const toCheck = rows.filter(needsCheck).length;
  const pages = loaded?.kind === "ai" ? loaded.pages : [];

  const load = (next: Loaded | null) => {
    if (loaded?.kind === "ai") {
      for (const page of loaded.pages) if (page.photo) URL.revokeObjectURL(page.photo);
    }
    setLoaded(next);
    setOverrides(new Map());
    setEdits(new Map());
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
    setReadingFile(true);
    const result = await readFile(file);
    setReadingFile(false);
    if (fileInput.current) fileInput.current.value = "";
    if (typeof result === "string") {
      setProblem(copy[result]);
      return;
    }
    load(result);
  };

  const readWithAi = async (list: FileList | null) => {
    const files = [...(list ?? [])].slice(0, MAX_READ_PAGES);
    if (aiInput.current) aiInput.current.value = "";
    if (cameraInput.current) cameraInput.current.value = "";
    if (!files.length || !reading) return;
    setProblem(null);
    const read: ReadPage[] = [];
    const sources: ImportSource[] = [];
    let stopped = false;
    setAiProgress({ done: 0, total: files.length });
    for (const [index, file] of files.entries()) {
      if (stopped) {
        read.push({ name: file.name, photo: null, outcome: "used-up" });
        continue;
      }
      const body = await pageBody(file, reading.pdf);
      if (typeof body === "string") {
        read.push({ name: file.name, photo: null, outcome: body });
      } else {
        const result = await readPage(inviteId, body, index, english);
        if (result.ok) {
          sources.push(...result.sources);
          setPagesLeft(result.left);
          read.push({ name: file.name, photo: body.photo, outcome: result.problem });
        } else {
          if (result.reason === "used-up") {
            stopped = true;
            setPagesLeft(result.left ?? 0);
          }
          const outcome =
            result.reason === "off" || result.reason === "not-found" ? "failed" : result.reason;
          read.push({ name: file.name, photo: body.photo, outcome });
        }
      }
      setAiProgress({ done: index + 1, total: files.length });
    }
    setAiProgress(null);
    if (sources.length) {
      load({ kind: "ai", label: ai.source(files.length), sources, pages: read });
      return;
    }
    for (const page of read) if (page.photo) URL.revokeObjectURL(page.photo);
    const first = read[0]?.outcome ?? "failed";
    setProblem(first === "none" ? ai.nothingFound : ai.outcomes[first]);
  };

  const toggleAll = (on: boolean) =>
    setOverrides(new Map(selectable.map((row) => [row.source, on])));

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
      if (ok !== true) {
        setProgress(null);
        if (done) {
          toast({ title: copy.partial(done, input.length), tone: "error" });
          router.refresh();
          onDone();
        } else toast({ title: ok === "limit" ? form.limit : form.failed, tone: "error" });
        return;
      }
      done += batch.length;
      setProgress({ done, total: input.length });
    }
    toast({ title: copy.added(done), tone: "success" });
    router.refresh();
    onDone();
  };

  const hidden = "sr-only";
  const pickers = (
    <>
      <input
        ref={fileInput}
        type="file"
        accept=".xlsx,.csv,.tsv,.txt,.vcf,.xls,text/csv,text/plain,text/vcard,text/x-vcard,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className={hidden}
        tabIndex={-1}
        aria-hidden
        onChange={(event) => void pickFile(event.target.files?.[0])}
      />
      {reading && (
        <>
          <input
            ref={aiInput}
            type="file"
            multiple
            accept={`image/*,.heic,.heif,.docx,.xlsx,.csv,.tsv,.txt,text/plain${reading?.pdf ? ",.pdf,application/pdf" : ""}`}
            className={hidden}
            tabIndex={-1}
            aria-hidden
            onChange={(event) => void readWithAi(event.target.files)}
          />
          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            className={hidden}
            tabIndex={-1}
            aria-hidden
            onChange={(event) => void readWithAi(event.target.files)}
          />
        </>
      )}
    </>
  );

  if (!loaded) {
    const busy = aiProgress !== null;
    const outOfPages = reading !== null && pagesLeft === 0;
    return (
      <div className="flex flex-col gap-5">
        <p className="text-ink-muted">{copy.intro}</p>
        {reading && (
          <section
            aria-labelledby="ai-import-heading"
            className="flex flex-col gap-3 rounded-lg border border-marigold/45 bg-marigold/10 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles aria-hidden className="size-5 text-accent-text" />
              <h3 id="ai-import-heading" className="font-semibold">
                {ai.heading}
              </h3>
              <Badge tone="gold">{ai.badge}</Badge>
            </div>
            <p className="text-sm text-ink-muted">{reading.pdf ? ai.bodyPdf : ai.body}</p>
            {busy ? (
              <p role="status" className="text-sm font-semibold">
                {ai.reading(Math.min(aiProgress.done + 1, aiProgress.total), aiProgress.total)}
              </p>
            ) : outOfPages ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">{ai.usedUp(reading.allowed)}</p>
                {reading.allowed < 30 && (
                  <Button asChild size="sm" className="self-start">
                    <Link href={`/invites/${inviteId}/edition?plan=grand`}>{ai.upgrade}</Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    leadingIcon={<Camera aria-hidden />}
                    onClick={() => cameraInput.current?.click()}
                    className="sm:flex-1"
                  >
                    {ai.camera}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    leadingIcon={<Upload aria-hidden />}
                    onClick={() => aiInput.current?.click()}
                    className="sm:flex-1"
                  >
                    {ai.files}
                  </Button>
                </div>
                <Switch
                  label={ai.english}
                  description={ai.englishHint}
                  checked={english}
                  onCheckedChange={setEnglish}
                />
                <p className="text-xs text-ink-muted">
                  {ai.left(pagesLeft, reading.allowed)} {ai.privacy}
                </p>
              </>
            )}
          </section>
        )}
        <div className="flex flex-col gap-3">
          {canPickContacts && (
            <div className="flex flex-col gap-1.5">
              <Button
                variant="secondary"
                leadingIcon={<Contact aria-hidden />}
                disabled={busy}
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
              leadingIcon={<FileSpreadsheet aria-hidden />}
              loading={reading_}
              disabled={busy}
              onClick={() => fileInput.current?.click()}
            >
              {reading_ ? copy.reading : copy.file}
            </Button>
            <p className="text-sm text-ink-muted">{copy.fileHint}</p>
          </div>
          {pickers}
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
  const title = loaded.kind === "sheet" ? copy.from(loaded.file) : copy.from(loaded.label);
  const pageNotes = pages.flatMap((page, index) =>
    page.outcome === "none" ? [] : [{ page, index }],
  );

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 font-semibold">
          {loaded.kind === "sheet" ? (
            <FileSpreadsheet aria-hidden className="size-5 shrink-0 text-accent-text" />
          ) : loaded.kind === "ai" ? (
            <Sparkles aria-hidden className="size-5 shrink-0 text-accent-text" />
          ) : (
            <Contact aria-hidden className="size-5 shrink-0 text-accent-text" />
          )}
          <span className="min-w-0 break-words">{title}</span>
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

      {pageNotes.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label={ai.pageNotes}>
          {pageNotes.map(({ page, index }) => (
            <li
              key={index}
              className="flex items-start gap-2 rounded-md border border-warning/35 bg-warning/10 px-3 py-2 text-sm"
            >
              <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
              <span className="min-w-0 break-words">
                <span className="font-semibold">{ai.pageName(index + 1, page.name)}</span>{" "}
                {ai.outcomes[page.outcome as Exclude<PageOutcome, "none">]}
              </span>
            </li>
          ))}
        </ul>
      )}

      {rows.length === 0 ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {copy.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {toCheck > 0 && (
            <p className="flex items-center gap-2 text-sm font-semibold text-warning">
              <TriangleAlert aria-hidden className="size-4 shrink-0" />
              {copy.toCheck(toCheck)}
            </p>
          )}
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
            aria-label={title}
            className="flex max-h-[min(26rem,50vh)] flex-col divide-y divide-line overflow-y-auto overscroll-contain rounded-md border border-line bg-surface-2/40 px-3"
            data-testid="import-rows"
          >
            {rows.map((row) => (
              <ReviewRow
                key={row.source}
                row={row}
                picked={isPicked(row)}
                disabled={pending}
                photo={Boolean(row.page && pages[row.page - 1]?.photo)}
                onPick={(checked) =>
                  setOverrides((current) => new Map(current).set(row.source, checked))
                }
                onEdit={(edit) => {
                  setEdits((current) => new Map(current).set(row.source, edit));
                  // An edited guest is one the host means to add
                  setOverrides((current) => new Map(current).set(row.source, true));
                }}
                onPhoto={() => row.page && setPhoto(pages[row.page - 1] ?? null)}
              />
            ))}
          </ul>
          {tried && chosen.length === 0 && (
            <p role="alert" className="text-sm font-medium text-danger">
              {copy.nothingPicked}
            </p>
          )}
          {rows.length >= IMPORT_LIMIT && <p className="text-sm text-ink-muted">{copy.fileHint}</p>}
        </div>
      )}

      <Field label={form.pasteGroup} hint={copy.groupHint} optionalLabel={form.optional}>
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

      <Dialog open={Boolean(photo)} onOpenChange={(open) => !open && setPhoto(null)}>
        {photo?.photo && (
          <DialogContent title={photo.name} closeLabel={form.close} className="sm:max-w-3xl">
            {/* A local photo the host just chose; next/image can't read blob: addresses */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.photo}
              alt={ai.photoAlt}
              className="mx-auto max-h-[70dvh] w-auto rounded-md border border-line"
            />
          </DialogContent>
        )}
      </Dialog>
    </form>
  );
}
