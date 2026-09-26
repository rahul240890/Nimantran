import { describe, expect, it, vi } from "vitest";
import { createToastStore } from "./toast-store";

describe("toast store", () => {
  it("adds, dismisses and removes toasts, notifying listeners", () => {
    const store = createToastStore();
    const listener = vi.fn();
    store.subscribe(listener);

    const id = store.show({ title: "Saved" });
    expect(store.getSnapshot()).toMatchObject([
      { id, title: "Saved", tone: "neutral", open: true },
    ]);

    store.dismiss(id);
    expect(store.getSnapshot()[0]?.open).toBe(false);

    store.remove(id);
    expect(store.getSnapshot()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("keeps only the newest toasts", () => {
    const store = createToastStore(2);
    store.show({ title: "One" });
    store.show({ title: "Two" });
    store.show({ title: "Three" });
    expect(store.getSnapshot().map((item) => item.title)).toEqual(["Two", "Three"]);
  });
});
