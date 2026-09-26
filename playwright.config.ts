import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  projects: [
    {
      name: "phone-320",
      use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 700 } },
    },
    {
      name: "desktop-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  // Tests run against the production build, like real users see it
  webServer: {
    command: `npm run start -- -p ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
    // Waitlist sign-ups are logged instead of sent anywhere, and sign-in runs in preview
    // mode (any number, code 123456) instead of reaching Supabase
    env: { WAITLIST_LOG_ONLY: "1", NIMANTRAN_AUTH_PREVIEW: "1" },
  },
});
