import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog/blog-pages";
import { postMetadata } from "@/components/blog/post-metadata";
import { postsIn, relatedPosts } from "@/lib/blog/posts";
import { allPostsIn, findLivePost } from "@/lib/blog/store";

/* The code's posts are built ahead; posts from Admin, Blog are made on first visit. */
export const revalidate = 300;

export function generateStaticParams() {
  return postsIn("en").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const post = await findLivePost((await params).slug, "en");
  return post ? postMetadata(post) : {};
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const post = await findLivePost((await params).slug, "en");
  if (!post) notFound();
  const more = relatedPosts(post, await allPostsIn("en"));
  return <BlogPostPage post={post} more={more} />;
}
