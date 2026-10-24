"use client";

import { format, parseISO } from "date-fns";
import {
  CircleAlert,
  Clapperboard,
  Clock,
  Eye,
  ImageIcon,
  Images,
  MapPin,
  PartyPopper,
  Pencil,
  Shirt,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CategoryIcon } from "@/components/categories/category-icon";
import { EditionNotice } from "@/components/editions/edition-notice";
import { FamilyPreview } from "../family-preview";
import {
  draftCategory,
  draftTemplate,
  includedFunctions,
  type EditorStep,
} from "@/lib/editor/draft";
import { draftProblems } from "@/lib/editor/draft-checks";
import { inviteNames } from "@/lib/publish/describe";
import { inviteDraft } from "@/lib/editor/store";
import { syncDraft } from "@/lib/invites/sync";
import { formatTime } from "@/lib/time";
import { photoFailed, usePhotoUrls } from "../use-photo-urls";
import { GateSummary } from "../gate-chooser";
import { SecondLanguageSection } from "./second-language";
import type { StepProps } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { dateLocale } from "@/i18n/dates";
import { cardsText } from "@/i18n/copy/cards";
import { editorText } from "@/i18n/copy/editor";

function Section({
  title,
  step,
  goTo,
  children,
}: {
  title: string;
  step: EditorStep;
  goTo: (step: EditorStep) => void;
  children: ReactNode;
}) {
  const { previewCopy } = useText(editorText);
  const id = `summary-${step}`;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 border-t border-line pt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="font-display text-xl">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<Pencil aria-hidden />}
          onClick={() => goTo(step)}
          aria-label={previewCopy.editStep(title)}
        >
          {previewCopy.edit}
        </Button>
      </div>
      {children}
    </section>
  );
}

