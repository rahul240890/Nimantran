import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newDraft } from "./draft";
import { createDraftStore, DRAFT_KEY } from "./store";

describe("invite draft store", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("autosaves shortly after a change, and a reload picks it up", () => {
    const store = createDraftStore({ delay: 500, now: () => 42 });
    store.update((draft) => ({ ...draft, content: { first: "Meera" } }));
    expect(store.get().save).toBe("saving");
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    vi.advanceTimersByTime(500);
    expect(store.get().save).toBe("saved");
    const reloaded = createDraftStore().get().draft;
    expect(reloaded.content.first).toBe("Meera");
    expect(reloaded.updatedAt).toBe(42);
  });

  it("writes at once when flushed", () => {
    const store = createDraftStore();
    store.update((draft) => ({ ...draft, templateId: "kasavu" }));
    store.flush();
    expect(createDraftStore().get().draft.templateId).toBe("kasavu");
  });

  it("keeps a stable snapshot between changes and tells listeners", () => {
    const store = createDraftStore();
    expect(store.get()).toBe(store.get());
    const listener = vi.fn();
    store.subscribe(listener);
    store.update((draft) => draft);
    vi.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(store.get()).toBe(store.get());
  });

  it("starts over when reset", () => {
    const store = createDraftStore();
    store.update((draft) => ({ ...draft, content: { first: "Meera" } }));
    store.flush();
    store.reset(newDraft("emerald"));
    expect(store.get().draft.templateId).toBe("emerald");
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("ignores a damaged saved value", () => {
    localStorage.setItem(DRAFT_KEY, "{not json");
    expect(createDraftStore().get().draft).toEqual(newDraft());
  });
});
