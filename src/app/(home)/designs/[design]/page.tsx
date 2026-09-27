import { notFound } from "next/navigation";
import { DesignPage, publicMetadata } from "@/components/seo/pages";
import { TEMPLATE_IDS, isTemplateId } from "@/lib/templates/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_IDS.map((design) => ({ design }));
}

export async function generateMetadata({ params }: PageProps<"/designs/[design]">) {
  const { design } = await params;
  return isTemplateId(design) ? publicMetadata({ kind: "design", id: design }, "en") : {};
}

export default async function Page({ params }: PageProps<"/designs/[design]">) {
  const { design } = await params;
  if (!isTemplateId(design)) notFound();
  return <DesignPage id={design} locale="en" />;
}
