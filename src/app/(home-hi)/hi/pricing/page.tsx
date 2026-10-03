import { PricingPage } from "@/components/seo/info-pages";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "pricing" }, "hi");

export default function Page() {
  return <PricingPage locale="hi" />;
}
