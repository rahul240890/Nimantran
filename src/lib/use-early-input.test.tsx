import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useEarlyInput } from "./use-early-input";

/** The server's search box, as it is on the page before the app draws. */
function serverBox(value: string) {
  const box = document.createElement("input");
  box.id = "early-search";
  box.value = value;
  document.body.append(box);
  return box;
}

function Search({
  take,
  whileDrawing,
}: {
  take: (typed: string) => void;
  whileDrawing?: () => void;
}) {
  useEarlyInput("early-search", take);
  whileDrawing?.();
  return null;
}

describe("useEarlyInput", () => {
  afterEach(() => {
    cleanup();
    document.getElementById("early-search")?.remove();
  });

  it("searches what was typed before the app drew", () => {
    serverBox("kayal");
    const take = vi.fn();
    render(<Search take={take} />);
    expect(take).toHaveBeenCalledExactlyOnceWith("kayal");
  });

  it("keeps words typed while the app draws its own box in place of the server's", () => {
    const box = serverBox("ka");
    const take = vi.fn();
    // On a slow phone the keys go on into the server's box until the app replaces it
    render(
      <Search
        take={take}
        whileDrawing={() => {
          box.value = "kayal";
          box.remove();
        }}
      />,
    );
    expect(take).toHaveBeenCalledExactlyOnceWith("kayal");
  });

  it("keeps what a box the app took over held at first", () => {
    const box = serverBox("kayal");
    const take = vi.fn();
    render(<Search take={take} whileDrawing={() => (box.value = "")} />);
    expect(take).toHaveBeenCalledExactlyOnceWith("kayal");
  });

  it("does nothing when nothing was typed", () => {
    serverBox(" ");
    const take = vi.fn();
    render(<Search take={take} />);
    expect(take).not.toHaveBeenCalled();
  });
});
