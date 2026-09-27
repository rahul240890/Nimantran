import { LegalPage } from "@/components/seo/legal-page";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "terms" }, "en");

export default function Page() {
  return <LegalPage locale="en" kind="terms" />;
}
