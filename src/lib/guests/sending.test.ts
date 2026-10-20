import { describe, expect, it } from "vitest";
import { guestGroups, matchesFilter, sendQueue, wasSent, type HostGuest } from "./list";

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
  lastOpenedAt: null,
  openCount: 0,
  sentAt: null,
  remindedAt: null,
  createdAt: "2026-10-01T00:00:00Z",
  replies: [],
  message: "",
  respondedAt: null,
  answers: {},
  ...over,
});

const reply = { functionId: "w", status: "attending" as const, adults: 2, children: 0 };

describe("who has had their invitation", () => {
  it("counts a send, a reminder, an open or a reply, and guests who found the invite", () => {
    expect(wasSent(guest())).toBe(false);
    expect(wasSent(guest({ sentAt: "2026-10-02T00:00:00Z" }))).toBe(true);
    expect(wasSent(guest({ remindedAt: "2026-10-02T00:00:00Z" }))).toBe(true);
    expect(wasSent(guest({ openedAt: "2026-10-02T00:00:00Z" }))).toBe(true);
    expect(wasSent(guest({ replies: [reply] }))).toBe(true);
    expect(wasSent(guest({ selfAdded: true }))).toBe(true);
  });

  it("filters the list to those still to send", () => {
    expect(matchesFilter(guest(), "not-sent")).toBe(true);
    expect(matchesFilter(guest({ sentAt: "2026-10-02T00:00:00Z" }), "not-sent")).toBe(false);
  });
});

describe("sending to many", () => {
  const list = [
    guest({ name: "Chitra", createdAt: "2026-10-03T00:00:00Z", group: "Office" }),
    guest({ name: "Asha", createdAt: "2026-10-01T00:00:00Z", group: "Family" }),
    guest({ name: "Bela", createdAt: "2026-10-02T00:00:00Z", sentAt: "2026-10-05T00:00:00Z" }),
    guest({ name: "Dev", createdAt: "2026-10-04T00:00:00Z", replies: [reply] }),
    guest({ name: "Self", createdAt: "2026-10-04T00:00:00Z", selfAdded: true }),
  ];
  const names = (guests: HostGuest[]) => guests.map((item) => item.name);

  it("goes through guests in the order they were added", () => {
    expect(names(sendQueue(list, { audience: "not-sent", batch: 0 }))).toEqual(["Asha", "Chitra"]);
  });

  it("reminds everyone who hasn't replied, sent or not", () => {
    expect(names(sendQueue(list, { audience: "waiting", batch: 0 }))).toEqual([
      "Asha",
      "Bela",
      "Chitra",
    ]);
  });

  it("never sends to guests who added themselves", () => {
    expect(names(sendQueue(list, { audience: "all", batch: 0 }))).not.toContain("Self");
  });

  it("keeps to one group and to the batch size", () => {
    expect(names(sendQueue(list, { audience: "all", group: "Office", batch: 0 }))).toEqual([
      "Chitra",
    ]);
    expect(names(sendQueue(list, { audience: "all", batch: 2 }))).toEqual(["Asha", "Bela"]);
  });

  it("lists the groups once each, sorted", () => {
    expect(guestGroups(list)).toEqual(["Family", "Office"]);
  });
});
