"use client";

import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  PlayCircle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AccountMenu } from "@/components/account/account-menu";
import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/brand/social-links";
import { PreviewOffers } from "@/components/offers/preview-offers";
import { TrustLine } from "@/components/reviews/trust-line";
import { DesignPackages } from "@/components/pricing/design-packages";
import { TierBadge } from "@/components/pricing/tier-badge";
import { helpPath } from "@/components/shell/nav-links";
import { Button } from "@/components/ui/button";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { draftCategory, includedFunctions, type EditorStep } from "@/lib/editor/draft";
import { stepErrors } from "@/lib/editor/draft-checks";
import { noFamily } from "@/lib/editor/family";
import { startWithDesign, type GalleryChoice } from "@/lib/editor/gallery-start";
import { inviteDraft } from "@/lib/editor/store";
import { funnel } from "@/lib/funnel";
import { coupleLayouts } from "@/lib/publish/frames";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PreviewStage } from "../preview-stage";
import { CoupleStep } from "../steps/couple-step";
import { FamilySection } from "../steps/family-section";
import { Fold } from "../steps/fold";
import { DesignPhotos } from "../steps/photos-music-steps";
import { QuickFunctions } from "./quick-functions";
import "@/components/invitation/type/fonts.css";

const noSubscribe = () => () => {};

/** The parts of the full editor the short form fills in. */
/** How long on a design's page before offering to make it for them. */
const STALL_MS = 60_000;
const MAKE_HIDDEN_KEY = "shubh-make-nudge-hidden";

const CHECKED: readonly EditorStep[] = ["couple", "functions"];

/**
 * A design's own page (update 4; owner, 2026-10-24: tap a design, see it on top and fill
 * in the details below). The design shows as the invitation itself, the names appearing on
 * it as they are typed, with its price and the way to watch it open. Under it, one short
 * form: the card's language, the names, and when and where; the family and photos fold
 * away. Everything else (wording, music, reply questions) fills itself in. See my
 * invitation opens the editor's last step, where it is previewed, published and paid for;
 * More options opens the full editor, everything typed already in place. Both work on the
 * same draft as the editor, so nothing is typed twice.
 */
export function QuickStart({
  designId,
  name,
  choice,
  signedIn,
  backHref,
  sampleHref,
}: {
  designId: string;
  /** The design's name in the site's language. */
  name: string;
  choice: GalleryChoice;
  signedIn: boolean;
  /** Where Back goes: the listing the design was opened from. */
  backHref: string;
  /** The design as a guest gets it. */
  sampleHref: string;
}) {
  const { quickCopy, editor } = useText(editorText);
  const locale = useLocale();
  const router = useRouter();
  const still = useReducedMotion();
  const wide = useMediaQuery("(min-width: 64rem)");
  const { draft } = useSyncExternalStore(
    inviteDraft.subscribe,
    inviteDraft.get,
    inviteDraft.getServer,
  );
  const update = inviteDraft.update;
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const [arriving, setArriving] = useState(true);
  const ready = hydrated && !arriving;
  const [page, setPage] = useState("cover");
  const [checking, setChecking] = useState(false);
  const errors = checking
    ? Object.assign({}, ...CHECKED.map((step) => stepErrors(draft, step)))
    : {};
  const errorCount = Object.keys(errors).length;

  // The design is applied once, to the invite under way (gallery-start.ts), and its main
  // function planned, so the form opens on the wedding's date, time and venue
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    funnel("Details opened", { design: designId });
    void startWithDesign(choice, { signedIn, site: locale })
      .then(() => {
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
      .finally(() => setArriving(false));
  }, [choice, signedIn, locale, designId]);

  // Written straight away if the tab is closed or hidden mid-way
  useEffect(() => {
    const flush = () => inviteDraft.flush();
    const onVisibility = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // On a phone, once the design scrolls away, a small copy of it floats in the corner so the
  // names can still be seen arriving on it; tapping it brings the design back up
  const stage = useRef<HTMLDivElement>(null);
  const [stageSeen, setStageSeen] = useState(true);
  const [miniHidden, setMiniHidden] = useState(false);
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
  const see = () => {
    const problems = Object.assign({}, ...CHECKED.map((step) => stepErrors(draft, step)));
    if (Object.keys(problems).length > 0) {
      setChecking(true);
      requestAnimationFrame(() => {
        const first = form.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"], [data-invalid]',
        );
        first?.focus();
        first?.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" });
      });
      return;
    }
    leave("preview");
  };

  const photos = coupleLayouts(draft).some((layout) => layout !== "none");
  const familyFilled = JSON.stringify(draft.family) !== JSON.stringify(noFamily);
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
          <AccountMenu compact />
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
            className="h-[min(60svh,32rem)] min-h-[22rem] lg:h-[min(calc(100dvh-17rem),42rem)] lg:min-h-[26rem]"
          >
            {ready ? (
              <PreviewStage draft={draft} page={page} onPage={setPage} className="h-full" />
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
              <p className="text-sm text-ink-muted">{quickCopy.free}</p>
            </div>
            <TierBadge designId={designId} variant="plain" />
          </div>
          <Button asChild variant="secondary" className="self-start">
            <Link href={sampleHref} prefetch={false} data-watch-live>
              <PlayCircle aria-hidden className="text-accent-text" />
              {quickCopy.watch}
            </Link>
          </Button>
          <TrustLine />
        </section>

        {/* One short form; the rest fills itself in */}
        <form
          ref={form}
          noValidate
          aria-labelledby="quick-title"
          // Filling in a function turns the design to its page, the names to the cover
          onFocusCapture={(event) => {
            const target = (event.target as HTMLElement).closest<HTMLElement>("[data-page-target]");
            if (target?.dataset.pageTarget) setPage(target.dataset.pageTarget);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            see();
          }}
          className="flex min-w-0 flex-col gap-8 lg:max-w-2xl"
        >
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
              {quickCopy.eyebrow}
            </p>
            <h2 id="quick-title" className="font-display text-[1.6rem] leading-tight sm:text-3xl">
              {quickCopy.title}
            </h2>
            <p className="text-ink-muted">{quickCopy.intro}</p>
          </div>

          {ready && (
            <>
              <CoupleStep {...stepProps} />
              <section
                aria-labelledby="when-heading"
                className="flex flex-col gap-4 border-t border-line pt-6"
              >
                <h2 id="when-heading" className="font-display text-xl">
                  {quickCopy.whenHeading}
                </h2>
                <QuickFunctions draft={draft} update={update} errors={errors} />
              </section>
              <Fold
                title={quickCopy.familyTitle}
                intro={quickCopy.familyIntro}
                filled={familyFilled}
                pageTarget="family"
              >
                <FamilySection draft={draft} update={update} />
              </Fold>
              {photos && (
                <Fold
                  title={quickCopy.photosTitle}
                  intro={quickCopy.photosIntro}
                  filled={draft.photos.length > 0}
                  pageTarget="cover"
                >
                  <DesignPhotos draft={draft} update={update} />
                </Fold>
              )}
              <DesignPackages
                designId={designId}
                tone="paper"
                className="border-t border-line pt-6"
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
            </>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!ready}
                leadingIcon={<SlidersHorizontal aria-hidden />}
                onClick={() => leave("couple")}
                title={quickCopy.moreIntro}
                className="ms-auto"
              >
                {quickCopy.more}
              </Button>
            </div>
          </div>
        </form>
      </main>

      {/* Phones: the design, small, while it is out of view, until put away */}
      {ready && !wide && !stageSeen && !miniHidden && (
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
