import { emptyWaitlist, type WaitlistDraft } from "./schema";

const KEY = "nimantran-waitlist-draft";

function readSaved(): WaitlistDraft {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as unknown;
    if (!saved || typeof saved !== "object") return emptyWaitlist;
    const value = saved as Partial<Record<keyof WaitlistDraft, unknown>>;
    return {
      name: String(value.name ?? ""),
      email: String(value.email ?? ""),
      phone: String(value.phone ?? ""),
      occasion: String(value.occasion ?? ""),
    };
  } catch {
    return emptyWaitlist;
  }
}

/**
 * The waitlist form's text, kept in session storage so a refresh or a trip back
 * never loses it. Shaped for useSyncExternalStore: the server renders the empty form,
 * and the browser swaps in the saved draft right after hydration.
 */
export function createDraftStore() {
  let current: WaitlistDraft | null = null;
  const listeners = new Set<() => void>();

  const save = (next: WaitlistDraft | null) => {
    current = next ?? emptyWaitlist;
    try {
      if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
      else sessionStorage.removeItem(KEY);
    } catch {
      // Storage blocked: the draft still lives in memory for this visit
    }
    listeners.forEach((listener) => listener());
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get(): WaitlistDraft {
      current ??= readSaved();
      return current;
    },
    getServer: (): WaitlistDraft => emptyWaitlist,
    set: (next: WaitlistDraft) => save(next),
    clear: () => save(null),
  };
}

export const waitlistDraft = createDraftStore();
