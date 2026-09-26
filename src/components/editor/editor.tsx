"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  CloudCheck,
  CloudOff,
  Eye,
  HardDrive,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AccountMenu } from "@/components/account/account-menu";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { Stepper } from "@/components/ui/stepper";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "@/components/ui/toast";
import { editor, previewCopy, stepCopy, syncCopy } from "@/content/editor";
import type { QualityChoice } from "@/content/engine-review";
import type { CategoryId } from "@/lib/categories/catalog";
import {
  EDITOR_STEPS,
  newDraft,
  stepErrors,
  withCategory,
  type EditorStep,
  type InviteDraft,
} from "@/lib/editor/draft";
import { deletePhoto } from "@/lib/editor/photos";
import { inviteDraft, type SaveState } from "@/lib/editor/store";
import { switchDraft, syncDraft, syncStore, type SyncState } from "@/lib/invites/sync";
import type { TemplateId } from "@/lib/templates/schema";
import { uiStrings } from "@/lib/ui-strings";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PreviewStage } from "./preview-stage";
import { CoupleStep } from "./steps/couple-step";
import { DesignStep } from "./steps/design-step";
import { ExtrasStep } from "./steps/extras-step";
import { FunctionsStep } from "./steps/functions-step";
import { OccasionStep } from "./steps/occasion-step";
import { PreviewStep } from "./steps/preview-step";
import { forgetPhotoUrl } from "./use-photo-urls";

const WIDE = "(min-width: 64rem)";

/** The card opens on the steps where the host is writing what's inside it. */
const opensOn: Record<EditorStep, boolean> = {
  occasion: false,
  design: false,
  couple: true,
  functions: true,
  extras: false,
  preview: false,
};

const SYNC_DELAY = 1200;

/** Where the draft is saved: this device, or the account once signed in. */
function SaveStatus({
  state,
  sync,
  signedIn,
  edited,
}: {
  state: SaveState;
  sync: SyncState;
  signedIn: boolean;
  edited: boolean;
}) {
  if (signedIn && state !== "unavailable" && sync !== "signed-out") {
    const busy = state === "saving" || sync === "syncing";
    const key = busy ? "syncing" : sync === "offline" ? "offline" : edited ? sync : "idle";
    const icon =
      key === "syncing" ? (
        <LoaderCircle className="size-4 animate-spin motion-still:animate-none" />
      ) : key === "synced" ? (
        <CloudCheck className="size-4 text-success" />
      ) : key === "offline" ? (
        <CloudOff className="size-4 text-warning" />
      ) : (
        <Cloud className="size-4" />
      );
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
        <span aria-hidden>{icon}</span>
        <span className="truncate max-[419px]:sr-only">{syncCopy[key]}</span>
      </span>
    );
  }
  const icon =
    state === "saving" ? (
      <LoaderCircle className="size-4 animate-spin motion-still:animate-none" />
    ) : state === "saved" ? (
      <Check className="size-4 text-success" strokeWidth={2.5} />
    ) : state === "unavailable" ? (
      <CloudOff className="size-4 text-warning" />
    ) : (
      <HardDrive className="size-4" />
    );
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
      <span aria-hidden>{icon}</span>
      <span className="truncate max-[419px]:sr-only">{editor.save[state]}</span>
    </span>
  );
}

