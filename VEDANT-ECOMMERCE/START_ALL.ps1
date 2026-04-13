# Complete E-Commerce Startup Script for Windows (PowerShell)
# Usage: Run as Administrator
# .\START_ALL.ps1

param(
    [switch]$AutoStart = $false,  # Set to $true to auto-start without prompts
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "`n=== E-Commerce Startup Script Help ===" -ForegroundColor Cyan
    Write-Host "Usage: .\START_ALL.ps1 [options]" -ForegroundColor White
    Write-Host "`nOptions:" -ForegroundColor White
    Write-Host "  -AutoStart  : Automatically start services without prompts" -ForegroundColor Gray
    Write-Host "  -Help       : Show this help message" -ForegroundColor Gray
    Write-Host "`nExample:" -ForegroundColor White
    Write-Host "  .\START_ALL.ps1 -AutoStart" -ForegroundColor Gray
    exit
}

# Initialize variables
$projectRoot = Split-Path -Parent $MyInvocation.MyCommandPath
$backendPath = Join-Path $projectRoot "ecommerce-backend"
$frontendPath = Join-Path $projectRoot "ecommerce-frontend"

Write-Host "`n" -ForegroundColor Black
Write-Host "======================================" -ForegroundColor Cyan
Write-Host " VEDANT E-COMMERCE STARTUP SCRIPT" -ForegroundColor Cyan
Write-Host " MERN Stack with Docker MongoDB" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "`nProject Root: $projectRoot`n" -ForegroundColor Gray

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        $result = docker ps -q 2>$null
        return $?
    }
    catch {
        return $false
    }
}

# Function to wait for container
function Wait-ForContainer {
    param([string]$ContainerName, [int]$MaxWaitSeconds = 60)
    
    $elapsed = 0
    while ($elapsed -lt $MaxWaitSeconds) {
        $status = docker inspect $ContainerName -f '{{.State.Health.Status}}' 2>$null
        if ($status -eq "healthy") {
            return $true
        }
        Start-Sleep -Seconds 2
        $elapsed += 2
        Write-Host "." -NoNewline -ForegroundColor Yellow
    }
    return $false
}

# ============= PHASE 1: MONGODB =============
Write-Host "`n[Phase 1/3] MONGODB SETUP" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta

Write-Host "`n[1/5] Checking Docker..." -ForegroundColor Yellow

if (-not (Test-DockerRunning)) {
    Write-Host "[FAIL] Docker is not running or not installed." -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Docker is running" -ForegroundColor Green

Write-Host "`n[2/5] Starting MongoDB Container..." -ForegroundColor Yellow

# Stop existing container if running
$existingContainer = docker ps -a -q -f "name=ecommerce_mongodb" 2>$null
if ($existingContainer) {
    Write-Host "   Stopping existing MongoDB container..." -ForegroundColor Gray
    docker-compose -f "$projectRoot\docker-compose.yml" down -v 2>$null
}

# Start MongoDB
Push-Location $projectRoot
try {
    $dockerOutput = docker-compose up -d 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[FAIL] Failed to start MongoDB" -ForegroundColor Red
        Write-Host "   Output: $dockerOutput" -ForegroundColor Red
        exit 1
    }
}
finally {
    Pop-Location
}

Write-Host "[OK] MongoDB container started" -ForegroundColor Green

Write-Host "`n[3/5] Waiting for MongoDB to be healthy (up to 60 seconds)..." -ForegroundColor Yellow
$isHealthy = Wait-ForContainer "ecommerce_mongodb"

if ($isHealthy) {
    Write-Host "`n[OK] MongoDB is healthy and ready" -ForegroundColor Green
}
else {
    Write-Host "`n[WARN] MongoDB is running but health check not complete (may still be initializing)" -ForegroundColor Yellow
}

# Show MongoDB status
Write-Host "`n[4/5] MongoDB Status:" -ForegroundColor Yellow
docker ps -f "name=ecommerce_mongodb" --format "table {{.Names}}\t{{.Status}}"

Write-Host "`n[5/5] Testing MongoDB Connection..." -ForegroundColor Yellow

$mongoTest = docker exec ecommerce_mongodb mongosh -u admin -p password123 --eval "db.adminCommand('ping')" 2>&1
if ($mongoTest -and $mongoTest -match "ok") {
    Write-Host "[OK] MongoDB connection successful" -ForegroundColor Green
}
else {
    Write-Host "[WARN] MongoDB connection may be slow to initialize" -ForegroundColor Yellow
}

# ============= PHASE 2: BACKEND SETUP =============
Write-Host "`n[Phase 2/3] BACKEND SETUP" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta

Write-Host "`n[1/3] Checking backend directory..." -ForegroundColor Yellow

