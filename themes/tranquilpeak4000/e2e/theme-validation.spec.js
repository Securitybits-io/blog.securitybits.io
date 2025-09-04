const { test, expect } = require("@playwright/test");
const { createLogger } = require("./utils/test-logger");

test.describe("Hugo Tranquilpeak Theme Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("page loads without errors", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing page loads without console errors");

    // Check for console errors
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState("networkidle");

    // Verify page loaded successfully
    await expect(page).toHaveTitle(/./);

    // Report any console errors
    if (errors.length > 0) {
      logger.warn("Console errors detected:", errors);
    }

    expect(errors.length).toBe(0);
    logger.success("Page loads without errors test passed");
  });

  test("basic page elements are present", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing basic page elements are present");

    await page.waitForLoadState("networkidle");

    // Check that the page has basic content
    await expect(page.locator("body")).toBeVisible();
    logger.debug("Body element is visible");
    
    // Check for a heading (h1, h2, h3, etc.)
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    logger.info(`Found ${headingCount} headings on page`);

    // Check that the page has some content
    const content = page.locator("main, .content, article, .post");
    const contentCount = await content.count();
    expect(contentCount).toBeGreaterThan(0);
    logger.info(`Found ${contentCount} content areas on page`);

    logger.success("Basic page elements test passed");
  });

  test("images load correctly", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing images load correctly");

    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const imageCount = await images.count();
    logger.info(`Found ${imageCount} images on page`);

    if (imageCount > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        
        // Check if image has src attribute
        await expect(img).toHaveAttribute("src");
        
        // Check if image is attached to the DOM (more lenient than visibility)
        await expect(img).toBeAttached();
        
        logger.debug(`Image ${i + 1} is properly attached with src attribute`);
      }
      logger.success(`Validated ${Math.min(imageCount, 3)} images successfully`);
    } else {
      logger.info("No images found on page");
    }

    logger.success("Images load correctly test passed");
  });

  test("CSS and JS resources load successfully", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);
    const failedRequests = [];

    logger.step("Testing CSS and JS resources load successfully");

    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for CSS files
    const stylesheets = page.locator('link[rel="stylesheet"]');
    const cssCount = await stylesheets.count();
    expect(cssCount).toBeGreaterThan(0);
    logger.info(`Found ${cssCount} CSS stylesheets`);

    if (failedRequests.length > 0) {
      logger.warn("Failed resource requests:", failedRequests);
      expect(failedRequests.length).toBe(0);
    } else {
      logger.success("All resources loaded successfully");
    }

    logger.success("CSS and JS resources test passed");
  });
});
