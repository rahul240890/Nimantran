import { describe, expect, it } from "vitest";
import { describeError } from "./report";

describe("describeError", () => {
  it("keeps an error's message and stack", () => {
    const described = describeError(new Error("boom"));
    expect(described.message).toBe("boom");
    expect(described.stack).toContain("boom");
  });

  it("names what failed to load instead of [object Event]", () => {
    const script = { nodeName: "SCRIPT", src: "https://shubhdwar.in/_next/static/chunks/a.js?v=1" };
    const event = new Event("error");
    Object.defineProperty(event, "target", { value: script });
    expect(describeError(event).message).toBe(
      "error event on SCRIPT https://shubhdwar.in/_next/static/chunks/a.js",
    );
  });

  it("gives only the host for other files, whose paths can name people", () => {
    const photo = {
      nodeName: "IMG",
      src: "https://x.supabase.co/storage/v1/object/photos/u1/a.jpg",
    };
    const event = new Event("error");
    Object.defineProperty(event, "target", { value: photo });
    expect(describeError(event).message).toBe("error event on IMG https://x.supabase.co");
  });
});
