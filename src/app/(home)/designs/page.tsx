import { DesignsPage, publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "designs" }, "en");

export default function Page() {
  return <DesignsPage locale="en" />;
}
