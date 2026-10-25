"use client";

import { CopyPlus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";

type Picked = { href: string; name: string };

/**
 * Another design picked under a live invite's page asks first (owner, 2026-10-25): a new
 * invitation with every detail carried over, or this live invite in the new design, its
 * link and guests kept. Until then the row's links changed the live invite without saying,
 * and a design its package didn't cover was held back while the preview called it live.
 * A draft not yet live just takes the design, as before.
 */
export function DesignChoice({ live, children }: { live: boolean; children: ReactNode }) {
  const { quickCopy } = useText(editorText);
  const router = useRouter();
  const [picked, setPicked] = useState<Picked | null>(null);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!live || event.defaultPrevented || event.button !== 0) return;
    // A new tab or window opens the page as it is
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      "[data-suggested-designs] a[href]",
    );
    if (!link) return;
    event.preventDefault();
    const name = link.querySelector("[data-design-name]")?.textContent?.trim() ?? "";
    setPicked({ href: link.getAttribute("href")!, name });
  };

  // Without the invite in the address, the design's page starts a new invite from this
  // one, already filled in (gallery-start.ts)
  const asNew = (href: string) => {
    const url = new URL(href, window.location.origin);
    url.searchParams.delete("invite");
    return `${url.pathname}${url.search}`;
  };

  const option =
    "flex w-full cursor-pointer items-start gap-3 rounded-lg border p-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div onClickCapture={onClick}>
      {children}
      <Dialog open={picked !== null} onOpenChange={(open) => !open && setPicked(null)}>
        <DialogContent
          title={quickCopy.pickTitle(picked?.name ?? "")}
          closeLabel={quickCopy.pickClose}
        >
          <div className="flex flex-col gap-3" data-design-choice>
            <button
              type="button"
              className={cn(option, "border-marigold/60 bg-marigold/10 hover:bg-marigold/20")}
              onClick={() => picked && router.push(asNew(picked.href))}
            >
              <CopyPlus aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
              <span className="flex flex-col gap-1">
                <span className="font-semibold">{quickCopy.pickNew}</span>
                <span className="text-sm text-ink-muted">{quickCopy.pickNewBody}</span>
              </span>
            </button>
            <button
              type="button"
              className={cn(option, "border-line bg-surface hover:bg-surface-2")}
              onClick={() => picked && router.push(picked.href)}
            >
              <Send aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-muted" />
              <span className="flex flex-col gap-1">
                <span className="font-semibold">{quickCopy.pickLive}</span>
                <span className="text-sm text-ink-muted">{quickCopy.pickLiveBody}</span>
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
