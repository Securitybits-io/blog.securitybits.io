#!/bin/bash

# Simple script to generate baseline screenshot using Docker
# Takes one screenshot of the main webpage

set -e

echo "🚀 Generating baseline screenshot using Docker..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not available in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "Dockerfile.baselines" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Current directory: $(pwd)"
echo "🐳 Docker version: $(docker --version)"

# Stop any running containers
echo ""
echo "🛑 Stopping any running containers..."
docker stop $(docker ps -q --filter "ancestor=hugo-tranquilpeak-baselines") 2>/dev/null || true
sleep 2

# Create snapshots directory
echo ""
echo "📁 Creating snapshots directory..."
mkdir -p e2e/visual-regression.spec.js-snapshots

# Build the Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -f Dockerfile.baselines -t hugo-tranquilpeak-baselines .

# Run the Docker container
echo ""
echo "🐳 Running Docker container to generate screenshot..."
echo "This may take a few minutes..."

if docker run --rm \
  --name hugo-tranquilpeak-baseline-gen \
  -e DOCKER_CONTAINER=true \
  -v "$(pwd)/e2e/visual-regression.spec.js-snapshots:/app/e2e/visual-regression.spec.js-snapshots" \
  hugo-tranquilpeak-baselines; then
    
    echo "✅ Docker container completed successfully"
else
    echo "❌ Docker container failed"
    exit 1
fi

# Check if screenshot was generated
echo ""
echo "📊 Checking generated screenshot..."
if [ -d "e2e/visual-regression.spec.js-snapshots" ] && [ "$(ls -A e2e/visual-regression.spec.js-snapshots 2>/dev/null)" ]; then
    echo "✅ Screenshot generated successfully!"
    echo ""
    echo "📁 Generated files:"
    ls -la e2e/visual-regression.spec.js-snapshots/
    
    echo ""
    echo "🎉 Baseline generation completed!"
    echo ""
    echo "Next steps:"
    echo "1. Commit the screenshot: git add e2e/visual-regression.spec.js-snapshots/"
    echo "2. Push the changes: git commit -m 'Add baseline screenshot'"
    echo "3. Test: npm run test:e2e:ci"
    
else
    echo "❌ No screenshot was generated"
    exit 1
fi

echo ""
echo "✨ All done!" 