import { HomePage } from "@/components/landing/home-page";
import { pageAlternates } from "@/lib/seo/paths";

export const metadata = { alternates: pageAlternates({ kind: "home" }, "hi") };

export default function HindiHome() {
  return <HomePage locale="hi" />;
}
