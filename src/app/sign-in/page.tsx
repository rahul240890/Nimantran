import { Check, PenLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { SignInForm } from "@/components/account/sign-in-form";
import { TemplateCover } from "@/components/brand/template-cover";
import { TiltCard } from "@/components/motion/tilt-card";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signInCopy } from "@/content/account";
import { safeNext } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { getAccount } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: signInCopy.metaTitle,
  description: signInCopy.metaDescription,
  robots: { index: false, follow: false },
};

/** Three designs fanned out like cards in a hand, beside the form on wide screens. */
function CardFan() {
  const cards = [
    { id: "rose", className: "-rotate-12 -translate-x-[58%] translate-y-6" },
    { id: "emerald", className: "rotate-12 translate-x-[58%] translate-y-6" },
    { id: "marigold", className: "z-10" },
  ] as const;
  return (
    <div aria-hidden className="relative mx-auto grid h-80 w-48 place-items-center">
      {cards.map((card) => (
        <div key={card.id} className={`absolute w-44 ${card.className}`}>
          <TiltCard maxTilt={6} className="rounded-md shadow-float">
            <TemplateCover id={card.id} className="rounded-md" />
          </TiltCard>
        </div>
      ))}
    </div>
  );
}

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const mode = authMode();
  if (mode !== "off" && (await getAccount())) redirect(next);
  const error = params.error === "google" ? "google" : undefined;

  return (
    <PageTransition>
      <AccountShell menu={false}>
        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16 lg:px-8">
          <section
            aria-hidden
            className="relative hidden flex-col items-center gap-10 overflow-hidden rounded-xl border border-line bg-surface-2/60 px-8 py-12 text-center lg:flex"
          >
            <CardFan />
            <div className="flex max-w-sm flex-col gap-3">
              <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                {signInCopy.side.eyebrow}
              </p>
              <p className="font-display text-3xl leading-tight">{signInCopy.side.title}</p>
              <ul className="mt-2 flex flex-col gap-2 text-start text-ink-muted">
                {signInCopy.side.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-success" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Card className="w-full gap-7 p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                {signInCopy.eyebrow}
              </p>
              <h1 className="font-display text-[2rem] leading-[1.08] sm:text-[2.4rem]">
                {mode === "off" ? signInCopy.off.title : signInCopy.title}
              </h1>
              <p className="text-ink-muted">
                {mode === "off" ? signInCopy.off.body : signInCopy.intro}
              </p>
            </div>
            {mode === "off" ? (
              <Button asChild>
                <Link href="/create">
                  <PenLine aria-hidden />
                  {signInCopy.off.action}
                </Link>
              </Button>
            ) : (
              <SignInForm next={next} preview={mode === "preview"} initialError={error} />
            )}
          </Card>
        </div>
      </AccountShell>
    </PageTransition>
  );
}
