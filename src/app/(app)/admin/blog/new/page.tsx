import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";
import { requireAdmin } from "@/lib/admin/access";
import { occasionOptions, toEditorPost } from "@/lib/blog/editor-post";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireAdmin("/admin/blog/new");
  return (
    <>
      <AdminHeading
        eyebrow="Blog"
        title="New post"
        intro="Write it yourself, or let the AI write a first draft from a search phrase. Save as a draft until it reads well."
      />
      <BlogEditor initial={toEditorPost(null)} occasions={occasionOptions()} liveUrl={null} />
    </>
  );
}
