# Multi-stage build for ThriftEase Full Stack

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (dev deps needed: vite/plugin-react only run at build time)
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Python Backend with Frontend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (curl needed for the HEALTHCHECK below)
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code, keeping it nested so main.py's relative
# "parent.parent / dist" path calculation matches the local dev layout
COPY backend/ ./backend/

# Copy built frontend from previous stage (one level up from backend/, as main.py expects)
COPY --from=frontend-builder /app/dist ./dist

WORKDIR /app/backend

# Expose port (Render overrides the actual bound port via $PORT at runtime)
EXPOSE 5000

# Health check — respects $PORT so it works under Render's dynamic port assignment
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD sh -c 'curl -f http://localhost:${PORT:-5000}/health || exit 1'

# Start command — binds to $PORT if set (required by Render), falling back to 5000 locally
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-5000}"]
