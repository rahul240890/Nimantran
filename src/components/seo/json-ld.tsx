import { jsonLdText } from "@/lib/seo/structured-data";

/*
 * Structured data for search engines, one script tag for each thing. Some readers (Safari
 * extensions among them) expect "@context" at the top of every tag, and a list has none.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const things = Array.isArray(data) ? data : [data];
  return (
    <>
      {things.map((thing, index) => (
        <script
          key={index}
          type="application/ld+json"
          // Built from our own data and escaped by jsonLdText
          dangerouslySetInnerHTML={{ __html: jsonLdText(thing) }}
        />
      ))}
    </>
  );
}
