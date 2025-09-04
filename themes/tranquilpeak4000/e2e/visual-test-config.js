/**
 * Configuration for visual regression tests
 *
 * This configuration is designed for Linux-only baseline generation.
 * Tests are configured to only run on Linux to ensure consistent
 * rendering and avoid cross-platform differences.
 */

const path = require("path");

// Base configuration
const baseConfig = {
  // CSS file to stabilize screenshots
  stylePath: path.join(__dirname, "screenshot-stabilization.css"),

  // Default settings
  animations: "disabled",
  caret: "hide",
};

// Simple tolerance levels
const toleranceLevels = {
  // CI environment - more tolerant due to different rendering
  ci: {
    maxDiffPixels: 10000,
    maxDiffPixelRatio: 0.1, // 10% tolerance for CI
  },

  // Local development - more strict for catching issues
  local: {
    maxDiffPixels: 2000,
    maxDiffPixelRatio: 0.05, // 5% tolerance for local
  },
};

// Test-specific configurations
const testConfigs = {
  homepage: {
    ...baseConfig,
    ...toleranceLevels.local,
  },
};

// Helper function to get configuration for CI environment
function getCIConfig(testType = "homepage") {
  return {
    ...baseConfig,
    ...toleranceLevels.ci,
  };
}

// Helper function to get configuration for local environment
function getVisualTestConfig(testType = "homepage") {
  return testConfigs[testType] || testConfigs.homepage;
}

module.exports = {
  baseConfig,
  toleranceLevels,
  testConfigs,
  getVisualTestConfig,
  getCIConfig,
};
