#!/bin/bash

# ThriftEase Backend Startup Script

echo "Starting ThriftEase Backend..."

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Script directory: $SCRIPT_DIR"

# Navigate to backend directory
cd "$SCRIPT_DIR"
echo "Current directory: $(pwd)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please configure your .env file with proper database credentials"
fi

# Set PYTHONPATH to current directory
export PYTHONPATH="$SCRIPT_DIR:$PYTHONPATH"
echo "PYTHONPATH: $PYTHONPATH"

# Start the FastAPI server
echo "Starting FastAPI server on http://localhost:5000"
echo "API Documentation will be available at http://localhost:5000/docs"
/home/muchiri/development/thrift-ease/.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 5000 --reload
