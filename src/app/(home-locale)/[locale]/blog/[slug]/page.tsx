import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog/blog-pages";
import { postMetadata } from "@/components/blog/post-metadata";
import { postsIn, relatedPosts } from "@/lib/blog/posts";
import { allPostsIn, findLivePost } from "@/lib/blog/store";
import { isPrefixedLocale } from "@/i18n/locales";
import { routeLocale } from "../../locale";

/* The code's posts are built ahead; posts from Admin, Blog are made on first visit. */
export const revalidate = 300;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isPrefixedLocale(params.locale)) return [];
  return postsIn(params.locale).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const locale = await routeLocale(params);
  const post = await findLivePost((await params).slug, locale);
  return post ? postMetadata(post) : {};
}

export default async function Page({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const locale = await routeLocale(params);
  const post = await findLivePost((await params).slug, locale);
  if (!post) notFound();
  const more = relatedPosts(post, await allPostsIn(locale));
  return <BlogPostPage post={post} more={more} />;
}
