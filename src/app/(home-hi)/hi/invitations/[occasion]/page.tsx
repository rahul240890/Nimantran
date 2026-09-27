import { notFound } from "next/navigation";
import { OccasionGalleryPage } from "@/components/gallery/gallery-pages";
import { publicMetadata } from "@/components/seo/pages";
import { CATEGORY_IDS, isCategoryId } from "@/lib/categories/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_IDS.map((occasion) => ({ occasion }));
}

export async function generateMetadata({ params }: PageProps<"/hi/invitations/[occasion]">) {
  const { occasion } = await params;
  return isCategoryId(occasion) ? publicMetadata({ kind: "occasion", id: occasion }, "hi") : {};
}

export default async function Page({ params }: PageProps<"/hi/invitations/[occasion]">) {
  const { occasion } = await params;
  if (!isCategoryId(occasion)) notFound();
  return <OccasionGalleryPage id={occasion} locale="hi" />;
}
