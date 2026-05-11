@echo off
title RepairFlow OS - Startup
color 0A

echo.
echo  =============================================
echo   RepairFlow OS - Starting All Services...
echo  =============================================
echo.

:: Start Python FastAPI Backend in a new window
echo  [1/2] Starting Python Backend (FastAPI)...
start "RepairFlow Backend" cmd /k "cd /d C:\Users\Tusha_wpsqzqk\tv-repair-automation && .\venv\Scripts\activate && cd backend && uvicorn app.main:app --reload"

:: Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

:: Start Next.js Frontend in a new window
echo  [2/2] Starting Next.js Frontend...
start "RepairFlow Frontend" cmd /k "cd /d C:\Users\Tusha_wpsqzqk\tv-repair-automation\frontend && npm run dev"

:: Wait for frontend to start then open browser
echo.
echo  Waiting for frontend to compile (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo  Opening browser...
start "" "http://localhost:3000"

echo.
echo  =============================================
echo   Both services are running!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   Close the two terminal windows to stop.
echo  =============================================
echo.
pause
