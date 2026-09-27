import type { ReactNode } from "react";

export type ToastTone = "neutral" | "success" | "error" | "info";

export type ToastInput = {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds on screen. Errors default to longer so they can be read. */
  duration?: number;
  action?: { label: string; altText: string; onClick: () => void };
};

export type ToastItem = ToastInput & { id: number; tone: ToastTone; open: boolean };

type Listener = () => void;

/** A tiny store so any code (not just components) can raise a toast. */
export function createToastStore(limit = 3) {
  let items: ToastItem[] = [];
  let nextId = 1;
  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((listener) => listener());

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => items,
    show(input: ToastInput): number {
      const id = nextId++;
      const item: ToastItem = { tone: "neutral", ...input, id, open: true };
      // Newest last; drop the oldest beyond the limit
      items = [...items, item].slice(-limit);
      emit();
      return id;
    },
    /** Starts the exit animation; `remove` runs after it ends. */
    dismiss(id: number) {
      items = items.map((item) => (item.id === id ? { ...item, open: false } : item));
      emit();
    },
    remove(id: number) {
      items = items.filter((item) => item.id !== id);
      emit();
    },
  };
}

export const toastStore = createToastStore();

export function toast(input: ToastInput): number {
  return toastStore.show(input);
}

const CARRIED_KEY = "nimantran-toast";

/**
 * A toast for the next page, when moving to another part of the site reloads the page
 * (the home pages and the app have separate root layouts). Plain words only.
 */
export function toastAfterNavigation(input: { title: string; tone?: ToastTone }) {
  try {
    sessionStorage.setItem(CARRIED_KEY, JSON.stringify(input));
  } catch {
    // Storage blocked: show it now instead
    toast(input);
  }
}

/** Shows a toast carried over from the previous page, once. */
export function showCarriedToast() {
  try {
    const raw = sessionStorage.getItem(CARRIED_KEY);
    if (!raw) return;
    sessionStorage.removeItem(CARRIED_KEY);
    const input = JSON.parse(raw) as { title?: unknown; tone?: ToastTone };
    if (typeof input.title === "string") toast({ title: input.title, tone: input.tone });
  } catch {
    // Nothing to show
  }
}
