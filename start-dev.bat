@echo off
setlocal
cd /d "%~dp0"
echo Starting SentinelAI backend and frontend...
start "SentinelAI Backend" cmd /k "%~dp0start-backend.bat"
timeout /t 3 /nobreak >nul
start "SentinelAI Frontend" cmd /k "%~dp0start-frontend.bat"
echo.
echo Backend:  http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo Frontend: http://127.0.0.1:5173
echo.
echo Close the opened terminal windows to stop the servers.
