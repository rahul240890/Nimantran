import { describe, expect, it } from "vitest";
import { wallWindow } from "./rules";

describe("the photo wall's window", () => {
  const dates = ["2026-12-12", "2026-12-11"];

  it("opens on the morning of the first function", () => {
    expect(wallWindow(dates, 30, "2026-12-10")).toEqual({ state: "soon", opensOn: "2026-12-11" });
    expect(wallWindow(dates, 30, "2026-12-11")).toEqual({ state: "open", closesOn: "2027-01-11" });
  });

  it("closes the edition's album days after the last function", () => {
    expect(wallWindow(dates, 30, "2027-01-11").state).toBe("open");
    expect(wallWindow(dates, 30, "2027-01-12")).toEqual({ state: "closed" });
  });

  it("stays open forever on the bundle, and is off without an album", () => {
    expect(wallWindow(dates, Infinity, "2036-01-01")).toEqual({ state: "open", closesOn: null });
    expect(wallWindow(dates, 0, "2026-12-11")).toEqual({ state: "off" });
  });

  it("is open from the start when the invite has no dates", () => {
    expect(wallWindow(["", "soon"], 30, "2026-10-02")).toEqual({ state: "open", closesOn: null });
  });
});
