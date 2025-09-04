const { test, expect } = require("@playwright/test");
const {
  navigateToPage,
  navigateWithRetry,
  isPageReady,
} = require("./utils/navigation-helper");
const { createLogger } = require("./utils/test-logger");

test.describe("Navigation Helper Tests", () => {
  test("fast navigation strategy", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing fast navigation strategy");
    const startTime = Date.now();

    await navigateToPage(page, "/", {
      strategy: "fast",
      testInfo,
    });

    const endTime = Date.now();
    logger.info(`Fast navigation took ${endTime - startTime}ms`);

    // Verify page loaded
    await expect(page.locator("body")).toBeVisible();
    logger.success("Fast navigation test passed");
  });

  test("networkidle navigation strategy", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing networkidle navigation strategy");
    const startTime = Date.now();

    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    const endTime = Date.now();
    logger.info(`networkidle navigation took ${endTime - startTime}ms`);

    // Verify page loaded
    await expect(page.locator("body")).toBeVisible();
    logger.success("networkidle navigation test passed");
  });

  test("stable navigation strategy", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing stable navigation strategy");
    const startTime = Date.now();

    await navigateToPage(page, "/", {
      strategy: "stable",
      testInfo,
    });

    const endTime = Date.now();
    logger.info(`Stable navigation took ${endTime - startTime}ms`);

    // Verify page loaded
    await expect(page.locator("body")).toBeVisible();
    logger.success("Stable navigation test passed");
  });

  test("navigation with retry", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing navigation with retry logic");

    await navigateWithRetry(page, "/", {
      strategy: "networkidle",
      maxRetries: 2,
      retryDelay: 1000,
      testInfo,
    });

    // Verify page loaded
    await expect(page.locator("body")).toBeVisible();
    logger.success("Navigation with retry test passed");
  });

  test("page readiness check", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing page readiness check");

    // Navigate to page and wait for all resources to load
    await page.goto("/", { waitUntil: "load" });

    // Check if page is ready
    const ready = await isPageReady(page);
    logger.info(`Page ready: ${ready}`);

    expect(ready).toBe(true);
    logger.success("Page readiness check passed");
  });

  test("custom timeout navigation", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing navigation with custom timeout");

    await navigateToPage(page, "/", {
      strategy: "networkidle",
      timeout: 45000, // 45 seconds
      testInfo,
    });

    // Verify page loaded
    await expect(page.locator("body")).toBeVisible();
    logger.success("Custom timeout navigation test passed");
  });
});
