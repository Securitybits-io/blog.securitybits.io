#!/bin/bash

# Script to generate baseline snapshots using Docker
# This ensures consistent snapshots across all environments

set -e

echo "🚀 Generating baseline snapshots using Docker..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not available in PATH"
    exit 1
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -f Dockerfile.baselines -t hugo-tranquilpeak-baselines .

# Create a temporary directory for snapshots
echo "📁 Creating temporary directory for snapshots..."
mkdir -p temp-snapshots

# Run the Docker container
echo "🐳 Running Docker container to generate snapshots..."
docker run --rm \
  -v "$(pwd)/temp-snapshots:/app/e2e/visual-regression.spec.js-snapshots" \
  hugo-tranquilpeak-baselines

# Check if snapshots were generated
if [ -d "temp-snapshots" ] && [ "$(ls -A temp-snapshots 2>/dev/null)" ]; then
    echo ""
    echo "✅ Snapshots generated successfully!"
    echo "📁 Generated snapshots:"
    ls -la temp-snapshots/
    echo ""
    echo "📊 Snapshot count: $(ls temp-snapshots/*.png 2>/dev/null | wc -l)"
    
    # Ask user if they want to copy snapshots to the main directory
    echo ""
    read -p "Do you want to copy these snapshots to e2e/visual-regression.spec.js-snapshots/? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📋 Copying snapshots..."
        
        # Create the target directory if it doesn't exist
        mkdir -p e2e/visual-regression.spec.js-snapshots
        
        # Copy snapshots
        cp temp-snapshots/*.png e2e/visual-regression.spec.js-snapshots/
        
        echo "✅ Snapshots copied successfully!"
        echo "📁 Target directory: e2e/visual-regression.spec.js-snapshots/"
        echo ""
        echo "Next steps:"
        echo "1. Review the generated snapshots"
        echo "2. Commit the new snapshots: git add e2e/visual-regression.spec.js-snapshots/"
        echo "3. Push the changes"
    else
        echo "ℹ️  Snapshots are available in temp-snapshots/ directory"
        echo "You can manually copy them when ready"
    fi
else
    echo "❌ No snapshots were generated"
    echo "Check the Docker logs above for errors"
    exit 1
fi

# Clean up temporary directory
echo ""
read -p "Do you want to clean up the temporary directory? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "ℹ️  Temporary directory preserved at temp-snapshots/"
else
    echo "🧹 Cleaning up temporary directory..."
    rm -rf temp-snapshots
    echo "✅ Cleanup completed"
fi

echo ""
echo "🎉 Baseline generation process completed!" 