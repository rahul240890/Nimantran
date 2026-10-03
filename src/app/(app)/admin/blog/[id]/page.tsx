import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminHeading } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";
import { requireAdmin } from "@/lib/admin/access";
import { occasionOptions, toEditorPost } from "@/lib/blog/editor-post";
import { blogPostPath } from "@/lib/blog/posts";
import { adminPost, isLive } from "@/lib/blog/store";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  await requireAdmin(`/admin/blog/${id}`);
  const post = z.uuid().safeParse(id).success ? await adminPost(id) : null;
  if (!post) notFound();
  return (
    <>
      <AdminHeading
        eyebrow="Blog"
        title={post.heading}
        intro="Changes show on the blog as soon as you save."
      />
      <BlogEditor
        key={post.updatedAt}
        initial={toEditorPost(post)}
        occasions={occasionOptions()}
        liveUrl={isLive(post) ? blogPostPath(post.slug, post.locale) : null}
      />
    </>
  );
}
