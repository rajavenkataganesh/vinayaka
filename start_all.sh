#!/bin/bash
echo "==================================================="
echo "🕉️ GANESHMAP - Starting Backend & Frontend Servers"
echo "==================================================="

(cd backend && python run.py) &
BACKEND_PID=$!

(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "Backend running at:  http://localhost:8000"
echo "API Documentation:  http://localhost:8000/docs"
echo "Frontend running at: http://localhost:3000"
echo "==================================================="

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
