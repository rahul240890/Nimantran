import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });

  it("lets later Tailwind classes win", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("knows text-ui is a size, so it keeps the colour beside it and replaces other sizes", () => {
    expect(cn("text-on-marigold font-semibold", "text-ui")).toBe(
      "text-on-marigold font-semibold text-ui",
    );
    expect(cn("text-sm", "text-ui")).toBe("text-ui");
  });
});
