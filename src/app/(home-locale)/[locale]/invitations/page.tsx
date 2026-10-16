import { GalleryIndexPage } from "@/components/gallery/gallery-pages";
import { publicMetadata } from "@/components/seo/pages";
import { routeLocale } from "../locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/invitations">) {
  return publicMetadata({ kind: "gallery" }, await routeLocale(params));
}

/* Every occasion, with search: the start of making an invitation. */
export default async function Page({ params }: PageProps<"/[locale]/invitations">) {
  return <GalleryIndexPage locale={await routeLocale(params)} />;
}
