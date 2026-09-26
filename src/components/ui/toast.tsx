"use client";

import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { Toast as ToastPrimitive } from "radix-ui";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { toastStore, type ToastItem, type ToastTone } from "@/lib/toast-store";

export { toast } from "@/lib/toast-store";

const icons: Record<ToastTone, typeof Info | null> = {
  neutral: null,
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
};

const iconTones: Record<ToastTone, string> = {
  neutral: "",
  success: "text-success",
  error: "text-danger",
  info: "text-accent-text",
};

function ToastCard({ item, closeLabel }: { item: ToastItem; closeLabel: string }) {
  const Icon = icons[item.tone];
  return (
    <ToastPrimitive.Root
      open={item.open}
      onOpenChange={(open) => {
        if (!open) toastStore.dismiss(item.id);
      }}
      onAnimationEnd={() => {
        if (!item.open) toastStore.remove(item.id);
      }}
      duration={item.duration ?? (item.tone === "error" ? 8000 : 5000)}
      type={item.tone === "error" ? "foreground" : "background"}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-lg border border-line bg-surface p-4 pe-12 text-ink shadow-overlay",
        "data-[state=closed]:animate-toast-out data-[state=open]:animate-toast-in",
        "data-[swipe=cancel]:translate-y-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-toast-out data-[swipe=move]:translate-y-(--radix-toast-swipe-move-y)",
        item.tone === "error" && "border-danger/40",
      )}
    >
      {/* A thin gold line along the top edge, like foil on card stock */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-4 top-0 h-px",
          item.tone === "error"
            ? "bg-danger/60"
            : "bg-linear-to-r from-transparent via-marigold to-transparent",
        )}
      />
      {Icon ? (
        <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconTones[item.tone])} />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <ToastPrimitive.Title className="font-semibold">{item.title}</ToastPrimitive.Title>
        {item.description ? (
          <ToastPrimitive.Description className="text-sm text-ink-muted">
            {item.description}
          </ToastPrimitive.Description>
        ) : null}
        {item.action ? (
          <ToastPrimitive.Action
            altText={item.action.altText}
            onClick={item.action.onClick}
            className="-ms-2 mt-1 inline-flex min-h-11 w-fit cursor-pointer items-center rounded-md px-2 font-semibold text-accent-text underline-offset-4 hover:underline"
          >
            {item.action.label}
          </ToastPrimitive.Action>
        ) : null}
      </div>
      <ToastPrimitive.Close
        aria-label={closeLabel}
        className="absolute end-1.5 top-1.5 grid size-11 cursor-pointer place-items-center rounded-full text-ink-muted hover:bg-surface-2 hover:text-ink"
      >
        <X aria-hidden className="size-4.5" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

type ToasterProps = {
  /** From translations. */
  closeLabel: string;
  /** Screen-reader name of the notification area, from translations. */
  regionLabel: string;
};

/** Mount once near the root. Bottom-centre on phones, bottom-right on desktop; swipe down to dismiss. */
export function Toaster({ closeLabel, regionLabel }: ToasterProps) {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );

  return (
    <ToastPrimitive.Provider swipeDirection="down" label={regionLabel}>
      {items.map((item) => (
        <ToastCard key={item.id} item={item} closeLabel={closeLabel} />
      ))}
      <ToastPrimitive.Viewport className="fixed inset-x-0 bottom-0 z-[60] m-0 flex list-none flex-col gap-3 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] outline-none sm:start-auto sm:w-[26rem] sm:p-6" />
    </ToastPrimitive.Provider>
  );
}
