@echo off
title KisanDirect Web App
echo =======================================================
echo KisanDirect - Smart India Hackathon 2026
echo Starting development server on http://localhost:3000
echo Network URL: http://0.0.0.0:3000
echo =======================================================
echo.

:: Automatically open default browser after server initialization delay
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"

:: Start Next.js dev server
npm run dev
