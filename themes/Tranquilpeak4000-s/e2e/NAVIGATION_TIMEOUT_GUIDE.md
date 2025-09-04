# Playwright Navigation Timeout Guide

This guide explains how to handle navigation timeouts in Playwright tests and provides solutions for different loading scenarios.

## 🚨 Understanding the Timeout Issue

### Why Timeouts Happen

The `TimeoutError: page.goto: Timeout 15000ms exceeded` error occurs when:

1. **Page takes too long to load** - All resources (CSS, JS, images) haven't finished loading
2. **Network issues** - Slow connections or server response delays
3. **Heavy resources** - Large images, videos, or complex JavaScript
4. **Server startup** - Hugo server might still be starting up
5. **Resource dependencies** - External resources (CDNs, analytics) taking time

### Default Playwright Behavior

By default, `page.goto()` waits for the "load" event, which means:

- DOM is fully loaded
- All resources (images, stylesheets, scripts) are loaded
- Network requests are complete

This can take much longer than the visual "page loaded" state.

## 🔧 Solutions

### 1. **Increased Timeouts** (Already Applied)

```javascript
// playwright.config.js
use: {
  navigationTimeout: process.env.CI ? 60000 : 30000, // 30s local, 60s CI
}
```

### 2. **Different Loading Strategies**

Use the navigation helper for different scenarios:

```javascript
const { navigateToPage } = require("./utils/navigation-helper");

// Fastest - just DOM content
await navigateToPage(page, "/", { strategy: "fast" });

// Complete - all resources (default)
await navigateToPage(page, "/", { strategy: "complete" });

// Network idle - wait for network to settle
await navigateToPage(page, "/", { strategy: "networkidle" });

// Stable - network idle + stabilization
await navigateToPage(page, "/", { strategy: "stable" });
```

### 3. **Custom Timeouts per Navigation**

```javascript
// Override timeout for specific navigation
await navigateToPage(page, "/", {
  strategy: "networkidle",
  timeout: 45000, // 45 seconds
});
```

### 4. **Retry Logic**

```javascript
const { navigateWithRetry } = require("./utils/navigation-helper");

// Retry navigation up to 3 times
await navigateWithRetry(page, "/", {
  strategy: "networkidle",
  maxRetries: 3,
  retryDelay: 2000,
});
```

## 🎯 When to Use Each Strategy

### `"fast"` Strategy

- **Use for**: Quick checks, when you only need DOM content
- **Pros**: Fastest, good for basic validation
- **Cons**: Resources might not be loaded, styling might be incomplete

```javascript
await navigateToPage(page, "/", { strategy: "fast" });
// Good for: Checking if page exists, basic content validation
```

### `"complete"` Strategy

- **Use for**: When you need all resources loaded
- **Pros**: Ensures everything is loaded
- **Cons**: Slowest, most likely to timeout

```javascript
await navigateToPage(page, "/", { strategy: "complete" });
// Good for: Visual regression tests, when you need exact rendering
```

### `"networkidle"` Strategy (Recommended)

- **Use for**: Most test scenarios
- **Pros**: Good balance of speed and completeness
- **Cons**: May miss very slow resources

```javascript
await navigateToPage(page, "/", { strategy: "networkidle" });
// Good for: Most functional tests, content validation
```

### `"stable"` Strategy

- **Use for**: Visual tests, when you need consistent rendering
- **Pros**: Most reliable for visual comparisons
- **Cons**: Slowest of the practical options

```javascript
await navigateToPage(page, "/", { strategy: "stable" });
// Good for: Visual regression tests, screenshot comparisons
```

## 🔍 Debugging Navigation Issues

### 1. **Check Server Status**

```javascript
// Before navigation, ensure server is ready
await page
  .goto("http://localhost:1313/health", {
    waitUntil: "domcontentloaded",
    timeout: 10000,
  })
  .catch(() => {
    console.log("Server might not be ready yet");
  });
```

### 2. **Monitor Network Activity**

```javascript
// Log all network requests
page.on("request", (request) => {
  console.log(`Request: ${request.url()}`);
});

page.on("response", (response) => {
  console.log(`Response: ${response.url()} - ${response.status()}`);
});
```

### 3. **Check Page Readiness**

```javascript
const { isPageReady, waitForPageReady } = require("./utils/navigation-helper");

// Check if page is ready
const ready = await isPageReady(page);
console.log(`Page ready: ${ready}`);

// Wait for page to be ready
await waitForPageReady(page, { timeout: 30000 });
```

### 4. **Use Enhanced Logging**

```javascript
const { createLogger } = require("./utils/test-logger");

test("example", async ({ page }, testInfo) => {
  const logger = createLogger(testInfo);

  logger.step("Starting navigation");
  await navigateToPage(page, "/", {
    strategy: "networkidle",
    testInfo,
  });
  logger.success("Navigation completed");
});
```

## 🛠️ Advanced Solutions

### 1. **Resource Blocking**

Block unnecessary resources to speed up loading:

```javascript
// Block analytics, ads, etc.
await page.route("**/*", (route) => {
  const url = route.request().url();
  if (url.includes("google-analytics") || url.includes("ads")) {
    route.abort();
  } else {
    route.continue();
  }
});
```

### 2. **Progressive Loading**

```javascript
// Navigate quickly, then wait for specific elements
await page.goto("/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("main", { timeout: 10000 });
```

### 3. **Conditional Waiting**

```javascript
// Wait for specific content to be ready
await page.goto("/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(
  () => {
    return (
      document.querySelector("main") &&
      document.querySelector("main").offsetHeight > 0
    );
  },
  { timeout: 30000 }
);
```

## 📊 Performance Monitoring

### Track Navigation Times

```javascript
const startTime = Date.now();
await navigateToPage(page, "/", { strategy: "networkidle" });
const endTime = Date.now();
console.log(`Navigation took ${endTime - startTime}ms`);
```

### Monitor Resource Loading

```javascript
const resources = [];
page.on("response", (response) => {
  resources.push({
    url: response.url(),
    status: response.status(),
    timing: response.timing(),
  });
});

// After navigation, analyze resources
console.log(`Loaded ${resources.length} resources`);
```

## 🎯 Best Practices

### 1. **Choose the Right Strategy**

- Use `"fast"` for basic checks
- Use `"networkidle"` for most tests
- Use `"stable"` for visual tests

### 2. **Set Appropriate Timeouts**

- Local development: 30 seconds
- CI environments: 60 seconds
- Custom timeouts for specific pages

### 3. **Use Retry Logic**

- Implement retries for flaky navigation
- Add delays between retries
- Log retry attempts

### 4. **Monitor and Debug**

- Use enhanced logging
- Monitor network activity
- Check server readiness

### 5. **Optimize Your Site**

- Minimize resource sizes
- Use CDNs for external resources
- Optimize images and scripts

## 🔧 Configuration Examples

### For Different Environments

```javascript
// playwright.config.js
use: {
  navigationTimeout: process.env.CI ? 60000 : 30000,
  actionTimeout: process.env.CI ? 10000 : 5000,
}
```

### For Different Test Types

```javascript
// Visual regression tests
await navigateToPage(page, "/", {
  strategy: "stable",
  timeout: 45000,
});

// Functional tests
await navigateToPage(page, "/", {
  strategy: "networkidle",
  timeout: 30000,
});

// Quick checks
await navigateToPage(page, "/", {
  strategy: "fast",
  timeout: 15000,
});
```

This approach provides flexible, reliable navigation handling that can adapt to different scenarios and environments.
