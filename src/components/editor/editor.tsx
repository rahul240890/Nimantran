"use client";

import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AccountMenu } from "@/components/account/account-menu";
import { Logo } from "@/components/brand/logo";
import { HeldBackNotice } from "@/components/editions/held-back";
import { PublishButton } from "@/components/publish/publish-button";
import { Button } from "@/components/ui/button";
import { ThemeMenu } from "@/components/ui/theme-toggle";
import { toast } from "@/components/ui/toast";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { uiText } from "@/i18n/copy/ui";
import { designPageHref, editingHref, partHref } from "@/lib/editor/design-page";
import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import { deletePhoto } from "@/lib/editor/photos";
import { inviteDraft } from "@/lib/editor/store";
import { funnel } from "@/lib/funnel";
import { switchDraft, syncDraft, syncStore } from "@/lib/invites/sync";
import { useMediaQuery } from "@/lib/use-media-query";
import "@/components/invitation/type/fonts.css";
import { DesignBar } from "./design-bar";
import { PreviewStage } from "./preview-stage";
import { SaveStatus } from "./save-status";
import { PreviewStep } from "./steps/preview-step";
import { forgetPhotoUrl, useDropLostPhotos } from "./use-photo-urls";

const WIDE = "(min-width: 64rem)";
const SYNC_DELAY = 1200;

/** Opening the link dialog survives the remount that leaving ?invite= in the address causes. */
let publishOnArrival = false;
/** The same for the opening gate's dialog (?gate=1, from the guest preview or the video). */
let gateOnArrival = false;

const noSubscribe = () => () => {};

/**
 * Preview and publish (/create). An invite is written and changed on its design's own page
 * (owner, 2026-10-24: one editor for everything), so this is only where it's seen as guests
 * will see it, shown to the family, paid for and published. A draft that isn't ready for
 * its preview goes back to its design's page, or to the gallery while no design is chosen.
 */
