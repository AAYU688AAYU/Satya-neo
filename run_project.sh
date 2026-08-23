#!/usr/bin/env bash
# ==============================================================================
# Satya-eo: National Earth Observation Satellite AI Platform
# One-Command Server Launcher (Django REST API + React Frontend)
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="${PROJECT_ROOT}/.node/bin:$PATH"

echo "=========================================================="
echo "🛰️  Starting Satya-eo Platform (PyTorch DSen2-CR AI Engine)"
echo "=========================================================="

# 1. Start Django Backend
echo "--> Starting Django REST API Backend on http://127.0.0.1:8000..."
cd "${PROJECT_ROOT}/backend/ecomproject"
"${PROJECT_ROOT}/.venv/bin/python" manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!

# Trap signals to terminate both servers on Ctrl+C
trap "kill $BACKEND_PID 2>/dev/null; exit" SIGINT SIGTERM EXIT

# 2. Start React Frontend
echo "--> Starting React Dashboard on http://localhost:3000..."
cd "${PROJECT_ROOT}/frontend/ecommerce"
BROWSER=none npm start
