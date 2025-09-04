#!/usr/bin/env node

/**
 * Script to generate baseline screenshots for visual regression tests
 * Run this before running visual regression tests for the first time
 */

const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

async function generateBaselines() {
  console.log(
    "🎨 Generating baseline screenshots for visual regression tests..."
  );

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the site
    await page.goto("http://localhost:1313");
    await page.waitForLoadState("networkidle");

    // Create snapshots directory if it doesn't exist
    const snapshotsDir = path.join(
      __dirname,
      "e2e",
      "visual-regression.spec.js-snapshots"
    );
    if (!fs.existsSync(snapshotsDir)) {
      fs.mkdirSync(snapshotsDir, { recursive: true });
    }

    // Generate baseline screenshots for different viewports
    const viewports = [
      { name: "homepage-desktop", width: 1200, height: 800 },
      { name: "homepage-tablet", width: 768, height: 1024 },
      { name: "homepage-mobile", width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      console.log(`📸 Generating ${viewport.name} baseline...`);

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.waitForTimeout(1000);

      const screenshotPath = path.join(
        snapshotsDir,
        `${viewport.name}-chromium-linux.png`
      );
      await page.screenshot({ path: screenshotPath });

      console.log(`✅ Generated ${screenshotPath}`);
    }

    console.log("🎉 Baseline screenshots generated successfully!");
    console.log("📁 Screenshots saved to:", snapshotsDir);
  } catch (error) {
    console.error("❌ Error generating baseline screenshots:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check if Hugo server is running
async function checkServer() {
  try {
    const response = await fetch("http://localhost:1313");
    return response.ok;
  } catch {
    return false;
  }
}

// Main execution
async function main() {
  console.log("🔍 Checking if Hugo server is running...");

  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error("❌ Hugo server is not running on http://localhost:1313");
    console.log("💡 Please start the Hugo server first:");
    console.log("   npm run test:e2e");
    process.exit(1);
  }

  await generateBaselines();
}

main().catch(console.error);
