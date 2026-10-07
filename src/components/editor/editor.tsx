"use client";

import type { InviteFormat } from "@/lib/editor/formats";
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
  Smartphone,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AccountMenu } from "@/components/account/account-menu";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { Stepper } from "@/components/ui/stepper";
import { ThemeMenu } from "@/components/ui/theme-toggle";
import { toast } from "@/components/ui/toast";
import type { CategoryId } from "@/lib/categories/catalog";
import {
  EDITOR_STEPS,
  newDraft,
  withCategory,
  functionOrder,
  withGalleryChoice,
  withTradition,
  type EditorStep,
  type InviteDraft,
} from "@/lib/editor/draft";
import { stepErrors } from "@/lib/editor/draft-checks";
import { deletePhoto } from "@/lib/editor/photos";
import { inviteDraft, type SaveState } from "@/lib/editor/store";
import { switchDraft, syncDraft, syncStore, type SyncState } from "@/lib/invites/sync";
import type { SuiteId } from "@/lib/suites/catalog";
import type { TraditionId } from "@/lib/traditions/schema";
import type { TemplateId } from "@/lib/templates/schema";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PublishButton } from "@/components/publish/publish-button";
import { PreviewStage } from "./preview-stage";
import { DesignBar } from "./design-bar";
import { DETAIL_STEPS, SectionMark, SectionRow, isDetailStep } from "./detail-sections";
import "@/components/invitation/type/fonts.css";
import { CoupleStep } from "./steps/couple-step";
import { DesignStep } from "./steps/design-step";
import { ExtrasStep } from "./steps/extras-step";
import { LanguageStep } from "./steps/language-step";
import { FunctionsStep } from "./steps/functions-step";
import { OccasionStep } from "./steps/occasion-step";
import { PreviewStep } from "./steps/preview-step";
import { TraditionStep } from "./steps/tradition-step";
import { forgetPhotoUrl } from "./use-photo-urls";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { uiText } from "@/i18n/copy/ui";

const WIDE = "(min-width: 64rem)";

/** The steps where words are typed, which get the floating live preview on phones. */
const MINI_STEPS = new Set<EditorStep>(["language", "couple", "functions", "extras"]);

/*
 * The progress shows three stages, not eight steps: pick a design (occasion, tradition,
 * design and the card's language), add your details (names, functions, photos and music,
 * as three parts of one page), then preview and share. A host arriving from the gallery
 * starts on the design stage's last step, the language, with the design already chosen.
 */
const STAGES = ["design", "details", "preview"] as const;
const SETUP = new Set<EditorStep>(["occasion", "tradition", "design", "language"]);
/** The steps where the design is still being picked; past them, it shows with a way back. */
const PICKING = new Set<EditorStep>(["occasion", "tradition", "design"]);
const stageOf = (step: EditorStep) => (SETUP.has(step) ? 0 : isDetailStep(step) ? 1 : 2);
const MINI_HIDDEN_KEY = "shubhdwar-editor-mini-hidden";

/** Whether the floating preview is hidden, remembered on this device. */
const miniStore = (() => {
  const listeners = new Set<() => void>();
  // Kept here too, so hiding still works for the visit when storage is blocked
  let hidden: boolean | null = null;
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    get(): boolean {
      if (hidden === null) {
        try {
          hidden = localStorage.getItem(MINI_HIDDEN_KEY) === "1";
        } catch {
          hidden = false;
        }
      }
      return hidden;
    },
    set(next: boolean) {
      hidden = next;
      try {
        localStorage.setItem(MINI_HIDDEN_KEY, next ? "1" : "0");
      } catch {
        // Storage blocked: it stays as chosen for this visit
      }
      listeners.forEach((listener) => listener());
    },
  };
})();

const SYNC_DELAY = 1200;

