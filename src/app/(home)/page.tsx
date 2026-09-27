import { HomePage } from "@/components/landing/home-page";
import { pageAlternates } from "@/lib/seo/paths";

export const metadata = { alternates: pageAlternates({ kind: "home" }, "en") };

export default function EnglishHome() {
  return <HomePage locale="en" />;
}
