#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================================================="
echo "🚀 Starting KEYSER Intelligence Engine (Hackathon Mode) "
echo "=========================================================="

echo "1️⃣  Checking Database (PostgreSQL)..."
# Try starting Postgres if on Mac (Homebrew)
if command -v brew &> /dev/null; then
    brew services start postgresql 2>/dev/null || echo "Postgres already running or not installed via brew."
else
    echo "Make sure your PostgreSQL server is running locally!"
fi

echo "2️⃣  Starting Data Broker (Redis)..."
# Run Redis as a background daemon
if command -v redis-server &> /dev/null; then
    redis-server --daemonize yes 2>/dev/null || echo "Redis is already running."
else
    echo "❌ redis-server not found! Please install redis (e.g., brew install redis)"
    exit 1
fi

echo "3️⃣  Setting up Python Virtual Environment..."
if [ ! -d "venv" ]; then
    echo "🐍 Creating virtual environment..."
    # Hackathon safe-guard: prefer python3.11/3.12 over unstable 3.14
    if command -v python3.12 &> /dev/null; then
        python3.12 -m venv venv
    elif command -v python3.11 &> /dev/null; then
        python3.11 -m venv venv
    else
        python3 -m venv venv
    fi
    source venv/bin/activate
    echo "📦 Installing dependencies (this might take a minute)..."
    pip install -r requirements.txt
    playwright install chromium
else
    source venv/bin/activate
fi

echo "4️⃣  Starting Background Worker (Celery)..."
# Start Celery in the background and pipe output to a log file so it doesn't clutter the screen
celery -A workers.celery_worker.celery worker --loglevel=warning > celery_worker.log 2>&1 &
CELERY_PID=$!
echo "⚙️  Celery started with PID $CELERY_PID. (Logs saved to celery_worker.log)"

echo "5️⃣  Starting API & Scheduler (Flask)..."
# Start Flask in the background
python app.py &
FLASK_PID=$!

echo ""
echo "=========================================================="
echo "✅ All Services Are Live and Running!"
echo "=========================================================="
echo "🌐 API Endpoint:   http://localhost:5001"
echo "📜 Celery Logs:    tail -f celery_worker.log"
echo "🛑 To shut EVERYTHING down gracefully, just press [Ctrl+C] here."
echo "=========================================================="

# 🛑 Cleanup sequence: Trap Ctrl+C so we can cleanly kill the background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down KEYSER Intelligence Engine..."
    echo "Killing Flask (PID: $FLASK_PID)..."
    kill $FLASK_PID 2>/dev/null
    echo "Killing Celery (PID: $CELERY_PID)..."
    kill $CELERY_PID 2>/dev/null
    echo "👋 Shutdown complete. See you next time!"
    exit 0
}

# Catch ALL exits (including crash or Ctrl+C) to run the cleanup function
trap cleanup EXIT SIGINT SIGTERM

# Wait indefinitely so the script doesn't exit until Ctrl+C is pressed
wait
