import { BlogIndexPage } from "@/components/blog/blog-pages";
import { publicMetadata } from "@/components/seo/pages";
import { allPostsIn } from "@/lib/blog/store";
import { routeLocale } from "../locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  return publicMetadata({ kind: "blog" }, await routeLocale(params));
}

/* Posts from Admin, Blog appear within five minutes, or at once when saved there. */
export const revalidate = 300;

export default async function Page({ params }: PageProps<"/[locale]/blog">) {
  const locale = await routeLocale(params);
  const [posts, other] = await Promise.all([allPostsIn(locale), allPostsIn("en")]);
  return <BlogIndexPage locale={locale} posts={posts} otherHasPosts={other.length > 0} />;
}
