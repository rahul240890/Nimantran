"use client";

import { Copy, LogIn, UsersRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { familyLink } from "@/actions/family";
import { SocialIcon } from "@/components/brand/social-links";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { funnel } from "@/lib/funnel";

/**
 * Before paying, a preview for the family (lib/invites/family-link.ts): one tap sends the
 * link on WhatsApp, or it can be copied. Signed out, the card says signing in makes one.
 */
export function FamilyPreview({
  signedIn,
  remoteId,
  signInNext = "/create",
}: {
  signedIn: boolean;
  /** The invite in the account; still null for a moment while a new one is saved. */
  remoteId: string | null;
  /** Where signing in comes back to: the design's page the card is on. */
  signInNext?: string;
}) {
  const { previewCopy } = useText(editorText);
  const [link, setLink] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Made as the card appears, so the WhatsApp button is a plain link a tap opens at once
  useEffect(() => {
    if (!remoteId) return;
    let live = true;
    familyLink(remoteId)
      .then((made) => {
        if (!live) return;
        setLink(made);
        setFailed(!made);
      })
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [remoteId]);

  return (
    <Card elevation="flat" className="gap-3 p-5" data-family-share>
      <p className="flex items-center gap-2 font-semibold">
        <UsersRound aria-hidden className="size-5 shrink-0 text-accent-text" />
        {previewCopy.familyTitle}
      </p>
      <p className="text-sm text-ink-muted">
        {signedIn ? previewCopy.familyBody : previewCopy.familySignInBody}
      </p>
      {!signedIn ? (
        <Button asChild variant="secondary" className="self-start">
          <Link href={`/sign-in?next=${encodeURIComponent(signInNext)}`}>
            <LogIn aria-hidden />
            {previewCopy.familySignIn}
          </Link>
        </Button>
      ) : failed ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {previewCopy.familyFailed}
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {link ? (
            <Button
              asChild
              className="h-auto min-h-12 max-w-full py-2 text-balance whitespace-normal"
            >
              <a
                href={`https://wa.me/?text=${encodeURIComponent(previewCopy.familyMessage(link))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => funnel("Family preview shared")}
              >
                <SocialIcon channel="whatsapp" />
                {previewCopy.familySend}
              </a>
            </Button>
          ) : (
            <Button loading disabled>
              {previewCopy.familySend}
            </Button>
          )}
          <Button
            variant="secondary"
            leadingIcon={<Copy aria-hidden />}
            disabled={!link}
            onClick={async () => {
              if (!link) return;
              try {
                await navigator.clipboard.writeText(link);
                toast({ title: previewCopy.familyCopied, tone: "success" });
                funnel("Family preview shared");
              } catch {
                toast({ title: link, tone: "info" });
              }
            }}
          >
            {previewCopy.familyCopy}
          </Button>
        </div>
      )}
    </Card>
  );
}
