import { newDraft, parseDraft, type InviteDraft } from "./draft";

export const DRAFT_KEY = "nimantran-invite-draft";

export type SaveState = "idle" | "saving" | "saved" | "unavailable";

type Snapshot = { draft: InviteDraft; save: SaveState };

function readSaved(): InviteDraft {
  try {
    return parseDraft(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null")) ?? newDraft();
  } catch {
    return newDraft();
  }
}

/**
 * The invite draft, autosaved to local storage a moment after each change so a refresh,
 * a closed tab or a trip away never loses it. Shaped for useSyncExternalStore: the server
 * renders a fresh draft and the browser swaps in the saved one right after hydration.
 */
export function createDraftStore({ delay = 500, now = () => Date.now() } = {}) {
  let snapshot: Snapshot | null = null;
  const serverSnapshot: Snapshot = { draft: newDraft(), save: "idle" };
  const listeners = new Set<() => void>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const emit = () => listeners.forEach((listener) => listener());

  const get = (): Snapshot => (snapshot ??= { draft: readSaved(), save: "idle" });

  const flush = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    const current = get();
    let save: SaveState = "saved";
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(current.draft));
    } catch {
      // Storage blocked or full: the draft still lives in memory for this visit
      save = "unavailable";
    }
    snapshot = { ...current, save };
    emit();
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get,
    getServer: () => serverSnapshot,
    update(change: (draft: InviteDraft) => InviteDraft) {
      const current = get();
      snapshot = { draft: { ...change(current.draft), updatedAt: now() }, save: "saving" };
      emit();
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, delay);
    },
    /** Writes now, for example before the page is hidden. */
    flush() {
      if (timer) flush();
    },
    reset(draft: InviteDraft = newDraft()) {
      if (timer) clearTimeout(timer);
      timer = null;
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Nothing saved to remove
      }
      snapshot = { draft, save: "idle" };
      emit();
    },
  };
}

export type DraftStore = ReturnType<typeof createDraftStore>;

export const inviteDraft = createDraftStore();
