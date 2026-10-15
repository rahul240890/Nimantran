import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Email reminders",
  robots: { index: false, follow: false },
};

const one = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

/**
 * Where "Stop these reminders" in an email lands. Asks before stopping, so a mail scanner
 * opening the link changes nothing; the button posts to /api/emails/stop.
 */
export default async function StopRemindersPage({ searchParams }: PageProps<"/emails/stop">) {
  const params = await searchParams;
  const userId = one(params.u);
  const token = one(params.t);
  const done = one(params.done) === "1";
  const failed = one(params.error) === "1" || (!done && (!userId || !token));

  const title = done
    ? "Reminders stopped"
    : failed
      ? "This link didn't work"
      : "Stop reminder emails?";
  const body = done
    ? "We won't send you reminders about unfinished invitations again. Receipts for payments still come to you."
    : failed
      ? "Open the link from the email again, or write to us and we'll stop them for you."
      : "We send one reminder when an invitation is left unfinished. Receipts for payments will still come to you.";

  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-paper px-4 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-lg border border-line bg-surface p-6 text-center shadow-raised sm:p-8">
        <BrandMark className="size-16 text-accent-text" />
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[2rem] leading-tight text-ink">{title}</h1>
          <p className="text-ink-muted">{body}</p>
        </div>
        {!done && !failed ? (
          <form
            method="post"
            action={`/api/emails/stop?${new URLSearchParams({ u: userId, t: token })}`}
          >
            <Button type="submit">Stop reminders</Button>
          </form>
        ) : null}
        <Button asChild variant="secondary">
          <Link href="/">Go to the home page</Link>
        </Button>
      </div>
    </main>
  );
}
