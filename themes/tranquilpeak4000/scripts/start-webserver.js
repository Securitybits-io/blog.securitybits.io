#!/usr/bin/env node

/**
 * Custom webServer startup script for Playwright
 * Ensures Hugo server is fully ready before tests start
 */

const { spawn } = require("child_process");
const http = require("http");

// Configuration
const SERVER_URL = "http://localhost:1313";
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000; // 2 seconds

/**
 * Check if the server is ready by making an HTTP request
 */
function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get(SERVER_URL, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        // Check if response is 200 and has content
        const isReady =
          res.statusCode === 200 &&
          (data.includes("<body") || data.includes("<!DOCTYPE html>"));
        resolve(isReady);
      });
    });

    req.on("error", () => {
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Wait for server to be ready with retries
 */
async function waitForServer() {
  console.log("🔄 Waiting for Hugo server to be ready...");

  for (let i = 0; i < MAX_RETRIES; i++) {
    const isReady = await checkServerReady();

    if (isReady) {
      console.log("✅ Hugo server is ready!");
      return true;
    }

    console.log(`⏳ Server not ready yet (attempt ${i + 1}/${MAX_RETRIES})...`);

    if (i < MAX_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  console.error("❌ Hugo server failed to start within expected time");
  return false;
}

/**
 * Start Hugo server
 */
function startHugoServer() {
  const isCI = process.env.CI === "true";

  command = "bash";
  args = [
    "-c",
    "./setup-examplesite.sh && cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0",
  ];

  console.log("🚀 Starting Hugo server...");
  console.log(`Command: ${command} ${args.join(" ")}`);

  const hugoProcess = spawn(command, args, {
    stdio: ["pipe", "pipe", "pipe"],
    shell: true,
  });

  // Handle stdout
  hugoProcess.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`[Hugo] ${output.trim()}`);

    // Check for server ready indicators
    if (
      output.includes("Web Server is available at") ||
      output.includes("Server is ready")
    ) {
      console.log("🎯 Hugo server startup detected");
    }
  });

  // Handle stderr
  hugoProcess.stderr.on("data", (data) => {
    const output = data.toString();
    console.log(`[Hugo Error] ${output.trim()}`);
  });

  // Handle process exit
  hugoProcess.on("exit", (code) => {
    console.log(`Hugo server exited with code ${code}`);
    process.exit(code);
  });

  // Handle process errors
  hugoProcess.on("error", (error) => {
    console.error("Failed to start Hugo server:", error);
    process.exit(1);
  });

  return hugoProcess;
}

/**
 * Main function
 */
async function main() {
  try {
    // Start Hugo server
    const hugoProcess = startHugoServer();

    // Wait for server to be ready
    const isReady = await waitForServer();

    if (!isReady) {
      console.error("❌ Server failed to start properly");
      hugoProcess.kill();
      process.exit(1);
    }

    console.log("🎉 Hugo server is ready for testing!");

    // Keep the process running
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down Hugo server...");
      hugoProcess.kill();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("\n🛑 Shutting down Hugo server...");
      hugoProcess.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error starting webServer:", error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { startHugoServer, waitForServer, checkServerReady };
