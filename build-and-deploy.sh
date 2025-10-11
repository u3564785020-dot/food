#!/bin/bash

echo "🚀 Building and deploying to Railway..."

# Build frontend
echo "📦 Building frontend..."
npm run build:frontend

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

# Check if webhook server exists
if [ ! -f "webhook-server.cjs" ]; then
    echo "❌ Webhook server not found!"
    exit 1
fi

echo "✅ Webhook server found!"

# Check if all dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ All dependencies installed!"

echo "🎉 Project is ready for Railway deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub"
echo "2. Deploy on Railway"
echo "3. Set environment variables"
echo "4. Set webhook URL in Telegram"
