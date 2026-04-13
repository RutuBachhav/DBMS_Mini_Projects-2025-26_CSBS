@echo off
REM Complete E-Commerce Startup Script for Windows
REM This script starts MongoDB, seeds products, and runs backend + frontend

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   VEDANT E-COMMERCE STARTUP SCRIPT
echo ========================================
echo.

REM Get the project root directory
cd /d "%~dp0"

REM Step 1: Start Docker MongoDB
echo [1/4] Starting MongoDB Container...
docker-compose up -d

if errorlevel 1 (
    echo ❌ Failed to start MongoDB. Make sure Docker is running.
    pause
    exit /b 1
)

echo ✅ MongoDB started. Waiting 40 seconds for it to fully initialize...
timeout /t 40 /nobreak

REM Step 2: Seed Database
echo.
echo [2/4] Seeding Products into Database...
cd ecommerce-backend

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
)

REM Run seeding script
call npm run seed

if errorlevel 1 (
    echo ❌ Seeding failed. Check MongoDB connection.
    pause
    exit /b 1
)

echo ✅ Products seeded successfully.
echo.

REM Step 3: Show instructions for manual terminal opening
echo [3/4 & 4/4] Starting Backend and Frontend...
echo.
echo ⚠️  Please open NEW PowerShell/CMD windows and run these commands:
echo.
echo  BACKEND (Terminal 1):
echo  cd "%cd%"
echo  npm run dev
echo.
echo  FRONTEND (Terminal 2):
echo  cd "%~dp0ecommerce-frontend"
echo  npm install
echo  npm start
echo.
echo Once both are running, open: http://localhost:3000
echo.
echo Press any key to continue...
pause

endlocal
