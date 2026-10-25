"use client";

import { ArrowLeft, ArrowRight, Eye, LoaderCircle, PlayCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AccountMenu } from "@/components/account/account-menu";
import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/brand/social-links";
import { PreviewOffers } from "@/components/offers/preview-offers";
import { TrustLine } from "@/components/reviews/trust-line";
import { DesignPackages } from "@/components/pricing/design-packages";
import { TierBadge } from "@/components/pricing/tier-badge";
import { helpPath } from "@/components/shell/nav-links";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { HeldBackNotice } from "@/components/editions/held-back";
import { usePaidOn } from "@/components/editions/use-invite-edition";
import { Quiet } from "@/components/ui/quiet";
import { toast } from "@/components/ui/toast";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import {
  cardLanguages,
  draftCategory,
  draftOpeningStyle,
  includedFunctions,
  type EditorStep,
  type InviteDraft,
} from "@/lib/editor/draft";
import { stepErrors } from "@/lib/editor/draft-checks";
import { designPageHref } from "@/lib/editor/design-page";
import { changeDesign, startWithDesign, type GalleryChoice } from "@/lib/editor/gallery-start";
import { inviteDraft } from "@/lib/editor/store";
import { switchDraft, syncDraft, syncStore } from "@/lib/invites/sync";
import { funnel } from "@/lib/funnel";
import { draftShowsScene, draftSuite } from "@/lib/publish/story";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { GateSummary } from "../gate-chooser";
import { GATE_PAGE, PreviewStage } from "../preview-stage";
import { SaveStatus } from "../save-status";
import { CoupleStep, WordsStep } from "../steps/couple-step";
import { FamilySection } from "../steps/family-section";
import { Fold } from "../steps/fold";
import { MusicStep, PhotosStep } from "../steps/photos-music-steps";
import { useDropLostPhotos } from "../use-photo-urls";
import { DesignChoice } from "./design-choice";
import { QuickFunctions } from "./quick-functions";
import "@/components/invitation/type/fonts.css";

const noSubscribe = () => () => {};

/** How long on a design's page before offering to make it for them. */
const STALL_MS = 60_000;
/** Saved to the account a moment after each change, as the editor always has. */
const SYNC_DELAY = 1200;
const MAKE_HIDDEN_KEY = "shubh-make-nudge-hidden";
/** The page's parts open one at a time (owner, 2026-10-24): the one being worked on. */
const PARTS = "editor-parts";

/** The part open as the page arrives: the names until typed, then dates and places due. */
function firstPart(draft: InviteDraft): "names" | "when" | null {
  if (!draft.content.first?.trim()) return "names";
  return Object.keys(stepErrors(draft, "functions")).length > 0 ? "when" : null;
}

/** A field the host types into, rather than a button or a choice. */
function isTextField(target: EventTarget | null): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  if (!(target instanceof HTMLInputElement)) return false;
  return !["checkbox", "radio", "button", "submit", "file", "range", "color"].includes(target.type);
}

/** The parts with fields that must be right before the preview. */
const CHECKED: readonly EditorStep[] = ["couple", "words", "functions"];

/**
 * A design's own page, the whole editor on one page (update 4; owner, 2026-10-24: one main
 * page, nothing nested, clean and short). The design shows as the invitation itself, the
 * names appearing on it as they are typed, with its price and the way to watch it open.
 * Beside it, every part of the editor for the occasion: the card's language and the names,
 * when and where, then the family, photos, card words, and music and replies, folded until
 * opened. The page is quiet (components/ui/quiet.tsx): no helper words, small type, close
 * together. See my invitation opens the editor's preview, where it is published and paid
 * for, on the same draft, so nothing is typed twice. Other designs for the occasion sit
 * underneath to compare with.
 */
