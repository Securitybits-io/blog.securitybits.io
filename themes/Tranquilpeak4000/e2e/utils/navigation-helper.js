/**
 * Navigation helper utilities for Playwright tests
 * Provides different strategies for page navigation to handle various loading scenarios
 */

const { createLogger } = require("./test-logger");

/**
 * Navigate to a page with different loading strategies
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} url - URL to navigate to
 * @param {Object} options - Navigation options
 * @param {string} options.strategy - Loading strategy ('fast', 'complete', 'networkidle', 'domcontentloaded')
 * @param {number} options.timeout - Custom timeout in milliseconds
 * @param {import('@playwright/test').TestInfo} options.testInfo - Test info for logging
 * @returns {Promise<void>}
 */
async function navigateToPage(page, url, options = {}) {
  const { strategy = "fast", timeout = null, testInfo = null } = options;

  const logger = createLogger(testInfo);

  try {
    // Log timeout information if provided
    if (timeout) {
      logger.debug(`Using custom timeout: ${timeout}ms`);
    }

    logger.debug(`Navigating to ${url} with strategy: ${strategy}`);

    switch (strategy) {
      case "fast":
        // Fastest: Just wait for DOM content loaded
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: timeout || undefined,
        });
        logger.debug("DOM content loaded");
        break;

      case "complete":
        // Complete: Wait for all resources (default behavior)
        await page.goto(url, {
          waitUntil: "load",
          timeout: timeout || undefined,
        });
        logger.debug("All resources loaded");
        break;

      case "networkidle":
        // Network idle: Wait for network to be idle
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: timeout || undefined,
        });
        await page.waitForLoadState("networkidle");
        logger.debug("Network is idle");
        break;

      case "stable":
        // Stable: Wait for network idle + additional stabilization
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: timeout || undefined,
        });
        await page.waitForLoadState("networkidle");
        await waitForPageStabilization(page, logger);
        logger.debug("Page is stable");
        break;

      default:
        throw new Error(`Unknown navigation strategy: ${strategy}`);
    }

    logger.success(`Successfully navigated to ${url}`);
  } catch (error) {
    logger.error(`Failed to navigate to ${url}`, error);
    throw error;
  }
}

/**
 * Wait for page to stabilize (no loading indicators, animations complete)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} logger - Logger instance
 * @returns {Promise<void>}
 */
async function waitForPageStabilization(page, logger) {
  logger.debug("Waiting for page stabilization...");

  // Wait for any animations to complete
  await page.waitForTimeout(1000);

  // Wait for any loading indicators to disappear
  try {
    await page.waitForFunction(
      () => {
        const loadingSelectors = [
          "[data-loading]",
          ".loading",
          ".spinner",
          ".loader",
          "[aria-busy='true']",
          ".is-loading",
        ];

        return !loadingSelectors.some((selector) =>
          document.querySelector(selector)
        );
      },
      { timeout: 10000 }
    );
    logger.debug("Loading indicators cleared");
  } catch (error) {
    logger.debug("No loading indicators found or timeout reached");
  }

  // Additional wait for CI environment
  if (process.env.CI) {
    await page.waitForTimeout(2000);
    logger.debug("Additional CI stabilization wait completed");
  }
}

/**
 * Navigate to a page with retry logic
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} url - URL to navigate to
 * @param {Object} options - Navigation options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.retryDelay - Delay between retries in milliseconds
 * @param {import('@playwright/test').TestInfo} options.testInfo - Test info for logging
 * @returns {Promise<void>}
 */
async function navigateWithRetry(page, url, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 2000,
    testInfo = null,
    ...navigationOptions
  } = options;

  const logger = createLogger(testInfo);
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Navigation attempt ${attempt}/${maxRetries}`);
      await navigateToPage(page, url, { ...navigationOptions, testInfo });
      return; // Success
    } catch (error) {
      lastError = error;
      logger.warn(`Navigation attempt ${attempt} failed: ${error.message}`);

      if (attempt < maxRetries) {
        logger.debug(`Retrying in ${retryDelay}ms...`);
        await page.waitForTimeout(retryDelay);
      }
    }
  }

  // All retries failed
  logger.error(`Navigation failed after ${maxRetries} attempts`);
  throw lastError;
}

/**
 * Check if the page is ready for interaction
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>}
 */
async function isPageReady(page) {
  try {
    // Check if document is ready
    const readyState = await page.evaluate(() => document.readyState);
    if (readyState !== "complete") {
      return false;
    }

    // Check if body is visible
    const bodyVisible = await page.locator("body").isVisible();
    if (!bodyVisible) {
      return false;
    }

    // Check for any loading indicators
    const hasLoadingIndicators = await page.evaluate(() => {
      const loadingSelectors = [
        "[data-loading]",
        ".loading",
        ".spinner",
        ".loader",
        "[aria-busy='true']",
        ".is-loading",
      ];

      return loadingSelectors.some((selector) =>
        document.querySelector(selector)
      );
    });

    return !hasLoadingIndicators;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for page to be ready for interaction
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} options - Options
 * @param {number} options.timeout - Timeout in milliseconds
 * @param {import('@playwright/test').TestInfo} options.testInfo - Test info for logging
 * @returns {Promise<void>}
 */
async function waitForPageReady(page, options = {}) {
  const { timeout = 30000, testInfo = null } = options;
  const logger = createLogger(testInfo);

  logger.debug(`Waiting for page to be ready (timeout: ${timeout}ms)...`);

  await page.waitForFunction(
    () => {
      // Check document ready state
      if (document.readyState !== "complete") {
        return false;
      }

      // Check if body is visible
      if (!document.body || !document.body.offsetHeight) {
        return false;
      }

      // Check for loading indicators
      const loadingSelectors = [
        "[data-loading]",
        ".loading",
        ".spinner",
        ".loader",
        "[aria-busy='true']",
        ".is-loading",
      ];

      return !loadingSelectors.some((selector) =>
        document.querySelector(selector)
      );
    },
    { timeout }
  );

  logger.debug("Page is ready for interaction");
}

module.exports = {
  navigateToPage,
  navigateWithRetry,
  waitForPageStabilization,
  isPageReady,
  waitForPageReady,
};
