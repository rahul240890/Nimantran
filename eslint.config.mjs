import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Every picture comes through components/ui/image.tsx, which shows the picture as it is
    // when the image resizer refuses (on the free plan, once its month's allowance is spent)
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/image.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/image",
              message:
                'Use { Image } from "@/components/ui/image", which falls back when the resizer refuses.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The marketing videos are their own Remotion project (marketing/videos/README.md)
    "marketing/**",
  ]),
]);

export default eslintConfig;
