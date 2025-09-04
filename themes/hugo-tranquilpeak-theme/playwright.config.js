// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  testIgnore: [
    "**/utils/**",
    "**/examples/**",
    "**/*.md",
    "**/*.css",
    "**/*.config.js",
    "**/snapshots/**",
  ],
  timeout: process.env.CI ? 60000 : 30000, // Increased timeout for CI
  expect: {
    timeout: process.env.CI ? 30000 : 10000, // Increased expect timeout for CI
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Retries for CI stability
  workers: process.env.CI ? 2 : 8, // Reduced workers for CI stability
  maxFailures: process.env.CI ? 10 : 5, // Increased max failures for CI
  reporter: process.env.CI
    ? [
        ["json", { outputFile: "playwright-report/results.json" }],
        ["list"],
        ["github"],
        ["html", { outputFolder: "playwright-report" }],
      ]
    : [
        ["json", { outputFile: "playwright-report/results.json" }],
        ["html", { open: "true" }],
        ["list"],
        ["allure-playwright", { outputFolder: "allure-results" }],
      ],
  use: {
    baseURL: "http://localhost:1313",
    trace: process.env.CI ? "on-first-retry" : "off",
    screenshot: process.env.CI ? "on" : "only-on-failure",
    video: "retain-on-failure",
    // Add more robust settings for CI
    actionTimeout: process.env.CI ? 15000 : 10000,
    navigationTimeout: process.env.CI ? 60000 : 30000,
    // Enhanced logging settings
    logger: {
      isEnabled: (name, severity) => true,
      log: (name, severity, message, args) => {
        const timestamp = new Date().toISOString();
        const level = severity.toUpperCase();
        console.log(`${timestamp} [${level}] ${name}: ${message}`);
      },
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // Only run on Linux for consistent baseline generation (unless FORCE_ALL_BROWSERS is set)
      testIgnore: (process.platform !== "linux" && !process.env.FORCE_ALL_BROWSERS) ? /.*/ : undefined,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      // Only run on Linux for consistent baseline generation (unless FORCE_ALL_BROWSERS is set)
      testIgnore: (process.platform !== "linux" && !process.env.FORCE_ALL_BROWSERS) ? /.*/ : undefined,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      // Only run on Linux for consistent baseline generation (unless FORCE_ALL_BROWSERS is set)
      testIgnore: (process.platform !== "linux" && !process.env.FORCE_ALL_BROWSERS) ? /.*/ : undefined,
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      // Only run on Linux for consistent baseline generation (unless FORCE_ALL_BROWSERS is set)
      testIgnore: (process.platform !== "linux" && !process.env.FORCE_ALL_BROWSERS) ? /.*/ : undefined,
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
      // Only run on Linux for consistent baseline generation (unless FORCE_ALL_BROWSERS is set)
      testIgnore: (process.platform !== "linux" && !process.env.FORCE_ALL_BROWSERS) ? /.*/ : undefined,
    },
  ],

  webServer: {
    command: "node scripts/start-webserver.js",
    url: "http://localhost:1313",
    timeout: process.env.CI ? 180000 : 120000, // Increased timeout for CI
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
