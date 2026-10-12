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
    // The host's preview plays the guest page inside a phone on its own page (wide screens)
    {
      source: "/invites/:id/preview",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        {
          key: "Content-Security-Policy",
          value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
        },
      ],
    },
  ],
  // The site has several root layouts, so unmatched addresses need their own page
  experimental: { globalNotFound: true },
  // Link-preview images read these at request time (src/lib/og/assets.ts)
  outputFileTracingIncludes: {
    "/i/**": [
      "./src/app/globals.css",
      "./node_modules/@fontsource/rozha-one/files/rozha-one-{latin,devanagari}-400-normal.woff",
      "./node_modules/@fontsource/tenor-sans/files/tenor-sans-latin-400-normal.woff",
      "./public/suites/*/preview.jpg",
    ],
  },
};

export default nextConfig;
