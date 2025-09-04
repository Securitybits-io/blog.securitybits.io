/**
 * Enhanced logging utility for Playwright tests
 * Provides structured logging with different levels and better integration
 * with Playwright's reporting system.
 */

class TestLogger {
  constructor(testInfo = null) {
    this.testInfo = testInfo;
    this.logLevel = process.env.LOG_LEVEL || "info";
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4,
    };
  }

  /**
   * Log an error message
   * @param {string} message - The error message
   * @param {any} data - Additional data to log
   */
  error(message, data = null) {
    if (this.shouldLog("error")) {
      this._log("ERROR", message, data, "🔴");
    }
  }

  /**
   * Log a warning message
   * @param {string} message - The warning message
   * @param {any} data - Additional data to log
   */
  warn(message, data = null) {
    if (this.shouldLog("warn")) {
      this._log("WARN", message, data, "🟡");
    }
  }

  /**
   * Log an info message
   * @param {string} message - The info message
   * @param {any} data - Additional data to log
   */
  info(message, data = null) {
    if (this.shouldLog("info")) {
      this._log("INFO", message, data, "ℹ️");
    }
  }

  /**
   * Log a debug message
   * @param {string} message - The debug message
   * @param {any} data - Additional data to log
   */
  debug(message, data = null) {
    if (this.shouldLog("debug")) {
      this._log("DEBUG", message, data, "🔍");
    }
  }

  /**
   * Log a trace message (most verbose)
   * @param {string} message - The trace message
   * @param {any} data - Additional data to log
   */
  trace(message, data = null) {
    if (this.shouldLog("trace")) {
      this._log("TRACE", message, data, "🔬");
    }
  }

  /**
   * Log a success message
   * @param {string} message - The success message
   * @param {any} data - Additional data to log
   */
  success(message, data = null) {
    if (this.shouldLog("info")) {
      this._log("SUCCESS", message, data, "✅");
    }
  }

  /**
   * Log a step message (for test steps)
   * @param {string} message - The step message
   * @param {any} data - Additional data to log
   */
  step(message, data = null) {
    if (this.shouldLog("info")) {
      this._log("STEP", message, data, "👣");
    }
  }

  /**
   * Check if the current log level should be displayed
   * @param {string} level - The level to check
   * @returns {boolean} - Whether to log this level
   */
  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  /**
   * Internal logging method
   * @param {string} level - The log level
   * @param {string} message - The message
   * @param {any} data - Additional data
   * @param {string} emoji - The emoji for the level
   */
  _log(level, message, data, emoji) {
    const timestamp = new Date().toISOString();
    const testName = this.testInfo ? `[${this.testInfo.title}]` : "";
    const prefix = `${emoji} ${timestamp} ${level}${testName}`;

    if (data) {
      console.log(`${prefix}: ${message}`, data);
    } else {
      console.log(`${prefix}: ${message}`);
    }

    // If we have testInfo, also add to test annotations for better reporting
    if (this.testInfo) {
      this.testInfo.annotations.push({
        type: level.toLowerCase(),
        description: `${emoji} ${message}`,
      });
    }
  }

  /**
   * Create a child logger with additional context
   * @param {string} context - Additional context for the child logger
   * @returns {TestLogger} - A new logger instance with context
   */
  child(context) {
    const childLogger = new TestLogger(this.testInfo);
    childLogger.context = context;
    return childLogger;
  }
}

/**
 * Create a logger instance
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info
 * @returns {TestLogger} - Logger instance
 */
function createLogger(testInfo = null) {
  return new TestLogger(testInfo);
}

/**
 * Create a logger for a specific test step
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info
 * @param {string} stepName - Name of the test step
 * @returns {TestLogger} - Logger instance for the step
 */
function createStepLogger(testInfo, stepName) {
  const logger = new TestLogger(testInfo);
  logger.stepName = stepName;
  return logger;
}

module.exports = {
  TestLogger,
  createLogger,
  createStepLogger,
};
