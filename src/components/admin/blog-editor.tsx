"use client";

import { ExternalLink, ImagePlus, Save, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { draftBlogPost, removeBlogPost, saveBlogPost, uploadBlogCover } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { UiLocale } from "@/i18n/locales";
import { fromIndiaLocal } from "@/lib/blog/india-time";
import { slugify } from "@/lib/blog/markup";
import type { CategoryId } from "@/lib/categories/catalog";

/*
 * Writing one post on Admin, Blog: words, cover, when it goes live, and a first draft
 * from the AI. The body uses the blog's light markup, explained beside the box.
 */

export type EditorPost = {
  id: string | null;
  slug: string;
  locale: UiLocale;
  title: string;
  description: string;
  heading: string;
  intro: string;
  body: string;
  faq: string;
  occasion: CategoryId;
  keywords: string;
  coverPath: string | null;
  coverUrl: string | null;
  coverAlt: string;
  status: "draft" | "published";
  /** For the date and time box: "2026-10-03T09:30", India time as the browser shows it. */
  publishedLocal: string;
};

const LANGUAGES = [
  { value: "en", label: "English (/blog)" },
  { value: "hi", label: "Hindi (/hi/blog)" },
];

const SAVE_ERRORS = {
  invalid: "Check the post: a title, a heading and an address are needed.",
  taken: "Another post in this language already uses that address.",
  "code-post": "A post that ships with the site already uses that address.",
  failed: "Couldn't save. Try again.",
} as const;

function Count({ value, limit }: { value: string; limit: number }) {
  const over = value.length > limit;
  return (
    <span className={over ? "text-sm font-semibold text-danger" : "text-sm text-ink-muted"}>
      {value.length}/{limit}
    </span>
  );
}

export function BlogEditor({
  initial,
  occasions,
  liveUrl,
}: {
  initial: EditorPost;
  occasions: { value: string; label: string }[];
  /** Where the post can be read, when it is live. */
  liveUrl: string | null;
}) {
  const router = useRouter();
  const [post, setPost] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [keyword, setKeyword] = useState("");
  const [tried, setTried] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, startSave] = useTransition();
  const [drafting, startDraft] = useTransition();
  const [uploading, startUpload] = useTransition();
  const [deleting, startDelete] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof EditorPost>(key: K, value: EditorPost[K]) =>
    setPost((current) => ({ ...current, [key]: value }));

  const errors = {
    title: !post.title.trim() ? "Add a title." : undefined,
    heading: !post.heading.trim() ? "Add the heading readers see." : undefined,
    slug: !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)
      ? "Use small English letters, numbers and dashes, like griha-pravesh-invitation-message."
      : undefined,
    publishedLocal: !post.publishedLocal ? "Choose a date." : undefined,
  };
  const shown = (key: keyof typeof errors) => (tried ? errors[key] : undefined);

  const setTitle = (title: string) =>
    setPost((current) => ({
      ...current,
      title,
      ...(slugTouched || current.locale === "hi" ? {} : { slug: slugify(title) }),
    }));

  const save = (status: EditorPost["status"]) => {
    setTried(true);
    if (Object.values(errors).some(Boolean)) {
      toast({ title: "Some details need a look.", tone: "error" });
      return;
    }
    startSave(async () => {
      const result = await saveBlogPost({
        id: post.id,
        slug: post.slug,
        locale: post.locale,
        title: post.title,
        description: post.description,
        heading: post.heading,
        intro: post.intro,
        body: post.body,
        faq: post.faq,
        occasion: post.occasion,
        keywords: post.keywords
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean)
          .slice(0, 20),
        coverPath: post.coverPath,
        coverAlt: post.coverAlt,
        status,
        publishedAt: fromIndiaLocal(post.publishedLocal).toISOString(),
      }).catch(() => null);
      if (result?.ok) {
        const future = fromIndiaLocal(post.publishedLocal) > new Date();
        toast({
          title:
            status === "draft"
              ? "Draft saved"
              : future
                ? "Scheduled: it goes live on its date"
                : "Published",
          tone: "success",
        });
        setPost((current) => ({ ...current, status }));
        if (!post.id) router.replace(`/admin/blog/${result.id}`);
        else router.refresh();
      } else {
        toast({
          title: SAVE_ERRORS[result && !result.ok ? result.reason : "failed"],
          tone: "error",
        });
      }
    });
  };

  const draft = () => {
    if (keyword.trim().length < 3) {
      toast({ title: "Type the search phrase the post should answer.", tone: "error" });
      return;
    }
    startDraft(async () => {
      const result = await draftBlogPost({
        keyword,
        locale: post.locale,
        occasion: post.occasion,
      }).catch(() => null);
      if (result?.ok) {
        const { draft } = result;
        setPost((current) => ({
          ...current,
          title: draft.title,
          description: draft.description,
          heading: draft.heading,
          intro: draft.intro,
          body: draft.body,
          faq: draft.faq,
          keywords: draft.keywords.join(", "),
          slug: slugTouched || current.locale === "hi" ? current.slug : slugify(draft.title),
        }));
        toast({ title: "Draft written. Read it through before publishing.", tone: "success" });
      } else {
        toast({
          title:
            result && !result.ok && result.reason === "off"
              ? "AI is off: add an AI key in Vercel (Admin, AI)."
              : "The AI couldn't write a draft. Try again.",
          tone: "error",
        });
      }
    });
  };

  const upload = (file: File) => {
    startUpload(async () => {
      const form = new FormData();
      form.set("cover", file);
      const path = await uploadBlogCover(form).catch(() => null);
      if (path) {
        setPost((current) => ({
          ...current,
          coverPath: path,
          coverUrl: URL.createObjectURL(file),
        }));
        toast({ title: "Cover added. Save the post to keep it.", tone: "success" });
      } else {
        toast({ title: "Use a JPG, PNG or WebP picture under 5 MB.", tone: "error" });
      }
    });
  };

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        save(post.status);
      }}
    >
      <section
        aria-labelledby="ai-draft-heading"
        className="flex flex-col gap-3 rounded-lg border border-marigold/50 bg-surface-2 p-4 sm:p-5"
      >
        <h2 id="ai-draft-heading" className="flex items-center gap-2 font-semibold">
          <Sparkles aria-hidden className="size-5 text-accent-text" />
          Draft with AI
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field
            label="Search phrase"
            hint="What people type into Google, like “griha pravesh invitation message”."
            className="flex-1"
          >
            <Input
              value={keyword}
              maxLength={120}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </Field>
          <Button
            type="button"
            variant="secondary"
            loading={drafting}
            onClick={draft}
            className="sm:mb-6"
          >
            Write a draft
          </Button>
        </div>
        <p className="text-sm text-ink-muted">
          The draft fills the boxes below, in the language and occasion chosen. Nothing is published
          until you say so.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Language">
          <Select
            options={LANGUAGES}
            value={post.locale}
            onValueChange={(value) => set("locale", value as UiLocale)}
          />
        </Field>
        <Field label="Occasion" hint="The post ends with a way to make this occasion's invitation.">
          <Select
            options={occasions}
            value={post.occasion}
            onValueChange={(value) => set("occasion", value as CategoryId)}
            contentClassName="max-h-80"
          />
        </Field>
      </div>

      <Field
        label="Title"
        hint="For Google and the browser tab. Up to 48 characters, with the search phrase in it."
        aside={<Count value={post.title} limit={48} />}
        error={shown("title")}
        required
      >
        <Input
          value={post.title}
          maxLength={70}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Field>
      <Field
        label="Address"
        hint={`/${post.locale === "hi" ? "hi/" : ""}blog/${post.slug || "…"}. Keep it once published: changing it breaks links.`}
        error={shown("slug")}
        required
      >
        <Input
          value={post.slug}
          maxLength={80}
          spellCheck={false}
          className="font-mono"
          onChange={(event) => {
            setSlugTouched(true);
            set("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
          }}
        />
      </Field>
      <Field label="Heading" hint="The big heading on the page." error={shown("heading")} required>
        <Input
          value={post.heading}
          maxLength={160}
          onChange={(event) => set("heading", event.target.value)}
        />
      </Field>
      <Field
        label="Description"
        hint="Shown under the title in Google, and on the post's card."
        aside={<Count value={post.description} limit={155} />}
      >
        <Textarea
          value={post.description}
          maxLength={200}
          rows={2}
          onChange={(event) => set("description", event.target.value)}
        />
      </Field>
      <Field label="Introduction" hint="Two or three sentences under the heading.">
        <Textarea
          value={post.intro}
          maxLength={1200}
          rows={3}
          onChange={(event) => set("intro", event.target.value)}
        />
      </Field>

      <section aria-labelledby="cover-heading" className="flex flex-col gap-3">
        <h2 id="cover-heading" className="font-semibold">
          Cover picture
        </h2>
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- a just-chosen file or the bucket's picture
          <img
            src={post.coverUrl}
            alt={post.coverAlt}
            className="aspect-[16/9] w-full max-w-xl rounded-lg border border-line object-cover"
          />
        ) : (
          <p className="text-sm text-ink-muted">
            Without one, the post uses its occasion&apos;s painting. Best at 1200 × 675 pixels.
          </p>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
            event.target.value = "";
          }}
        />
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={uploading}
            leadingIcon={<ImagePlus aria-hidden />}
            onClick={() => fileInput.current?.click()}
          >
            {post.coverUrl ? "Change cover" : "Add cover"}
          </Button>
          {post.coverUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setPost((current) => ({ ...current, coverPath: null, coverUrl: null }))
              }
            >
              Remove cover
            </Button>
          )}
        </div>
        {post.coverUrl && (
          <Field label="Describe the picture" hint="For people who can't see it, and for Google.">
            <Input
              value={post.coverAlt}
              maxLength={200}
              onChange={(event) => set("coverAlt", event.target.value)}
            />
          </Field>
        )}
      </section>

      <Field
        label="Post"
        hint={
          <>
            One block per line, a blank line between blocks: <code>## Section</code>,{" "}
            <code>### Smaller heading</code>, <code>- list item</code>, <code>1. numbered</code>,{" "}
            <code>&gt; [Label] message to copy</code>, <code>! tip</code>. Links:{" "}
            <code>[words](/invitations/wedding)</code>, bold: <code>**words**</code>.
          </>
        }
      >
        <Textarea
          value={post.body}
          maxLength={60000}
          rows={20}
          className="font-mono text-sm"
          onChange={(event) => set("body", event.target.value)}
        />
      </Field>
      <Field
        label="Questions and answers"
        hint="Lines starting Q: and A:, shown at the end and to Google."
      >
        <Textarea
          value={post.faq}
          maxLength={8000}
          rows={6}
          onChange={(event) => set("faq", event.target.value)}
        />
      </Field>
      <Field
        label="Search phrases"
        hint="Comma-separated. Not shown; a note of what the post is for."
      >
        <Input
          value={post.keywords}
          maxLength={800}
          onChange={(event) => set("keywords", event.target.value)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <RadioGroup
          label="Status"
          value={post.status}
          onValueChange={(value) => set("status", value as EditorPost["status"])}
        >
          <RadioItem value="draft" label="Draft" description="Only admins can see it." />
          <RadioItem
            value="published"
            label="Published"
            description="Live on its date; a date ahead schedules it."
          />
        </RadioGroup>
        <Field
          label="Publish date"
          hint="India time. The blog sorts posts by this date."
          error={shown("publishedLocal")}
        >
          <Input
            type="datetime-local"
            value={post.publishedLocal}
            onChange={(event) => set("publishedLocal", event.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <Button type="submit" loading={saving} leadingIcon={<Save aria-hidden />}>
          Save
        </Button>
        {liveUrl && (
          <Button asChild variant="secondary">
            <a href={liveUrl} target="_blank" rel="noreferrer">
              View post
              <ExternalLink aria-hidden />
            </a>
          </Button>
        )}
        {post.id && (
          <Button
            type="button"
            variant={confirmDelete ? "danger" : "ghost"}
            loading={deleting}
            leadingIcon={<Trash2 aria-hidden />}
            className="ms-auto"
            onClick={() => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              startDelete(async () => {
                if (await removeBlogPost(post.id).catch(() => false)) {
                  toast({ title: "Post deleted", tone: "success" });
                  router.replace("/admin/blog");
                } else {
                  toast({ title: "Couldn't delete. Try again.", tone: "error" });
                }
              });
            }}
          >
            {confirmDelete ? "Delete for good" : "Delete post"}
          </Button>
        )}
      </div>
    </form>
  );
}
