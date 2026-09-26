import { describe, expect, it } from "vitest";
import {
  csvCell,
  dashboardCounts,
  filterGuests,
  guestState,
  guestsCsv,
  parseGuestList,
  sortGuests,
  type CsvLabels,
  type HostGuest,
} from "./list";

const guest = (over: Partial<HostGuest> = {}): HostGuest => ({
  id: over.name ?? "g",
  name: "Guest",
  phone: null,
  group: "",
  partySize: 1,
  token: "t",
  functionIds: [],
  selfAdded: false,
  openedAt: null,
  remindedAt: null,
  createdAt: "2026-09-26T00:00:00Z",
  replies: [],
  message: "",
  respondedAt: null,
  answers: {},
  ...over,
});

const functions = [
  { id: "h", kind: "haldi" as const },
  { id: "w", kind: "wedding" as const },
];

const nani = guest({
  name: "Nani",
  group: "Bride's family",
  phone: "+919812345678",
  partySize: 2,
  openedAt: "2026-09-27T00:00:00Z",
  respondedAt: "2026-09-27T01:00:00Z",
  replies: [
    { functionId: "h", status: "declined", adults: 0, children: 0 },
    { functionId: "w", status: "attending", adults: 2, children: 1 },
  ],
  answers: { meal: "jain" },
  message: "Blessings",
});
const rohan = guest({
  name: "Rohan Mehta",
  group: "Office",
  respondedAt: "2026-09-28T00:00:00Z",
  replies: [{ functionId: "w", status: "maybe", adults: 1, children: 0 }],
});
const kaka = guest({ name: "Kaka", partySize: 4, functionIds: ["w"] });
const didi = guest({ name: "Didi", openedAt: "2026-09-27T00:00:00Z" });

describe("guest list", () => {
  it("says where each guest stands", () => {
    expect([nani, rohan, kaka].map(guestState)).toEqual(["coming", "maybe", "waiting"]);
    expect(
      guestState(
        guest({ replies: [{ functionId: "w", status: "declined", adults: 0, children: 0 }] }),
      ),
    ).toBe("declined");
  });

  it("counts guests, opens, replies and people per function", () => {
    const counts = dashboardCounts([nani, rohan, kaka, didi], functions);
    expect(counts).toMatchObject({
      guests: 4,
      invitedPeople: 8,
      opened: 3,
      replied: 2,
      waiting: 2,
    });
    expect(counts.functions).toEqual([
      // Kaka is invited to the wedding only
      { id: "h", kind: "haldi", coming: 0, children: 0, maybe: 0, declined: 1, waiting: 2 },
      { id: "w", kind: "wedding", coming: 3, children: 1, maybe: 1, declined: 0, waiting: 2 },
    ]);
  });

  it("filters by state, search and function", () => {
    const all = [nani, rohan, kaka, didi];
    const names = (list: HostGuest[]) => list.map((item) => item.name);
    const by = (
      filter: Parameters<typeof filterGuests>[1]["filter"],
      query = "",
      fn = null as string | null,
    ) => names(filterGuests(all, { filter, query, functionId: fn }));
    expect(by("waiting")).toEqual(["Kaka", "Didi"]);
    expect(by("not-opened")).toEqual(["Kaka"]);
    expect(by("all", "bride")).toEqual(["Nani"]);
    expect(by("all", "rohan meh")).toEqual(["Rohan Mehta"]);
    expect(by("all", "98123")).toEqual(["Nani"]);
    expect(by("all", "", "h")).toEqual(["Nani", "Rohan Mehta", "Didi"]);
  });

  it("puts the newest replies first, then the rest by name", () => {
    expect(sortGuests([kaka, nani, didi, rohan]).map((item) => item.name)).toEqual([
      "Rohan Mehta",
      "Nani",
      "Didi",
      "Kaka",
    ]);
  });
});

describe("CSV export", () => {
  const labels: CsvLabels = {
    name: "Name",
    phone: "Phone",
    group: "Group",
    partySize: "Invited",
    opened: "Opened",
    link: "Link",
    message: "Note",
    yes: "Yes",
    no: "No",
    status: {
      attending: "Coming",
      maybe: "Maybe",
      declined: "Can't come",
      waiting: "Waiting",
      "not-invited": "Not invited",
    },
    functionName: (kind) => kind,
    people: (kind) => `${kind} people`,
    answers: [{ id: "meal", label: "Meal" }],
  };

  it("has one row per guest with each function's reply", () => {
    const csv = guestsCsv([nani, kaka], functions, {
      labels,
      linkFor: (item) => `https://x/i/a?g=${item.name}`,
    });
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv.slice(1).split("\r\n")).toEqual([
      "Name,Phone,Group,Invited,haldi,haldi people,wedding,wedding people,Meal,Note,Opened,Link",
      "Nani,'+919812345678,Bride's family,2,Can't come,0,Coming,3,jain,Blessings,Yes,https://x/i/a?g=Nani",
      "Kaka,,,4,Not invited,,Waiting,,,,No,https://x/i/a?g=Kaka",
    ]);
  });

  it("never lets a cell run as a formula", () => {
    expect(csvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(csvCell('Say "hi", please')).toBe('"Say ""hi"", please"');
  });
});

describe("pasting a list", () => {
  it("reads names, numbers and party sizes the way people write them", () => {
    expect(
      parseGuestList(
        [
          "Sharma uncle, 98765 43210",
          "",
          "1. Meera Iyer +91 98765 00000 (4)",
          "• Dadi x3",
          "Rohan - 12345",
          "  ",
          ", 9876543210",
        ].join("\n"),
      ),
    ).toEqual([
      { line: 1, name: "Sharma uncle", phone: "+919876543210", partySize: 1, error: null },
      { line: 3, name: "Meera Iyer", phone: "+919876500000", partySize: 4, error: null },
      { line: 4, name: "Dadi", phone: null, partySize: 3, error: null },
      { line: 5, name: "Rohan - 12345", phone: null, partySize: 1, error: null },
      { line: 7, name: "", phone: "+919876543210", partySize: 1, error: "name" },
    ]);
  });

  it("flags a number that isn't a phone number", () => {
    expect(parseGuestList("Anil 1234567890")[0]).toMatchObject({ name: "Anil", error: "phone" });
  });
});
