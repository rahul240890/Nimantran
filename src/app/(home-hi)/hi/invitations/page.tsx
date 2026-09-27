import { GalleryIndexPage } from "@/components/gallery/gallery-pages";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "gallery" }, "hi");

/* Every occasion, with search: the start of making an invitation. */
export default function Page() {
  return <GalleryIndexPage locale="hi" />;
}
