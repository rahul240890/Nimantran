import { Images } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images aria-hidden className="size-5 text-accent-text" />
          {albumCopy.card.title}
        </CardTitle>
        <CardDescription>{albumCopy.card.body(count)}</CardDescription>
      </CardHeader>
      <CardBody>
        <Button asChild size="sm" variant="secondary" className="self-start">
          <Link href={`/invites/${inviteId}/photos`}>{albumCopy.card.action}</Link>
        </Button>
      </CardBody>
    </Card>
  );
}
