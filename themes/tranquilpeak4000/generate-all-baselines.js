#!/usr/bin/env node

/**
 * Script to generate baseline snapshots for visual regression tests
 * This script will run the visual regression tests and create baseline snapshots
 * for Linux environment only
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating baseline snapshots for visual regression tests...');

// Function to clean up existing snapshots
function cleanupSnapshots() {
  const snapshotDir = path.join(__dirname, 'e2e', 'visual-regression.spec.js-snapshots');
  
  if (fs.existsSync(snapshotDir)) {
    console.log('🧹 Cleaning up existing snapshots...');
    fs.rmSync(snapshotDir, { recursive: true, force: true });
  }
}

// Function to run tests and generate snapshots
function generateSnapshots(environment = 'local') {
  console.log(`📸 Generating snapshots for ${environment} environment...`);
  
  const env = environment === 'ci' ? 'CI=true' : '';
  const command = `${env} npx playwright test e2e/visual-regression.spec.js --update-snapshots`;
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, CI: environment === 'ci' ? 'true' : undefined }
    });
    console.log(`✅ Successfully generated snapshots for ${environment} environment`);
  } catch (error) {
    console.error(`❌ Failed to generate snapshots for ${environment} environment:`, error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'local';
  
  console.log(`🎯 Target environment: ${environment}`);
  
  // Only clean up if not running in Docker (avoid EBUSY errors)
  if (!process.env.DOCKER_CONTAINER) {
    console.log('🧹 Cleaning up existing snapshots...');
    cleanupSnapshots();
  } else {
    console.log('🐳 Running in Docker container - skipping cleanup to avoid EBUSY errors');
  }
  
  // Generate snapshots for the specified environment
  generateSnapshots(environment);
  
  console.log('🎉 Baseline snapshot generation completed!');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  cleanupSnapshots,
  generateSnapshots
};
