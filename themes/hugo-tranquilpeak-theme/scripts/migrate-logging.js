#!/usr/bin/env node

/**
 * Migration script to help convert console.log statements to enhanced logging
 * Usage: node scripts/migrate-logging.js [file-or-directory]
 */

const fs = require("fs");
const path = require("path");

// Patterns to match and replace
const patterns = [
  // console.log with emoji patterns
  {
    pattern: /console\.log\s*\(\s*["']([^"']*✅[^"']*)["']\s*\)/g,
    replacement: 'logger.success("$1")',
    description: "Success messages with ✅",
  },
  {
    pattern: /console\.log\s*\(\s*["']([^"']*⚠️[^"']*)["']\s*\)/g,
    replacement: 'logger.warn("$1")',
    description: "Warning messages with ⚠️",
  },
  {
    pattern: /console\.log\s*\(\s*["']([^"']*❌[^"']*)["']\s*\)/g,
    replacement: 'logger.error("$1")',
    description: "Error messages with ❌",
  },
  {
    pattern: /console\.log\s*\(\s*["']([^"']*🔍[^"']*)["']\s*\)/g,
    replacement: 'logger.debug("$1")',
    description: "Debug messages with 🔍",
  },
  // Generic console.log patterns
  {
    pattern: /console\.log\s*\(\s*["']([^"']*Found[^"']*\d+[^"']*)["']\s*\)/g,
    replacement: 'logger.info("$1")',
    description: "Found X items messages",
  },
  {
    pattern: /console\.log\s*\(\s*["']([^"']*Testing[^"']*)["']\s*\)/g,
    replacement: 'logger.step("$1")',
    description: "Testing messages",
  },
  {
    pattern: /console\.log\s*\(\s*["']([^"']*Successfully[^"']*)["']\s*\)/g,
    replacement: 'logger.success("$1")',
    description: "Successfully messages",
  },
  {
    pattern: /console\.log\s*\(\s*["']([^"']*No[^"']*found[^"']*)["']\s*\)/gi,
    replacement: 'logger.warn("$1")',
    description: "No X found messages",
  },
  // Generic info messages
  {
    pattern: /console\.log\s*\(\s*["']([^"']*)["']\s*\)/g,
    replacement: 'logger.info("$1")',
    description: "Generic console.log messages",
  },
];

function processFile(filePath) {
  console.log(`Processing: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Check if file already has logger import
    const hasLoggerImport =
      content.includes('require("../utils/test-logger")') ||
      content.includes('require("./utils/test-logger")');

    // Add logger import if not present
    if (!hasLoggerImport && content.includes("console.log")) {
      const importStatement =
        'const { createLogger } = require("../utils/test-logger");\n';
      content = importStatement + content;
      modified = true;
    }

    // Replace console.log patterns
    patterns.forEach(({ pattern, replacement, description }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        console.log(`  - Applied: ${description}`);
        content = newContent;
        modified = true;
      }
    });

    // Add logger initialization if we made changes
    if (
      modified &&
      content.includes("logger.") &&
      !content.includes("const logger = createLogger(testInfo)")
    ) {
      // Find test function and add logger initialization
      const testPattern =
        /test\s*\(\s*["']([^"']*)["']\s*,\s*async\s*\(\s*\{[^}]*\}\s*,\s*testInfo\s*\)\s*=>\s*\{/g;
      content = content.replace(testPattern, (match, testName) => {
        return match.replace(
          "{",
          "{\n  const logger = createLogger(testInfo);\n  "
        );
      });
    }

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`  ✅ Updated: ${filePath}`);
    } else {
      console.log(`  ⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith(".js") && file.includes(".spec.")) {
      processFile(filePath);
    }
  });
}

function main() {
  const target = process.argv[2] || "./e2e";

  console.log("🔄 Starting logging migration...");
  console.log(`Target: ${target}`);
  console.log("");

  if (fs.existsSync(target)) {
    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
      processDirectory(target);
    } else {
      processFile(target);
    }
  } else {
    console.error(`❌ Target not found: ${target}`);
    process.exit(1);
  }

  console.log("");
  console.log("🎉 Migration completed!");
  console.log("");
  console.log("📝 Next steps:");
  console.log("1. Review the changes made");
  console.log("2. Test your updated test files");
  console.log("3. Adjust log levels as needed");
  console.log("4. Remove any remaining console.log statements manually");
}

if (require.main === module) {
  main();
}

module.exports = { processFile, processDirectory };
