import { BlogIndexPage } from "@/components/blog/blog-pages";
import { publicMetadata } from "@/components/seo/pages";
import { allPostsIn } from "@/lib/blog/store";

export const metadata = publicMetadata({ kind: "blog" }, "hi");

/* Posts from Admin, Blog appear within five minutes, or at once when saved there. */
export const revalidate = 300;

export default async function Page() {
  const [posts, other] = await Promise.all([allPostsIn("hi"), allPostsIn("en")]);
  return <BlogIndexPage locale="hi" posts={posts} otherHasPosts={other.length > 0} />;
}
