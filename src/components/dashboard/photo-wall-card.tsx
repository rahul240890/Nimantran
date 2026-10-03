import { Images } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getText } from "@/i18n/server";
import { photoWallText } from "@/i18n/copy/photo-wall";
import { getAccount } from "@/lib/auth/server";
import { hostWallCount } from "@/lib/invites/photo-wall";

/** The dashboard's way into the photo wall (Step 24), with how many photos guests shared. */
export async function PhotoWallCard({ inviteId }: { inviteId: string }) {
  const { albumCopy } = await getText(photoWallText);
  const account = await getAccount();
  const count = account ? await hostWallCount(account, inviteId).catch(() => 0) : 0;
  return (
    <Card role="region" aria-labelledby="photo-wall-heading" className="gap-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold/15 text-accent-text">
          <Images aria-hidden className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="photo-wall-heading" className="font-semibold">
            {albumCopy.card.title}
          </h2>
          <p className="text-sm text-ink-muted">{albumCopy.card.body(count)}</p>
        </div>
      </div>
      <Button asChild variant="secondary" className="w-full">
        <Link href={`/invites/${inviteId}/photos`}>{albumCopy.card.action}</Link>
      </Button>
    </Card>
  );
}
