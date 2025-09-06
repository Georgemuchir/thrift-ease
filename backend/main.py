from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
from datetime import datetime
import os
from pathlib import Path

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth_router, products_router, cart_router, orders_router, admin_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Print startup configuration
print("=== ThriftEase API Startup Configuration ===")
print(f"Environment: {settings.ENVIRONMENT}")
print(f"Database URL: {settings.DATABASE_URL}")
print(f"Debug Mode: {settings.DEBUG}")
print(f"CORS Origins: {settings.ALLOWED_ORIGINS}")
print("=============================================")

# Create FastAPI application
app = FastAPI(
    title="ThriftEase API",
    description="Backend API for ThriftEase - A modern thrift store platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Static file path for built React app
STATIC_DIR = Path(__file__).parent.parent / "dist"
print(f"Static files directory: {STATIC_DIR}")
print(f"Static files exist: {STATIC_DIR.exists()}")

# Mount static files (built React app)
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
    print("✅ Static files mounted at /static")
else:
    print("⚠️  Static files directory not found. Run 'npm run build' in the frontend.")

# CORS Middleware - more restrictive when serving frontend

# CORS Configuration - Specific origins for credentials support
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3003", 
        "http://localhost:3004",
        "http://localhost:5173", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3003", 
        "http://127.0.0.1:3004",
        "http://127.0.0.1:5173"
    ] if settings.ENVIRONMENT == "development" else ["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    max_age=600,
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "success",
        "message": "ThriftEase API is running",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.ENVIRONMENT
    }

# API Routes
app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(cart_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

# Method not allowed handler for Starlette HTTP exceptions
@app.exception_handler(StarletteHTTPException)
async def starlette_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 405:
        return JSONResponse(
            status_code=405,
            content={
                "error": "Method not allowed",
                "hint": "Check the HTTP method (GET, POST, PUT, DELETE) for this endpoint",
                "status_code": 405,
                "timestamp": datetime.now().isoformat()
            }
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": str(exc.detail),
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

# Placeholder image endpoint to prevent 404 errors
@app.get("/api/placeholder/{width}/{height}")
async def placeholder_image(width: int, height: int):
    """Returns placeholder image data for frontend development"""
    return {
        "url": f"https://via.placeholder.com/{width}x{height}",
        "width": width,
        "height": height,
        "message": "Placeholder image endpoint"
    }

# Root endpoint - serve React app
@app.get("/")
async def serve_frontend():
    """Serve the React frontend application"""
    if STATIC_DIR.exists():
        index_file = STATIC_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
    
    # Fallback if static files not found
    return {
        "message": "Welcome to ThriftEase API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0",
        "note": "Frontend not built. Run 'npm run build' to serve React app."
    }

# Catch-all route for React Router (SPA routing)
@app.get("/{path:path}")
async def serve_spa(path: str):
    """Serve React app for all non-API routes (SPA routing)"""
    # Don't interfere with API routes
    if path.startswith("api/") or path.startswith("docs") or path.startswith("redoc"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    # Serve React app for all other routes
    if STATIC_DIR.exists():
        index_file = STATIC_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
    
    raise HTTPException(status_code=404, detail="Frontend not found")

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info"
    )
