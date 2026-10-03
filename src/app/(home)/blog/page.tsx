import { BlogIndexPage } from "@/components/blog/blog-pages";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "blog" }, "en");

export default function Page() {
  return <BlogIndexPage locale="en" />;
}
