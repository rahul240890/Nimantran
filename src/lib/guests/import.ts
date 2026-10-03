import { normalizePhone } from "@/lib/auth/phone";
import { GUEST_RULES, type HostGuest } from "./list";

/*
 * Importing a guest list: from the phone's contacts, an Excel or CSV sheet, or a vCard
 * file (what an iPhone or Android phone shares when you export contacts). Everything
 * becomes the same rows for the host to check, with numbers already on the list flagged.
 * Pure functions, so the browser does the reading and nothing leaves the device until
 * the host adds the guests.
 */

/** More than a paste: a family's whole phone book or the caterer's sheet. */
export const IMPORT_LIMIT = 2000;

export type ImportSource = { name: string; phones: string[]; group?: string; partySize?: number };

export type ImportRow = {
  key: number;
  name: string;
  phone: string | null;
  group: string;
  partySize: number;
  /** A row that can't be added as it stands. */
  error: "name" | "phone" | null;
  /** The number (or, with no number, the name) is on the list already, or earlier in the import. */
  duplicate: boolean;
};

const fold = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** The first number in a cell that reads as a phone; cells often hold two ("98… / 99…"). */
function firstPhone(values: string[]): { phone: string | null; bad: boolean } {
  let bad = false;
  for (const value of values) {
    for (const part of value.split(/[,;/|]|\s{2,}|\bor\b/i)) {
      // Contact apps add labels and extensions: "Mobile: 98765 43210", "tel:+91…"
      const cleaned = part.replace(/^\s*(?:tel:|[^\d+(]*:)\s*/i, "").trim();
      if (cleaned.replace(/\D/g, "").length < 4) continue;
      const parsed = normalizePhone(cleaned);
      if ("phone" in parsed) return { phone: parsed.phone, bad: false };
      bad = true;
    }
  }
  return { phone: null, bad };
}

/** Rows ready to show the host: cleaned, numbers checked, duplicates marked. */
export function toImportRows(sources: ImportSource[], existing: HostGuest[]): ImportRow[] {
  const phones = new Set(existing.flatMap((guest) => (guest.phone ? [guest.phone] : [])));
  const names = new Set(existing.filter((guest) => !guest.phone).map((guest) => fold(guest.name)));
  const rows: ImportRow[] = [];
  for (const source of sources) {
    if (rows.length >= IMPORT_LIMIT) break;
    const name = source.name.replace(/\s+/g, " ").trim().slice(0, GUEST_RULES.name);
    const { phone, bad } = firstPhone(source.phones);
    if (!name && !phone && !bad) continue;
    const duplicate = phone ? phones.has(phone) : Boolean(name) && names.has(fold(name));
    if (phone) phones.add(phone);
    else if (name) names.add(fold(name));
    const partySize = Math.min(
      GUEST_RULES.partySize,
      Math.max(1, Math.round(source.partySize ?? 1)),
    );
    rows.push({
      key: rows.length,
      name,
      phone,
      group: (source.group ?? "").trim().slice(0, GUEST_RULES.group),
      partySize: Number.isFinite(partySize) ? partySize : 1,
      error: !name ? "name" : bad && !phone ? "phone" : null,
      duplicate,
    });
  }
  return rows;
}

/* ---------- Spreadsheets (CSV and Excel) ---------- */

/** Comma, semicolon (European Excel) or tab separated, with quoted cells. */
export function parseCsv(text: string): string[][] {
  const body = text.replace(/^﻿/, "");
  const firstLine = body.slice(0, body.search(/\r?\n|$/));
  const counts = [",", ";", "\t"].map((sep) => firstLine.split(sep).length);
  const separator = [",", ";", "\t"][counts.indexOf(Math.max(...counts))]!;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index]!;
    if (quoted) {
      if (char === '"' && body[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"' && cell.trim() === "") {
      quoted = true;
      cell = "";
    } else if (char === separator) {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && body[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

export type ColumnRole = "name" | "first" | "last" | "phone" | "group" | "party";

/** Header words families and contact exports use, in English and Hindi. */
const HEADER_WORDS: Record<ColumnRole, RegExp> = {
  first: /^(first|given)[\s_-]*name$|^first$/,
  last: /^(last|family|sur)[\s_-]*name$|^surname$|^last$/,
  name: /^(full[\s_-]*)?name$|^guest([\s_-]*name)?$|^contact([\s_-]*name)?$|^display[\s_-]*name$|^नाम$|^मेहमान/,
  phone:
    /phone|mobile|^mob\.?$|^cell|whatsapp|^contact[\s_-]*(no|number)|^number$|^tel|^फ़?फोन|^मोबाइल|^नंबर/,
  group: /^group|^side$|^family$|^relation|^category$|^समूह|^रिश्ता/,
  party:
    /^(party|family)[\s_-]*size|^(no\.?|number)[\s_-]*of[\s_-]*(people|guests|persons)|^people$|^persons?$|^pax$|^count$|^guests$|^invited$|^लोग/,
};

export type Columns = {
  /** Columns joined for the name: a single name column, or first and last. */
  name: number[];
  phone: number | null;
  group: number | null;
  party: number | null;
  /** Whether the first row is headings rather than a guest. */
  header: boolean;
};

const looksLikePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && !/[^\d\s()+.-]/.test(value.trim());
};

/** With headings but none for the name, the first column given no other job. */
function fallbackName(first: string[], found: Partial<Record<ColumnRole, number>>): number {
  const taken = new Set(Object.values(found));
  return first.findIndex((_, index) => !taken.has(index));
}

/** Works out which column is which: by the headings when there are some, else by the values. */
export function detectColumns(rows: string[][]): Columns {
  const width = Math.max(0, ...rows.slice(0, 50).map((row) => row.length));
  const first = rows[0] ?? [];
  const found: Partial<Record<ColumnRole, number>> = {};
  first.forEach((cell, index) => {
    const word = fold(cell).replace(/[:*]+$/, "");
    if (!word) return;
    for (const role of ["first", "last", "name", "phone", "group", "party"] as ColumnRole[]) {
      if (found[role] === undefined && HEADER_WORDS[role].test(word)) {
        found[role] = index;
        return;
      }
    }
  });
  const header = Object.keys(found).length > 0 && !first.some((cell) => looksLikePhone(cell));
  if (header) {
    const name =
      found.name !== undefined
        ? [found.name]
        : [found.first, found.last].filter((index): index is number => index !== undefined);
    return {
      name: name.length ? name : [fallbackName(first, found)].filter((index) => index >= 0),
      phone: found.phone ?? null,
      group: found.group ?? null,
      party: found.party ?? null,
      header: true,
    };
  }
  // No headings: the column that's mostly numbers is the phone, the first wordy one the name
  const sample = rows.slice(0, 50).filter((row) => row.some(Boolean));
  const share = (index: number, test: (value: string) => boolean) =>
    sample.filter((row) => row[index] && test(row[index]!)).length / Math.max(1, sample.length);
  let phone: number | null = null;
  let name: number | null = null;
  for (let index = 0; index < width; index += 1) {
    if (phone === null && share(index, looksLikePhone) >= 0.5) phone = index;
    else if (name === null && share(index, (value) => /\p{L}/u.test(value)) >= 0.5) name = index;
  }
  return { name: name === null ? [] : [name], phone, group: null, party: null, header: false };
}

/** Sheet rows to import sources, by the chosen columns. */
export function sheetSources(rows: string[][], columns: Columns): ImportSource[] {
  return rows.slice(columns.header ? 1 : 0).map((row) => {
    const party = columns.party === null ? NaN : parseInt(row[columns.party] ?? "", 10);
    return {
      name: columns.name.map((index) => row[index] ?? "").join(" "),
      phones: columns.phone === null ? [] : [row[columns.phone] ?? ""],
      group: columns.group === null ? "" : (row[columns.group] ?? ""),
      partySize: Number.isFinite(party) ? party : 1,
    };
  });
}

/** A short name for a column in the picker: its heading, else "Column B" style. */
export function columnLabel(rows: string[][], columns: Columns, index: number): string {
  const heading = columns.header ? (rows[0]?.[index] ?? "").trim() : "";
  return heading || String.fromCharCode(65 + (index % 26)).repeat(Math.floor(index / 26) + 1);
}

/* ---------- vCard (.vcf) ---------- */

function decodeQuotedPrintable(value: string): string {
  const bytes: number[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const hex = /^=([0-9A-F]{2})/i.exec(value.slice(index, index + 3));
    if (hex) {
      bytes.push(parseInt(hex[1]!, 16));
      index += 2;
    } else bytes.push(...new TextEncoder().encode(value[index]!));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

const unescapeVcard = (value: string) =>
  value.replace(/\\([,;\\nN])/g, (_, char: string) => (char.toLowerCase() === "n" ? " " : char));

/** Contacts from a .vcf file: each card's name and numbers, mobiles first. */
export function parseVcard(text: string): ImportSource[] {
  // Long lines continue on the next line after a space; quoted-printable ones end with "="
  const lines: string[] = [];
  for (const line of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const last = lines[lines.length - 1];
    if (last !== undefined && /^[ \t]/.test(line)) lines[lines.length - 1] = last + line.slice(1);
    else if (last?.endsWith("=") && /ENCODING=QUOTED-PRINTABLE/i.test(last))
      lines[lines.length - 1] = last.slice(0, -1) + line;
    else lines.push(line);
  }

  const cards: ImportSource[] = [];
  let card: { fn: string; n: string; mobiles: string[]; others: string[] } | null = null;
  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const head = line.slice(0, colon);
    const property = head
      .split(";")[0]!
      .replace(/^item\d+\./i, "")
      .toUpperCase();
    let value = line.slice(colon + 1);
    if (/ENCODING=QUOTED-PRINTABLE/i.test(head)) value = decodeQuotedPrintable(value);
    if (property === "BEGIN" && /vcard/i.test(value))
      card = { fn: "", n: "", mobiles: [], others: [] };
    else if (!card) continue;
    else if (property === "FN") card.fn = unescapeVcard(value).trim();
    else if (property === "N") {
      // N is family;given;middle;prefix;suffix
      const [family = "", given = "", middle = ""] = value.split(";").map(unescapeVcard);
      card.n = [given, middle, family]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ");
    } else if (property === "TEL") {
      const number = value.replace(/^tel:/i, "").trim();
      if (/CELL|MOBILE|IPHONE|WHATSAPP/i.test(head)) card.mobiles.push(number);
      else card.others.push(number);
    } else if (property === "END" && /vcard/i.test(value)) {
      cards.push({ name: card.fn || card.n, phones: [...card.mobiles, ...card.others] });
      card = null;
    }
  }
  return cards;
}

/* ---------- The phone's contacts (Contact Picker) ---------- */

export type PickedContact = { name?: string[]; tel?: string[] };

export function contactSources(contacts: PickedContact[]): ImportSource[] {
  return contacts.map((contact) => ({
    name: contact.name?.find((name) => name.trim()) ?? "",
    phones: contact.tel ?? [],
  }));
}
