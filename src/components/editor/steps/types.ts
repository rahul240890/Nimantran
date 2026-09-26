import type { EditorStep, InviteDraft, StepErrors } from "@/lib/editor/draft";

export type StepProps = {
  draft: InviteDraft;
  update: (change: (draft: InviteDraft) => InviteDraft) => void;
  /** Problems to show; empty until the host tries to move on. */
  errors: StepErrors;
  goTo: (step: EditorStep) => void;
};
