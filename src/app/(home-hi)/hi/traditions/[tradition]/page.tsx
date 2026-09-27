import { notFound } from "next/navigation";
import { TraditionPage, publicMetadata } from "@/components/seo/pages";
import { isTraditionId } from "@/lib/traditions/catalog";
import { TRADITION_IDS } from "@/lib/traditions/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRADITION_IDS.map((tradition) => ({ tradition }));
}

export async function generateMetadata({ params }: PageProps<"/hi/traditions/[tradition]">) {
  const { tradition } = await params;
  return isTraditionId(tradition) ? publicMetadata({ kind: "tradition", id: tradition }, "hi") : {};
}

export default async function Page({ params }: PageProps<"/hi/traditions/[tradition]">) {
  const { tradition } = await params;
  if (!isTraditionId(tradition)) notFound();
  return <TraditionPage id={tradition} locale="hi" />;
}
