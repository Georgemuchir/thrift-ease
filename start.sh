#!/bin/bash

# ThriftEase Startup Script
# This script starts both the backend API and serves the HTML frontend

echo "🚀 Starting ThriftEase Application..."
echo "=================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required but not installed."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing Flask and dependencies..."
    pip3 install flask flask-cors
fi

# Start the backend API in the background
echo "🔧 Starting Backend API..."
cd thrift-ease-react/backend
python3 app.py &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend API is running at http://localhost:5000"
else
    echo "⚠️  Backend API may not be fully ready yet"
fi

# Start a simple HTTP server for the frontend
echo "🌐 Starting Frontend Server..."
if command -v python3 &> /dev/null; then
    echo "📱 Frontend running at http://localhost:8000"
    echo "🔗 Open http://localhost:8000 in your browser"
    echo ""
    echo "To stop the servers, press Ctrl+C"
    echo "=================================="
    
    # Start frontend server (this will run in foreground)
    python3 -m http.server 8000
else
    echo "❌ Cannot start frontend server"
fi

# Cleanup: Kill backend when frontend server stops
echo "🛑 Stopping backend API..."
kill $BACKEND_PID 2>/dev/null
echo "✅ All servers stopped."
