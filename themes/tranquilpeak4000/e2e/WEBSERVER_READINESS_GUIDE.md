# WebServer Readiness Guide

This guide explains how the webServer readiness system works and how to ensure tests wait for the server to be fully ready before starting.

## 🎯 Problem Solved

**Before**: Tests would start before Hugo server was fully ready, causing:

- Navigation timeouts
- Inconsistent test results
- Race conditions
- Failed resource loading

**After**: Tests wait for Hugo server to be fully ready, ensuring:

- Reliable test execution
- Consistent results
- No race conditions
- All resources properly loaded

## 🔧 How It Works

### 1. **Custom Startup Script** (`scripts/start-webserver.js`)

The script provides enhanced server startup with:

- **Health Checks**: Verifies server responds with 200 status
- **Content Validation**: Ensures page has actual content (not just loading)
- **Retry Logic**: Waits up to 60 seconds (30 attempts × 2 seconds)
- **Real-time Logging**: Shows startup progress
- **Graceful Shutdown**: Proper cleanup on exit

### 2. **Playwright Configuration**

```javascript
webServer: {
  command: "node scripts/start-webserver.js",
  url: "http://localhost:1313",
  timeout: process.env.CI ? 180000 : 120000, // 3 minutes CI, 2 minutes local
  reuseExistingServer: !process.env.CI,
  stdout: "pipe",
  stderr: "pipe",
}
```

### 3. **Readiness Detection**

The script checks for server readiness by:

1. **HTTP Response**: Verifies `GET /` returns 200
2. **Content Validation**: Ensures response contains `<body` or `<!DOCTYPE html>`
3. **Retry Logic**: Attempts up to 30 times with 2-second delays
4. **Timeout Protection**: 5-second timeout per request

## 🚀 Usage

### **Automatic (Recommended)**

Tests automatically use the enhanced webServer:

```bash
# Run tests with automatic webServer startup
npm run test:e2e

# Run with verbose logging
npm run test:e2e:verbose
```

### **Manual WebServer Startup**

Start webServer manually for development:

```bash
# Start webServer only
npm run start:webserver

# In another terminal, run tests
npm run test:e2e
```

### **CI Environment**

The script automatically detects CI and adjusts:

```bash
# CI environment - builds first, then starts server
CI=true npm run test:e2e:ci
```

## 📊 Readiness Process

### **Startup Sequence**

1. **Environment Detection**: Determines CI vs local environment
2. **Build Process** (CI only): Runs `npm run build`
3. **Setup Process**: Runs `./setup-examplesite.sh`
4. **Server Startup**: Starts Hugo server with appropriate flags
5. **Health Monitoring**: Monitors server output for ready indicators
6. **Readiness Checks**: Performs HTTP requests to verify server is ready
7. **Content Validation**: Ensures page has actual content
8. **Success Confirmation**: Logs when server is ready for testing

### **Health Check Details**

```javascript
function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:1313", (res) => {
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

    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}
```

## 🔍 Troubleshooting

### **Server Not Starting**

**Symptoms**: Tests fail with connection errors
**Solutions**:

1. **Check Hugo Installation**:

   ```bash
   hugo version
   ```

2. **Check Port Availability**:

   ```bash
   lsof -i :1313
   ```

3. **Manual Server Test**:

   ```bash
   npm run start:webserver
   ```

4. **Check Logs**: Look for Hugo server output in test logs

### **Server Starts But Tests Fail**

**Symptoms**: Server starts but tests timeout
**Solutions**:

1. **Increase Timeout**:

   ```javascript
   // In playwright.config.js
   timeout: process.env.CI ? 300000 : 180000, // 5 minutes CI, 3 minutes local
   ```

2. **Check Server Content**:

   ```bash
   curl http://localhost:1313
   ```

3. **Verify Setup Script**:
   ```bash
   ./setup-examplesite.sh
   ```

### **Slow Server Startup**

**Symptoms**: Tests wait a long time for server
**Solutions**:

1. **Optimize Build Process**:

   ```bash
   # Pre-build assets
   npm run build
   ```

2. **Use Existing Server**:

   ```bash
   # Start server manually, then run tests
   npm run start:webserver &
   npm run test:e2e
   ```

3. **Reduce Retry Delay**:
   ```javascript
   // In scripts/start-webserver.js
   const RETRY_DELAY = 1000; // 1 second instead of 2
   ```

## 🛠️ Configuration Options

### **Environment Variables**

```bash
# Force CI mode
CI=true npm run test:e2e

# Custom server URL
SERVER_URL=http://localhost:1313 npm run start:webserver

# Custom retry settings
MAX_RETRIES=60 RETRY_DELAY=1000 npm run start:webserver
```

### **Custom Timeouts**

```javascript
// In playwright.config.js
webServer: {
  command: "node scripts/start-webserver.js",
  url: "http://localhost:1313",
  timeout: 300000, // 5 minutes
  reuseExistingServer: !process.env.CI,
  stdout: "pipe",
  stderr: "pipe",
}
```

### **Custom Health Checks**

```javascript
// In scripts/start-webserver.js
function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get(SERVER_URL, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        // Custom readiness criteria
        const isReady =
          res.statusCode === 200 &&
          data.includes("<body") &&
          data.includes("</html>") &&
          !data.includes("Loading...");
        resolve(isReady);
      });
    });

    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}
```

## 📈 Performance Optimization

### **Faster Startup**

1. **Pre-build Assets**:

   ```bash
   npm run build
   npm run test:e2e
   ```

2. **Use Existing Server**:

   ```bash
   # Start server once, run tests multiple times
   npm run start:webserver &
   npm run test:e2e
   npm run test:e2e:verbose
   npm run test:e2e:quiet
   ```

3. **Reduce Health Check Frequency**:
   ```javascript
   const RETRY_DELAY = 1000; // 1 second instead of 2
   ```

### **CI Optimization**

1. **Parallel Builds**: Build assets in parallel with test setup
2. **Caching**: Cache node_modules and build artifacts
3. **Docker**: Use pre-built Docker images with Hugo installed

## 🎯 Best Practices

### **Development**

1. **Use Existing Server**: Start server once, run tests multiple times
2. **Monitor Logs**: Watch for server startup messages
3. **Quick Feedback**: Use fast navigation strategy for development

### **CI/CD**

1. **Pre-build Assets**: Build before starting server
2. **Increase Timeouts**: Use longer timeouts for CI environments
3. **Parallel Execution**: Run different test suites in parallel

### **Debugging**

1. **Verbose Logging**: Use `LOG_LEVEL=debug` for detailed output
2. **Manual Testing**: Test server manually before running tests
3. **Health Checks**: Verify server responds correctly

## 🔄 Migration from Old Setup

### **Before (Basic Setup)**

```javascript
webServer: {
  command: "./setup-examplesite.sh && cd exampleSite && hugo server --bind 0.0.0.0",
  url: "http://localhost:1313",
  timeout: 30000,
  reuseExistingServer: !process.env.CI,
}
```

### **After (Enhanced Setup)**

```javascript
webServer: {
  command: "node scripts/start-webserver.js",
  url: "http://localhost:1313",
  timeout: process.env.CI ? 180000 : 120000,
  reuseExistingServer: !process.env.CI,
  stdout: "pipe",
  stderr: "pipe",
}
```

This enhanced setup provides reliable, consistent test execution with proper server readiness detection.
