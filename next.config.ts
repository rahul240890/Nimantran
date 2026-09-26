import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site has several root layouts, so unmatched addresses need their own page
  experimental: { globalNotFound: true },
  // Link-preview images read these at request time (src/lib/og/assets.ts)
  outputFileTracingIncludes: {
    "/i/**": [
      "./src/app/globals.css",
      "./node_modules/@fontsource/rozha-one/files/rozha-one-{latin,devanagari}-400-normal.woff",
      "./node_modules/@fontsource/tenor-sans/files/tenor-sans-latin-400-normal.woff",
    ],
  },
};

export default nextConfig;
