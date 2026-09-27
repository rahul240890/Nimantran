import { notFound } from "next/navigation";
import { WeddingKindPage } from "@/components/gallery/gallery-pages";
import { publicMetadata } from "@/components/seo/pages";
import { WEDDING_KINDS, isWeddingKind } from "@/lib/gallery/catalog";

export const dynamicParams = false;

/* Only a wedding has kinds: /invitations/wedding/gujarati. */
export function generateStaticParams() {
  return WEDDING_KINDS.map((kind) => ({ occasion: "wedding", kind }));
}

export async function generateMetadata({ params }: PageProps<"/hi/invitations/[occasion]/[kind]">) {
  const { occasion, kind } = await params;
  return occasion === "wedding" && isWeddingKind(kind)
    ? publicMetadata({ kind: "wedding-kind", id: kind }, "hi")
    : {};
}

export default async function Page({ params }: PageProps<"/hi/invitations/[occasion]/[kind]">) {
  const { occasion, kind } = await params;
  if (occasion !== "wedding" || !isWeddingKind(kind)) notFound();
  return <WeddingKindPage kind={kind} locale="hi" />;
}
