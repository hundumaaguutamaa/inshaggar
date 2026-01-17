#!/bin/bash

# Gebeta App - Quick Vercel Deployment Script
echo "🚀 Deploying Gebeta Ethiopian Procedures App to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project locally to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "📱 Your app is now live!"
    echo "🔗 Check your Vercel dashboard for the live URL"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi