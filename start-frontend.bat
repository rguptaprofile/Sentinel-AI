@echo off
setlocal
cd /d "%~dp0frontend"
if "%VITE_API_BASE_URL%"=="" set VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
echo Starting SentinelAI frontend on http://127.0.0.1:5173
echo API Base URL: %VITE_API_BASE_URL%
npm.cmd run dev -- --host 127.0.0.1 --port 5173
pause
