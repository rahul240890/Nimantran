import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { uiText } from "@/i18n/copy/ui";

const en = uiText.en.uiStrings.notFound;
const hi = uiText.hi.uiStrings.notFound;

/** "Page not found" in both languages, for unknown addresses and pages that aren't yours. */
export function NotFoundView() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <BrandMark className="size-20 text-accent-text" />
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[2rem] leading-tight">{en.title}</h1>
          <p className="text-ink-muted">{en.body}</p>
        </div>
        <div lang="hi" className="flex flex-col gap-2">
          <p className="font-display text-2xl leading-tight">{hi.title}</p>
          <p className="text-ink-muted">{hi.body}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/">{en.home}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/hi" lang="hi">
              {hi.home}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
