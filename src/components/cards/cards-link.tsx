import { Images } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cardsText } from "@/i18n/copy/cards";
import { getText } from "@/i18n/server";

/** On the share page: the way to the invitation's save-the-date and thank-you cards. */
export async function CardsLink({ inviteId }: { inviteId: string }) {
  const { cardsCopy } = await getText(cardsText);
  return (
    <Card className="gap-4 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-2 font-semibold">
          <Images aria-hidden className="size-5 shrink-0 text-accent-text" />
          {cardsCopy.open}
        </h2>
        <p className="text-sm text-ink-muted">{cardsCopy.openBody}</p>
      </div>
      <Button asChild variant="secondary" className="self-start">
        <Link href={`/invites/${inviteId}/cards`}>{cardsCopy.openShort}</Link>
      </Button>
    </Card>
  );
}
