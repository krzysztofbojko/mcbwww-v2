import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3000/pl",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    // Production mode needs a captcha secret, otherwise /api/captcha answers 503 on the contact page.
    // SITE_URL is required by a production build (it is baked into canonical URLs, sitemap and robots).
    // RESEND_API_KEY is forced empty so the contact e2e test always ends in the „not_configured” answer.
    env: { CAPTCHA_SECRET: "e2e-only-captcha-secret", SITE_URL: "http://localhost:3000", RESEND_API_KEY: "" },
  },
});
