import { jsonLdText } from "@/lib/seo/structured-data";

/** Structured data for search engines, in a script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Built from our own data and escaped by jsonLdText
      dangerouslySetInnerHTML={{ __html: jsonLdText(data) }}
    />
  );
}