export function QuickStart({
  designId,
  name,
  choice,
  signedIn,
  initialInvite = null,
  missing = false,
  backHref,
  sampleHref,
  more,
}: {
  designId: string;
  /** The design's name in the site's language. */
  name: string;
  choice: GalleryChoice;
  signedIn: boolean;
  /** An invite opened from the account (?invite=<id>): this design becomes its design. */
  initialInvite?: InviteDraft | null;
  /** ?invite= named an invite this person can't open. */
  missing?: boolean;
  /** Where Back goes: the listing the design was opened from. */
  backHref: string;
  /** The design as a guest gets it. */
  sampleHref: string;
  /** Other designs for the occasion, drawn on the server (suggested-designs.tsx). */
  more?: ReactNode;
}) {
  const { quickCopy, editor, stepCopy, syncCopy, coupleCopy, functionCopy, openingCopy } =
    useText(editorText);
  const locale = useLocale();
  const router = useRouter();
  const still = useReducedMotion();
  const wide = useMediaQuery("(min-width: 64rem)");
  const { draft, save } = useSyncExternalStore(
    inviteDraft.subscribe,
    inviteDraft.get,
    inviteDraft.getServer,
  );
  const sync = useSyncExternalStore(syncStore.subscribe, syncStore.get, syncStore.getServer);
  const update = inviteDraft.update;
  const paidOn = usePaidOn(draft.remoteId ?? null);
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const [arriving, setArriving] = useState(true);
  const [opened, setOpened] = useState<"names" | "when" | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [gate, setGate] = useState(false);
  const ready = hydrated && !arriving;
  useDropLostPhotos(draft, update, ready);
  const [page, setPage] = useState("cover");
  const [checking, setChecking] = useState(false);
  const errors = checking
    ? Object.assign({}, ...CHECKED.map((step) => stepErrors(draft, step)))
    : {};
  const errorCount = Object.keys(errors).length;

  // The design is applied once, to the invite under way (gallery-start.ts), or to the
  // invite opened from the account, and its main function planned, so the form opens on the
  // wedding's date, time and venue
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    funnel("Details opened", { design: designId });
    void arrive()
      .then(() => {
        // A second card language is no longer offered (owner, 2026-10-24): one left on an
        // invite not yet sent goes, so its guests get the one language the host sees here
        if (!inviteDraft.get().draft.slug && cardLanguages(inviteDraft.get().draft).length > 1) {
          inviteDraft.update((draft) => ({ ...draft, languages: [cardLanguages(draft)[0]] }), {
            touch: false,
          });
        }
        const current = inviteDraft.get().draft;
        if (includedFunctions(current).length > 0) return;
        const primary = draftCategory(current).functions.primary;
        inviteDraft.update(
          (draft) => ({
            ...draft,
            functions: {
              ...draft.functions,
              [primary]: { ...draft.functions[primary], included: true },
            },
          }),
          { touch: false },
        );
      })
      .finally(() => {
        setOpened(firstPart(inviteDraft.get().draft));
        setArriving(false);
      });

    async function arrive() {
      if (missing) toast({ title: syncCopy.missing, tone: "error" });
      // The invite opened from the account replaces the one open, which is saved first
      const switched = initialInvite ? await switchDraft(initialInvite, { signedIn }) : true;
      if (!switched) {
        toast({ title: syncCopy.switchFailed, tone: "error" });
        return;
      }
      if (switched === "set-aside") toast({ title: syncCopy.setAside, tone: "success" });
      // Back on a page whose design the invite already has (a reload, or back from the
      // preview), what the family changed since stays: the address's faith or tradition
      // isn't applied again
      const current = inviteDraft.get().draft;
      const already =
        current.updatedAt !== 0 &&
        current.suite === choice.suite &&
        current.templateId === choice.template &&
        current.format === (choice.format ?? "story") &&
        current.categoryId === choice.category;
      if (already) return;
      // Another design for the invite opened from the account is that invite's new design
      if (initialInvite) changeDesign(choice, locale);
      else await startWithDesign(choice, { signedIn, site: locale });
    }
  }, [choice, signedIn, locale, designId, initialInvite, missing, syncCopy]);

  // The preview's Edit for a part lands on it (#part-family and the like), opened
  useEffect(() => {
    if (!ready) return;
    const target = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    if (!target) return;
    if (target instanceof HTMLDetailsElement) target.open = true;
    requestAnimationFrame(() =>
      target.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" }),
    );
  }, [ready, still]);

  // Saved to the account a moment after each change, and when the connection comes back
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

  // Written straight away if the tab is closed or hidden mid-way
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

  // On a phone, once the design scrolls away, a small copy of it floats in the corner while a
  // field is typed in, so the names can still be seen arriving on it; tapping it brings the
  // design back up
  const stage = useRef<HTMLDivElement>(null);
  const [stageSeen, setStageSeen] = useState(true);
  const [miniHidden, setMiniHidden] = useState(false);
  // Only while typing (owner, 2026-10-25): otherwise it sat over the parts' titles and choices
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const node = stage.current;
    if (!node || !ready) return;
    const observer = new IntersectionObserver(([entry]) =>
      setStageSeen(entry?.isIntersecting ?? true),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready]);

  // A minute on the page without going on: offer to make it for them (owner, 2026-10-24).
  // Put away, it stays away for the rest of the visit.
  const [stalled, setStalled] = useState(false);
  const [makeHidden, setMakeHidden] = useState(false);
  useEffect(() => {
    if (!ready) return;
    try {
      if (sessionStorage.getItem(MAKE_HIDDEN_KEY)) return;
    } catch {
      // Storage blocked: it can still be put away for this page
    }
    const timer = window.setTimeout(() => setStalled(true), STALL_MS);
    return () => window.clearTimeout(timer);
  }, [ready]);
  const hideMake = () => {
    setMakeHidden(true);
    try {
      sessionStorage.setItem(MAKE_HIDDEN_KEY, "1");
    } catch {
      // Storage blocked: hidden on this page only
    }
  };

  const form = useRef<HTMLFormElement>(null);
  const leave = (step: EditorStep) => {
    update((current) => ({ ...current, step }));
    inviteDraft.flush();
    router.push("/create");
  };
  // Signed in, Preview is the guests' own view, saved first: the gate chosen here, the
  // welcome, every page and the music (owner, 2026-10-25: a gate changed on this page didn't
  // show in the pages-only preview). Without an account it stays the quick look at the pages
  const [toGuests, setToGuests] = useState(false);
  const guestPreview = async () => {
    setToGuests(true);
    inviteDraft.flush();
    // A change the live invite's package refused isn't in the account: the account's copy
    // is the live one as guests have it, so the quick look shows this one instead
    const saved = await syncDraft();
    const id = inviteDraft.get().draft.remoteId;
    if (id && saved !== "needs-plan") {
      router.push(`/invites/${id}/preview?from=design`);
      return;
    }
    setToGuests(false);
    setPreviewing(true);
  };
  const see = () => {
    const problems = Object.assign({}, ...CHECKED.map((step) => stepErrors(draft, step)));
    if (Object.keys(problems).length > 0) {
      setChecking(true);
      requestAnimationFrame(() => {
        const first = form.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"], [data-invalid]',
        );
        // A field folded away opens first, so it can be seen and typed in
        first?.closest("details")?.setAttribute("open", "");
        first?.focus();
        first?.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" });
      });
      return;
    }
    leave("preview");
  };

  // What's in the names and the events, beside their titles while folded
  const names = [draft.content.first, draft.content.second]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(" & ");
  const gateStyle = draftOpeningStyle(draft, draftSuite(draft), draftShowsScene(draft));
  const events = includedFunctions(draft)
    .map((id) => functionCopy[id].name)
    .join(", ");
  const stepProps = { draft, update, errors, goTo: () => {} };

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-site items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <Link
              href={backHref}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-3"
            >
              <ArrowLeft aria-hidden className="size-5 rtl:rotate-180" />
              <span className="max-sm:sr-only">{quickCopy.back}</span>
            </Link>
            <Logo className="max-[359px]:[&>span]:sr-only" />
          </div>
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            {ready && (
              <SaveStatus
                state={save}
                sync={sync}
                signedIn={signedIn}
                edited={draft.updatedAt !== 0}
              />
            )}
            <AccountMenu compact />
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto grid w-full max-w-site flex-1 gap-6 px-4 pt-5 sm:px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:pt-8 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] xl:gap-16"
      >
        {/* The design, as the invitation itself; on a wide screen it stays while the form scrolls */}
        <section
          aria-labelledby="design-name"
          className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-20 lg:self-start lg:pb-8"
        >
          <div
            ref={stage}
            // The phone is the page's picture: most of a phone's screen, a laptop's height
            className="h-[min(74svh,38rem)] min-h-[26rem] lg:h-[min(calc(100dvh-14rem),44rem)] lg:min-h-[28rem]"
          >
            {ready ? (
              // With its Edit this page: a page's words rewritten, placed or left out right here
              <PreviewStage
                draft={draft}
                page={page}
                onPage={setPage}
                update={update}
                onGate={() => setGate(true)}
                className="h-full"
              />
            ) : (
              <div
                role="status"
                className="flex h-full flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-line bg-surface-2 text-ink-muted"
              >
                <LoaderCircle
                  aria-hidden
                  className="size-6 animate-spin motion-still:animate-none"
                />
                <span className="text-sm">{quickCopy.opening}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex min-w-0 flex-col gap-1">
              <h1 id="design-name" className="font-display text-2xl leading-tight">
                {name}
              </h1>
              {/* A live invite is already paid for or free; the line is for new ones */}
              {!draft.slug && <p className="text-sm text-ink-muted">{quickCopy.free}</p>}
            </div>
            {/* The price is with the packages below (owner, 2026-10-25); once paid, it says so */}
            {paidOn(designId) !== "free" && (
              <TierBadge designId={designId} variant="plain" paid={paidOn(designId)} />
            )}
          </div>
          {/* The demo plays the design with sample names; the preview is the family's own */}
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href={sampleHref} prefetch={false} data-watch-live>
                <PlayCircle aria-hidden className="text-accent-text" />
                {quickCopy.watch}
              </Link>
            </Button>
            {ready && signedIn && (
              <Button
                variant="secondary"
                leadingIcon={<Eye aria-hidden />}
                loading={toGuests}
                onClick={() => void guestPreview()}
                data-own-preview
              >
                {quickCopy.preview}
              </Button>
            )}
            {ready && (
              <Sheet open={previewing} onOpenChange={setPreviewing}>
                {!signedIn && (
                  <SheetTrigger asChild>
                    <Button variant="secondary" leadingIcon={<Eye aria-hidden />} data-own-preview>
                      {quickCopy.preview}
                    </Button>
                  </SheetTrigger>
                )}
                <SheetContent title={editor.previewTitle} closeLabel={editor.close}>
                  <PreviewStage
                    draft={draft}
                    page={page}
                    onPage={setPage}
                    className="h-[min(72dvh,40rem)] min-h-[24rem]"
                  />
                </SheetContent>
              </Sheet>
            )}
          </div>
          <TrustLine />
        </section>

        {/* One short form; the rest fills itself in */}
        <form
          ref={form}
          noValidate
          aria-label={quickCopy.title}
          // Filling in a function turns the design to its page, the names to the cover
          onFocusCapture={(event) => {
            const target = (event.target as HTMLElement).closest<HTMLElement>("[data-page-target]");
            if (target?.dataset.pageTarget) setPage(target.dataset.pageTarget);
            setTyping(isTextField(event.target));
          }}
          onBlurCapture={(event) => {
            if (!isTextField(event.relatedTarget)) setTyping(false);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            see();
          }}
          className="flex min-w-0 flex-col gap-5 lg:max-w-2xl"
        >
          {ready && (
            <Quiet className="flex flex-col gap-5">
              {/* A live invite's change its package doesn't cover stays off the live copy */}
              {signedIn && (
                <HeldBackNotice
                  draft={draft}
                  onRestored={() => router.replace(designPageHref(inviteDraft.get().draft))}
                  onSplit={() => router.replace(designPageHref(inviteDraft.get().draft))}
                />
              )}
              {/* Every part folded to its title, the one being worked on open */}
              <Fold
                id="part-names"
                group={PARTS}
                open={opened === "names"}
                title={coupleCopy.namesHeading}
                note={names}
                pageTarget="cover"
              >
                <CoupleStep {...stepProps} />
              </Fold>
              <Fold
                id="part-when"
                group={PARTS}
                open={opened === "when"}
                title={quickCopy.whenHeading}
                note={events}
              >
                <QuickFunctions draft={draft} update={update} errors={errors} />
              </Fold>
              <Fold
                id="part-family"
                group={PARTS}
                open={false}
                title={quickCopy.familyTitle}
                pageTarget="family"
              >
                <FamilySection draft={draft} update={update} />
              </Fold>
              <Fold
                id="part-photos"
                group={PARTS}
                open={false}
                title={quickCopy.photosTitle}
                pageTarget="cover"
              >
                <PhotosStep {...stepProps} />
              </Fold>
              <Fold
                id="part-words"
                group={PARTS}
                open={false}
                title={stepCopy.words.label}
                pageTarget="cover"
              >
                <WordsStep {...stepProps} />
              </Fold>
              <Fold
                id="part-music"
                group={PARTS}
                open={false}
                title={stepCopy.music.label}
                pageTarget="family"
              >
                <MusicStep {...stepProps} />
              </Fold>
              {/* How it opens: the last part, the first thing guests see */}
              <Fold
                id="part-gate"
                group={PARTS}
                open={false}
                title={openingCopy.heading}
                note={openingCopy.styles[gateStyle].name}
                pageTarget={GATE_PAGE}
              >
                <GateSummary
                  draft={draft}
                  update={update}
                  open={gate}
                  onOpenChange={setGate}
                  bare
                />
              </Fold>
              <DesignPackages
                designId={designId}
                tone="paper"
                extras={draft.categoryId === "wedding" ? "wedding" : "other"}
                className="border-t border-line pt-4"
              />
              {/* An offer running now on this design, with its code to copy */}
              <PreviewOffers designId={designId} tone="paper" />
              <a
                href={helpPath(locale, "make", designId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-success/40 bg-success/10 px-4 text-sm font-semibold text-ink transition-colors hover:bg-success/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <SocialIcon channel="whatsapp" className="size-4 text-success" />
                {quickCopy.make}
              </a>
            </Quiet>
          )}

          {/* See my invitation stays in reach on a phone */}
          <div className="sticky bottom-0 z-30 -mx-4 mt-auto flex flex-col gap-2 border-t border-line bg-paper/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-t-lg lg:border-x lg:px-4">
            {errorCount > 0 && (
              <p
                role="alert"
                className="rounded-md border border-danger/35 bg-danger/10 px-4 py-2 text-sm font-medium text-danger"
              >
                {editor.fixErrors(errorCount)}
              </p>
            )}
            {/* A minute in and still here: we can make it for them instead */}
            {stalled && !makeHidden && errorCount === 0 && (
              <div
                data-make-nudge
                className="flex animate-fade-in items-center gap-1 rounded-md border border-success/40 bg-success/10 ps-3"
              >
                <SocialIcon channel="whatsapp" className="size-4 shrink-0 text-success" />
                <a
                  href={helpPath(locale, "make", designId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 flex-1 items-center rounded-sm px-1 text-sm font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {quickCopy.make}
                </a>
                <button
                  type="button"
                  aria-label={quickCopy.hideMake}
                  onClick={hideMake}
                  className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Button
                type="submit"
                size="lg"
                disabled={!ready}
                trailingIcon={<ArrowRight aria-hidden className="rtl:rotate-180" />}
                className="max-sm:w-full"
              >
                {quickCopy.see}
              </Button>
              <p className="text-xs text-ink-muted">{quickCopy.nothingToPay}</p>
            </div>
          </div>
        </form>
      </main>
      {/* On a live invite, another design asks first: a new invitation, or this one changed */}
      <DesignChoice live={ready && Boolean(draft.slug)}>{more}</DesignChoice>

      {/* Phones: the design, small, while it is out of view, until put away */}
      {ready && !wide && !stageSeen && typing && !miniHidden && (
        <div className="fixed end-3 top-[calc(env(safe-area-inset-top)+4.25rem)] z-30 animate-fade-in lg:hidden">
          <button
            type="button"
            aria-label={editor.livePreview}
            onClick={() =>
              stage.current?.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" })
            }
            className="block h-[11.4rem] w-[5.4rem] cursor-pointer overflow-hidden rounded-[1rem] shadow-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {/* A guest-sized phone, shrunk, so the words wrap as they will for guests */}
            <span className="block h-[25.35rem] w-48 origin-top-left scale-[0.45]">
              <PreviewStage draft={draft} page={page} onPage={setPage} mini className="h-full" />
            </span>
          </button>
          <button
            type="button"
            aria-label={editor.hideLivePreview}
            onClick={() => setMiniHidden(true)}
            className="absolute -start-2.5 -top-2.5 grid size-7 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink shadow-raised before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
