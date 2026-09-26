import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { getText } from "@/i18n/server";
import { publishText } from "@/i18n/copy";

export default async function InviteNotFound() {
  const { guestCopy } = await getText(publishText);
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <BrandMark className="h-20 w-18 text-accent-text" />
        <h1 className="font-display text-[2rem] leading-tight">{guestCopy.notFoundTitle}</h1>
        <p className="text-ink-muted">{guestCopy.notFoundBody}</p>
        <Button asChild variant="secondary">
          <Link href="/">{guestCopy.home}</Link>
        </Button>
      </div>
    </main>
  );
}