if (-not (Test-Path $backendPath)) {
    Write-Host "[FAIL] Backend directory not found: $backendPath" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Backend directory found" -ForegroundColor Green

Write-Host "`n[2/3] Installing backend dependencies..." -ForegroundColor Yellow

Push-Location $backendPath
try {
    if (-not (Test-Path "node_modules")) {
        npm install 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[WARN] npm install had warnings, but continuing..." -ForegroundColor Yellow
        }
        else {
            Write-Host "[OK] Dependencies installed" -ForegroundColor Green
        }
    }
    else {
        Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
    }
}
finally {
    Pop-Location
}

Write-Host "`n[3/3] Seeding database with 25 products..." -ForegroundColor Yellow

Push-Location $backendPath
try {
    $seedOutput = npm run seed 2>&1
    
    if ($seedOutput -match "success" -or $seedOutput -match "complete" -or $seedOutput -match "25") {
        Write-Host "[OK] Database seeding completed successfully" -ForegroundColor Green
        Write-Host "   Output: $([regex]::Match($seedOutput, '.{0,100}$').Value)" -ForegroundColor Gray
    }
    else {
        Write-Host "[WARN] Seeding output:" -ForegroundColor Yellow
        Write-Host $seedOutput -ForegroundColor Gray
    }
}
finally {
    Pop-Location
}

# ============= PHASE 3: FRONTEND SETUP =============
Write-Host "`n[Phase 3/3] FRONTEND SETUP" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta

Write-Host "`n[1/2] Checking frontend directory..." -ForegroundColor Yellow

if (-not (Test-Path $frontendPath)) {
    Write-Host "[FAIL] Frontend directory not found: $frontendPath" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Frontend directory found" -ForegroundColor Green

Write-Host "`n[2/2] Installing frontend dependencies..." -ForegroundColor Yellow

Push-Location $frontendPath
try {
    if (-not (Test-Path "node_modules")) {
        npm install 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Frontend dependencies installed" -ForegroundColor Green
        }
        else {
            Write-Host "[WARN] npm install had issues, but continuing..." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "[OK] Frontend dependencies already installed" -ForegroundColor Green
    }
}
finally {
    Pop-Location
}

# ============= STARTUP INSTRUCTIONS =============
Write-Host "`nSetup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

Write-Host "`nNEXT STEPS - Start Services:" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "`nOpen TWO new PowerShell/CMD windows:" -ForegroundColor Yellow

Write-Host "`nTERMINAL 1 (Backend Server):" -ForegroundColor Green
Write-Host "   cd `"$backendPath`"" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   " -ForegroundColor Gray
Write-Host "   Wait for: 'Server running on port 5000'" -ForegroundColor Gray

Write-Host "`nTERMINAL 2 (Frontend Development Server):" -ForegroundColor Green
Write-Host "   cd `"$frontendPath`"" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host "   " -ForegroundColor Gray
Write-Host "   Browser will auto-open to http://localhost:3000" -ForegroundColor Gray

Write-Host "`nWeb Browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White

Write-Host "`nKey Information:" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "MongoDB Container: ecommerce_mongodb (Docker)" -ForegroundColor Gray
Write-Host "MongoDB URI: mongodb://admin:password123@localhost:27017/ecommerce" -ForegroundColor Gray
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "Admin Panel: http://localhost:3000/admin" -ForegroundColor Gray
Write-Host "`nTotal Products in DB: 25 (5 categories, 5 products each)" -ForegroundColor Gray

Write-Host "`nUseful Commands:" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Stop MongoDB:       docker-compose down" -ForegroundColor Gray
Write-Host "Reset Database:     docker-compose down -v && docker-compose up -d" -ForegroundColor Gray
Write-Host "Re-seed Products:   npm run seed  (in ecommerce-backend)" -ForegroundColor Gray
Write-Host "View MongoDB logs:  docker logs ecommerce_mongodb" -ForegroundColor Gray
Write-Host "Connect to MongoDB: docker exec -it ecommerce_mongodb mongosh -u admin -p password123" -ForegroundColor Gray

Write-Host "`nDocumentation: See COMPLETE_SETUP_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host "`n"

if ($AutoStart) {
    Write-Host "Auto-starting backend and frontend..." -ForegroundColor Green
    
    # Start backend in background PowerShell
    $backendCmd = "cd `"$backendPath`"; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
    
    # Wait a few seconds
    Start-Sleep -Seconds 3
    
    # Start frontend in background PowerShell
    $frontendCmd = "cd `"$frontendPath`"; npm start"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd
}
else {
    Write-Host "Please follow the instructions above to start the backend and frontend." -ForegroundColor Yellow
    Write-Host "`nPress Enter to exit..." -ForegroundColor Gray
    Read-Host
}
