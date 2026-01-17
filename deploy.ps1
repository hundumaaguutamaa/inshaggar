# Gebeta App - Quick Vercel Deployment Script (PowerShell)
Write-Host "🚀 Deploying Gebeta Ethiopian Procedures App to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build the project locally to check for errors
Write-Host "🔨 Building project locally..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Local build successful!" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Blue
    vercel --prod
    
    Write-Host "🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "📱 Your app is now live!" -ForegroundColor Cyan
    Write-Host "🔗 Check your Vercel dashboard for the live URL" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed. Please fix errors before deploying." -ForegroundColor Red
    exit 1
}