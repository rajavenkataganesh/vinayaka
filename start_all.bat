@echo off
echo ===================================================
echo 🕉️ GANESHMAP - Starting Backend & Frontend Servers
echo ===================================================

cd backend
start "GaneshMap Backend (FastAPI)" cmd /k "python run.py"

cd ..\frontend
start "GaneshMap Frontend (Vite)" cmd /k "npm run dev"

echo.
echo Backend running at:  http://localhost:8000
echo API Documentation:  http://localhost:8000/docs
echo Frontend running at: http://localhost:3000
echo ===================================================
