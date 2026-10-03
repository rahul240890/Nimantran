import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog/blog-pages";
import { postMetadata } from "@/components/blog/post-metadata";
import { findPost, postsIn } from "@/lib/blog/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return postsIn("en").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const post = findPost((await params).slug, "en");
  return post ? postMetadata(post) : {};
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const post = findPost((await params).slug, "en");
  if (!post) notFound();
  return <BlogPostPage post={post} />;
}
