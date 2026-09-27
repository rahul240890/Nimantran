import { LegalPage } from "@/components/seo/legal-page";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "privacy" }, "hi");

export default function Page() {
  return <LegalPage locale="hi" kind="privacy" />;
}
