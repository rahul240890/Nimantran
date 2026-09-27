import { DesignsPage, publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "designs" }, "hi");

export default function Page() {
  return <DesignsPage locale="hi" />;
}
