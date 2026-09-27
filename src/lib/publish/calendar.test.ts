import { describe, expect, it } from "vitest";
import { entryTimes, googleCalendarUrl, icsCalendar, type CalendarEntry } from "./calendar";

const wedding: CalendarEntry = {
  uid: "wedding-1@shubhdwar",
  title: "Wedding: Aarav & Meera",
  date: "2026-12-12",
  time: "19:30",
  location: "The Leela Palace, Udaipur; Lake Pichola",
  description: "Dress code: Festive ethnic",
  url: "https://example.com/i/aarav-weds-meera",
};

describe("entryTimes", () => {
  it("reads times as India Standard Time", () => {
    const { start, end } = entryTimes(wedding);
    expect(start.toISOString()).toBe("2026-12-12T14:00:00.000Z");
    expect(end.toISOString()).toBe("2026-12-12T17:00:00.000Z");
  });

  it("moves early-morning functions to the previous UTC day", () => {
    expect(entryTimes({ date: "2027-01-01", time: "04:00" }).start.toISOString()).toBe(
      "2026-12-31T22:30:00.000Z",
    );
  });

  it("ends a muhurat exactly when the family says", () => {
    const { start, end } = entryTimes({ date: "2026-12-12", time: "09:47", endTime: "10:31" });
    expect(start.toISOString()).toBe("2026-12-12T04:17:00.000Z");
    expect(end.toISOString()).toBe("2026-12-12T05:01:00.000Z");
  });

  it("carries an end time past midnight into the next day", () => {
    const { end } = entryTimes({ date: "2026-12-12", time: "20:00", endTime: "01:00" });
    expect(end.toISOString()).toBe("2026-12-12T19:30:00.000Z");
  });
});

describe("icsCalendar", () => {
  const ics = icsCalendar(
    [wedding, { ...wedding, uid: "std@shubhdwar", time: "", title: "Save the date" }],
    new Date("2026-09-26T00:00:00Z"),
  );

  it("writes timed and all-day events with escaped text", () => {
    expect(ics).toContain("DTSTART:20261212T140000Z\r\n");
    expect(ics).toContain("DTEND:20261212T170000Z\r\n");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261212\r\nDTEND;VALUE=DATE:20261213\r\n");
    expect(ics).toContain("LOCATION:The Leela Palace\\, Udaipur\\; Lake Pichola");
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("folds long lines at 75 bytes", () => {
    const long = icsCalendar([{ ...wedding, description: "शुभ विवाह ".repeat(20) }]);
    for (const line of long.split("\r\n")) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});

describe("googleCalendarUrl", () => {
  it("fills Google's event template", () => {
    const url = new URL(googleCalendarUrl(wedding));
    expect(url.searchParams.get("dates")).toBe("20261212T140000Z/20261212T170000Z");
    expect(url.searchParams.get("text")).toBe("Wedding: Aarav & Meera");
    expect(url.searchParams.get("details")).toContain("https://example.com/i/aarav-weds-meera");
  });
});
