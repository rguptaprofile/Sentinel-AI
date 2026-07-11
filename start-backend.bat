@echo off
setlocal
cd /d "%~dp0"
echo Starting SentinelAI backend on http://127.0.0.1:8000
echo MongoDB URL: %MONGODB_URL%
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
pause
