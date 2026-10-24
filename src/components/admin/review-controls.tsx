"use client";

import { Check, Copy, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setReviewStatus } from "@/actions/reviews";
import { SocialIcon } from "@/components/brand/social-links";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { ReviewStatus } from "@/lib/reviews/store";

/** Show a review on the site, or take it off. */
export function ReviewControls({ id, status }: { id: string; status: ReviewStatus }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const set = (next: ReviewStatus) =>
    start(async () => {
      if (await setReviewStatus(id, next).catch(() => false)) router.refresh();
      else
        toast({ title: "Couldn't change it. Has the reviews migration been run?", tone: "error" });
    });
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "approved" && (
        <Button
          size="sm"
          loading={pending}
          leadingIcon={<Check aria-hidden />}
          onClick={() => set("approved")}
        >
          Show on the site
        </Button>
      )}
      {status !== "hidden" && (
        <Button
          size="sm"
          variant="secondary"
          loading={pending}
          leadingIcon={<EyeOff aria-hidden />}
          onClick={() => set("hidden")}
        >
          Hide
        </Button>
      )}
    </div>
  );
}

/** The review link, to copy or send to a family on WhatsApp. */
export function AskForReview({ url }: { url: string }) {
  const message = `Namaste! Thank you for choosing Shubh for your invitation. Would you write a few words about it? It helps other families decide: ${url}`;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm break-all text-ink" data-review-link>
        {url}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          leadingIcon={<Copy aria-hidden />}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              toast({ title: "Link copied", tone: "success" });
            } catch {
              toast({ title: "Couldn't copy. Select the link and copy it.", tone: "error" });
            }
          }}
        >
          Copy link
        </Button>
        <Button asChild size="sm" variant="secondary">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon channel="whatsapp" className="text-success" />
            Send on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
