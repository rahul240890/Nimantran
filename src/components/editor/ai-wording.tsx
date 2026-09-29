"use client";

import { Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { suggestWording } from "@/actions/wording";
import { languageName } from "@/components/invitation/card-language-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import type { CardLanguage, InviteDraft } from "@/lib/editor/draft";
import { editableLines } from "@/lib/editor/pages";
import type { StoryBeat } from "@/lib/engine/story";
import { TONES, type Tone, type WordingMode } from "@/lib/wording/prompt";
import type { StepProps } from "./steps/types";

type Problem = "sign-in" | "off" | "not-found" | "used-up" | "failed";

/**
 * Asks the AI to write the given pages in one card language and puts its words on them as
 * the host's own, so every line stays editable and "Back to the suggested words" still
 * brings back what the invite wrote itself.
 */
export function useWording(draft: InviteDraft, update: StepProps["update"]) {
  const [pending, start] = useTransition();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState<number | null>(null);

  const ask = (
    beats: readonly StoryBeat[],
    language: CardLanguage,
    tone: Tone,
    mode: WordingMode,
  ) => {
    setProblem(null);
    setDone(false);
    if (!draft.remoteId) {
      setProblem("sign-in");
      return;
    }
    const inviteId = draft.remoteId;
    start(async () => {
      const result = await suggestWording({
        inviteId,
        language,
        tone,
        mode,
        occasion: draft.categoryId,
        tradition: draft.tradition.id,
        pages: beats
          .filter((beat) => beat.lines.length > 0)
          .map((beat) => ({ id: beat.id, scene: beat.scene, lines: editableLines(beat) })),
      }).catch(() => ({ ok: false, reason: "failed" }) as const);
      if (!result.ok) {
        setProblem(result.reason);
        return;
      }
      setLeft(result.left);
      setDone(true);
      update((current) => ({
        ...current,
        pages: {
          ...current.pages,
          words: {
            ...current.pages.words,
            [language]: { ...current.pages.words[language], ...result.pages },
          },
        },
      }));
    });
  };

  return { ask, pending, problem, done, left };
}

/** The line under the buttons: working, written, how many drafts are left, or what went wrong. */
export function WordingStatus({ wording }: { wording: ReturnType<typeof useWording> }) {
  const { aiCopy } = useText(editorText);
  const text = wording.pending
    ? aiCopy.busy
    : wording.problem
      ? aiCopy.errors[wording.problem]
      : wording.done
        ? [aiCopy.done, wording.left === null ? "" : aiCopy.left(wording.left)]
            .filter(Boolean)
            .join(" ")
        : "";
  return (
    <p role="status" aria-live="polite" className="min-h-5 text-sm text-ink-muted">
      {text}
    </p>
  );
}

/**
 * "Write with AI" under the editor's phone: a tone, every page or only the shown one, in
 * the card language the phone is showing.
 */
export function AiWording({
  draft,
  update,
  beats,
  page,
  pageName,
  language,
}: {
  draft: InviteDraft;
  update: StepProps["update"];
  /** The pages as guests will see them in this language. */
  beats: readonly StoryBeat[];
  /** The page the phone shows. */
  page: StoryBeat;
  pageName: string;
  language: CardLanguage;
}) {
  const { aiCopy } = useText(editorText);
  const [tone, setTone] = useState<Tone>("traditional");
  const [scope, setScope] = useState<"all" | "page">("all");
  const wording = useWording(draft, update);
  const bilingual = draft.languages.length > 1;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="shrink-0">
          <Sparkles aria-hidden />
          {aiCopy.open}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={aiCopy.title}
        description={aiCopy.description}
        closeLabel={aiCopy.close}
        footer={
          <Button
            loading={wording.pending}
            onClick={() => wording.ask(scope === "all" ? beats : [page], language, tone, "write")}
          >
            <Sparkles aria-hidden />
            {wording.done ? aiCopy.again : aiCopy.write}
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span aria-hidden className="text-sm font-medium">
              {aiCopy.tone}
            </span>
            <RadioGroup
              label={aiCopy.tone}
              orientation="horizontal"
              value={tone}
              onValueChange={(value) => setTone(value as Tone)}
            >
              {TONES.map((id) => (
                <RadioItem key={id} value={id} label={aiCopy.tones[id]} />
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <span aria-hidden className="text-sm font-medium">
              {aiCopy.scope}
            </span>
            <RadioGroup
              label={aiCopy.scope}
              value={scope}
              onValueChange={(value) => setScope(value as "all" | "page")}
            >
              <RadioItem value="all" label={aiCopy.scopes.all} />
              <RadioItem value="page" label={aiCopy.scopes.page(pageName)} />
            </RadioGroup>
          </div>
          {bilingual && (
            <p className="text-sm text-ink-muted">{aiCopy.languages(languageName(language))}</p>
          )}
          <WordingStatus wording={wording} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
