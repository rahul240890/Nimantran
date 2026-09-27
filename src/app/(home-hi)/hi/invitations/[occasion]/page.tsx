import { notFound } from "next/navigation";
import { OccasionPage, publicMetadata } from "@/components/seo/pages";
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
  return <OccasionPage id={occasion} locale="hi" />;
}
