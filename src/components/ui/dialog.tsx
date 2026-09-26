"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

function Overlay() {
  return (
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim backdrop-blur-[3px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
  );
}

function CloseButton({ label }: { label: string }) {
  return (
    <DialogPrimitive.Close
      aria-label={label}
      className="absolute end-2 top-2 grid size-11 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <X aria-hidden className="size-5" />
    </DialogPrimitive.Close>
  );
}

type ContentProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Screen-reader name of the close button, from translations. */
  closeLabel: string;
  /** Buttons along the bottom. On phones they stack, primary first. */
  footer?: ReactNode;
};

/** A focused task over the page. Focus is trapped inside and returns to the trigger on close. */
export function DialogContent({
  title,
  description,
  closeLabel,
  footer,
  className,
  children,
  ...props
}: ContentProps) {
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
        <DialogPrimitive.Content
          className={cn(
            "pointer-events-auto relative flex max-h-[calc(100dvh-24px)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-overlay outline-none",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
            className,
          )}
          {...(description ? {} : { "aria-describedby": undefined })}
          {...props}
        >
          <div className="flex flex-col gap-2 px-5 pe-14 pt-6 sm:px-7 sm:pt-7">
            <DialogPrimitive.Title className="font-display text-2xl leading-tight">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-ink-muted">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
          {footer ? (
            <div className="flex flex-col-reverse gap-3 border-t border-line bg-paper/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              {footer}
            </div>
          ) : null}
          <CloseButton label={closeLabel} />
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

type SheetContentProps = ContentProps & {
  /** bottom: slides up, best on phones. end: slides in from the side, best for panels on desktop. */
  side?: "bottom" | "end";
};

/** A panel that slides in from the bottom or side edge. Same focus rules as Dialog. */
export function SheetContent({
  title,
  description,
  closeLabel,
  footer,
  side = "bottom",
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-surface text-ink shadow-overlay outline-none",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-xl border-t border-line pb-[env(safe-area-inset-bottom)] data-[state=closed]:animate-sheet-up-out data-[state=open]:animate-sheet-up-in sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-xl sm:-translate-x-1/2",
          side === "end" &&
            "inset-y-0 end-0 w-[min(28rem,calc(100vw-2.5rem))] border-s border-line data-[state=closed]:animate-sheet-left-out data-[state=open]:animate-sheet-left-in rtl:[--sheet-dir:-1]",
          className,
        )}
        {...(description ? {} : { "aria-describedby": undefined })}
        {...props}
      >
        {side === "bottom" ? (
          <span
            aria-hidden
            className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-line-strong"
          />
        ) : null}
        <div className="flex flex-col gap-2 px-5 pe-14 pt-5 sm:px-7 sm:pt-6">
          <DialogPrimitive.Title className="font-display text-2xl leading-tight">
            {title}
          </DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="text-ink-muted">
              {description}
            </DialogPrimitive.Description>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
        {footer ? (
          <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            {footer}
          </div>
        ) : null}
        <CloseButton label={closeLabel} />
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
