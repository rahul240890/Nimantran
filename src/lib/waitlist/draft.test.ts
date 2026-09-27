import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDraftStore, emptyWaitlist } from "./draft";

const draft = { name: "Meera", email: "meera@example.com", phone: "", occasion: "wedding" };

describe("waitlist draft store", () => {
  beforeEach(() => sessionStorage.clear());

  it("starts empty, then remembers what was typed across a new page load", () => {
    const first = createDraftStore();
    expect(first.get()).toEqual(emptyWaitlist);
    first.set(draft);
    // A fresh store stands in for a reload
    expect(createDraftStore().get()).toEqual(draft);
  });

  it("returns the same object until something changes, as React needs", () => {
    const store = createDraftStore();
    expect(store.get()).toBe(store.get());
    const listener = vi.fn();
    store.subscribe(listener);
    store.set(draft);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.get()).toBe(store.get());
  });

  it("forgets the draft once cleared", () => {
    const store = createDraftStore();
    store.set(draft);
    store.clear();
    expect(store.get()).toEqual(emptyWaitlist);
    expect(createDraftStore().get()).toEqual(emptyWaitlist);
  });

  it("ignores a damaged saved value", () => {
    sessionStorage.setItem("nimantran-waitlist-draft", "{not json");
    expect(createDraftStore().get()).toEqual(emptyWaitlist);
  });
});
