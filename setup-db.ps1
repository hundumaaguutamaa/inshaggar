Write-Host "Gebeta Database Setup Wizard" -ForegroundColor Cyan
Write-Host "=============================="

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Warning ".env file not found!"
    Write-Host "Please create a .env file based on .env.template"
    exit
}

Write-Host "Pushing schema to database..." -ForegroundColor Yellow
# Run Prisma Push
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database synchronized successfully!" -ForegroundColor Green
    
    Write-Host "Seeding initial data..." -ForegroundColor Yellow
    # Create a minimalistic seed script
    $seedScript = @"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.procedure.count();
  if (count === 0) {
    await prisma.procedure.create({
      data: {
        title: 'Passport Application (Seeded)',
        category: 'Identity',
        overview: 'Standard passport application process.',
        eligibility: 'Citizens',
        estimatedCost: '600 ETB',
        estimatedDuration: '2 Weeks',
        status: 'PUBLISHED'
      }
    });
    console.log('Seeded one procedure.');
  } else {
    console.log('Database already has data.');
  }
}
main().catch(e => console.error(e)).finally(() => prisma.\`$disconnect());
"@
    $seedScript | Out-File "prisma/seed.js" -Encoding UTF8
    node prisma/seed.js
    Remove-Item "prisma/seed.js"
    Write-Host "✅ Seed completed." -ForegroundColor Green
} else {
    Write-Error "Database connection failed. Please check your .env connection string."
}