export function Editor({
  quality,
  initialTemplate,
  initialCategory,
  signedIn = false,
  initialInvite = null,
  fresh = false,
  missing = false,
}: {
  quality: QualityChoice;
  initialTemplate: TemplateId | null;
  initialCategory: CategoryId | null;
  /** Drafts save to the account as well as the device. */
  signedIn?: boolean;
  /** An invite opened from My invites (?invite=<id>). */
  initialInvite?: InviteDraft | null;
  /** Start a new invite, keeping the open one in the account (?new=1). */
  fresh?: boolean;
  /** ?invite= named an invite this person can't open. */
  missing?: boolean;
}) {
  const { draft, save } = useSyncExternalStore(
    inviteDraft.subscribe,
    inviteDraft.get,
    inviteDraft.getServer,
  );
  const sync = useSyncExternalStore(syncStore.subscribe, syncStore.get, syncStore.getServer);
  const update = inviteDraft.update;
  const router = useRouter();
  const wide = useMediaQuery(WIDE);
  const still = useReducedMotion();

  const step = draft.step;
  const index = EDITOR_STEPS.indexOf(step);
  const last = index === EDITOR_STEPS.length - 1;

  const [cardOpen, setCardOpen] = useState(opensOn[step]);
  const [checking, setChecking] = useState<EditorStep | null>(null);
  const errors = checking === step ? stepErrors(draft, step) : {};
  const errorCount = Object.keys(errors).length;

  // Opening an invite from the account, or starting another, happens once per visit.
  // Then an occasion or design picked on the landing page starts a fresh invite with it,
  // on the design step: the occasion is chosen (a design alone means a wedding).
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      if (missing) toast({ title: syncCopy.missing, tone: "error" });
      if (initialInvite || fresh) {
        const switched = await switchDraft(initialInvite, { signedIn });
        if (!switched) toast({ title: syncCopy.switchFailed, tone: "error" });
      }
      if (initialInvite || fresh || missing) router.replace("/create", { scroll: false });
      if (!initialTemplate && !initialCategory) return;
      if (inviteDraft.get().draft.updatedAt !== 0) return;
      update((draft) => {
        let next = initialCategory ? withCategory(draft, initialCategory) : draft;
        if (draft.step === "occasion") next = { ...next, step: "design" };
        if (initialTemplate) next = { ...next, templateId: initialTemplate };
        return next;
      });
    })();
  }, [initialInvite, fresh, missing, signedIn, initialTemplate, initialCategory, update, router]);

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

  // After moving between steps, bring the new step's heading into view and focus it
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const target = heading.current;
    if (!target) return;
    target.focus({ preventScroll: true });
    const top = target.getBoundingClientRect().top + window.scrollY - 140;
    if (window.scrollY > top) window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  }, [step, still]);

  const goTo = useCallback(
    (next: EditorStep) => {
      moved.current = true;
      setChecking(null);
      setCardOpen(opensOn[next]);
      update((current) => ({ ...current, step: next }));
    },
    [update],
  );

  // Leave a step only when it's complete; otherwise point at the first problem
  const form = useRef<HTMLFormElement>(null);
  const advance = () => {
    const problems = stepErrors(draft, step);
    if (Object.keys(problems).length > 0) {
      setChecking(step);
      requestAnimationFrame(() => {
        const first = form.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"], [data-invalid]',
        );
        first?.focus();
        first?.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" });
      });
      return;
    }
    const next = EDITOR_STEPS[index + 1];
    if (next) goTo(next);
  };

  // In the account, the invite stays in My invites; otherwise it and its photos are cleared
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
    moved.current = true;
    setCardOpen(false);
    toast({ title: previewCopy.cleared, tone: "success" });
  };

  const props = { draft, update, errors, goTo };
  const copy = stepCopy[step];
  const preview = (className: string) => (
    <PreviewStage
      draft={draft}
      quality={quality}
      open={cardOpen}
      onOpenChange={setCardOpen}
      className={className}
    />
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="z-40 border-b border-line bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md sm:sticky sm:top-0">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="max-[359px]:[&>span]:sr-only" />
            <span className="hidden font-label text-xs tracking-[0.24em] text-ink-muted uppercase md:inline">
              {editor.headerLabel}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <SaveStatus
              state={save}
              sync={sync}
              signedIn={signedIn}
              edited={draft.updatedAt !== 0}
            />
            <ThemeToggle labels={uiStrings.theme} />
            <AccountMenu compact />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <Stepper
          steps={EDITOR_STEPS.map((id) => ({ id, label: stepCopy[id].label }))}
          current={index}
          label={editor.progressLabel}
          progressText={editor.progress(index + 1, EDITOR_STEPS.length)}
          doneLabel={editor.done}
        />

        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col">
            <div key={step} className="flex animate-rise flex-col gap-2 pb-6">
              <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                {copy.eyebrow}
              </p>
              <h1
                ref={heading}
                tabIndex={-1}
                className="font-display text-[2rem] leading-[1.08] outline-none sm:text-[2.6rem]"
              >
                {copy.title}
              </h1>
              <p className="max-w-xl text-ink-muted">{copy.intro}</p>
            </div>

            {/* Phones and tablets see the card inline on the last step */}
            {!wide && last && (
              <section aria-label={editor.preview} className="mb-8">
                {preview("h-[min(78svh,40rem)] min-h-[28rem]")}
              </section>
            )}

            <form
              ref={form}
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                advance();
              }}
              className="flex flex-1 flex-col"
            >
              <div key={step} className="flex-1 animate-rise pb-8">
                {step === "occasion" && <OccasionStep {...props} />}
                {step === "design" && <DesignStep {...props} />}
                {step === "couple" && <CoupleStep {...props} />}
                {step === "functions" && <FunctionsStep {...props} />}
                {step === "extras" && <ExtrasStep {...props} />}
                {step === "preview" && (
                  <PreviewStep
                    {...props}
                    onReset={() => void reset()}
                    signedIn={signedIn}
                    keepsInvite={keepsInvite}
                  />
                )}
              </div>

              {errorCount > 0 && (
                <p
                  role="alert"
                  className="mb-3 rounded-md border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
                >
                  {editor.fixErrors(errorCount)}
                </p>
              )}

              {/* Back and Continue stay in reach on phones */}
              <div className="sticky bottom-0 z-30 -mx-4 mt-auto flex items-center gap-3 border-t border-line bg-paper/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-t-lg lg:border-x lg:px-4">
                {index > 0 ? (
                  <Button
                    variant="secondary"
                    leadingIcon={<ArrowLeft aria-hidden className="rtl:rotate-180" />}
                    onClick={() => goTo(EDITOR_STEPS[index - 1] ?? "design")}
                    className="max-[359px]:px-3.5"
                  >
                    {editor.back}
                  </Button>
                ) : null}
                <div className="ms-auto flex items-center gap-3">
                  {!wide && !last && (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          leadingIcon={<Eye aria-hidden />}
                          className="max-[359px]:px-3"
                        >
                          <span className="max-[359px]:sr-only">{editor.showPreview}</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent title={editor.previewTitle} closeLabel={editor.close}>
                        {preview("h-[min(70dvh,34rem)] min-h-[24rem]")}
                      </SheetContent>
                    </Sheet>
                  )}
                  {!last && (
                    <Button
                      type="submit"
                      trailingIcon={<ArrowRight aria-hidden className="rtl:rotate-180" />}
                      className="max-[359px]:px-4"
                    >
                      {index === EDITOR_STEPS.length - 2 ? (
                        <>
                          <span className="sm:hidden">{editor.next}</span>
                          <span className="max-sm:hidden">{editor.toPreview}</span>
                        </>
                      ) : (
                        editor.next
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Desktop: the card stays beside the form, live */}
          <aside
            aria-label={editor.preview}
            className="hidden lg:sticky lg:top-24 lg:mb-8 lg:flex lg:h-[min(calc(100dvh-8rem),48rem)] lg:min-h-[32rem] lg:flex-col"
          >
            {wide && preview("h-full")}
          </aside>
        </div>
      </main>
    </div>
  );
}
