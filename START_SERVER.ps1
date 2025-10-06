# Burger King Thailand Clone - Start Server
Write-Host "Starting Burger King Thailand Clone..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start dev server
npm run dev

