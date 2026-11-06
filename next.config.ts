import type { NextConfig } from "next";

/*
 * Safe defaults for every response (docs/LAUNCH.md). Scripts are not restricted by a CSP,
 * as the theme and structured-data scripts are inline; framing and plugins are.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites see only our origin, never a guest's private link
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
  },
  // Razorpay's checkout window pays with UPI apps and Google Pay through the Payment
  // Request API, which a blanket payment=() switches off inside its frame
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), payment=(self "https://api.razorpay.com" "https://checkout.razorpay.com")',
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => [
    { source: "/:path*", headers: SECURITY_HEADERS },
    // The paintings keep their names when redrawn, so a day's cache, refreshed quietly after
    ...["/suites/:path*", "/openings/:path*", "/cards/:path*"].map((source) => ({
      source,
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
      ],
    })),
    // The host's preview plays the guest page inside a phone on its own page (wide screens),
    // signed in or tried before signing in
    ...["/invites/:id/preview", "/try/website"].map((source) => ({
      source,
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        {
          key: "Content-Security-Policy",
          value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
        },
      ],
    })),
  ],
  images: {
    // 480 sits between 384 and 640, so a phone's hero cards (about 430px wide) aren't sent at 640
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 480],
  },
  // The site has several root layouts, so unmatched addresses need their own page
  experimental: { globalNotFound: true },
  // Link-preview images read these at request time (src/lib/og/assets.ts)
  outputFileTracingIncludes: {
    "/i/**": [
      "./src/app/globals.css",
      "./node_modules/@fontsource/rozha-one/files/rozha-one-{latin,devanagari}-400-normal.woff",
      "./node_modules/@fontsource/tenor-sans/files/tenor-sans-latin-400-normal.woff",
      // The scripts the preview's names and places may be in (src/lib/og/text.ts)
      "./node_modules/@fontsource/baloo-bhai-2/files/baloo-bhai-2-gujarati-600-normal.woff",
      "./node_modules/@fontsource/baloo-da-2/files/baloo-da-2-bengali-600-normal.woff",
      "./node_modules/@fontsource/catamaran/files/catamaran-tamil-600-normal.woff",
      "./public/suites/*/preview.jpg",
    ],
  },
  /*
   * Keep the server bundles small, as Vercel bills every deployment's functions for storage.
   * The cover's painting is read by a path made at request time (src/lib/og/cover.tsx), which
   * the tracer can't narrow, so it would copy every file in public/ (about 600 MB) into the
   * link-preview functions; they need only the previews listed above. Public files are served
   * from the CDN, never from a function. Vercel's functions run on glibc x64, so sharp's musl
   * and WebAssembly builds (about 28 MB in every function) are never loaded there.
   */
  outputFileTracingExcludes: {
    "/**": [
      "./node_modules/@img/sharp-libvips-linuxmusl-x64/**",
      "./node_modules/@img/sharp-linuxmusl-x64/**",
      "./node_modules/@img/sharp-wasm32/**",
    ],
    ...Object.fromEntries(
      ["/i/**", "/invites/**"].map((route) => [
        route,
        // Everything but the jpg previews (all other public media is webp, png, svg and the like)
        ["./public/**/*.{webp,png,svg,json,mp4,m4a,webm}"],
      ]),
    ),
  },
};

export default nextConfig;
