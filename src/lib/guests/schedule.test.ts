import { describe, expect, it } from "vitest";
import type { HostGuest } from "./list";
import {
  defaultSendTime,
  formatSendTime,
  isDue,
  istParts,
  istToIso,
  pendingSends,
  sendAudience,
  type ScheduledSend,
} from "./schedule";

const guest = (id: string, extra: Partial<HostGuest> = {}): HostGuest => ({
  id,
  name: id,
  phone: null,
  group: "",
  partySize: 1,
  token: `t-${id}`,
  functionIds: [],
  selfAdded: false,
  openedAt: null,
  lastOpenedAt: null,
  openCount: 0,
  remindedAt: null,
  createdAt: "2026-10-01T00:00:00.000Z",
  replies: [],
  message: "",
  respondedAt: null,
  answers: {},
  ...extra,
});

const send = (extra: Partial<ScheduledSend> = {}): ScheduledSend => ({
  id: "s1",
  purpose: "invite",
  functionId: null,
  sendAt: "2026-11-20T04:00:00.000Z",
  status: "scheduled",
  ...extra,
});

describe("India Standard Time", () => {
  it("reads the host's date and time as IST", () => {
    expect(istToIso("2026-11-20", "09:30")).toBe("2026-11-20T04:00:00.000Z");
    expect(istToIso("2026-11-20", "02:00")).toBe("2026-11-19T20:30:00.000Z");
  });

  it("refuses times that don't exist", () => {
    expect(istToIso("2026-02-31", "10:00")).toBeNull();
    expect(istToIso("2026-11-20", "24:00")).toBeNull();
    expect(istToIso("20-11-2026", "10:00")).toBeNull();
  });

  it("turns an instant back into the day and time in India", () => {
    expect(istParts("2026-11-19T20:30:00.000Z")).toEqual({ date: "2026-11-20", time: "02:00" });
    expect(formatSendTime("2026-11-20T04:00:00.000Z")).toBe("Fri, 20 Nov · 9:30 AM");
  });

  it("starts the form at 10 AM tomorrow", () => {
    expect(defaultSendTime(new Date("2026-10-02T20:00:00.000Z"))).toEqual({
      date: "2026-10-04",
      time: "10:00",
    });
  });
});

describe("sends", () => {
  it("is due once the time has come, until it's sent or cancelled", () => {
    const now = new Date("2026-11-20T04:00:00.000Z");
    expect(isDue(send(), now)).toBe(true);
    expect(isDue(send({ sendAt: "2026-11-20T04:01:00.000Z" }), now)).toBe(false);
    expect(isDue(send({ status: "sent" }), now)).toBe(false);
  });

  it("lists only what's left to send, soonest first", () => {
    const list = pendingSends([
      send({ id: "late", sendAt: "2026-12-01T00:00:00.000Z" }),
      send({ id: "done", status: "sent" }),
      send({ id: "soon", sendAt: "2026-11-01T00:00:00.000Z" }),
      send({ id: "off", status: "cancelled" }),
    ]);
    expect(list.map((item) => item.id)).toEqual(["soon", "late"]);
  });

  it("sends invitations to everyone invited and reminders to those who haven't replied", () => {
    const guests = [
      guest("all"),
      guest("haldi-only", { functionIds: ["haldi"] }),
      guest("replied", {
        replies: [{ functionId: "wedding", status: "attending", adults: 2, children: 0 }],
      }),
    ];
    const ids = (list: HostGuest[]) => list.map((item) => item.id);
    expect(ids(sendAudience(send(), guests))).toEqual(["all", "haldi-only", "replied"]);
    expect(ids(sendAudience(send({ functionId: "wedding" }), guests))).toEqual(["all", "replied"]);
    expect(ids(sendAudience(send({ purpose: "reminder" }), guests))).toEqual(["all", "haldi-only"]);
    // Replied to the wedding, but not to the haldi
    expect(ids(sendAudience(send({ purpose: "reminder", functionId: "haldi" }), guests))).toEqual([
      "all",
      "haldi-only",
      "replied",
    ]);
  });
});