export function Editor({
  signedIn = false,
  initialInvite = null,
  fresh = false,
  missing = false,
  openPublish = false,
  openGate = false,
  openPreview = false,
  openEdit = false,
}: {
  /** Drafts save to the account as well as the device. */
  signedIn?: boolean;
  /** An invite opened from My invites to publish it or change its gate (?invite=<id>). */
  initialInvite?: InviteDraft | null;
  /** Start a new invite, keeping the open one in the account (?new=1). */
  fresh?: boolean;
  /** ?invite= named an invite this person can't open. */
  missing?: boolean;
  /** Back from choosing a package (?publish=1): open the invite's Publish dialog. */
  openPublish?: boolean;
  /** Change the opening gate (?gate=1): the summary with the gate's dialog open. */
  openGate?: boolean;
  /** Back to the invite's preview (?preview=1, from its video). */
  openPreview?: boolean;
  /** Change the invite: its design's page, with this device's copy if it's the newer. */
  openEdit?: boolean;
}) {
  const { editor, previewCopy, stepCopy, syncCopy } = useText(editorText);
  const { publishCopy } = useText(publishText);
  const { uiStrings } = useText(uiText);
  const { draft, save } = useSyncExternalStore(
    inviteDraft.subscribe,
    inviteDraft.get,
    inviteDraft.getServer,
  );
  const sync = useSyncExternalStore(syncStore.subscribe, syncStore.get, syncStore.getServer);
  const update = inviteDraft.update;
  const router = useRouter();
  const locale = useLocale();
  const wide = useMediaQuery(WIDE);

  // The preview waits for this device's draft, and for an invite named in the address
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const [arriving, setArriving] = useState(() => Boolean(initialInvite || fresh || missing));
  const ready = hydrated && !arriving;
  const previewing = ready && draft.step === "preview";
  useDropLostPhotos(draft, update, ready);

  const [page, setPage] = useState("cover");
  const [autoPublish, setAutoPublish] = useState(() => publishOnArrival);
  const [autoGate, setAutoGate] = useState(() => gateOnArrival);
  useEffect(() => {
    publishOnArrival = false;
    gateOnArrival = false;
  }, []);
  const previewCounted = useRef(false);
  useEffect(() => {
    if (!previewing || previewCounted.current) return;
    previewCounted.current = true;
    funnel("Preview reached", { category: draft.categoryId });
  }, [previewing, draft.categoryId]);

  // Opening an invite from the account, or starting another, happens once per visit
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      let editing = false;
      try {
        if (missing) toast({ title: syncCopy.missing, tone: "error" });
        if (!initialInvite && !fresh) return;
        const switched = await switchDraft(initialInvite, { signedIn });
        if (!switched) toast({ title: syncCopy.switchFailed, tone: "error" });
        else if (openEdit) {
          editing = true;
          router.replace(designPageHref(inviteDraft.get().draft));
        } else if (openPublish || openGate || openPreview) {
          inviteDraft.update((current) => ({ ...current, step: "preview" }), { touch: false });
          if (openPublish) {
            publishOnArrival = true;
            setAutoPublish(true);
          } else if (openGate) {
            gateOnArrival = true;
            setAutoGate(true);
          }
        }
      } finally {
        // An invite that isn't theirs: My invites, with the message, rather than the designs
        if (missing) {
          editing = true;
          router.replace("/invites");
        } else if ((initialInvite || fresh) && !editing) {
          router.replace("/create", { scroll: false });
        }
        // On the way to another page, the preview never shows
        if (!editing) setArriving(false);
      }
    })();
  }, [
    initialInvite,
    fresh,
    missing,
    openPublish,
    openGate,
    openPreview,
    openEdit,
    signedIn,
    router,
    syncCopy,
  ]);

  // Anything but the preview is written on the design's own page
  useEffect(() => {
    if (ready && draft.step !== "preview") router.replace(editingHref(draft, locale));
  }, [ready, draft, locale, router]);

  // Save to the account a moment after each change, and when the connection comes back
  useEffect(() => {
    if (!signedIn || draft.updatedAt === 0) return;
    const timer = setTimeout(() => void syncDraft(), SYNC_DELAY);
    const onOnline = () => void syncDraft();
    window.addEventListener("online", onOnline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", onOnline);
    };
  }, [signedIn, draft.updatedAt]);

  // Leaving for the preview or the design's page saves at once, so the page arriving never
  // opens the account's copy a save behind
  useEffect(
    () => () => {
      if (signedIn && inviteDraft.get().draft.updatedAt !== 0) void syncDraft();
    },
    [signedIn],
  );

  // Write straight away if the tab is closed or hidden mid-edit
  useEffect(() => {
    const flush = () => {
      inviteDraft.flush();
      if (signedIn && inviteDraft.get().draft.updatedAt !== 0) void syncDraft();
    };
    const onVisibility = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [signedIn]);

  // In the account, the invite stays in My invites; otherwise it and its photos are cleared.
  // Either way the next one starts in the gallery.
  const keepsInvite = signedIn && draft.remoteId !== null;
  const reset = async () => {
    const fresh = () => newDraft(draft.templateId, draft.categoryId);
    if (keepsInvite) {
      if (!(await switchDraft(null, { signedIn, fresh }))) {
        toast({ title: syncCopy.switchFailed, tone: "error" });
        return;
      }
    } else {
      for (const photo of draft.photos) {
        forgetPhotoUrl(photo.id);
        void deletePhoto(photo.id).catch(() => {
          // Already gone, or storage blocked
        });
      }
      inviteDraft.reset(fresh());
    }
    toast({ title: previewCopy.cleared, tone: "success" });
  };

  const copy = stepCopy.preview;
  const preview = (className: string) => (
    <PreviewStage
      draft={draft}
      page={page}
      onPage={setPage}
      update={update}
      className={className}
    />
  );

  return (
    // Clipped sideways as a safety net: nothing here may widen the page on a phone
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <header className="z-40 border-b border-line bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md sm:sticky sm:top-0">
        <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="max-[359px]:[&>span]:sr-only" />
            <span className="hidden font-label text-xs tracking-[0.24em] text-ink-muted uppercase md:inline">
              {editor.headerLabel}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <SaveStatus
              state={save}
              sync={sync}
              signedIn={signedIn}
              edited={draft.updatedAt !== 0}
            />
            <ThemeMenu labels={uiStrings.theme} />
            <AccountMenu compact />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col gap-6 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {previewing ? (
          <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-12">
            <div className="flex min-w-0 flex-col xl:w-full xl:max-w-3xl xl:justify-self-center">
              {/* A live invite's change its package doesn't cover stays off the live copy */}
              {signedIn && <HeldBackNotice draft={draft} />}
              {/* The chosen design, with the way to another: the design's page, where the
                  others for the occasion sit under the form */}
              <DesignBar
                draft={draft}
                onChange={() => router.push(`${designPageHref(draft)}#more-designs`)}
                update={update}
                className="mb-5"
              />
              <div className="flex animate-rise flex-col gap-2 pb-6">
                <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                  {copy.eyebrow}
                </p>
                <h1 className="font-display text-[1.75rem] leading-[1.08] sm:text-[2.15rem]">
                  {copy.title}
                </h1>
                <p className="max-w-xl text-ink-muted">{copy.intro}</p>
              </div>
              {/* Phones and tablets see the card inline */}
              {!wide && (
                <section aria-label={editor.preview} className="mb-8">
                  {preview("h-[min(78svh,40rem)] min-h-[28rem]")}
                </section>
              )}
              <div className="flex-1 animate-rise pb-8">
                <PreviewStep
                  draft={draft}
                  update={update}
                  errors={{}}
                  goTo={(part) => router.push(partHref(draft, part, locale))}
                  onReset={() => void reset()}
                  signedIn={signedIn}
                  keepsInvite={keepsInvite}
                  openGate={autoGate}
                />
              </div>

              {/* Back to the design's page, and Publish, stay in reach on phones */}
              <div className="sticky bottom-0 z-30 -mx-4 mt-auto flex items-center gap-3 border-t border-line bg-paper/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-t-lg lg:border-x lg:px-4">
                <Button
                  variant="secondary"
                  leadingIcon={<ArrowLeft aria-hidden className="rtl:rotate-180" />}
                  onClick={() => router.push(designPageHref(draft))}
                  className="max-[359px]:min-w-11 max-[359px]:px-3"
                >
                  {/* Only the arrow on the narrowest phones, so Publish still fits */}
                  <span className="max-[359px]:sr-only">{editor.back}</span>
                </Button>
                <div className="ms-auto flex min-w-0 items-center gap-2 sm:gap-3">
                  <PublishButton
                    key={autoPublish ? "back" : "first"}
                    autoOpen={autoPublish}
                    draft={draft}
                    signedIn={signedIn}
                    onNotReady={() => toast({ title: publishCopy.finishFirst, tone: "error" })}
                  />
                </div>
              </div>
            </div>

            {/* Desktop: the card stays beside the summary, live */}
            <aside
              aria-label={editor.preview}
              className="hidden lg:sticky lg:top-24 lg:mb-8 lg:flex lg:h-[min(calc(100dvh-8rem),48rem)] lg:min-h-[32rem] lg:flex-col"
            >
              {wide && preview("h-full")}
            </aside>
          </div>
        ) : (
          <div
            role="status"
            className="flex flex-1 animate-fade-in flex-col items-center justify-center gap-3 pb-24 text-ink-muted"
          >
            <LoaderCircle aria-hidden className="size-6 animate-spin motion-still:animate-none" />
            <span className="text-sm">{editor.opening}</span>
          </div>
        )}
      </main>
    </div>
  );
}