export function PreviewStep({
  draft,
  update,
  goTo,
  onReset,
  signedIn = false,
  keepsInvite = false,
  openGate = false,
}: StepProps & {
  onReset: () => void;
  /** Saved to the account as well as this device. */
  signedIn?: boolean;
  /** Starting over keeps this invite in My invites instead of clearing it. */
  keepsInvite?: boolean;
  /** Arrived to change the opening gate (?gate=1): its dialog opens straight away. */
  openGate?: boolean;
}) {
  const locale = useLocale();
  const { editor, extrasCopy, functionCopy, previewCopy, stepCopy } = useText(editorText);
  const problems = draftProblems(draft);
  const functions = includedFunctions(draft);
  const category = draftCategory(draft);
  const urls = usePhotoUrls(
    draft.photos.map((photo) => photo.id),
    draft.remoteId,
  );
  const raga = draftTemplate(draft).music.raga;
  const [confirming, setConfirming] = useState(false);
  const [gate, setGate] = useState(openGate);

  return (
    <div className="flex flex-col gap-6">
      {problems.length === 0 ? (
        <Card
          elevation="flat"
          className="flex-row items-start gap-4 border-success/40 bg-success/5 p-5"
        >
          <PartyPopper aria-hidden className="mt-0.5 size-6 shrink-0 text-success" />
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{draft.slug ? previewCopy.live : previewCopy.ready}</p>
            <p className="text-sm break-words text-ink-muted">
              {draft.slug
                ? previewCopy.liveBody(`/i/${draft.slug}`)
                : signedIn
                  ? previewCopy.readyBodyAccount
                  : previewCopy.readyBody}
            </p>
          </div>
        </Card>
      ) : (
        <Card elevation="flat" className="gap-3 border-warning/40 bg-warning/5 p-5">
          <p className="flex items-center gap-2 font-semibold">
            <CircleAlert aria-hidden className="size-5 shrink-0 text-warning" />
            {previewCopy.notReady}
          </p>
          <ul className="flex flex-wrap gap-2">
            {problems.map(({ step }) => (
              <li key={step}>
                <Button variant="secondary" size="sm" onClick={() => goTo(step)}>
                  {previewCopy.fix(stepCopy[step].label)}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {signedIn && draft.remoteId && problems.length === 0 && (
        <SeeAsGuest remoteId={draft.remoteId} published={Boolean(draft.slug)} />
      )}

      {/* Before it's live, the family can see it first */}
      {problems.length === 0 && !draft.slug && (
        <FamilyPreview signedIn={signedIn} remoteId={draft.remoteId} />
      )}

      {/* After seeing it once: guests can also read it in a second language */}
      <SecondLanguageSection draft={draft} update={update} />

      {signedIn && draft.remoteId && <EditionNotice draft={draft} inviteId={draft.remoteId} />}

      <Section title={previewCopy.occasionHeading} step="occasion" goTo={goTo}>
        <p className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-marigold/45 bg-marigold/10 text-accent-text">
            <CategoryIcon icon={category.icon} className="size-4.5" />
          </span>
          <span className="font-display text-lg leading-tight">{category.names[locale]}</span>
        </p>
      </Section>

      {/* The first screen guests see, changeable here without going back to the design */}
      <GateSummary draft={draft} update={update} open={gate} onOpenChange={setGate} />

      {/* The names lead the card, so they get their own check before sharing */}
      <Section title={previewCopy.namesHeading} step="couple" goTo={goTo}>
        <p className="font-display text-lg leading-tight break-words">
          {draft.content.first?.trim() ? inviteNames(draft) : "—"}
        </p>
      </Section>

      <Section title={previewCopy.functionsHeading} step="functions" goTo={goTo}>
        <ol className="flex flex-col gap-3">
          {functions.map((id) => {
            const fn = draft.functions[id];
            return (
              <li
                key={id}
                className="flex flex-col gap-1.5 rounded-md border border-line bg-surface-2/60 p-4"
              >
                <span className="font-display text-lg leading-tight">{functionCopy[id].name}</span>
                <span className="flex items-start gap-2 text-sm">
                  <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                  {fn.date
                    ? format(parseISO(fn.date), "EEE, d MMM yyyy", { locale: dateLocale[locale] })
                    : "—"}
                  {fn.time ? ` · ${formatTime(fn.time, dateLocale[locale])}` : ""}
                </span>
                <span className="flex items-start gap-2 text-sm break-words">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                  <span className="min-w-0">{fn.venue || "—"}</span>
                </span>
                {fn.dressCode && (
                  <span className="flex items-start gap-2 text-sm text-ink-muted">
                    <Shirt aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="sr-only">{previewCopy.dressCode}: </span>
                      {fn.dressCode}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Section>

      <Section title={previewCopy.photosHeading} step="photos" goTo={goTo}>
        {draft.photos.length === 0 ? (
          <p className="text-sm text-ink-muted">{previewCopy.noPhotos}</p>
        ) : (
          <ul className="grid grid-cols-4 gap-2">
            {draft.photos.map((photo, index) => (
              <li
                key={photo.id}
                className="aspect-square overflow-hidden rounded-sm border border-line bg-surface-2"
              >
                {urls[photo.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={urls[photo.id]}
                    src={urls[photo.id]}
                    alt={extrasCopy.photo(index + 1)}
                    // An account link that ran out is asked for again; a lost photo leaves
                    onError={() => photoFailed(photo.id)}
                    className="size-full object-cover"
                  />
                ) : (
                  // Still coming from the account
                  <span className="grid size-full place-items-center text-ink-faint">
                    <ImageIcon aria-hidden className="size-6" />
                    <span className="sr-only">{extrasCopy.photo(index + 1)}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={previewCopy.musicHeading} step="music" goTo={goTo}>
        <p className="text-sm">
          {draft.music.clip ? draft.music.clip.name : extrasCopy.ragaNames[raga]}
          {draft.music.playOnOpen ? ` · ${previewCopy.playsOnOpen}` : ""}
        </p>
      </Section>

      <div className="border-t border-line pt-5">
        <Dialog open={confirming} onOpenChange={setConfirming}>
          <DialogTrigger asChild>
            <Button variant="ghost">{previewCopy.startOver}</Button>
          </DialogTrigger>
          <DialogContent
            title={previewCopy.startOverTitle}
            closeLabel={editor.close}
            footer={
              <>
                <DialogClose asChild>
                  <Button variant="secondary">{previewCopy.cancel}</Button>
                </DialogClose>
                <Button
                  variant={keepsInvite ? "primary" : "danger"}
                  onClick={() => {
                    setConfirming(false);
                    onReset();
                  }}
                >
                  {keepsInvite ? previewCopy.startOverKeepConfirm : previewCopy.startOverConfirm}
                </Button>
              </>
            }
          >
            <p className="text-ink-muted">
              {keepsInvite ? previewCopy.startOverKeepBody : previewCopy.startOverBody}
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/** Where each button goes: a live invite's video is on its share page, with the link it ends on. */
function guestHref(id: string, page: "preview" | "video" | "cards", published: boolean) {
  return `/invites/${id}/${page === "video" && published ? "share" : page}`;
}

/**
 * Saves the invite, then opens it full screen exactly as a guest will see it, as the
 * invitation video (free to watch, with the mark until a package includes it), or as its
 * save-the-date and thank-you cards.
 */
function SeeAsGuest({ remoteId, published }: { remoteId: string | null; published: boolean }) {
  const { previewCopy } = useText(editorText);
  const { cardsCopy } = useText(cardsText);
  const router = useRouter();
  const [busy, setBusy] = useState<"preview" | "video" | "cards" | null>(null);
  // Fetch the pages' code and loading screens ahead, so a tap opens them straight away
  useEffect(() => {
    if (!remoteId) return;
    router.prefetch(guestHref(remoteId, "preview", published));
    router.prefetch(guestHref(remoteId, "video", published));
  }, [remoteId, published, router]);
  const open = async (page: "preview" | "video" | "cards") => {
    setBusy(page);
    await syncDraft();
    const id = inviteDraft.get().draft.remoteId;
    if (id) router.push(guestHref(id, page, published));
    else setBusy(null);
  };
  return (
    <Card elevation="flat" className="gap-3 border-marigold/45 bg-marigold/10 p-5">
      <p className="text-sm text-ink-muted">{previewCopy.seeAsGuestBody}</p>
      <div className="flex flex-wrap gap-3">
        <Button
          loading={busy === "preview"}
          disabled={busy !== null}
          leadingIcon={<Eye aria-hidden />}
          onClick={() => void open("preview")}
        >
          {previewCopy.seeAsGuest}
        </Button>
        <Button
          variant="secondary"
          loading={busy === "video"}
          disabled={busy !== null}
          leadingIcon={<Clapperboard aria-hidden />}
          onClick={() => void open("video")}
        >
          {previewCopy.watchVideo}
        </Button>
        <Button
          variant="secondary"
          loading={busy === "cards"}
          disabled={busy !== null}
          leadingIcon={<Images aria-hidden />}
          // A long name in some languages: it wraps on a narrow phone rather than run off
          className="h-auto min-h-12 max-w-full py-2 text-balance whitespace-normal"
          onClick={() => void open("cards")}
        >
          {cardsCopy.open}
        </Button>
      </div>
    </Card>
  );
}