/** The page the phone shows as each step opens: the one that step fills in. */
function stepPage(draft: InviteDraft, step: EditorStep): string {
  if (step === "functions") {
    const first = functionOrder(draft).suggested.find((id) => draft.functions[id].included);
    return first ? `fn-${first}` : "cover";
  }
  return "cover";
}

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
  const { editor, syncCopy } = useText(editorText);
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
  initialTemplate,
  initialCategory,
  initialTradition = null,
  initialSuite = null,
  initialFormat = null,
  signedIn = false,
  initialInvite = null,
  fresh = false,
  missing = false,
}: {
  initialTemplate: TemplateId | null;
  initialCategory: CategoryId | null;
  /** A tradition picked on its page (?tradition=<id>). */
  initialTradition?: TraditionId | null;
  /** A design chosen in the gallery (?suite=<id>, with its card, occasion and tradition). */
  initialSuite?: SuiteId | null;
  /** The gallery's Scene or Story version of that design (?format=scene). */
  initialFormat?: InviteFormat | null;
  /** Drafts save to the account as well as the device. */
  signedIn?: boolean;
  /** An invite opened from My invites (?invite=<id>). */
  initialInvite?: InviteDraft | null;
  /** Start a new invite, keeping the open one in the account (?new=1). */
  fresh?: boolean;
  /** ?invite= named an invite this person can't open. */
  missing?: boolean;
}) {
  const { editor, previewCopy, stepCopy: baseSteps, namesCopy, syncCopy } = useText(editorText);
  const { publishCopy } = useText(publishText);
  const { uiStrings } = useText(uiText);
  const { draft, save } = useSyncExternalStore(
    inviteDraft.subscribe,
    inviteDraft.get,
    inviteDraft.getServer,
  );
  // Occasions beyond weddings name the names step their own way ("Whose birthday is it?")
  const ownNames = namesCopy.steps[draft.categoryId as keyof typeof namesCopy.steps];
  const stepCopy = ownNames
    ? { ...baseSteps, couple: { ...baseSteps.couple, ...ownNames } }
    : baseSteps;
  const sync = useSyncExternalStore(syncStore.subscribe, syncStore.get, syncStore.getServer);
  const update = inviteDraft.update;
  const router = useRouter();
  const wide = useMediaQuery(WIDE);
  const still = useReducedMotion();

  const step = draft.step;
  const index = EDITOR_STEPS.indexOf(step);
  const last = index === EDITOR_STEPS.length - 1;

  const [page, setPage] = useState(() => stepPage(draft, step));
  const [checking, setChecking] = useState<EditorStep | null>(null);
  const [sheet, setSheet] = useState(false);
  const miniHidden = useSyncExternalStore(miniStore.subscribe, miniStore.get, () => false);
  const mini = !wide && MINI_STEPS.has(step) && !sheet;
  const miniShown = mini && !miniHidden;
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
      if (initialSuite) {
        // The gallery's Use this design, straight to the names. Signed in, an invite already
        // under way stays in My invites and a new one starts; on this device alone, the
        // choice applies to the open invite and every word typed is kept.
        const choice = {
          category: initialCategory,
          tradition: initialTradition,
          suite: initialSuite,
          template: initialTemplate,
          format: initialFormat ?? undefined,
        };
        const current = inviteDraft.get().draft;
        const switched =
          signedIn && current.updatedAt !== 0 && !initialInvite && !fresh
            ? await switchDraft(null, {
                signedIn,
                fresh: () => withGalleryChoice(newDraft(), choice),
              })
            : false;
        if (!switched) update((draft) => withGalleryChoice(draft, choice));
        router.replace("/create", { scroll: false });
        return;
      }
      if (!initialTemplate && !initialCategory && !initialTradition) return;
      if (inviteDraft.get().draft.updatedAt !== 0) return;
      update((draft) => {
        let next = initialCategory ? withCategory(draft, initialCategory) : draft;
        if (draft.step === "occasion") next = { ...next, step: "design" };
        if (initialTemplate) next = { ...next, templateId: initialTemplate };
        if (initialTradition) next = withTradition(next, initialTradition);
        return next;
      });
    })();
  }, [
    initialInvite,
    fresh,
    missing,
    signedIn,
    initialTemplate,
    initialCategory,
    initialTradition,
    initialSuite,
    initialFormat,
    update,
    router,
    syncCopy,
  ]);

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
      setPage(stepPage(inviteDraft.get().draft, next));
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
    toast({ title: previewCopy.cleared, tone: "success" });
  };

  const props = { draft, update, errors, goTo };
  const copy = stepCopy[step];
  const preview = (className: string, mini = false) => (
    <PreviewStage
      mini={mini}
      draft={draft}
      page={page}
      onPage={setPage}
      update={update}
      className={className}
    />
  );

  // The step's title: numbered within the details, under a small label elsewhere
  const intro = (number: number | null) => (
    <div key={`${step}-title`} className="flex animate-rise flex-col gap-2 pb-6">
      <div className={cn("flex flex-col gap-2", miniShown && "max-lg:pe-[6.5rem]")}>
        {number === null ? (
          <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            {copy.eyebrow}
          </p>
        ) : (
          <p className="flex items-center gap-2.5 font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            <SectionMark number={number} active />
            {copy.eyebrow}
          </p>
        )}
        <h1
          ref={heading}
          tabIndex={-1}
          className="font-display text-[2rem] leading-[1.08] outline-none sm:text-[2.6rem]"
        >
          {copy.title}
        </h1>
      </div>
      <p className="max-w-xl text-ink-muted">{copy.intro}</p>
    </div>
  );
  const content = (
    <div key={step} className="flex-1 animate-rise pb-8">
      {step === "occasion" && <OccasionStep {...props} />}
      {step === "tradition" && <TraditionStep {...props} />}
      {step === "design" && <DesignStep {...props} />}
      {step === "language" && <LanguageStep {...props} />}
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
        {/* On phones the floating preview sits beside the progress and the chosen design */}
        <div className={cn(miniShown && "max-lg:pe-[6.5rem]")}>
          <Stepper
            steps={STAGES.map((id) => ({ id, label: editor.stages[id] }))}
            current={stageOf(step)}
            label={editor.progressLabel}
            progressText={editor.progress(stageOf(step) + 1, STAGES.length)}
            doneLabel={editor.done}
          />
        </div>

        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-12">
          <div className="flex min-w-0 flex-col xl:w-full xl:max-w-3xl xl:justify-self-center">
            {/* Past the design: what was chosen, with the way back to change it */}
            {!PICKING.has(step) && (
              <DesignBar
                draft={draft}
                onChange={() => goTo("design")}
                className={cn("mb-5", miniShown && "max-lg:pe-[6.5rem]")}
              />
            )}
            <form
              ref={form}
              noValidate
              // Filling in a function brings its page up in the phone, the names the cover
              onFocusCapture={(event) => {
                const target = (event.target as HTMLElement).closest<HTMLElement>(
                  "[data-page-target]",
                );
                if (target?.dataset.pageTarget) setPage(target.dataset.pageTarget);
              }}
              onSubmit={(event) => {
                event.preventDefault();
                advance();
              }}
              className="flex flex-1 flex-col"
            >
              {isDetailStep(step) ? (
                // The details: three parts of one page, the open one in full, the others
                // folded to a line that says what's in them
                <div
                  role="group"
                  aria-label={editor.sections.label}
                  className="flex flex-1 flex-col gap-3 pb-8"
                >
                  {DETAIL_STEPS.map((part, at) =>
                    part === step ? (
                      <div
                        key={part}
                        aria-current="step"
                        className="flex flex-col border-y border-line bg-surface/70 px-4 pt-5 max-sm:-mx-4 sm:rounded-xl sm:border sm:p-6 sm:shadow-raised lg:p-8"
                      >
                        {intro(at + 1)}
                        {content}
                      </div>
                    ) : (
                      <div key={part}>
                        <SectionRow
                          draft={draft}
                          part={part}
                          current={step}
                          label={stepCopy[part].label}
                          onOpen={() => goTo(part)}
                        />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <>
                  {intro(null)}
                  {/* Phones and tablets see the card inline on the last step */}
                  {!wide && last && (
                    <section aria-label={editor.preview} className="mb-8">
                      {preview("h-[min(78svh,40rem)] min-h-[28rem]")}
                    </section>
                  )}
                  {content}
                </>
              )}

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
                <div className="ms-auto flex min-w-0 items-center gap-2 sm:gap-3">
                  {!wide && !last && (
                    <Sheet open={sheet} onOpenChange={setSheet}>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          leadingIcon={<Eye aria-hidden />}
                          className={index > 0 ? "max-[479px]:px-3" : "max-[359px]:px-3"}
                        >
                          {/* With Back beside it, only the eye fits on narrow phones */}
                          <span
                            className={index > 0 ? "max-[479px]:sr-only" : "max-[359px]:sr-only"}
                          >
                            {editor.showPreview}
                          </span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent title={editor.previewTitle} closeLabel={editor.close}>
                        {preview("h-[min(70dvh,34rem)] min-h-[24rem]")}
                      </SheetContent>
                    </Sheet>
                  )}
                  {last && (
                    <PublishButton
                      draft={draft}
                      signedIn={signedIn}
                      onNotReady={() => toast({ title: publishCopy.finishFirst, tone: "error" })}
                    />
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

          {/*
            Phones: while the words are being typed, a small live phone floats at the top
            corner showing the page being edited; tapping it opens the preview large
          */}
          {mini && (
            <div className="fixed end-3 top-[calc(env(safe-area-inset-top)+4.5rem)] z-30 animate-fade-in lg:hidden">
              {miniHidden ? (
                <button
                  type="button"
                  aria-label={editor.showLivePreview}
                  onClick={() => miniStore.set(false)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Smartphone aria-hidden className="size-5" />
                </button>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    aria-label={editor.livePreview}
                    onClick={() => setSheet(true)}
                    className="block h-[11.4rem] w-[5.4rem] cursor-pointer overflow-hidden rounded-[1rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {/* A guest-sized phone, shrunk, so the words wrap as they will for guests */}
                    <span className="block h-[25.35rem] w-48 origin-top-left scale-[0.45]">
                      {preview("h-full", true)}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={editor.hideLivePreview}
                    onClick={() => miniStore.set(true)}
                    className="absolute -start-2.5 -top-2.5 grid size-7 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink shadow-raised before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <X aria-hidden className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

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
