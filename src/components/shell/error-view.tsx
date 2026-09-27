"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { useLocale, useText } from "@/i18n/client";
import { homePath } from "@/i18n/locales";
import { uiText } from "@/i18n/copy/ui";
import { reportError } from "@/lib/errors/report";

/** What a page shows when it fails to draw: an apology, Try again, and a way home. */
export function ErrorView({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { uiStrings } = useText(uiText);
  const locale = useLocale();
  const copy = uiStrings.error;
  useEffect(() => {
    reportError(error, "boundary");
  }, [error]);
  return (
    <main id="main" className="grid min-h-[70dvh] flex-1 place-items-center px-4 py-16">
      <div role="alert" className="flex max-w-md flex-col items-center gap-5 text-center">
        <BrandMark className="size-20 text-accent-text" />
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[2rem] leading-tight">{copy.title}</h1>
          <p className="text-ink-muted">{copy.body}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={retry}>{copy.retry}</Button>
          <Button asChild variant="secondary">
            <Link href={homePath(locale)}>{copy.home}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
