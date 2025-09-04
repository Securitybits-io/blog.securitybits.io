# Playwright Logging Best Practices

This guide covers better alternatives to `console.log` in Playwright tests and when to use each approach.

## 🎯 Why Replace `console.log`?

- **Better integration** with Playwright's reporting system
- **Structured logging** with different levels (error, warn, info, debug)
- **Test annotations** that appear in HTML reports
- **Environment-specific** logging (different levels for CI vs local)
- **Better debugging** with contextual information

## 📋 Logging Options Overview

### 1. **Custom Logger Utility** (Recommended)

**Best for**: Most test scenarios, structured logging, CI/CD integration

```javascript
const { createLogger } = require("./utils/test-logger");

test("example", async ({ page }, testInfo) => {
  const logger = createLogger(testInfo);

  logger.info("Starting test");
  logger.step("Navigating to page");
  logger.success("Test completed");
  logger.error("Something went wrong", error);
});
```

**Benefits**:

- ✅ Structured logging with levels
- ✅ Test annotations in reports
- ✅ Environment-aware (different levels for CI)
- ✅ Emojis for visual distinction
- ✅ Timestamps and test context
- ✅ Child loggers for specific contexts

### 2. **Playwright Test Annotations**

**Best for**: Important test milestones, CI/CD reporting

```javascript
test("example", async ({ page }, testInfo) => {
  testInfo.annotations.push({
    type: "info",
    description: "Starting navigation test",
  });

  await page.goto("/");

  testInfo.annotations.push({
    type: "success",
    description: "Successfully navigated to homepage",
  });
});
```

**Benefits**:

- ✅ Appears in HTML reports
- ✅ Visible in CI/CD pipelines
- ✅ Structured data
- ✅ No console noise

### 3. **Playwright Built-in Logging**

**Best for**: Browser console monitoring, network requests

```javascript
test("example", async ({ page }) => {
  // Monitor console messages
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("Browser error:", msg.text());
    }
  });

  // Monitor network requests
  page.on("request", (request) => {
    console.log("Request:", request.url());
  });

  // Monitor responses
  page.on("response", (response) => {
    if (response.status() >= 400) {
      console.error("Error response:", response.url(), response.status());
    }
  });
});
```

**Benefits**:

- ✅ Real-time browser monitoring
- ✅ Network request tracking
- ✅ Error detection
- ✅ Performance insights

### 4. **Environment Variables for Logging**

**Best for**: Controlling log verbosity across environments

```bash
# Set log level via environment variable
LOG_LEVEL=debug npm run test:e2e
LOG_LEVEL=error npm run test:e2e:ci
```

**Available levels**:

- `error` - Only errors
- `warn` - Warnings and errors
- `info` - Info, warnings, and errors (default)
- `debug` - Debug, info, warnings, and errors
- `trace` - All messages (most verbose)

## 🔄 Migration Guide

### Before (using console.log):

```javascript
test("blog posts are accessible", async ({ page }) => {
  await page.goto("/");

  const postLinks = page.locator('a[href*="/post/"]');
  const postLinkCount = await postLinks.count();

  console.log(`Found ${postLinkCount} blog post links`);

  if (postLinkCount > 0) {
    console.log("Testing first post link...");
    // ... test logic
    console.log("✅ Post link test passed");
  } else {
    console.log("⚠️ No post links found");
  }
});
```

### After (using enhanced logger):

```javascript
const { createLogger } = require("../utils/test-logger");

test("blog posts are accessible", async ({ page }, testInfo) => {
  const logger = createLogger(testInfo);

  logger.step("Navigating to homepage");
  await page.goto("/");

  const postLinks = page.locator('a[href*="/post/"]');
  const postLinkCount = await postLinks.count();

  logger.info(`Found ${postLinkCount} blog post links`);

  if (postLinkCount > 0) {
    logger.step("Testing first post link");
    // ... test logic
    logger.success("Post link test passed");
  } else {
    logger.warn("No post links found");
  }
});
```

## 🎨 Logging Levels and When to Use Them

### `logger.error()`

- **When**: Test failures, exceptions, critical issues
- **Example**: `logger.error("Failed to navigate to page", error)`
- **Output**: 🔴 2024-01-15T10:30:00.000Z ERROR [Test Name]: Failed to navigate to page

### `logger.warn()`

- **When**: Non-critical issues, deprecation warnings, missing optional elements
- **Example**: `logger.warn("Header not visible - may be normal for this theme")`
- **Output**: 🟡 2024-01-15T10:30:00.000Z WARN [Test Name]: Header not visible

### `logger.info()`

- **When**: Important test steps, significant findings, general information
- **Example**: `logger.info("Found 5 blog post links")`
- **Output**: ℹ️ 2024-01-15T10:30:00.000Z INFO [Test Name]: Found 5 blog post links

### `logger.debug()`

- **When**: Detailed debugging information, step-by-step progress
- **Example**: `logger.debug("Testing post link 1: /post/example")`
- **Output**: 🔍 2024-01-15T10:30:00.000Z DEBUG [Test Name]: Testing post link 1

### `logger.success()`

- **When**: Successful test steps, positive outcomes
- **Example**: `logger.success("Successfully navigated to post")`
- **Output**: ✅ 2024-01-15T10:30:00.000Z SUCCESS [Test Name]: Successfully navigated to post

### `logger.step()`

- **When**: Major test steps, navigation actions
- **Example**: `logger.step("Navigating to homepage")`
- **Output**: 👣 2024-01-15T10:30:00.000Z STEP [Test Name]: Navigating to homepage

## 🚀 Advanced Features

### Child Loggers

```javascript
const logger = createLogger(testInfo);
const navLogger = logger.child("Navigation");
const formLogger = logger.child("Form Validation");

navLogger.info("Starting navigation test");
formLogger.info("Validating form inputs");
```

### Conditional Logging

```javascript
// Only log debug messages in development
if (process.env.NODE_ENV === "development") {
  logger.debug("Detailed debug information");
}
```

### Logging with Data

```javascript
logger.info("Page loaded", {
  title: await page.title(),
  url: page.url(),
  loadTime: performance.now(),
});
```

## 📊 Reporting Integration

### HTML Reports

Test annotations appear in Playwright's HTML reports:

- Navigate to `playwright-report/index.html`
- Click on any test
- View annotations in the test details

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Run tests with debug logging
  run: LOG_LEVEL=debug npm run test:e2e:ci
  env:
    CI: true
```

### Allure Reports

For even better reporting, consider using Allure:

```bash
npm install --save-dev allure-playwright
npx allure generate allure-results --clean
npx allure open
```

## 🎯 Best Practices

1. **Use appropriate log levels** - Don't log everything as info
2. **Include context** - Always mention what you're testing
3. **Log test steps** - Use `logger.step()` for major actions
4. **Log successes** - Use `logger.success()` for positive outcomes
5. **Include data when helpful** - Pass objects for complex information
6. **Use child loggers** - For specific test contexts
7. **Set environment-specific levels** - Debug for local, error for CI

## 🔧 Configuration

### Environment Variables

```bash
# Set default log level
export LOG_LEVEL=info

# Override for specific runs
LOG_LEVEL=debug npm run test:e2e
```

### Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:debug": "LOG_LEVEL=debug playwright test",
    "test:e2e:ci": "LOG_LEVEL=error playwright test"
  }
}
```

This approach provides much better logging than `console.log` while maintaining simplicity and providing rich features for debugging and reporting.
