import { BlogIndexPage } from "@/components/blog/blog-pages";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "blog" }, "hi");

export default function Page() {
  return <BlogIndexPage locale="hi" />;
}
