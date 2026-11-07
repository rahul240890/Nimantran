/*
 * The designs this browser opened lately (owner, 2026-11-07: the home page shows them again
 * as Recently viewed). Kept in this browser only, newest first; nothing leaves it.
 */

/** The browser storage key, under the site's older name like the others. */
export const RECENT_KEY = "nimantran-recent-designs";

/** The most designs kept. */
export const RECENT_KEPT = 10;

/** The stored list, read leniently: design ids only, each once. */
export function parseRecent(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((id): id is string => typeof id === "string"))].slice(
      0,
      RECENT_KEPT,
    );
  } catch {
    return [];
  }
}

/** The list with this design first. */
export function withRecent(list: readonly string[], id: string): string[] {
  return [id, ...list.filter((other) => other !== id)].slice(0, RECENT_KEPT);
}

const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(RECENT_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Notes that this browser opened a design. */
export function rememberDesign(id: string): void {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(withRecent(parseRecent(read()), id)));
  } catch {
    // Private browsing or storage full: nothing to remember
  }
  for (const listener of listeners) listener();
}

/** For useSyncExternalStore: the stored list as text, so it compares by value. */
export function subscribeRecent(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === RECENT_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const recentSnapshot = read;
export const recentServerSnapshot = (): string => "";
