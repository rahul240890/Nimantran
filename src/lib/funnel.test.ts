import { afterEach, describe, expect, it, vi } from "vitest";

const track = vi.fn();
vi.mock("@vercel/analytics", () => ({ track: (...args: unknown[]) => track(...args) }));

const { funnel } = await import("./funnel");

describe("funnel steps", () => {
  afterEach(() => track.mockReset());

  it("counts a step with what it is about", () => {
    funnel("Checkout started", { plan: "celebration", tier: "royal" });
    expect(track).toHaveBeenCalledWith("Checkout started", { plan: "celebration", tier: "royal" });
  });

  it("never throws when analytics fails", () => {
    track.mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => funnel("Invite published")).not.toThrow();
  });
});
