import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { hero } from "@/content/landing";
import { TEMPLATES } from "@/lib/templates/catalog";
import { Invitation, type EngineStatus } from "./invitation";

/*
 * jsdom has no WebGL, so these tests exercise the path weak phones take: the 2D card.
 * The 3D path is covered by the browser tests in e2e/engine.spec.ts.
 */
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function renderInvitation(props: Partial<Parameters<typeof Invitation>[0]> = {}) {
  return render(
    <TooltipProvider>
      <Invitation copy={hero.card} musicOnOpen={false} {...props} />
    </TooltipProvider>,
  );
}

describe("Invitation", () => {
  it("gives screen readers the invitation as text, and hides the pictures", () => {
    const { container } = renderInvitation();
    const text = container.querySelector(".sr-only");
    expect(text).toHaveTextContent("Aarav and Meera");
    expect(text).toHaveTextContent(hero.card.venue);
    expect(text?.closest("[aria-hidden]")).toBeNull();
    // Every copy of the words outside that block is decorative
    for (const node of screen.getAllByText(hero.card.venue)) {
      if (!text?.contains(node)) expect(node.closest("[aria-hidden]")).not.toBeNull();
    }
  });

  it("falls back to the 2D card without WebGL and says why", async () => {
    const onStatus = vi.fn<(status: EngineStatus) => void>();
    const { container } = renderInvitation({ onStatus });
    await act(async () => {});
    expect(container.firstElementChild).toHaveAttribute("data-engine-state", "fallback");
    expect(onStatus).toHaveBeenLastCalledWith({
      state: "fallback",
      level: "2d",
      detected: "2d",
      reason: "no-webgl",
    });
  });

  it("keeps a forced 3D level on the 2D card when the browser can't draw 3D", async () => {
    const onStatus = vi.fn<(status: EngineStatus) => void>();
    renderInvitation({ quality: "high", onStatus });
    await act(async () => {});
    expect(onStatus).toHaveBeenLastCalledWith(
      expect.objectContaining({ level: "2d", reason: "no-webgl" }),
    );
  });

  it("opens and closes from the button, and reports the change", () => {
    const onOpenChange = vi.fn();
    const { container } = renderInvitation({ onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: "Open invitation" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    const flat = container.querySelector<HTMLElement>("[style*='--open']")!;
    expect(flat.style.getPropertyValue("--open")).toBe("1");

    fireEvent.click(screen.getByRole("button", { name: "Close invitation" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(flat.style.getPropertyValue("--open")).toBe("0");
  });

  it("follows a controlled open state", () => {
    const { rerender } = renderInvitation({ open: true });
    expect(screen.getByRole("button", { name: "Close invitation" })).toBeInTheDocument();
    rerender(
      <TooltipProvider>
        <Invitation copy={hero.card} open={false} />
      </TooltipProvider>,
    );
    expect(screen.getByRole("button", { name: "Open invitation" })).toBeInTheDocument();
  });

  it("re-colours the 2D card with the chosen design's tokens", () => {
    const { container } = renderInvitation({ template: TEMPLATES.emerald });
    const flat = container.querySelector<HTMLElement>("[style*='--open']")!;
    expect(flat.style.getPropertyValue("--card-ivory")).toBe("var(--tpl-emerald-paper)");
  });

  it("offers music, and stays quiet where Web Audio is missing", async () => {
    renderInvitation();
    const play = screen.getByRole("button", { name: "Play music" });
    await act(async () => {
      fireEvent.click(play);
    });
    expect(screen.getByRole("button", { name: "Play music" })).toBeInTheDocument();
  });
});
