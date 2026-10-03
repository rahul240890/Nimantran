import { describe, expect, it } from "vitest";
import {
  contactSources,
  detectColumns,
  parseCsv,
  parseVcard,
  sheetSources,
  toImportRows,
} from "./import";
import type { HostGuest } from "./list";

const existing = (over: Partial<HostGuest>): HostGuest => ({
  id: "g",
  name: "Guest",
  phone: null,
  group: "",
  partySize: 1,
  token: "t",
  functionIds: [],
  selfAdded: false,
  openedAt: null,
  lastOpenedAt: null,
  openCount: 0,
  remindedAt: null,
  createdAt: "2026-09-26T00:00:00Z",
  replies: [],
  message: "",
  respondedAt: null,
  answers: {},
  ...over,
});

const fromSheet = (rows: string[][], list: HostGuest[] = []) =>
  toImportRows(sheetSources(rows, detectColumns(rows)), list);

describe("reading a CSV", () => {
  it("handles quotes, commas inside quotes, a byte order mark and Windows line ends", () => {
    expect(parseCsv('﻿Name,Phone\r\n"Sharma, Anil","98765 43210"\r\nMeera,\r\n')).toEqual([
      ["Name", "Phone"],
      ["Sharma, Anil", "98765 43210"],
      ["Meera", ""],
    ]);
  });

  it("reads semicolon and tab separated sheets", () => {
    expect(parseCsv("Name;Mobile\nDadi;9876500000")).toEqual([
      ["Name", "Mobile"],
      ["Dadi", "9876500000"],
    ]);
    expect(parseCsv('Name\tMobile\n"He said ""hi"""\t1')[1]).toEqual(['He said "hi"', "1"]);
  });
});

describe("working out the columns", () => {
  it("finds name, phone, group and party size by their headings", () => {
    const rows = [
      ["S.No", "Guest Name", "WhatsApp No.", "Side", "No. of people"],
      ["1", "Sharma uncle", "98765 43210", "Bride", "4"],
    ];
    expect(detectColumns(rows)).toEqual({ name: [1], phone: 2, group: 3, party: 4, header: true });
    expect(fromSheet(rows)).toEqual([
      {
        key: 0,
        name: "Sharma uncle",
        phone: "+919876543210",
        group: "Bride",
        partySize: 4,
        error: null,
        duplicate: false,
      },
    ]);
  });

  it("joins first and last names, as Google and Outlook contacts export them", () => {
    const rows = [
      ["First Name", "Last Name", "Mobile Phone"],
      ["Meera", "Iyer", "+91 98765 00000"],
    ];
    expect(detectColumns(rows).name).toEqual([0, 1]);
    expect(fromSheet(rows)[0]).toMatchObject({ name: "Meera Iyer", phone: "+919876500000" });
  });

  it("reads Hindi headings", () => {
    const rows = [
      ["नाम", "मोबाइल"],
      ["दादी", "9876500000"],
    ];
    expect(fromSheet(rows)[0]).toMatchObject({ name: "दादी", phone: "+919876500000" });
  });

  it("guesses columns from the values when there are no headings", () => {
    const rows = [
      ["Sharma uncle", "9876543210"],
      ["Dadi", "9876500000"],
    ];
    expect(detectColumns(rows)).toMatchObject({ name: [0], phone: 1, header: false });
    expect(fromSheet(rows)).toHaveLength(2);
  });
});

describe("rows to import", () => {
  it("marks numbers already on the list or earlier in the file, and names without numbers", () => {
    const rows = toImportRows(
      [
        { name: "Nani", phones: ["98123 45678"] },
        { name: "Nani ji", phones: ["+91 98123 45678"] },
        { name: "Kaka", phones: ["9811111111"] },
        { name: "  dadi ", phones: [] },
        { name: "Bua", phones: [] },
      ],
      [existing({ phone: "+919811111111" }), existing({ name: "Dadi" })],
    );
    expect(rows.map((row) => [row.name, row.duplicate])).toEqual([
      ["Nani", false],
      ["Nani ji", true],
      ["Kaka", true],
      ["dadi", true],
      ["Bua", false],
    ]);
  });

  it("takes the first number that reads as a phone, and flags rows it can't use", () => {
    const [two, labelled, bad, nameless] = toImportRows(
      [
        { name: "Two numbers", phones: ["98765 43210 / 99999 00000"] },
        { name: "Labelled", phones: ["Mobile: 98765 11111"] },
        { name: "Landline", phones: ["1234"] },
        { name: "", phones: ["98765 22222"] },
      ],
      [],
    );
    expect(two!.phone).toBe("+919876543210");
    expect(labelled!.phone).toBe("+919876511111");
    expect(bad).toMatchObject({ phone: null, error: "phone" });
    expect(nameless).toMatchObject({ phone: "+919876522222", error: "name" });
  });

  it("skips blank rows and keeps party sizes in range", () => {
    const rows = toImportRows(
      [
        { name: "", phones: [""] },
        { name: "Big family", phones: [], partySize: 45 },
        { name: "Nobody", phones: [], partySize: 0 },
      ],
      [],
    );
    expect(rows.map((row) => [row.name, row.partySize])).toEqual([
      ["Big family", 20],
      ["Nobody", 1],
    ]);
  });
});

describe("contacts", () => {
  it("reads a vCard file with folded lines, quoted-printable names and mobile numbers first", () => {
    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Iyer;Meera;;;",
      "FN:Meera Iyer",
      "TEL;TYPE=HOME:022 2345 6789",
      "TEL;TYPE=CELL:+91 98765 00000",
      "END:VCARD",
      "BEGIN:VCARD",
      "VERSION:2.1",
      "N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;=E0=A4=A6=E0=A4=BE=E0=A4=A6=E0=A5=80;;;",
      "item1.TEL;type=pref:98765",
      " 43210",
      "END:VCARD",
    ].join("\r\n");
    const sources = parseVcard(vcf);
    expect(sources).toEqual([
      { name: "Meera Iyer", phones: ["+91 98765 00000", "022 2345 6789"] },
      { name: "दादी", phones: ["9876543210"] },
    ]);
    expect(toImportRows(sources, []).map((row) => row.phone)).toEqual([
      "+919876500000",
      "+919876543210",
    ]);
  });

  it("reads what the phone's contact picker returns", () => {
    expect(
      contactSources([{ name: ["Rohan"], tel: ["+91 98765 43210"] }, { tel: ["9876500000"] }]),
    ).toEqual([
      { name: "Rohan", phones: ["+91 98765 43210"] },
      { name: "", phones: ["9876500000"] },
    ]);
  });
});
