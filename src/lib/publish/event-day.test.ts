import { describe, expect, it } from "vitest";
import { newDraft } from "@/lib/editor/draft";
import { eventDayStatus, functionWindow, guestGuide } from "./event-day";

const ist = (at: string) => Date.parse(`${at}:00+05:30`);

describe("when a function is on", () => {
  it("runs from its start to its end, past midnight when it ends earlier", () => {
    expect(functionWindow("2026-11-19", "19:30", "23:00")).toEqual({
      start: ist("2026-11-19T19:30"),
      end: ist("2026-11-19T23:00"),
    });
    expect(functionWindow("2026-11-19", "20:00", "01:00")?.end).toBe(ist("2026-11-20T01:00"));
  });

  it("lasts four hours without an end, and all day without a time", () => {
    expect(functionWindow("2026-11-19", "19:30", "")?.end).toBe(ist("2026-11-19T23:30"));
    expect(functionWindow("2026-11-19", "", "")).toEqual({
      start: ist("2026-11-19T00:00"),
      end: ist("2026-11-20T00:00"),
    });
    expect(functionWindow("", "19:30", "")).toBeNull();
  });
});

describe("the event-day banner", () => {
  const functions = [
    { kind: "haldi", window: functionWindow("2026-11-19", "10:00", "13:00") },
    { kind: "sangeet", window: functionWindow("2026-11-19", "19:30", "") },
    { kind: "wedding", window: functionWindow("2026-11-20", "18:30", "") },
    { kind: "roka", window: null },
  ];

  it("shows the function on now", () => {
    expect(eventDayStatus(functions, ist("2026-11-19T11:00"))).toEqual({
      kind: "haldi",
      state: "now",
    });
    expect(eventDayStatus(functions, ist("2026-11-19T23:00"))?.kind).toBe("sangeet");
  });

  it("shows what is later today between functions, and nothing on other days", () => {
    expect(eventDayStatus(functions, ist("2026-11-19T07:00"))).toEqual({
      kind: "haldi",
      state: "later",
    });
    expect(eventDayStatus(functions, ist("2026-11-19T15:00"))).toEqual({
      kind: "sangeet",
      state: "later",
    });
    // After the sangeet, the wedding is tomorrow: no banner yet
    expect(eventDayStatus(functions, ist("2026-11-19T23:45"))).toBeNull();
    expect(eventDayStatus(functions, ist("2026-11-12T12:00"))).toBeNull();
    expect(eventDayStatus(functions, ist("2026-11-20T00:30"))).toEqual({
      kind: "wedding",
      state: "later",
    });
  });

  it("picks the latest to start when two overlap", () => {
    const overlap = [
      { kind: "a", window: functionWindow("2026-11-19", "10:00", "18:00") },
      { kind: "b", window: functionWindow("2026-11-19", "12:00", "14:00") },
    ];
    expect(eventDayStatus(overlap, ist("2026-11-19T13:00"))?.kind).toBe("b");
  });
});

describe("the guest's guide to a function", () => {
  it("brings the parking, the host's pin and a map link pasted as the address", () => {
    const draft = newDraft();
    draft.functions.sangeet = {
      ...draft.functions.sangeet,
      included: true,
      date: "2026-11-19",
      time: "19:30",
      venue: "Rooftop lawns",
      address: "https://maps.app.goo.gl/AbC123",
    };
    draft.guide = { sangeet: { pin: "", parking: " Valet at the gate " } };
    const guide = guestGuide(draft, "sangeet");
    expect(guide.parking).toBe("Valet at the gate");
    // The link isn't printed as an address, but directions follow it
    expect(guide.address).toBe("");
    expect(guide.mapsUrl).toBe("https://maps.app.goo.gl/AbC123");
    expect(guide.mapEmbedUrl).toContain("q=Rooftop%20lawns");
    expect(guide.window?.start).toBe(ist("2026-11-19T19:30"));
  });
});
